"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getDropboxToken } from "@/lib/dropbox";

export async function getDropboxUploadLink(fileName: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const safeFileName = `resume_${session.user.id}_${Date.now()}.pdf`;
  const path = `/resumes/${safeFileName}`;

  try {
    const accessToken = await getDropboxToken();
    const res = await fetch("https://api.dropboxapi.com/2/files/get_temporary_upload_link", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        commit_info: {
          path: path,
          mode: "add",
          autorename: true,
          mute: false,
        },
        duration: 3600,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Dropbox get_temporary_upload_link error:", errText);
      return { error: "Failed to initialize upload." };
    }

    const data = await res.json();
    return { link: data.link, path: path };
  } catch (error) {
    console.error("Dropbox Link Generation Error:", error);
    return { error: "Failed to generate upload link." };
  }
}

export async function saveResumeUrl(path: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const accessToken = await getDropboxToken();
    const shareRes = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path: path,
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
    console.error("Dropbox Save Error:", error);
    return { error: "Failed to save uploaded file." };
  }
}
