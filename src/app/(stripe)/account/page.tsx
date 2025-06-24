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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";
import { Separator } from "@radix-ui/react-select";
import Link from "next/link";

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
  const [user, setUser] = useState<User | null>(null);
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

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "destructive";
      case "premium":
        return "default";
      case "pro":
        return "secondary";
      default:
        return "outline";
    }
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-4 sm:p-8">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="blob blob-blue" />
        <div className="blob blob-purple" />
        <div className="blob blob-pink" />
        <div className="blob blob-green" />
      </div>

      <nav className="flex justify-end mb-6 w-full max-w-2xl">
        <Button
          asChild
          className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
        >
          <Link href="/">Home</Link>
        </Button>
      </nav>

      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* User Profile Card */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-200/20">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <UserIcon className="h-5 w-5" />
              Account Details
            </CardTitle>
            <CardDescription className="text-slate-200">
              Your profile information and account settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {userData && (
              <>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    {userData.name && (
                      <h3 className="text-lg font-semibold text-slate-50">
                        {userData.name}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 text-slate-200">
                      <Mail className="h-4 w-4" />
                      {userData.email}
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-200/20" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-slate-200">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Role</span>
                    </div>
                    <Badge
                      variant={getRoleBadgeVariant(userData.role)}
                      className="capitalize"
                    >
                      {userData.role}
                    </Badge>
                  </div>

                  {userData.subscriptionStatus && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-slate-200">
                        <CreditCard className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Subscription
                        </span>
                      </div>
                      <Badge
                        variant={
                          userData.subscriptionStatus === "active"
                            ? "default"
                            : "outline"
                        }
                        className="capitalize"
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
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-200/20">
          <CardHeader>
            <CardTitle className="text-slate-50 flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Manage Plan
            </CardTitle>
            <CardDescription className="text-slate-200">
              Update your payment details, change plans, or cancel your
              subscription
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-slate-800/40 rounded-lg border border-slate-200/10">
                <h4 className="text-slate-50 font-medium mb-2">
                  Billing Portal
                </h4>
                <p className="text-slate-300 text-sm mb-3">
                  Access your complete billing history, update payment methods,
                  and manage your subscription directly through Stripe.
                </p>
                <Button
                  onClick={handleManageSubscription}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Loading..." : "Open Billing Portal"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Actions Card */}
        <Card className="bg-slate-900/60 backdrop-blur-xl border border-slate-200/20">
          <CardHeader>
            <CardTitle className="text-slate-50">Account Actions</CardTitle>
            <CardDescription className="text-slate-200">
              Additional account management options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 flex flex-row gap-3">
            <Button
              variant="outline"
              className="px-2 flex-1 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/60 hover:text-green-400"
              onClick={() => {
                // Add logic to update profile
                console.log("Update profile clicked");
              }}
            >
              Update Profile
            </Button>
            <Button
              variant="outline"
              className="px-2 flex-1 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/60 hover:text-green-400"
              onClick={() => {
                // Add logic to change password
                console.log("Change password clicked");
              }}
            >
              Change Password
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
