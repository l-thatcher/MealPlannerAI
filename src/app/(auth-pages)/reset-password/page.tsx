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

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state
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
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription>
              Enter a new password for your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" ? (
              <div className="text-green-600 text-center space-y-2">
                <p>Your password has been reset.</p>
                <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-3">
                  <Label htmlFor="password">New Password</Label>
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
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
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
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "Resetting..." : "Reset Password"}
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
