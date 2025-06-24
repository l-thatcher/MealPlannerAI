"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function SuccessPageContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!sessionId) {
      setStatus("error");
      return;
    }

    // Verify the session with your backend
    const verifySession = async () => {
      try {
        const response = await fetch("/api/stripe/verify-subscription", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        });

        if (!response.ok) {
          throw new Error("Failed to verify session");
        }

        setStatus("success");
      } catch (error) {
        console.error("Error verifying session:", error);
        setStatus("error");
      }
    };

    verifySession();
  }, [sessionId]);

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <div className="w-full max-w-lg mx-auto">
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-200/20">
          <CardHeader>
            <CardTitle className="text-slate-50">
              {status === "loading"
                ? "Processing..."
                : status === "success"
                ? "Thank You For Subscribing!"
                : "Something Went Wrong"}
            </CardTitle>
            <CardDescription className="text-slate-200">
              {status === "loading"
                ? "Verifying your subscription..."
                : status === "success"
                ? "Your subscription has been activated"
                : "We couldn't verify your subscription"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {status === "success" && (
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/">Start Creating Meal Plans</Link>
              </Button>
            )}
            {status === "error" && (
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/stripe/subscriptions">Try Again</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-24">
          <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="blob blob-blue" />
            <div className="blob blob-purple" />
            <div className="blob blob-pink" />
            <div className="blob blob-green" />
          </div>
          <div className="w-full max-w-lg mx-auto">
            <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-200/20">
              <CardHeader>
                <CardTitle className="text-slate-50">Loading...</CardTitle>
                <CardDescription className="text-slate-200">
                  Please wait while we process your request.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      }
    >
      <SuccessPageContent />
    </Suspense>
  );
}
