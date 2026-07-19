"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateCoverLetterContent } from "@/services/watsonx";

export async function generateCoverLetter(jobId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!profile) {
      return { error: "Student profile not found. Please complete your profile." };
    }

    if (!profile.aiAnalysis) {
      return { error: "Please upload and analyze your resume in the Resume Center first." };
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { company: true }
    });

    if (!job) {
      return { error: "Job not found." };
    }

    const coverLetter = await generateCoverLetterContent(profile, job);

    return { response: coverLetter };

  } catch (error: any) {
    console.error("Cover Letter Generation error:", error);
    return { error: "Failed to generate cover letter. Please try again later." };
  }
}

export async function generateCustomCoverLetter(jobDetails: { title: string; company: string; description: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
      include: { user: true }
    });

    if (!profile) {
      return { error: "Student profile not found. Please complete your profile." };
    }

    if (!profile.aiAnalysis) {
      return { error: "Please upload and analyze your resume in the Resume Center first." };
    }

    // Format the custom details to match what the Watsonx service expects
    const formattedJob = {
      title: jobDetails.title,
      company: { name: jobDetails.company },
      description: jobDetails.description,
      requirements: "See description.", // Fallback if no specific requirements provided
    };

    const coverLetter = await generateCoverLetterContent(profile, formattedJob);

    return { response: coverLetter };

  } catch (error: any) {
    console.error("Custom Cover Letter Generation error:", error);
    return { error: "Failed to generate custom cover letter. Please try again later." };
  }
}
