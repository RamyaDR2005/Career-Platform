"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function upsertCompany(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "RECRUITER") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const website = formData.get("website") as string;

  if (!name || !description) {
    return { error: "Name and Description are required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    let company;
    
    if (user?.companyId) {
      // Update existing
      company = await prisma.company.update({
        where: { id: user.companyId },
        data: { name, description, website }
      });
    } else {
      // Create new
      company = await prisma.company.create({
        data: { name, description, website }
      });
      // Link to user
      await prisma.user.update({
        where: { id: session.user.id },
        data: { companyId: company.id }
      });
    }

    revalidatePath("/recruiter");
    revalidatePath("/recruiter/company");
    return { success: true };
  } catch (error: any) {
    console.error("Company update error:", error);
    return { error: "Failed to update company profile" };
  }
}
