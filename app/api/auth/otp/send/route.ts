// app/api/auth/otp/send/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verificationTokens } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const formattedEmail = email.toLowerCase().trim();

    // 1. Generate 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiration

    // 2. Clean up any existing codes for this email
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.identifier, formattedEmail));

    // 3. Insert code into the database
    await db.insert(verificationTokens).values({
      identifier: formattedEmail,
      token: code,
      expires,
    });

    // 4. Send code via Resend HTTP API
    const apiKey = process.env.AUTH_RESEND_KEY;
    const from = process.env.RESEND_FROM || "onboarding@resend.dev";

    if (!apiKey) {
      console.error("AUTH_RESEND_KEY environment variable is missing");
      return NextResponse.json(
        { error: "Email configuration error" },
        { status: 500 },
      );
    }

    const isDev = process.env.NODE_ENV === "development";
    const recipientEmail = formattedEmail;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: isDev ? "delivered@resend.dev" : recipientEmail,
        subject: "Your Subler Verification Code",
        html: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="font-size: 20px; font-weight: bold; color: #0e1442; margin-bottom: 16px;">Subler Verification Code</h2>
            <p style="font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 24px;">
               You requested a verification code to sign in to the Subler Reverse Marketplace. 
               Please enter the following 6-digit code on the login page:
            </p>
            <div style="background-color: #fafafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #1e2d8c;">${code}</span>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 16px;">
              This code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.
            </p>
            <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 16px;" />
            <p style="font-size: 11px; color: #94a3b8;">
              &copy; ${new Date().getFullYear()} Subler.
            </p>
          </div>
        `,
        text: `Your Subler verification code is: ${code}\n\nThis code is valid for 5 minutes. If you did not request this code, you can safely ignore this email.`,
      }),
    });

    // Output code to console for easy local development testing without checking emails
    console.log(`[OTP Verification Code] ${formattedEmail} -> ${code}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Resend API response error:", errorText);

      // In development, ignore email dispatch failures (like unverified domain limits)
      // and let the developer log in using the console log code.
      if (isDev) {
        console.warn(
          `[DEV ONLY] Resend API call failed, but letting login flow continue with console-logged OTP code.`,
        );
        return NextResponse.json({
          success: true,
          warning: "Email dispatch failed but bypassed in dev",
        });
      }

      return NextResponse.json(
        { error: "Failed to send email verification code" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in OTP send route:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
