"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import {
  User as UserIcon,
  Settings,
  CreditCard,
  Mail,
  Shield,
  ChefHat,
  Sparkles,
  ArrowLeft,
  LogOut,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { Footer } from "@/components/footer";
import { logout } from "@/lib/actions";

interface UserData {
  email: string;
  name?: string;
  role: string;
  subscriptionStatus?: string;
  planType?: string;
}

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoadingUser(true);
      const supabase = createClient();

      // Get the authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("Authentication error:", authError);
        setIsLoadingUser(false);
        return;
      }

      console.log("Authenticated user:", authUser);

      // Get user role and subscription data
      const { data: userRoles, error: userRoleError } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", authUser.id)
        .single();

      if (userRoleError && userRoleError.code !== "PGRST116") {
        console.error("Error fetching user role:", userRoleError);
      }

      // Prepare user data
      const userData: UserData = {
        email: authUser.email || "",
        name: authUser.user_metadata?.name || authUser.user_metadata?.full_name,
        role: userRoles?.role || "basic",
        subscriptionStatus: userRoles?.subscription_status,
        planType:
          userRoles?.role === "pro"
            ? "Professional"
            : userRoles?.role === "admin"
            ? "Admin"
            : "Basic",
      };

      setUserData(userData);
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setIsLoadingUser(false);
    }
  };

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

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoggingOut(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "pro":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getRoleTextColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "pro":
        return "text-slate-900";
      case "admin":
      case "basic":
      default:
        return "text-slate-50";
    }
  };

  const getSubscriptionBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
      case "pro":
        return "default";
      default:
        return "outline";
    }
  };

  const geSubscriptionBackgroundColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "pro":
      case "admin":
        return "bg-green-500";
      case "basic":
      default:
        return "";
    }
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-300">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="blob blob-blue animate-float" />
        <div className="blob blob-purple animate-float-delayed" />
        <div className="blob blob-pink animate-pulse-slow" />
        <div className="blob blob-green animate-float-delayed-2" />

        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-transparent to-purple-600/10" />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tl from-green-500/5 via-transparent to-pink-500/5" />
      </div>

      {/* Modern navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 shadow-2xl shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-white/10">
                  <ChefHat className="h-5 w-5 text-blue-400" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Account
                </span>
              </div>
            </div>

            <Button
              asChild
              className="bg-gradient-to-r from-blue-500/90 to-purple-600/90 hover:from-blue-600 hover:to-purple-700 backdrop-blur-sm border border-white/10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            >
              <Link href="/" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to App
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Account Dashboard
            </h1>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Manage your profile, subscription, and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Profile Card */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-white" />
                  </div>
                  Profile Information
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Your account details and current status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {userData && (
                  <>
                    <div className="space-y-4">
                      {userData.name && (
                        <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                            {userData.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white font-medium">
                              {userData.name}
                            </p>
                            <p className="text-slate-400 text-sm">Full Name</p>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            {userData.email}
                          </p>
                          <p className="text-slate-400 text-sm">
                            Email Address
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-blue-400" />
                          <span className="text-slate-300 text-sm font-medium">
                            Account Role
                          </span>
                        </div>
                        <Badge
                          variant={getRoleBadgeVariant(userData.role)}
                          className={`capitalize text-xs font-semibold px-3 py-1 ${getRoleTextColor(
                            userData.role
                          )}`}
                        >
                          {userData.role}
                        </Badge>
                      </div>

                      {userData.subscriptionStatus && (
                        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <CreditCard className="h-4 w-4 text-green-400" />
                            <span className="text-slate-300 text-sm font-medium">
                              Subscription
                            </span>
                          </div>
                          <Badge
                            variant={getSubscriptionBadgeVariant(userData.role)}
                            className={`capitalize text-xs font-semibold px-3 py-1 ${getRoleTextColor(
                              userData.role
                            )} ${geSubscriptionBackgroundColor(userData.role)}`}
                          >
                            {userData.subscriptionStatus}
                            {userData.planType && ` - ${userData.planType}`}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Manage Subscription Card */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 group hover:scale-[1.02]">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center gap-3 text-xl">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  Subscription Management
                </CardTitle>
                <CardDescription className="text-slate-300">
                  {userData?.subscriptionStatus === "active"
                    ? "Manage your billing and subscription settings"
                    : "Upgrade to unlock premium meal planning features"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {userData?.subscriptionStatus === "active" ? (
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="h-5 w-5 text-green-400" />
                        <h4 className="text-white font-semibold">
                          Premium Active
                        </h4>
                      </div>
                      <p className="text-slate-300 text-sm mb-4">
                        Access your complete billing history, update payment
                        methods, and manage your subscription directly through
                        Stripe.
                      </p>
                      <Button
                        onClick={handleManageSubscription}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Loading...
                          </div>
                        ) : (
                          "Open Billing Portal"
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30">
                      <div className="flex items-center gap-3 mb-3">
                        <Sparkles className="h-5 w-5 text-purple-400" />
                        <h4 className="text-white font-semibold">
                          Upgrade to Premium
                        </h4>
                      </div>
                      <p className="text-slate-300 text-sm mb-4">
                        Get access to unlimited meal plans, advanced dietary
                        preferences, personalized nutrition insights, and
                        priority support.
                      </p>
                      <Button
                        asChild
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Link
                          href="/subscriptions"
                          className="flex items-center justify-center gap-2"
                        >
                          <Sparkles className="h-4 w-4" />
                          View Subscription Plans
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Account Actions Card */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="text-white flex items-center gap-3 text-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-white" />
                </div>
                Account Actions
              </CardTitle>
              <CardDescription className="text-slate-300">
                Additional settings and account management options
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="h-12 text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
                  onClick={() => {
                    console.log("Update profile clicked");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 group-hover:text-blue-400 transition-colors" />
                    Update Profile
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 transition-all duration-300 group"
                  onClick={() => {
                    console.log("Change password clicked");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 group-hover:text-green-400 transition-colors" />
                    Change Password
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="h-12 text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-red-500/20 hover:border-red-400/50 transition-all duration-300 group sm:col-span-2 lg:col-span-1"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                >
                  <div className="flex items-center gap-2">
                    {isLoggingOut ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4 group-hover:text-red-400 transition-colors" />
                    )}
                    {isLoggingOut ? "Logging out..." : "Log Out"}
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
