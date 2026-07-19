"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateRoadmapPlan } from "@/services/watsonx";
import { PDFParse } from "pdf-parse";
import { revalidatePath } from "next/cache";

export async function createRoadmap(targetRole: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id }
  });

  if (!profile || !profile.resumeUrl) {
    return { error: "Please upload your resume first." };
  }

  try {
    // 1. Fetch Resume PDF
    let resumeText = "";
    try {
      const response = await fetch(profile.resumeUrl);
      if (!response.ok) throw new Error("Could not fetch resume");
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const parser = new PDFParse({ data: buffer });
      const pdfData = await parser.getText();
      resumeText = pdfData.text;
    } catch (e) {
      console.error("Resume parse error", e);
      return { error: "Failed to parse your resume." };
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
