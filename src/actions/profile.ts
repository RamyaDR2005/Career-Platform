"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: any) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // Server-side validation
  const name = data.name?.trim() || "";
  const college = data.college?.trim() || "";
  const degree = data.degree?.trim() || "";
  const branch = data.branch?.trim() || "";
  const graduationYear = data.graduationYear;
  const cgpa = data.cgpa;
  const linkedinUrl = data.linkedinUrl?.trim() || "";
  const githubUrl = data.githubUrl?.trim() || "";
  const portfolioUrl = data.portfolioUrl?.trim() || "";

  if (!name || name.length < 2 || name.length > 50 || !/^[a-zA-Z\s.-]+$/.test(name)) {
    return { error: "Name must be 2-50 characters and can only contain letters, spaces, dots, and hyphens" };
  }
  if (!college || college.length < 2 || college.length > 100) {
    return { error: "College/University must be 2-100 characters long" };
  }
  if (!degree || degree.length < 2 || degree.length > 50) {
    return { error: "Degree must be 2-50 characters long" };
  }
  if (!branch || branch.length < 2 || branch.length > 50) {
    return { error: "Branch/Major must be 2-50 characters long" };
  }
  
  const parsedGradYear = graduationYear ? parseInt(String(graduationYear).trim(), 10) : null;
  if (parsedGradYear === null || isNaN(parsedGradYear) || parsedGradYear < 1980 || parsedGradYear > 2040) {
    return { error: "Graduation year must be between 1980 and 2040" };
  }

  const parsedCgpa = cgpa ? parseFloat(String(cgpa).trim()) : null;
  if (parsedCgpa === null || isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 10) {
    return { error: "CGPA must be a number between 0.0 and 10.0" };
  }

  if (linkedinUrl && !/^https:\/\/(www\.)?([a-z]{2,3}\.)?linkedin\.com\/.*$/i.test(linkedinUrl)) {
    return { error: "Please enter a valid LinkedIn URL (e.g., https://linkedin.com/in/username)" };
  }

  if (githubUrl && !/^https:\/\/(www\.)?github\.com\/.*$/i.test(githubUrl)) {
    return { error: "Please enter a valid GitHub URL (e.g., https://github.com/username)" };
  }

  if (portfolioUrl && !/^https?:\/\/.+$/i.test(portfolioUrl)) {
    return { error: "Please enter a valid Portfolio URL (e.g., https://myportfolio.dev)" };
  }

  try {
    const updatedProfile = await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: {
        college: college,
        degree: degree,
        branch: branch,
        graduationYear: parsedGradYear,
        cgpa: parsedCgpa,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
      },
      create: {
        userId: session.user.id,
        college: college,
        degree: degree,
        branch: branch,
        graduationYear: parsedGradYear,
        cgpa: parsedCgpa,
        linkedinUrl: linkedinUrl || null,
        githubUrl: githubUrl || null,
        portfolioUrl: portfolioUrl || null,
      }
    });

    // Also update the user's name if it was changed
    if (name && name !== session.user.name) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { name: name }
      });
    }

    revalidatePath("/dashboard/profile");
    return { success: true };

  } catch (error: any) {
    console.error("Profile update error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

export async function analyzeCurrentResumeAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const profile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id }
    });

    if (!profile?.resumeUrl) {
      return { error: "No resume found. Please upload a PDF resume first." };
    }

    let pdfText = "";
    try {
      const pdfParseModule = await import("pdf-parse");
      const pdfParse = pdfParseModule.default || pdfParseModule;
      const pdfRes = await fetch(profile.resumeUrl);
      if (pdfRes.ok) {
        const arrayBuffer = await pdfRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const pdfData = await pdfParse(buffer);
        pdfText = pdfData.text.trim();
      }
    } catch (err) {
      console.error("Error parsing PDF resume:", err);
    }

    const { analyzeResumeText } = await import("@/services/watsonx");
    const result = await analyzeResumeText(pdfText || "General candidate resume text", {
      type: "general",
      profile
    });

    await prisma.studentProfile.update({
      where: { userId: session.user.id },
      data: {
        atsScore: result.atsScore || 70,
        aiAnalysis: result
      }
    });

    revalidatePath("/dashboard/resume");
    revalidatePath("/dashboard");
    return { success: true, result };
  } catch (error: any) {
    console.error("Analyze resume error:", error);
    return { error: "Failed to analyze resume with Watsonx AI. Please try again." };
  }
}
