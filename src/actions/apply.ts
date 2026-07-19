"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function applyForJob(jobId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "STUDENT") {
    return { error: "Unauthorized. Only students can apply for jobs." };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { error: "Please complete your profile before applying." };
    }

    if (!profile.resumeUrl) {
      return { error: "You must upload a resume in the Resume Center before applying." };
    }

    // Check if already applied
    const existingApplication = await prisma.application.findFirst({
      where: {
        jobId,
        studentProfileId: profile.id
      }
    });

    if (existingApplication) {
      return { error: "You have already applied for this job." };
    }

    // Fetch job details for AI evaluation and validation
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return { error: "Job not found." };
    }

    if (job.status === "CLOSED") {
      return { error: "This job is no longer accepting applications." };
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return { error: "The deadline for this job has passed." };
    }

    // Evaluate the candidate specifically for this job using WatsonX
    const { evaluateCandidate } = await import("@/services/watsonx");
    const aiEvaluation = await evaluateCandidate(profile, job);

    // Create application
    await prisma.application.create({
      data: {
        jobId,
        studentProfileId: profile.id,
        aiScore: aiEvaluation.score || 50, // Use the specific job fit score
      }
    });

    revalidatePath("/dashboard/jobs");
    revalidatePath("/dashboard");
    return { success: true };

  } catch (error: any) {
    console.error("Application error:", error);
    return { error: "Failed to submit application. Please try again." };
  }
}
