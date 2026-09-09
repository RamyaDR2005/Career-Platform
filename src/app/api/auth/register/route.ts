import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getDropboxToken } from "@/lib/dropbox";

export async function POST(req: Request) {
  try {
    const { name, email, password, role, companyName, employeeId, verificationDocBase64, fileName } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role === "RECRUITER" && (!companyName || !employeeId || !verificationDocBase64)) {
      return NextResponse.json({ error: "Missing recruiter required fields" }, { status: 400 });
    }

    const exist = await prisma.user.findUnique({
      where: { email },
    });

    if (exist) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "STUDENT",
      },
    });

    if (user.role === "STUDENT") {
      await prisma.studentProfile.create({
        data: {
          userId: user.id,
        },
      });
    } else if (user.role === "RECRUITER") {
      // Upload document to Dropbox
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
              path: `/verifications/${user.id}_${fileName || 'doc.pdf'}`,
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
        
        // Create shared link for viewing
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
          // Modify dl=0 to raw=1 to get direct URL
          verificationDocUrl = linkData.url.replace("?dl=0", "?raw=1");
        } else {
          // fallback if link creation fails
          verificationDocUrl = uploadData.path_lower; 
        }
      } catch (uploadError) {
        console.error("Error uploading to Dropbox:", uploadError);
        // We'll still create the profile, maybe they can upload later or admin contacts them
      }

      await prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          companyName: companyName,
          employeeId: employeeId,
          verificationDocUrl: verificationDocUrl,
          isVerified: false,
        },
      });
    }

    return NextResponse.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    }, { status: 201 });
  } catch (error) {
    console.error("REGISTRATION_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
