"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitEditRequest(data: { companyName?: string; employeeId?: string; reason: string }) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "RECRUITER") {
      throw new Error("Unauthorized");
    }

    const userId = session.user.id;
    const profile = await prisma.recruiterProfile.findUnique({
      where: { userId }
    });

    if (!profile) {
      throw new Error("Profile not found");
    }

    const editRequest = {
      requestedCompanyName: data.companyName || profile.companyName,
      requestedEmployeeId: data.employeeId || profile.employeeId,
      reason: data.reason,
      status: "PENDING",
      submittedAt: new Date().toISOString()
    };

    await prisma.recruiterProfile.update({
      where: { id: profile.id },
      data: { editRequest }
    });

    revalidatePath("/recruiter/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error submitting edit request:", error);
    return { error: error.message || "Failed to submit request" };
  }
}
