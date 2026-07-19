"use server";


import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function uploadResume(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("resume") as File;
  if (!file) {
    return { error: "No file provided" };
  }

  if (file.type !== "application/pdf") {
    return { error: "Only PDF files are allowed" };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "File exceeds 5MB limit" };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  try {
    const fileName = `resume_${session.user.id}_${Date.now()}.pdf`;
    const dropboxArg = {
      path: `/resumes/${fileName}`,
      mode: "add",
      autorename: true,
      mute: false,
    };

    const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        "Dropbox-API-Arg": JSON.stringify(dropboxArg),
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Dropbox upload error:", errText);
      return { error: "Failed to upload to Dropbox." };
    }
    const uploadData = await uploadRes.json();

    const shareRes = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.DROPBOX_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: uploadData.path_lower,
        settings: {
          requested_visibility: "public",
        },
      }),
    });

    if (!shareRes.ok) {
      const errText = await shareRes.text();
      console.error("Dropbox share error:", errText);
      return { error: "Failed to create public link." };
    }
    const shareData = await shareRes.json();
    const secureUrl = shareData.url.replace("www.dropbox.com", "dl.dropboxusercontent.com").replace("?dl=0", "");

    await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: { resumeUrl: secureUrl },
      create: {
        userId: session.user.id,
        resumeUrl: secureUrl,
      },
    });

    revalidatePath("/dashboard/resume");
    revalidatePath("/dashboard");
    return { success: true, url: secureUrl };
  } catch (error) {
    console.error("Dropbox Upload Error:", error);
    return { error: "Failed to upload file to Dropbox" };
  }
}
