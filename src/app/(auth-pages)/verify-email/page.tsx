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

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const email = typeof params?.email === "string" ? params.email : "your email";

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
                className="h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
              >
                <Link href="/login">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Return to login
                </Link>
              </Button>

              <Button
                variant="outline"
                className="h-12 border-white/10 bg-slate-800/50 hover:bg-slate-700/50 text-slate-200"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Resend verification email
              </Button>
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
