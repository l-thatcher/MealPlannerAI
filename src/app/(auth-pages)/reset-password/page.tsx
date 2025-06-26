"use client";
import React, { useState } from "react";
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
import { resetPassword } from "@/lib/actions";
import { Lock, CheckCircle, ArrowLeft } from "lucide-react";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setStatus("error");
      return;
    }

    setStatus("loading");

    const result = await resetPassword(password);

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
            <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 flex items-center justify-center mb-2">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Create New Password
            </CardTitle>
            <CardDescription className="text-slate-300">
              Enter a strong password for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "success" ? (
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-green-400 font-medium">
                    Password updated!
                  </p>
                  <p className="text-slate-300 text-sm">
                    Your password has been successfully reset.
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
                  <Label
                    htmlFor="password"
                    className="text-slate-200 font-medium"
                  >
                    New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="new-password"
                      placeholder="Enter new password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={status === "loading"}
                      className="pl-10 h-12 border-white/10 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="confirmPassword"
                    className="text-slate-200 font-medium"
                  >
                    Confirm New Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      autoComplete="new-password"
                      placeholder="Re-enter new password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      disabled={status === "loading"}
                      className="pl-10 h-12 border-white/10 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-purple-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-200 hover:shadow-lg"
                  disabled={status === "loading"}
                >
                  {status === "loading"
                    ? "Updating password..."
                    : "Update Password"}
                </Button>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center backdrop-blur-sm">
                    {errorMsg}
                  </div>
                )}

                <div className="text-center">
                  <Link
                    href="/login"
                    className="inline-flex items-center text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors"
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
