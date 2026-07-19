"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const requirements = formData.get("requirements") as string;
  const location = formData.get("location") as string;
  const salary = formData.get("salary") as string;
  const deadlineStr = formData.get("deadline") as string;

  if (!title || !description || !requirements) {
    return { error: "Title, Description, and Requirements are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user?.companyId) {
      return { error: "You must create a company profile first." };
    }

    let deadline: Date | null = null;
    if (deadlineStr) {
      deadline = new Date(deadlineStr);
    }

    await prisma.job.create({
      data: {
        title,
        description,
        requirements,
        location,
        salary,
        deadline,
        companyId: user.companyId
      }
    });

  } catch (error: any) {
    console.error("Job Creation Error:", error);
    return { error: "Failed to create job posting" };
  }
  
  revalidatePath("/recruiter/jobs");
  revalidatePath("/recruiter");
  redirect("/recruiter/jobs");
}

export async function closeJobProcess(jobId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (job?.companyId !== user?.companyId) {
      return { error: "Unauthorized to close this job" };
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { status: "CLOSED" }
    });

    revalidatePath("/recruiter/jobs");
    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    return { error: "Failed to close the job" };
  }
}

export async function updateJobDeadline(jobId: string, newDeadlineStr: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (job?.companyId !== user?.companyId) {
      return { error: "Unauthorized to edit this job" };
    }

    const deadline = newDeadlineStr ? new Date(newDeadlineStr) : null;

    await prisma.job.update({
      where: { id: jobId },
      data: { deadline }
    });

    revalidatePath("/recruiter/jobs");
    revalidatePath("/dashboard/jobs");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update deadline" };
  }
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });
    
    // Authorization check
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (application?.job.companyId !== user?.companyId) {
       return { error: "Unauthorized to update this application" };
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status }
    });
    
    revalidatePath(`/recruiter/jobs/${application?.jobId}`);
    return { success: true };
  } catch (error) {
    return { error: "Failed to update status" };
  }
}

export async function evaluateCandidateFit(applicationId: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { 
        job: true,
        studentProfile: true
      }
    });

    if (!application) {
      return { error: "Application not found" };
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (application.job.companyId !== user?.companyId) {
      return { error: "Unauthorized to evaluate this application" };
    }

    // Call Watsonx for evaluation
    // Since we can't easily import evaluateCandidate directly here without making it a server component import cycle,
    // wait, we can just import it at the top of the file. Let me check if I should do that or just import dynamically.
    const { evaluateCandidate } = await import("@/services/watsonx");
    
    const evaluation = await evaluateCandidate(application.studentProfile, application.job);

    // Save the specific AI score to the application record
    if (evaluation?.score !== undefined) {
      await prisma.application.update({
        where: { id: applicationId },
        data: { aiScore: evaluation.score }
      });
    }
    
    revalidatePath(`/recruiter/jobs/${application.jobId}`);
    return { response: evaluation };
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    return { error: "Failed to run AI evaluation." };
  }
}
