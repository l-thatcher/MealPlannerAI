"use client";

import { useState, useEffect, useCallback } from "react";
import {
  MealPlan,
  MealPlannerFormData,
  SavedMealPlan,
} from "@/types/interfaces";
import { MealPlannerForm } from "@/components/meal-planner-form";
import { MealPlanResults } from "@/components/meal-plan-results";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { mealPlanSchema } from "./api/generateMealPlan/use-object/mealPlanSchema";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/actions";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { BookmarkCheck } from "lucide-react";
import PlanGeneratingWindow from "@/components/plan-generating-window";
import { PlanGenerationError } from "@/components/plan-generation-error";
import { SavedPlans } from "@/components/saved-plans";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string>("basic");
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
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
    <main className="relative flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24">
      <div
        className="absolute inset-0 -z-20 bg-slate-700 overflow-hidden"
        aria-hidden
      >
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          {/* Blue blob */}
          <div className="blob blob-blue" />
          {/* Purple blob */}
          <div className="blob blob-purple" />
          {/* Purple pink */}
          <div className="blob blob-pink" />
          {/* Green blob */}
          <div className="blob blob-green" />
          {/* Overlay for blending */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-purple-900/20 to-pink-900/10 pointer-events-none" /> */}
        </div>
      </div>

      <nav className="flex justify-end mb-6 w-full max-w-7xl">
        {user ? (
          <form action={logout}>
            <Button
              type="submit"
              className="text-sm px-4 py-2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-700 transition"
            >
              Log out
            </Button>
          </form>
        ) : (
          <Button
            asChild
            className="text-sm px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <Link href="/login">Sign In/Up</Link>
          </Button>
        )}
      </nav>

      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-slate-50">
          Your Personal AI Nutritionist
        </h1>
        <p className="mt-2 text-lg text-slate-100">
          Craft the perfect meal plan tailored to your goals and tastes.
        </p>
      </header>

      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar for Saved Plans */}
        <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-12">
          <h2 className="text-2xl font-bold mb-4 text-slate-50 flex items-center gap-2">
            <BookmarkCheck className="w-6 h-6" />
            Saved Meal Plans
          </h2>
          <div
            className="
              h-full min-h-30 max-h-60 md:max-h-160 overflow-y-auto
              rounded-lg border border-slate-200/20 dark:border-slate-700/40 shadow-inner
              bg-slate-900/60 backdrop-blur-md
              transition
            "
            style={{
              // fallback for browsers that don't support Tailwind's backdrop-blur
              background: "rgba(30, 41, 59, 0.60)", // slate-900/60
              border: "1px solid rgba(148, 163, 184, 0.2)", // slate-200/20
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {user && (userRole == "admin" || userRole == "pro") && (
              <SavedPlans
                loadingSaved={loadingSaved}
                savedPlans={savedPlans}
                handleLoadPlan={handleLoadPlan}
                handleDeletePlanFromSaved={handleDeletePlanFromSaved}
              />
            )}
            {!user && (
              <div className="p-6 text-center text-slate-400">
                Signed in pro users can save meal plans for later.
              </div>
            )}

            {user && userRole == "basic" && (
              <div className="p-6 text-center text-slate-400">
                <p>Pro users can save meal plans for later.</p>
                <Link href={"/stripe/subscriptions"} className="text-blue-300">
                  Sign up here!
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 w-full md:min-w-0">
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
            />
          )}
        </div>
      </div>
    </main>
  );
}
