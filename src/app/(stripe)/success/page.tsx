"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2, Sparkles, ChefHat } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    // Get session_id from URL params on the client side
    const urlParams = new URLSearchParams(window.location.search);
    const sessionIdFromUrl = urlParams.get("session_id");
    console.log("Session ID from URL:", sessionIdFromUrl);
    setSessionId(sessionIdFromUrl);
  }, []);

  useEffect(() => {
    if (!sessionId) {
      return; // Don't set error immediately, wait for sessionId to be set
    }

    console.log("Verifying session:", sessionId);
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

        console.log("Verification response status:", response.status);

        if (!response.ok) {
          throw new Error("Failed to verify session");
        }

        const data = await response.json();
        console.log("Verification response data:", data);
        setStatus("success");
      } catch (error) {
        console.error("Error verifying session:", error);
        setStatus("error");
      }
    };

    verifySession();
  }, [sessionId]); // Add sessionId to dependency array

  // Set error status if no sessionId is found after initial load
  useEffect(() => {
    if (sessionId === null) {
      // Wait a bit for the URL to be parsed
      const timer = setTimeout(() => {
        if (!sessionId) {
          setStatus("error");
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [sessionId]);

  const getStatusIcon = () => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />;
      case "success":
        return <CheckCircle className="w-16 h-16 text-green-400" />;
      case "error":
        return <XCircle className="w-16 h-16 text-red-400" />;
      default:
        return <Loader2 className="w-16 h-16 text-blue-400 animate-spin" />;
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case "loading":
        return {
          title: "Processing Your Subscription",
          description:
            "Please wait while we verify your payment and activate your account...",
          bgColor: "from-blue-900/40 to-slate-900/40",
          borderColor: "border-blue-400/30",
        };
      case "success":
        return {
          title: "Welcome to plAIte Pro! 🎉",
          description:
            "Your subscription has been successfully activated. You now have access to all premium features!",
          bgColor: "from-green-900/40 to-blue-900/40",
          borderColor: "border-green-400/30",
        };
      case "error":
        return {
          title: "Subscription Issue",
          description:
            "We encountered an issue while processing your subscription. Please try again or contact support.",
          bgColor: "from-red-900/40 to-slate-900/40",
          borderColor: "border-red-400/30",
        };
      default:
        return {
          title: "Processing...",
          description: "Please wait...",
          bgColor: "from-blue-900/40 to-slate-900/40",
          borderColor: "border-blue-400/30",
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <div className="w-full max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ChefHat className="w-10 h-10 text-blue-400" />
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              plAIte
            </span>
          </div>
        </div>

        {/* Status Card */}
        <Card
          className={`bg-gradient-to-br ${statusContent.bgColor} backdrop-blur-xl border ${statusContent.borderColor} shadow-2xl hover:shadow-3xl transition-all duration-300`}
        >
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-6">{getStatusIcon()}</div>

            <CardTitle className="text-2xl md:text-3xl font-bold text-white mb-4">
              {statusContent.title}
            </CardTitle>

            <CardDescription className="text-slate-300 text-lg leading-relaxed max-w-md mx-auto">
              {statusContent.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {status === "success" && (
              <>
                {/* Success Features */}
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    What&apos;s Unlocked
                  </h3>
                  <div className="space-y-3 text-sm text-slate-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Unlimited AI-generated meal plans</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>Advanced dietary customization</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <span>Nutrition tracking & analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                      <span>Priority support</span>
                    </div>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Start Creating Meal Plans
                  </Link>
                </Button>
              </>
            )}

            {status === "error" && (
              <div className="space-y-4">
                <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-4">
                  <p className="text-red-300 text-sm">
                    Don&apos;t worry! Your payment is likely still processing.
                    If you continue to see this error, please contact our
                    support team with your session ID:
                    <code className="bg-red-900/30 px-2 py-1 rounded text-xs ml-1">
                      {sessionId?.slice(0, 20)}...
                    </code>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 hover:border-white/50"
                  >
                    <Link href="/subscriptions">Try Again</Link>
                  </Button>

                  <Button
                    asChild
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  >
                    <Link href="/">Back to App</Link>
                  </Button>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-slate-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <p className="text-slate-400 text-sm mt-3">
                  This usually takes just a few seconds...
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-slate-400 text-sm">
            Need help? Contact us at{" "}
            <a
              href="mailto:support@plaite.ai"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              support@plaite.ai
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
