import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getDropboxToken } from "@/lib/dropbox";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "RECRUITER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { verificationDocBase64, fileName } = await req.json();

    if (!verificationDocBase64) {
      return NextResponse.json({ error: "Missing verification document" }, { status: 400 });
    }

    let verificationDocUrl = "";
    try {
      const token = await getDropboxToken();
      const fileBuffer = Buffer.from(verificationDocBase64, "base64");
      
      const uploadResponse = await fetch("https://content.dropboxapi.com/2/files/upload", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/octet-stream",
          "Dropbox-API-Arg": JSON.stringify({
            path: `/verifications/${session.user.id}_reapply_${Date.now()}_${fileName || 'doc.pdf'}`,
            mode: "add",
            autorename: true,
            mute: false,
          }),
        },
        body: fileBuffer,
      });

      if (!uploadResponse.ok) {
        console.error("Dropbox upload failed:", await uploadResponse.text());
        throw new Error("Failed to upload document");
      }
      
      const uploadData = await uploadResponse.json();
      
      const linkResponse = await fetch("https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          path: uploadData.path_lower,
          settings: { requested_visibility: "public" }
        }),
      });

      if (linkResponse.ok) {
        const linkData = await linkResponse.json();
        verificationDocUrl = linkData.url.replace("?dl=0", "?raw=1");
      } else {
        verificationDocUrl = uploadData.path_lower; 
      }
    } catch (uploadError) {
      console.error("Error uploading to Dropbox:", uploadError);
      return NextResponse.json({ error: "Failed to upload document to storage" }, { status: 500 });
    }

    await prisma.recruiterProfile.update({
      where: { userId: session.user.id },
      data: {
        verificationDocUrl: verificationDocUrl,
        isVerified: false,
        rejectionNote: null, // Clear the rejection note so they are back in pending state
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("REAPPLY_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
