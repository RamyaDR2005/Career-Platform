import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // We still return 200 even if user doesn't exist for security reasons (don't reveal registered emails)
    if (!user) {
      return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    // Send email using Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_APP_PASSWORD,
        },
      });

      try {
        await transporter.sendMail({
          from: `"CareerAI" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Reset Your Password - CareerAI",
          html: `<p>Hello,</p><p>You requested a password reset. Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>This link will expire in 1 hour.</p><p>If you didn't request this, you can safely ignore this email.</p>`,
        });
      } catch (error) {
        console.error("Nodemailer Forgot Password Error:", error);
        console.log("==========================================");
        console.log("NODEMAILER FAILED. MOCK EMAIL FALLBACK:");
        console.log(`To: ${email}`);
        console.log(`Reset Link: ${resetLink}`);
        console.log("==========================================");
      }
    } else {
      // Fallback for local testing if API key is not valid
      console.log("==========================================");
      console.log("MOCK EMAIL SENT. NO NODEMAILER CREDS FOUND");
      console.log(`To: ${email}`);
      console.log(`Reset Link: ${resetLink}`);
      console.log("==========================================");
    }

    return NextResponse.json({ message: "If an account exists, a reset link has been sent." }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
