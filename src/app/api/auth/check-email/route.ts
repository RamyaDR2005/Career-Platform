import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: { role: true },
    });

    if (user) {
      return NextResponse.json({ exists: true, role: user.role });
    } else {
      return NextResponse.json({ exists: false });
    }
  } catch (error) {
    console.error("CHECK_EMAIL_ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
