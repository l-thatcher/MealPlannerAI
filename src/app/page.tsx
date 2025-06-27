"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MealPlan,
  MealPlannerFormData,
  SavedMealPlan,
} from "@/types/interfaces";
import { MealPlannerForm } from "@/components/meal-planner-form";
import { MealPlanResults } from "@/components/meal-plan-results";
import { LandingPage } from "@/components/landing-page";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealPlanSchema } from "./api/generateMealPlan/use-object/mealPlanSchema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { logout } from "@/lib/actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { BookmarkCheck, ChefHat, Sparkles } from "lucide-react";
import PlanGeneratingWindow from "@/components/plan-generating-window";
import { PlanGenerationError } from "@/components/plan-generation-error";
import { SavedPlans } from "@/components/saved-plans";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("basic");
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [formData, setFormData] = useState<MealPlannerFormData>({
    days: 5,
    mealsPerDay: 3,
    calories: "",
    protein: "",
    carbs: "",
    fats: "",
    dietaryRestrictions: [],
    preferredCuisines: "",
    skillLevel: "",
    excludedIngredients: "",
    extraInstructions: "",
    selectedModel: "gpt-4.1-mini",
  });
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [currentSavedPlanId, setCurrentSavedPlanId] = useState<string | null>(
    null
  );
  const [deletedPlanId, setDeletedPlanId] = useState<string | null>(null);
  const [generationErrorMessage, setGenerationErrorMessage] = useState<
    string | null
  >(null);

  const {
    object,
    submit,
    stop,
    error: generationError,
  } = useObject({
    api: "/api/generateMealPlan",
    schema: mealPlanSchema(formData),
    onFinish: (result) => {
      console.log("onFinish received result:", result);

      if (!result?.object) {
        console.error("No meal plan generated. Full result:", {
          result,
          objectExists: !!result?.object,
          generationError,
        });
        setIsLoading(false);
        setGenerationErrorMessage(
          "Failed to generate a complete meal plan. The AI model returned an incomplete response. Please try again."
        );
        return;
      }

      setPlan(result.object as MealPlan);

      console.log(
        "========== Meal plan generated successfully: ==========",
        result.object
      );
      setIsLoading(false);
    },
    onError: (error) => {
      console.error("Error generating meal plan:", error);
      setIsLoading(false);
      setPlan(null);
      let errorMessage =
        "Failed to generate meal plan. Please try again with different parameters.";
      if (error?.message) {
        errorMessage = error.message;
      } else if (error?.cause) {
        errorMessage = String(error.cause);
      }
      setGenerationErrorMessage(errorMessage);
    },
  });

  const handleSubmitWithLog = async (newFormData: MealPlannerFormData) => {
    try {
      setPlan(null);
      setIsLoading(true);
      setCurrentSavedPlanId(null);
      setGenerationErrorMessage(null);

      console.log("Form data received:", newFormData);

      submit(newFormData); // send with user_id
    } catch (err) {
      console.error("Failed to generate meal plan. Please try again." + err);
      setIsLoading(false);
      setGenerationErrorMessage(
        err instanceof Error
          ? err.message
          : "Failed to generate meal plan. Please try again."
      );
    }
  };

  const handleDismissError = () => {
    setGenerationErrorMessage(null);
  };

  const handleRetry = () => {
    setGenerationErrorMessage(null);
    handleSubmitWithLog(formData);
  };

  const handleStopGeneration = () => {
    stop();
    setPlan(null);
    setIsLoading(false);
  };

  const handleFormData = async (newFormData: MealPlannerFormData) => {
    return new Promise<void>((resolve) => {
      setFormData(newFormData);
      resolve();
    });
  };

  useEffect(() => {
    const checkUser = async () => {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    checkUser();
  }, []);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) return;
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      console.log("UserID:", user.id);

      if (error) {
        console.error("Error fetching user role:", error);
        setUserRole("basic");
      } else {
        setUserRole(data.role || "basic");
      }
    };

    fetchUserRole();
  }, [user]);

  useEffect(() => {
    const fetchSavedPlans = async () => {
      if (!user) return;
      setLoadingSaved(true);
      const res = await fetch(`/api/getSavedMealPlans`);
      if (res.ok) {
        const data = await res.json();
        setSavedPlans(data.plans || []);
      }
      setLoadingSaved(false);
    };
    fetchSavedPlans();
  }, [user]);

  const handleLoadPlan = (saved: SavedMealPlan) => {
    console.log("Loading saved plan:", saved.plan);
    setCurrentSavedPlanId(saved.id); // set the DB id
    setPlan(saved); // set the MealPlan
  };

  const deleteFromDB = async (planId: string) => {
    await fetch("/api/deleteMealPlan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan_id: planId }),
    });
  };

  const handleDeletePlanFromSaved = async (planId: string) => {
    deleteFromDB(planId);
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    setDeletedPlanId(planId);
  };

  const handlePlanSavedFromForm = () => {
    fetchSavedPlans();
  };

  const handlePlanDeletedFromForm = async (planId: string) => {
    deleteFromDB(planId);
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    setDeletedPlanId(planId);
  };

  const handleStartNewPlan = () => setPlan(null);

  const handleGetStarted = () => {
    setShowLanding(false);
  };

  const fetchSavedPlans = useCallback(async () => {
    if (!user) return;
    setLoadingSaved(true);
    const res = await fetch(`/api/getSavedMealPlans?user_id=${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setSavedPlans(data.plans || []);
    }
    setLoadingSaved(false);
  }, [user]);

  useEffect(() => {
    fetchSavedPlans();
  }, [fetchSavedPlans]);

  // const handleApiErrorResponse = async (response: Response) => {
  //   if (!response.ok) {
  //     let errorMessage = "Failed to generate meal plan";
  //     try {
  //       const errorData = await response.json();
  //       errorMessage = errorData.error || errorMessage;
  //     } catch (e) {
  //       // If we can't parse the JSON, use the default message
  //     }
  //     throw new Error(errorMessage);
  //   }
  //   return response;
  // };

  // Check if user is authenticated and has used the app before
  useEffect(() => {
    // If user is logged in and has saved plans, skip landing page
    if (user && savedPlans.length > 0) {
      setShowLanding(false);
    }
    // If user is returning (has used the planner before), skip landing
    const hasUsedApp = localStorage.getItem("plaite-has-used-app");
    if (hasUsedApp === "true") {
      setShowLanding(false);
    }
  }, [user, savedPlans]);

  const handleGetStartedWithTracking = () => {
    localStorage.setItem("plaite-has-used-app", "true");
    handleGetStarted();
  };

  const backToLandingPage = () => {
    localStorage.setItem("plaite-has-used-app", "false");
    setShowLanding(true);
  };

  // Calculate progress for the loading bar
  let progressPercent = 0;
  if (isLoading && object?.days && formData) {
    const currentDay = object.days.length;
    const totalDays = formData.days || object.days.length || 1;
    const currentMeal = object.days[object.days.length - 1]?.meals?.length || 1;
    const totalMeals =
      formData.mealsPerDay ||
      object.days[object.days.length - 1]?.meals?.length ||
      1;

    // Progress: (day - 1 + (meal/totalMeals)) / totalDays
    const progress = (currentDay - 1 + currentMeal / totalMeals) / totalDays;
    progressPercent = Math.min(progress * 100, 100);
  }

  return (
    <>
      {showLanding ? (
        <LandingPage user={user} onGetStarted={handleGetStartedWithTracking} />
      ) : (
        <main className="relative flex min-h-screen flex-col items-center landing-gradient-bg">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 w-60 h-60 bg-green-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>

          {/* Modern Navigation */}
          <nav className="relative z-10 w-full px-4 py-6 max-w-screen">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ChefHat className="w-8 h-8 text-blue-400" />
                  <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-0.5 -right-0.5 animate-pulse" />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  plAIte
                </span>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                      onClick={backToLandingPage}
                    >
                      Landing Page
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                      asChild
                    >
                      <Link href="/account">Account</Link>
                    </Button>
                    <form action={logout}>
                      <Button
                        type="submit"
                        variant="outline"
                        className="border-slate-600 text-slate-900 hover:bg-slate-800/50 hover:text-white"
                      >
                        Log out
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      className="text-slate-300 hover:text-white hover:bg-slate-800/50"
                      onClick={backToLandingPage}
                    >
                      Landing Page
                    </Button>
                    <Button
                      asChild
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      <Link href="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>

          <header className="relative z-10 text-center mb-12 px-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="relative">
                <ChefHat className="w-12 h-12 text-blue-400" />
                <Sparkles className="w-6 h-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Your AI Meal Planner
              </h1>
            </div>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Create personalized meal plans tailored to your dietary needs and
              nutrition goals
            </p>
          </header>

          <div className="relative z-10 w-full max-w-7xl flex flex-col lg:flex-row gap-8 items-start px-4 pb-8">
            {/* Sidebar for Saved Plans */}
            <aside className="w-full lg:w-80 flex-shrink-0 mb-8 lg:mb-0 lg:sticky lg:top-8">
              <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <BookmarkCheck className="w-6 h-6 text-blue-400" />
                </div>
                Saved Plans
              </h2>
              <Card className="landing-card bg-slate-800/50 border-slate-700/50 backdrop-blur-md p-0 max-h-150 overflow-scroll">
                <CardContent className="px-0">
                  {user && (userRole == "admin" || userRole == "pro") && (
                    <SavedPlans
                      loadingSaved={loadingSaved}
                      savedPlans={savedPlans}
                      handleLoadPlan={handleLoadPlan}
                      handleDeletePlanFromSaved={handleDeletePlanFromSaved}
                    />
                  )}
                  {!user && (
                    <div className="text-center p-4">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                          <BookmarkCheck className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-slate-400 mb-3">
                          Sign in to save and manage your meal plans
                        </p>
                        <Button
                          asChild
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          <Link href="/login">Sign In</Link>
                        </Button>
                      </div>
                    </div>
                  )}

                  {user && userRole == "basic" && (
                    <div className="text-center p-4">
                      <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Sparkles className="w-8 h-8 text-purple-400" />
                      </div>
                      <p className="text-slate-400 mb-3">
                        Upgrade to Pro to save unlimited meal plans
                      </p>
                      <Button
                        asChild
                        className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
                      >
                        <Link href="/subscriptions">Upgrade to Pro</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1 w-full min-w-0 space-y-8">
              {!plan && (
                <MealPlannerForm
                  onGenerate={handleSubmitWithLog}
                  isLoading={isLoading}
                  initialFormData={formData}
                  stopGeneration={handleStopGeneration}
                  handleFormData={handleFormData}
                  user={user}
                  userRole={userRole}
                />
              )}

              {isLoading && object?.days && (
                <PlanGeneratingWindow
                  object={object as MealPlan}
                  progressPercent={progressPercent}
                />
              )}

              {!isLoading && generationErrorMessage && !plan && (
                <PlanGenerationError
                  error={generationErrorMessage}
                  onRetry={handleRetry}
                  onDismiss={handleDismissError}
                />
              )}

              {plan && !isLoading && (
                <MealPlanResults
                  plan={plan}
                  user={user}
                  onNewPlan={handleStartNewPlan}
                  savedPlanId={currentSavedPlanId}
                  onPlanSaved={handlePlanSavedFromForm}
                  onPlanDeleted={handlePlanDeletedFromForm}
                  deletedPlanId={deletedPlanId}
                  userRole={userRole}
                />
              )}
            </div>
          </div>

          <footer className="border-t border-slate-700/50 py-12 px-4 bg-slate-900/50 w-full">
            <div className="max-w-7xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="relative">
                      <ChefHat className="w-8 h-8 text-blue-400" />
                      <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-0.5 -right-0.5" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      plAIte
                    </span>
                  </div>
                  <p className="text-slate-400 max-w-md mb-4">
                    Transform your meal planning with AI-powered
                    personalization. Create perfect meal plans tailored to your
                    lifestyle and dietary needs.
                  </p>
                  <div className="flex items-center gap-2 text-slate-400">
                    <span>Made with</span>
                    <span className="text-red-400">❤️</span>
                    <span>for healthier eating</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                  <div className="space-y-2">
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white p-0 h-auto"
                        onClick={() =>
                          document
                            .getElementById("features")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Features
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white p-0 h-auto"
                        onClick={() =>
                          document
                            .getElementById("pricing")
                            ?.scrollIntoView({ behavior: "smooth" })
                        }
                      >
                        Pricing
                      </Button>
                    </div>
                    {user ? (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-slate-400 hover:text-white p-0 h-auto"
                          asChild
                        >
                          <Link href="/account">Account</Link>
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white p-0 h-auto"
                            asChild
                          >
                            <Link href="/login">Sign In</Link>
                          </Button>
                        </div>
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-white p-0 h-auto"
                            asChild
                          >
                            <Link href="/sign-up">Sign Up</Link>
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-white mb-4">Support</h4>
                  <div className="space-y-2">
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white p-0 h-auto"
                        asChild
                      >
                        <Link href="/subscriptions">Subscriptions</Link>
                      </Button>
                    </div>
                    <div>
                      <span className="text-slate-400">Help Center</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Contact Us</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Privacy Policy</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-700/50 mt-8 pt-8 text-center text-slate-400">
                <p>
                  &copy; {new Date().getFullYear()} plAIte. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </main>
      )}
    </>
  );
}
