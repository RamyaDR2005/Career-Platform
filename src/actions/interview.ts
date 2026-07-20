"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { generateInterviewResponse } from "@/services/watsonx";

export async function submitInterviewMessage(chatHistory: { role: 'user' | 'assistant', content: string }[], context?: { type: "general" | "job", jobDescription?: string }) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { error: "Student profile not found. Please set up your profile first." };
    }

    const aiResponse = await generateInterviewResponse(chatHistory, profile, context);

    return { response: aiResponse };

  } catch (error: any) {
    console.error("Interview API error:", error);
    return { error: "Failed to generate AI response. Please try again." };
  }
}

export async function endInterview(chatHistory: { role: 'user' | 'assistant', content: string }[]) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return { error: "Student profile not found. Please set up your profile first." };
    }

    const { generateInterviewFeedback } = await import("@/services/watsonx");
    const aiFeedback = await generateInterviewFeedback(chatHistory, profile);

    // Save Mock Interview to DB
    await prisma.mockInterview.create({
      data: {
        studentProfileId: profile.id,
        title: "Mock Interview Session",
        transcript: chatHistory as any,
        evaluation: { summary: aiFeedback } as any
      }
    });

    return { response: aiFeedback };

  } catch (error: any) {
    console.error("Interview Feedback API error:", error);
    return { error: "Failed to generate AI feedback. Please try again." };
  }
}
