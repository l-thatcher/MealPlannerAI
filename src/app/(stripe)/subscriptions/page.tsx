"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Plan = {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: string;
  price_id: string;
};

export default function Subscriptions() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/stripe/subcription-plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoadingPlans(false);
      })
      .catch(() => {
        setError("Failed to load plans");
        setLoadingPlans(false);
      });
  }, []);

  const handleSubscribe = async (priceId: string) => {
    try {
      setIsLoading(priceId);
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      setIsLoading(null);
    }
  };

  if (loadingPlans) {
    return <div className="text-center text-slate-200">Loading plans...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <div className="w-full max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-slate-50 mb-12">
          Upgrade Your Meal Planning
        </h1>

        <div className="grid md:grid-cols-1 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.price_id}
              className="relative bg-slate-900/60 backdrop-blur-xl border border-slate-200/20"
            >
              <CardHeader>
                <CardTitle className="text-slate-50">{plan.name}</CardTitle>
                <CardDescription className="text-slate-200">
                  {(plan.price / 100).toLocaleString("en-GB", {
                    style: "currency",
                    currency: "GBP",
                  })}
                  /{plan.interval}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-slate-200">{plan.description}</p>
                {/* You can add features if you store them in Stripe metadata */}
                <Button
                  onClick={() => handleSubscribe(plan.price_id)}
                  disabled={!!isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading === plan.price_id ? "Loading..." : "Subscribe Now"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
