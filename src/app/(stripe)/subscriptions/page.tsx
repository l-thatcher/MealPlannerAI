"use client";

// Force dynamic rendering to prevent build-time errors with Supabase client
export const dynamic = "force-dynamic";

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
import { Footer } from "@/components/footer";
import { createClient } from "@/utils/supabase/client";
import type { User } from "@supabase/supabase-js";

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
  const [user, setUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState<{
    role: string;
    subscriptionStatus: string | null;
    subscriptionDuration: string | null;
    isPro: boolean;
  } | null>(null);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // Check for user authentication
    const getUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        // If user exists, check their subscription status
        if (user) {
          setSubscriptionLoading(true);
          try {
            const response = await fetch("/api/user-subscription-status");
            if (response.ok) {
              const subscriptionData = await response.json();
              setUserSubscriptionStatus(subscriptionData);
            } else {
              console.error("Failed to fetch subscription status");
            }
          } catch (error) {
            console.error("Error fetching subscription status:", error);
          } finally {
            setSubscriptionLoading(false);
          }
        }
      } catch (error) {
        console.error("Error getting user:", error);
      } finally {
        setUserLoading(false);
      }
    };

    getUser();

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setUserLoading(false);

      // Check subscription status when user changes
      if (session?.user) {
        setSubscriptionLoading(true);
        try {
          const response = await fetch("/api/user-subscription-status");
          if (response.ok) {
            const subscriptionData = await response.json();
            setUserSubscriptionStatus(subscriptionData);
          }
        } catch (error) {
          console.error("Error fetching subscription status:", error);
        } finally {
          setSubscriptionLoading(false);
        }
      } else {
        setUserSubscriptionStatus(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

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
    // If user is not authenticated, redirect to login
    if (!user) {
      window.location.href = "/login";
      return;
    }

    // Check if user is already subscribed to this plan type
    const plan = plans.find((p) => p.price_id === priceId);
    if (plan && isUserSubscribedToThisPlan(plan)) {
      // User is already subscribed to this specific plan
      return;
    }

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

  const handleManageSubscription = async () => {
    if (!user) {
      window.location.href = "/login";
      return;
    }

    try {
      setIsLoading("manage-subscription");
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No portal URL returned");
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      setIsLoading(null);
    }
  };

  const getPlanFeatures = (planName: string) => {
    const name = planName.toLowerCase();
    if (name.includes("pro")) {
      return [
        "Up to 14-day meal plans",
        "Advanced AI models (GPT-4.1)",
        "Higher daily meal plan limits",
        "Advanced plan customisation options",
        "Detailed nutrition tracking",
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
    return name.includes("pro") || name.includes("premium");
  };

  const isUserSubscribedToThisPlan = (plan: Plan) => {
    if (
      !userSubscriptionStatus?.isPro ||
      !userSubscriptionStatus?.subscriptionDuration
    ) {
      return false;
    }

    // Check if the user's subscription duration matches this plan's interval
    const planInterval = plan.interval; // 'month' or 'year'
    const userInterval = userSubscriptionStatus.subscriptionDuration; // 'month' or 'year'

    // Check if it's the same type of plan (pro) and same interval
    return isPremiumPlan(plan.name) && planInterval === userInterval;
  };

  if (loadingPlans || userLoading || subscriptionLoading) {
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
    <div>
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
              Transform your meal planning experience with AI-powered
              suggestions, personalised nutrition tracking, and seamless grocery
              list generation.
            </p>
          </div>

          {/* Plans Grid - Now includes Free plan */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card
              className={`relative transition-all duration-300 backdrop-blur-xl flex flex-col ${
                userSubscriptionStatus?.isPro
                  ? "bg-slate-900/60 border-orange-400/40 hover:border-orange-400/60 ring-2 ring-orange-400/20 hover:scale-105 hover:-translate-y-2"
                  : "bg-slate-900/60 border-slate-200/20 hover:border-slate-200/40 hover:scale-105 hover:-translate-y-2"
              }`}
            >
              {/* Pro user badge */}
              {userSubscriptionStatus?.isPro && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                    Subscription Management
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Star
                    className={`w-6 h-6 ${
                      userSubscriptionStatus?.isPro
                        ? "text-orange-400"
                        : "text-blue-400"
                    }`}
                  />
                </div>

                <CardTitle className="text-2xl font-bold text-slate-50 mb-2">
                  {userSubscriptionStatus?.isPro
                    ? "Manage Subscription"
                    : "Free"}
                </CardTitle>

                <div className="flex items-baseline justify-center mb-4">
                  <span className="text-4xl font-bold text-slate-50">
                    {userSubscriptionStatus?.isPro ? (
                      <span className="text-2xl">
                        {userSubscriptionStatus.subscriptionDuration === "year"
                          ? "Pro Annual"
                          : "Pro Monthly"}
                      </span>
                    ) : (
                      "£0"
                    )}
                  </span>
                </div>

                <CardDescription className="text-slate-300 text-base leading-relaxed">
                  {userSubscriptionStatus?.isPro
                    ? `You're currently on the ${
                        userSubscriptionStatus.subscriptionDuration === "year"
                          ? "Annual"
                          : "Monthly"
                      } Pro plan`
                    : "Perfect for trying out plAIte"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 flex-grow flex flex-col">
                {/* Features List */}
                <div className="space-y-3 flex-grow">
                  {userSubscriptionStatus?.isPro ? (
                    // Show current Pro benefits
                    <>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          ✨ Currently enjoying Pro features
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          Up to 14-day meal plans
                        </span>
                      </div>
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-slate-300 text-sm leading-relaxed">
                          Higher daily limits & advanced features
                        </span>
                      </div>
                    </>
                  ) : (
                    // Show Free plan features
                    <>
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
                          GPT powered AI model
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
                    </>
                  )}
                </div>

                {/* CTA Button and guarantee - keep at bottom */}
                <div className="space-y-3 mt-auto">
                  {/* CTA Button */}
                  {userSubscriptionStatus?.isPro ? (
                    <Button
                      onClick={handleManageSubscription}
                      disabled={isLoading === "manage-subscription"}
                      className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white hover:shadow-lg"
                    >
                      {isLoading === "manage-subscription" ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Loading...</span>
                        </div>
                      ) : (
                        "Manage Subscription"
                      )}
                    </Button>
                  ) : (
                    <Button
                      asChild
                      className="w-full py-3 text-lg font-semibold transition-all duration-300 bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 hover:shadow-lg"
                    >
                      <Link href="/">Continue with Free</Link>
                    </Button>
                  )}

                  {/* Money-back guarantee */}
                  <p className="text-center text-slate-400 text-xs">
                    {userSubscriptionStatus?.isPro
                      ? "Manage your subscription or cancel anytime"
                      : "No credit card required"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Existing Paid Plans */}
            {plans.map((plan, index) => {
              const features = getPlanFeatures(plan.name);
              const planIcon = getPlanIcon(plan.name);
              const isPopular = isPremiumPlan(plan.name) && index === 0; // First paid plan is popular
              const isPlanProType = isPremiumPlan(plan.name);
              const isUserAlreadyPro = userSubscriptionStatus?.isPro || false;
              const isCurrentUserPlan = isUserSubscribedToThisPlan(plan);
              const isOtherProPlan =
                isPlanProType && isUserAlreadyPro && !isCurrentUserPlan;
              const shouldDisableButton = isCurrentUserPlan || isOtherProPlan;

              return (
                <Card
                  key={plan.price_id}
                  className={`relative group transition-all duration-300 flex flex-col ${
                    shouldDisableButton
                      ? ""
                      : "hover:scale-105 hover:-translate-y-2"
                  } ${
                    isCurrentUserPlan
                      ? "bg-gradient-to-br from-green-900/40 via-green-800/40 to-slate-900/60 border-green-400/40 ring-2 ring-green-400/20"
                      : isOtherProPlan
                      ? "bg-slate-900/40 border-slate-400/30 opacity-75"
                      : isPopular
                      ? "bg-gradient-to-br from-purple-900/60 via-blue-900/60 to-slate-900/60 border-purple-400/40 ring-2 ring-purple-400/20"
                      : "bg-slate-900/60 border-slate-200/20 hover:border-slate-200/40"
                  } backdrop-blur-xl`}
                >
                  {/* Popular Badge */}
                  {isPopular && !isCurrentUserPlan && !isOtherProPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  {/* Already Subscribed Badge */}
                  {isCurrentUserPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                        Current Plan
                      </Badge>
                    </div>
                  )}

                  {/* Other Plan Badge */}
                  {isOtherProPlan && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 text-white px-4 py-1 text-sm font-semibold shadow-lg">
                        Switch at Billing End
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

                  <CardContent className="space-y-6 flex-grow flex flex-col">
                    {/* Features List */}
                    <div className="space-y-3 flex-grow">
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

                    {/* CTA Button and guarantee - keep at bottom */}
                    <div className="space-y-3 mt-auto">
                      {/* CTA Button */}
                      <Button
                        onClick={() => handleSubscribe(plan.price_id)}
                        disabled={!!isLoading || shouldDisableButton}
                        className={`w-full py-3 text-lg font-semibold transition-all duration-300 ${
                          isCurrentUserPlan
                            ? "bg-gradient-to-r from-green-600 to-green-700 text-white cursor-not-allowed opacity-75"
                            : isOtherProPlan
                            ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white cursor-not-allowed opacity-75"
                            : isPopular
                            ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl"
                            : "bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-slate-100 hover:shadow-lg"
                        } ${
                          isLoading === plan.price_id
                            ? "opacity-75 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {isCurrentUserPlan ? (
                          "Current Plan"
                        ) : isOtherProPlan ? (
                          "Available After Current Billing"
                        ) : isLoading === plan.price_id ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </div>
                        ) : user ? (
                          "Get Started"
                        ) : (
                          "Sign In to Get Started"
                        )}
                      </Button>

                      {/* Money-back guarantee / Plan switch info */}
                      <p className="text-center text-slate-400 text-xs">
                        {isOtherProPlan
                          ? `Switch to this plan when your current ${
                              userSubscriptionStatus?.subscriptionDuration ===
                              "year"
                                ? "annual"
                                : "monthly"
                            } billing cycle ends`
                          : "30-day money-back guarantee"}
                      </p>
                    </div>
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
      <Footer />
    </div>
  );
}
