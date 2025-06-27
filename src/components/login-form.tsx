"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
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
import { AuthFormProps } from "@/types/interfaces";
import { Mail, Lock, User } from "lucide-react";

export function LoginForm({ className, action, ...props }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    setErrorMsg(null);
    if (action) {
      if (typeof action === "function") {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const result = await action(formData);
        if (result?.error) {
          setErrorMsg(result.error);
        }
        setIsLoading(false);
      }
      // else, let the form submit (for server actions)
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-white/10 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mb-2">
            <User className="h-6 w-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back
          </CardTitle>
          <CardDescription className="text-slate-300">
            Sign in to access your personalised meal plans
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-white/20"
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsLoading(true)}
                >
                  <Apple className="h-5 w-5 mr-3" />
                  {isLoading ? "Loading..." : "Continue with Apple"}
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200 backdrop-blur-sm transition-all duration-200 hover:border-white/20"
                  type="button"
                  disabled={isLoading}
                  onClick={() => setIsLoading(true)}
                >
                  <Chrome className="h-5 w-5 mr-3" />
                  {isLoading ? "Loading..." : "Continue with Google"}
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900/80 px-3 text-slate-400 backdrop-blur-sm">
                    Or continue with email
                  </span>
                </div>
              </div> */}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-200 font-medium">
                    Email
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
                      disabled={isLoading}
                      className="pl-10 h-12 border-white/10 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="password"
                      className="text-slate-200 font-medium"
                    >
                      Password
                    </Label>
                    <a
                      href="/forgot-password"
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                      id="password"
                      type="password"
                      name="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                      className="pl-10 h-12 border-white/10 bg-slate-800/50 text-slate-200 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 backdrop-blur-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-200 hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>

                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center backdrop-blur-sm">
                    {errorMsg}
                  </div>
                )}
              </div>

              <div className="text-center text-sm text-slate-300">
                Don&apos;t have an account?{" "}
                <a
                  href="/sign-up"
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Create account
                </a>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-center text-xs text-slate-400">
        By continuing, you agree to our{" "}
        <a
          href="#"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Terms of Service
        </a>{" "}
        and{" "}
        <a
          href="#"
          className="text-blue-400 hover:text-blue-300 transition-colors"
        >
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
