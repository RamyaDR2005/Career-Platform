"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        college: data.college,
        degree: data.degree,
        branch: data.branch,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : null,
        cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      },
      create: {
        userId: session.user.id,
        college: data.college,
        degree: data.degree,
        branch: data.branch,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : null,
        cgpa: data.cgpa ? parseFloat(data.cgpa) : null,
        linkedinUrl: data.linkedinUrl,
        githubUrl: data.githubUrl,
      }
    });

    // Also update the user's name if it was changed
    if (data.name && data.name !== session.user.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: data.name }
      });
    }

    revalidatePath("/dashboard/profile");
    return { success: true };

  } catch (error: any) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}
