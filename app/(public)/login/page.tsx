"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";

function LoginForm() {
  const searchParams = useSearchParams();
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const callbackUrl = rawCallbackUrl.replace(/[?&]new_login=true/, "");

  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send code.");
      }

      setStep("otp");
      toast.success("Verification code sent to your email!");
    } catch (err: any) {
      console.error("OTP Send error:", err);
      toast.error(
        err.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode) {
      toast.error("Please enter the verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email: email.toLowerCase().trim(),
        code: otpCode.trim(),
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        toast.error("Invalid or expired verification code.");
      } else {
        toast.success("Logged in successfully!");
        if (callbackUrl === "/dashboard") {
          try {
            const userRes = await fetch("/api/users/me");
            if (userRes.ok) {
              const userData = await userRes.json();
              if (userData?.hostStatus === "approved") {
                window.location.replace("/host/dashboard");
                return;
              }
            }
          } catch (err) {
            console.error("Error checking host role after login:", err);
          }
        }
        window.location.replace(callbackUrl);
      }
    } catch (err) {
      console.error("Login verification error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "otp") {
    return (
      <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 shadow-xs space-y-6 animate-fade-in">
        <div className="space-y-2">
          <div className="h-10 w-10 rounded-lg bg-[#1E2D8C]/5 flex items-center justify-center text-[#1E2D8C]">
            <KeyRound className="h-5 w-5" />
          </div>
          <h2 className="font-display text-lg font-semibold text-[#1E2D8C] tracking-tight">
            Verify Your Email
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            We sent a 6-digit code to{" "}
            <strong className="text-[#1E2D8C]">{email}</strong>. Enter it below
            to sign in.
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="code"
              className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
            >
              Verification Code
            </label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              placeholder="123456"
              value={otpCode}
              onChange={(e) =>
                setOtpCode(e.target.value.replace(/[^0-9]/g, ""))
              }
              disabled={loading}
              required
              className="h-11 rounded-lg border border-slate-200 focus:border-[#1E2D8C] px-3.5 text-center font-mono text-lg tracking-widest focus-visible:ring-[#1E2D8C]/10 bg-white text-[#1E2D8C] outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => {
                setStep("email");
                setOtpCode("");
              }}
              className="w-1/3 border-slate-200 hover:bg-slate-50 font-semibold h-10 text-xs rounded-lg transition-colors cursor-pointer"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="w-2/3 bg-[#FDC800] hover:bg-[#FDC800]/90 text-black font-semibold transition-all rounded-lg h-10 shadow-xs text-xs active:scale-[0.98] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Sign In"
              )}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 shadow-xs space-y-6 animate-fade-in">
      <div className="space-y-2">
        <h2 className="font-display text-lg font-semibold text-[#1E2D8C] tracking-tight">
          Sign In
        </h2>
        <p className="text-xs text-slate-500">
          Enter your email to receive a secure one-time verification link.
        </p>
      </div>

      <form onSubmit={handleSendOtp} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs font-bold text-slate-400 uppercase tracking-wider"
          >
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            className="h-10 rounded-lg border border-slate-200 focus:border-[#1E2D8C] px-3 text-xs focus-visible:ring-[#1E2D8C]/10 bg-white text-[#1E2D8C] outline-none"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FDC800] hover:bg-[#FDC800]/90 text-black font-semibold transition-all rounded-lg h-10 shadow-xs text-xs active:scale-[0.98] cursor-pointer pt-0.5"
        >
          {loading ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Sending Link...
            </>
          ) : (
            "Send Magic Link"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#fafafc] flex flex-col items-center justify-center p-6 relative font-sans">
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#1E2D8C] transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* Brand logo lockup centered above the card */}
      <div className="flex items-center gap-2 mb-8 select-none">
        <img
          src="/subler-logo-black.png"
          alt="Subler"
          className="h-5.5 w-auto object-contain shrink-0"
        />
        <div className="flex items-baseline gap-1">
          <span className="text-slate-300 font-light text-xs select-none">
            |
          </span>
          <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap leading-none tracking-tight">
            Reverse Marketplace
          </span>
        </div>
      </div>

      {/* Center - Form Card */}
      <div className="w-full max-w-md flex flex-col items-center justify-center">
        <Suspense
          fallback={
            <div className="w-full max-w-md bg-white border border-slate-200/60 rounded-2xl p-8 shadow-xs flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </div>

      {/* Bottom info */}
      <div className="mt-8 text-center text-[10px] text-slate-400 max-w-xs leading-relaxed select-none">
        <p>
          By continuing, you agree to Subler&apos;s terms of service and privacy
          policy. All transaction processes are finalized on Subler.
        </p>
      </div>
    </div>
  );
}
