"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getDropboxToken } from "@/lib/dropbox";
import { revalidatePath } from "next/cache";

export async function uploadFileToDropbox(formData: FormData, isPrimary: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    return { error: "No file provided." };
  }

  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return { error: "Only PDF files are supported." };
  }

  try {
    const cleanFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `/resumes/${session.user.id}_${Date.now()}_${cleanFilename}`;
    const token = await getDropboxToken();
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload binary stream to Dropbox API
    const uploadRes = await fetch("https://content.dropboxapi.com/2/files/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Dropbox-API-Arg": JSON.stringify({
          path,
          mode: "add",
          autorename: true,
          mute: false,
        }),
        "Content-Type": "application/octet-stream",
      },
      body: buffer,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      console.error("Dropbox upload API error:", errText);
      return { error: "Failed to upload file to storage." };
    }

    // Create shared direct view/download URL
    let sharedUrl = "";
    const shareRes = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        settings: { requested_visibility: "public" },
      }),
    });

    if (shareRes.ok) {
      const shareData = await shareRes.json();
      sharedUrl = shareData.url.replace("dl=0", "dl=1");
    } else {
      // List existing links if already shared
      const listRes = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      if (listRes.ok) {
        const listData = await listRes.json();
        if (listData.links?.length > 0) {
          sharedUrl = listData.links[0].url.replace("dl=0", "dl=1");
        }
      }
    }

    if (!sharedUrl) {
      sharedUrl = `https://dl.dropboxusercontent.com/s/${path}`;
    }

    if (isPrimary) {
      await prisma.studentProfile.upsert({
        where: { userId: session.user.id },
        update: { resumeUrl: sharedUrl },
        create: {
          userId: session.user.id,
          resumeUrl: sharedUrl,
        },
      });

      revalidatePath("/dashboard/resume");
      revalidatePath("/dashboard");
    }

    return { success: true, url: sharedUrl };
  } catch (error: any) {
    console.error("Server Action Resume Upload Error:", error);
    return { error: error?.message || "Failed to process resume upload." };
  }
}

export async function getDropboxUploadLink(filename: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `/resumes/${session.user.id}_${Date.now()}_${cleanFilename}`;
    const token = await getDropboxToken();

    return {
      link: "https://content.dropboxapi.com/2/files/upload",
      path,
      token,
    };
  } catch (error: any) {
    console.error("Error generating upload link:", error);
    return { error: "Failed to initialize resume upload." };
  }
}

export async function saveResumeUrl(path: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  try {
    const token = await getDropboxToken();
    let sharedUrl = "";
    const response = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        path,
        settings: { requested_visibility: "public" },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      sharedUrl = data.url.replace("dl=0", "dl=1");
    } else {
      const listResponse = await fetch("https://api.dropboxapi.com/2/sharing/list_shared_links", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ path }),
      });

      if (listResponse.ok) {
        const listData = await listResponse.json();
        if (listData.links?.length > 0) {
          sharedUrl = listData.links[0].url.replace("dl=0", "dl=1");
        }
      }
    }

    if (!sharedUrl) {
      sharedUrl = `https://dl.dropboxusercontent.com/s/${path}`;
    }

    await prisma.studentProfile.upsert({
      where: { userId: session.user.id },
      update: { resumeUrl: sharedUrl },
      create: {
        userId: session.user.id,
        resumeUrl: sharedUrl,
      },
    });

    revalidatePath("/dashboard/resume");
    revalidatePath("/dashboard");
    return { success: true, url: sharedUrl };
  } catch (error: any) {
    console.error("Error saving resume URL:", error);
    return { error: "Failed to save resume URL." };
  }
}
