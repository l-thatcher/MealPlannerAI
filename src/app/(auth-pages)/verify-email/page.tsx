"use client";

import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { resendVerificationEmail } from "@/lib/actions";
import { useSearchParams } from "next/navigation";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState<string>("your email");
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string | null>(null);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleResendEmail = async () => {
    if (email === "your email") return;

    setIsResending(true);
    setResendMessage(null);

    try {
      const result = await resendVerificationEmail(email);
      if (result.error) {
        setResendMessage(`Error: ${result.error}`);
      } else {
        setResendMessage("Verification email sent! Check your inbox.");
      }
    } catch (error) {
      setResendMessage("Failed to resend email. Please try again.");
      console.error("Error resending verification email:", error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      {/* Blobs for background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>
      <div className="w-full max-w-md">
        <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Check Your Email
            </CardTitle>
            <CardDescription className="text-slate-300">
              We&apos;ve sent a verification link to{" "}
              <span className="text-cyan-400 font-medium">{email}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="space-y-3">
              <p className="text-slate-300">
                Please check your inbox and click the verification link to
                complete your registration.
              </p>
              <p className="text-slate-400 text-sm">
                If you don&apos;t see the email, check your spam folder.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button
                asChild
                variant="outline"
                className="h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-slate-100"
              >
                <Link href="/sign-up">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to sign up
                </Link>
              </Button>

              <Button
                onClick={handleResendEmail}
                disabled={isResending || email === "your email"}
                variant="outline"
                className="h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 hover:text-slate-100"
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${
                    isResending ? "animate-spin" : ""
                  }`}
                />
                {isResending ? "Sending..." : "Resend verification email"}
              </Button>

              {resendMessage && (
                <div
                  className={`p-3 rounded-lg text-sm text-center backdrop-blur-sm ${
                    resendMessage.startsWith("Error")
                      ? "bg-red-500/10 border border-red-500/20 text-red-400"
                      : "bg-green-500/10 border border-green-500/20 text-green-400"
                  }`}
                >
                  {resendMessage}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-slate-400 text-sm mb-2">
                Wrong email address?
              </p>
              <Link
                href="/sign-up"
                className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                Sign up with a different email
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-300">Loading your account...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
