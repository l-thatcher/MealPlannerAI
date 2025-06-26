"use client";
import React, { useState } from "react";
import { forgotPassword } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);

    const result = await forgotPassword(email);

    if (result?.error) {
      setErrorMsg(result.error);
      setStatus("error");
    } else {
      setStatus("success");
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
      <div className="w-full max-w-sm">
        <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center mb-2">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter your email and we&apos;ll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "success" ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-green-400 font-medium">Reset link sent!</p>
                  <p className="text-slate-300 text-sm">
                    Check your email for password reset instructions.
                  </p>
                </div>
                <Button
                  asChild
                  variant="outline"
                  className="w-full h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
                >
                  <Link href="/login">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Return to login
                  </Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === "loading"}
                      className="pl-10 h-12 border-white/10 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-orange-400/50 focus:ring-orange-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold transition-all duration-200 hover:shadow-lg"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Sending reset link..."
                    : "Send Reset Link"}
                </Button>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center backdrop-blur-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
