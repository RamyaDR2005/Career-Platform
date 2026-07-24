import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");
    const studentProfileId = searchParams.get("profileId");
    const customResumeUrlParam = searchParams.get("resumeUrl");

    let targetResumeUrl: string | null = null;

    if (customResumeUrlParam) {
      targetResumeUrl = customResumeUrlParam;
    } else if (applicationId) {
      const application = await prisma.application.findUnique({
        where: { id: applicationId },
        include: { studentProfile: true }
      });
      targetResumeUrl = application?.customResumeUrl || application?.studentProfile?.resumeUrl || null;
    } else if (studentProfileId) {
      const profile = await prisma.studentProfile.findUnique({
        where: { id: studentProfileId },
      });
      targetResumeUrl = profile?.resumeUrl || null;
    } else {
      const profile = await prisma.studentProfile.findUnique({
        where: { userId: session.user.id },
      });
      targetResumeUrl = profile?.resumeUrl || null;
    }

    if (!targetResumeUrl) {
      return new NextResponse("Resume not found", { status: 404 });
    }

    // Fetch the PDF binary stream
    const pdfRes = await fetch(targetResumeUrl);
    if (!pdfRes.ok) {
      return new NextResponse("Failed to fetch resume file", { status: 502 });
    }

    const pdfBuffer = await pdfRes.arrayBuffer();

    // Serve with Content-Disposition: inline to force browser viewing instead of download
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename=\"resume.pdf\"",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error serving inline resume preview:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
