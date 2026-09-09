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

    // Check if the user already exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 400 });
    }

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    // Delete any existing tokens for this email to prevent spam/confusion
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    // Create the new token
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires,
      },
    });

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
        const info = await transporter.sendMail({
          from: `"CareerAI" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: "Your Registration Verification Code",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
              <h2 style="color: #c95a2e;">Welcome to CareerAI!</h2>
              <p>Please use the following 6-digit code to verify your email address and complete your registration:</p>
              <div style="background-color: #f7f1e7; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
                <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1c211d;">${otp}</span>
              </div>
              <p style="color: #706b63; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        console.log("Email sent successfully via Nodemailer. ID:", info.messageId);
      } catch (error) {
        console.error("Nodemailer API Error:", error);
        console.log("==========================================");
        console.log("NODEMAILER FAILED. MOCK OTP FALLBACK:");
        console.log(`To: ${email}`);
        console.log(`OTP Code: ${otp}`);
        console.log("==========================================");
      }
    } else {
      // Fallback for local testing if API key is not valid
      console.log("==========================================");
      console.log("MOCK OTP EMAIL SENT. NO NODEMAILER CREDS FOUND");
      console.log(`To: ${email}`);
      console.log(`OTP Code: ${otp}`);
      console.log("==========================================");
    }

    return NextResponse.json({ success: true, message: "Verification code sent." }, { status: 200 });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json({ error: "Failed to send verification code." }, { status: 500 });
  }
}
