"use client";

import { useState, useEffect } from "react";
import { LandingPage } from "@/components/landing-page";
import { MainAppPage } from "@/components/main-app-page";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { Footer } from "@/components/footer";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("basic");
  const [showLanding, setShowLanding] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  const [savedPlansExist, setSavedPlansExist] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Get user authentication status
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Get user role if logged in
          const { data, error } = await supabase
            .from("user_roles")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (error) {
            console.error("Error fetching user role:", error);
          } else {
            setUserRole(data?.role || "basic");
          }

          // Check if user has saved plans
          const res = await fetch(`/api/getSavedMealPlans`);
          if (res.ok) {
            const data = await res.json();
            setSavedPlansExist(data.plans && data.plans.length > 0);
          }
        }

        // Check if user has used app before
        const hasUsedApp = localStorage.getItem("plaite-has-used-app");

        // Decide which view to show
        if ((user && savedPlansExist) || hasUsedApp === "true") {
          setShowLanding(false);
        }
      } catch (error) {
        console.error("Error initializing app:", error);
      } finally {
        // Finish initialization regardless of outcome
        setIsInitializing(false);
      }
    };

    initializeApp();
  }, []);

  const handleGetStartedWithTracking = () => {
    localStorage.setItem("plaite-has-used-app", "true");
    setShowLanding(false);
  };

  const backToLandingPage = () => {
    localStorage.setItem("plaite-has-used-app", "false");
    setShowLanding(true);
  };

  // Show loading state while we determine which view to display
  if (isInitializing) {
    return (
      <div className="min-h-screen landing-gradient-bg flex items-center justify-center">
        <div className="relative p-3 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-xl backdrop-blur-sm border border-white/20 animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // Content for the main app page (without the landing page content)
  const mainAppContent = (
    <MainAppPage
      user={user}
      userRole={userRole}
      showLandingCallback={backToLandingPage}
    />
  );

  // Content for the landing page (without rendering the full landing page component)
  const landingPageContent = (
    <LandingPage user={user} onGetStarted={handleGetStartedWithTracking} />
  );

  // Once initialized, show the appropriate view
  return showLanding ? landingPageContent : mainAppContent;
}
