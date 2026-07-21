"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateRoadmapPlan } from "@/services/watsonx";
import pdfParse from "pdf-parse";
import { revalidatePath } from "next/cache";

export async function createRoadmap(targetRole: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile || !profile.resumeUrl) {
      return { error: "No resume found. Please upload one first." };
    }

    const pdfResponse = await fetch(profile.resumeUrl);
    if (!pdfResponse.ok) {
      return { error: "Failed to fetch resume from storage." };
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length === 0) {
      return { error: "Could not extract text from the PDF." };
    }

    // 2. Generate Roadmap using Watsonx
    const planData = await generateRoadmapPlan(resumeText, targetRole);

    // 3. Save to DB
    const roadmap = await prisma.roadmap.create({
      data: {
        studentProfileId: profile.id,
        targetRole,
        data: planData as any
      }
    });

    revalidatePath("/dashboard/roadmap");
    return { success: true, roadmapId: roadmap.id };
  } catch (error: any) {
    console.error("Roadmap error:", error);
    return { error: error.message || "An unexpected error occurred." };
  }
}

export async function deleteRoadmap(roadmapId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile) {
      return { error: "Profile not found" };
    }

    const roadmap = await prisma.roadmap.findUnique({
      where: { id: roadmapId }
    });

    if (!roadmap || roadmap.studentProfileId !== profile.id) {
      return { error: "Roadmap not found or unauthorized" };
    }

    await prisma.roadmap.delete({
      where: { id: roadmapId }
    });

    revalidatePath("/dashboard/roadmap");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Roadmap error:", error);
    return { error: "Failed to delete roadmap." };
  }
}
