"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageSubscription = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create portal session");
      }

      const { url } = await response.json();

      // Redirect to the Stripe portal
      window.location.href = url;
    } catch (error) {
      console.error("Error creating portal session:", error);
      alert("Failed to open billing portal. Please try again.");
      setIsLoading(false);
    }
  };

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
            <CardTitle className="text-slate-50">Manage Subscription</CardTitle>
            <CardDescription className="text-slate-200">
              Update your payment details or cancel your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? "Loading..." : "Manage Subscription"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
