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
import { Badge } from "@/components/ui/badge";
import { Check, Star, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

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

  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("basic") || name.includes("starter")) {
      return [
        "Up to 5-day meal plans",
        "GPT 4.0 powered AI model",
        "Shopping list generation",
      ];
    } else if (name.includes("pro") || name.includes("premium")) {
      return [
        "Up to 14-day meal plans",
        "Advanced AI models (GPT-4.1)",
        "Higher daily meal plan limits",
        "Advanced plan customisation options",
        "Detailed nutrition tracking",
      ];
    } else if (name.includes("family") || name.includes("enterprise")) {
      return [
        "Everything in Pro",
        "Multiple family member profiles",
        "Bulk meal planning",
        "Advanced nutrition goals",
        "Custom recipe imports",
        "White-label options",
        "Dedicated account manager",
      ];
    } else {
      return [
        "Up to 5-day meal plans",
        "GPT 4.0 powered AI model",
        "Shopping list generation",
      ];
    }
  };

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("basic") || name.includes("starter")) {
      return <Star className="w-6 h-6 text-blue-400" />;
    } else if (name.includes("pro") || name.includes("premium")) {
      return <Sparkles className="w-6 h-6 text-purple-400" />;
    } else if (name.includes("family") || name.includes("enterprise")) {
      return <Crown className="w-6 h-6 text-yellow-400" />;
    } else {
      return <Star className="w-6 h-6 text-blue-400" />;
    }
  };

  const isPremiumPlan = (planName: string) => {
    const name = planName.toLowerCase();
    return (
      name.includes("pro") ||
      name.includes("premium") ||
      name.includes("family") ||
      name.includes("enterprise")
    );
  };

  if (loadingPlans) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="blob blob-blue animate-pulse" />
          <div
            className="blob blob-purple animate-pulse"
            style={{ animationDelay: "0.5s" }}
          />
          <div
            className="blob blob-pink animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>
        <Card className="bg-slate-900/80 backdrop-blur-xl border border-slate-200/20 p-8">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
            <span className="text-slate-200 font-medium">
              Loading subscription plans...
            </span>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="blob blob-blue opacity-50" />
          <div className="blob blob-purple opacity-50" />
        </div>
        <Card className="bg-red-900/20 backdrop-blur-xl border border-red-500/30 p-8 max-w-md">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-400 text-xl">⚠️</span>
            </div>
            <h3 className="text-red-400 font-semibold mb-2">
              Failed to Load Plans
            </h3>
            <p className="text-slate-300 text-sm">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white"
            >
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 md:p-12 lg:p-24">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <div className="w-full max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 mb-6">
            <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
            <span className="text-blue-300 text-sm font-medium">
              Unlock Premium Features
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-50 via-blue-100 to-purple-100 bg-clip-text text-transparent mb-6">
            Choose Your Plan
          </h1>

          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Transform your meal planning experience with AI-powered suggestions,
            personalised nutrition tracking, and seamless grocery list
            generation.
          </p>
        </div>

        {/* Plans Grid - Now includes Free plan */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <Card className="bg-slate-900/60 border-slate-200/20 hover:border-slate-200/40 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:-translate-y-2">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <Star className="w-6 h-6 text-blue-400" />
              </div>

              <CardTitle className="text-2xl font-bold text-slate-50 mb-2">
                Free
              </CardTitle>

              <div className="flex items-baseline justify-center mb-4">
                <span className="text-4xl font-bold text-slate-50">£0</span>
              </div>

              <CardDescription className="text-slate-300 text-base leading-relaxed">
                Perfect for trying out plAIte
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features List */}
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    Up to 5-day meal plans
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    GPT 4.0 powered AI model
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                  <span className="text-slate-300 text-sm leading-relaxed">
                    Shopping list generation
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                asChild
                className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 hover:shadow-lg"
              >
                <Link href="/">Continue with Free</Link>
              </Button>

              {/* Money-back guarantee */}
              <p className="text-center text-slate-400 text-xs">
                No credit card required
              </p>
            </CardContent>
          </Card>

          {/* Existing Paid Plans */}
          {plans.map((plan, index) => {
            const features = getPlanFeatures(plan.name);
            const planIcon = getPlanIcon(plan.name);
            const isPopular = isPremiumPlan(plan.name) && index === 0; // First paid plan is popular

            return (
              <Card
                key={plan.price_id}
                className={`relative group transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                  isPopular
                    ? "bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-slate-900/60 border-purple-400/40 ring-2 ring-purple-400/20"
                    : "bg-slate-900/60 border-slate-200/20 hover:border-slate-200/40"
                } backdrop-blur-xl`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">{planIcon}</div>

                  <CardTitle className="text-2xl font-bold text-slate-50 mb-2">
                    {plan.name}
                  </CardTitle>

                  <div className="flex items-baseline justify-center mb-4">
                    <span className="text-4xl font-bold text-slate-50">
                      {(plan.price / 100).toLocaleString("en-GB", {
                        style: "currency",
                        currency: "GBP",
                      })}
                    </span>
                    <span className="text-slate-400 ml-1 text-lg">
                      /{plan.interval}
                    </span>
                  </div>

                  <CardDescription className="text-slate-300 text-base leading-relaxed">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features List */}
                  <div className="space-y-3">
                    {features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-start space-x-3"
                      >
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.price_id)}
                    disabled={!!isLoading}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                      isPopular
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 hover:shadow-lg"
                    } ${
                      isLoading === plan.price_id
                        ? "opacity-75 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {isLoading === plan.price_id ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </div>
                    ) : (
                      "Get Started"
                    )}
                  </Button>

                  {/* Money-back guarantee */}
                  <p className="text-center text-slate-400 text-xs">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center space-x-8 p-6 rounded-2xl bg-slate-900/40 backdrop-blur-xl border border-slate-200/10">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Secure payments</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">Cancel anytime</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="text-slate-300 text-sm">24/7 support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
