"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { PDFParse } from "pdf-parse";

import { analyzeResumeText } from "@/services/watsonx";
import { revalidatePath } from "next/cache";

export async function analyzeResume(type: "general" | "job" = "general", jobDescription?: string) {
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

    // 1. Fetch PDF from storage
    const pdfResponse = await fetch(profile.resumeUrl);
    if (!pdfResponse.ok) {
      return { error: "Failed to fetch resume from storage." };
    }

    const arrayBuffer = await pdfResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. Parse PDF Text
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    const text = pdfData.text;

    if (!text || text.trim().length === 0) {
      return { error: "Could not extract text from the PDF. Make sure it is not a scanned image." };
    }

    // 3. Send to Watsonx.ai
    const analysis = await analyzeResumeText(text, { type, jobDescription, profile });

    // 4. Update Database
    await prisma.studentProfile.update({
      where: { id: profile.id },
      data: {
        atsScore: analysis.atsScore,
        aiAnalysis: analysis,
      },
    });

    revalidatePath("/dashboard/resume");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error: any) {
    console.error("AI Analysis Error:", error);
    return { error: error.message || "Failed to analyze resume." };
  }
}
