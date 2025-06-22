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
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Forgot your password?</CardTitle>
            <CardDescription>
              Enter your email and we&apos;ll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="text-center space-y-2">
                <p className="text-green-600">
                  Check your email for a password reset link.
                </p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="email@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading"}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Sending..." : "Send Reset Link"}
                </Button>
                {errorMsg && (
                  <div className="text-red-500 text-sm text-center">
                    {errorMsg}
                  </div>
                )}
                <div className="text-center text-sm">
                  <Link href="/login" className="underline underline-offset-4">
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
