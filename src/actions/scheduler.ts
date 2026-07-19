"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function scheduleInterview(applicationId: string, scheduledAt: string, link?: string, notes?: string) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const dateObj = new Date(scheduledAt);
  if (isNaN(dateObj.getTime())) {
    return { error: "Please enter a valid date and time." };
  }

  try {
    const application = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { job: true }
    });

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (application?.job.companyId !== user?.companyId) {
      return { error: "Unauthorized to schedule for this application" };
    }

    const interview = await prisma.interview.create({
      data: {
        applicationId,
        scheduledAt: new Date(scheduledAt),
        link,
        notes,
        status: "SCHEDULED"
      }
    });

    revalidatePath("/recruiter/jobs");
    revalidatePath("/dashboard");
    
    return { success: true, interview };
  } catch (error: any) {
    console.error("Schedule Interview error:", error);
    return { error: `Failed to schedule interview: ${error.message}` };
  }
}

export async function getInterviews(applicationId: string) {
  try {
    const interviews = await prisma.interview.findMany({
      where: { applicationId },
      orderBy: { scheduledAt: 'desc' }
    });
    return { interviews };
  } catch (error) {
    return { error: "Failed to fetch interviews" };
  }
}
