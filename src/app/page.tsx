"use client";

import { useState, useEffect } from "react";
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
import { createClient } from "@/utils/supabase/client"; // Add this import
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { BookmarkCheck, Trash2, MoreHorizontal } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import PlanGeneratingWindow from "@/components/plan-generating-window";

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<MealPlannerFormData>({
    days: 7,
    mealsPerDay: 3,
    calories: "2000",
    protein: "150",
    carbs: "250",
    fats: "70",
    dietaryRestrictions: [],
    preferredCuisines: "",
    skillLevel: "",
    excludedIngredients: "",
    selectedModel: "gpt-4.1-nano",
  });
  const [savedPlans, setSavedPlans] = useState<SavedMealPlan[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);
  const [currentSavedPlanId, setCurrentSavedPlanId] = useState<string | null>(
    null
  );
  const [deletedPlanId, setDeletedPlanId] = useState<string | null>(null);

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
    },
  });

  const handleSubmitWithLog = async (newFormData: MealPlannerFormData) => {
    try {
      setPlan(null);
      setIsLoading(true);
      setCurrentSavedPlanId(null);

      console.log("Form data received:", newFormData);

      submit(newFormData); // send with user_id
    } catch (err) {
      console.error("Failed to generate meal plan. Please try again." + err);
      setIsLoading(false);
    }
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
    await fetch("/api/deleteMealPlan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user?.id, plan_id: planId }),
    });
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    setDeletedPlanId(planId);
  };

  const handleStartNewPlan = () => setPlan(null);

  const fetchSavedPlans = async () => {
    if (!user) return;
    setLoadingSaved(true);
    const res = await fetch(`/api/getSavedMealPlans?user_id=${user.id}`);
    if (res.ok) {
      const data = await res.json();
      setSavedPlans(data.plans || []);
    }
    setLoadingSaved(false);
  };

  useEffect(() => {
    fetchSavedPlans();
  }, [user]);

  //   setPlan(null);
  //   setIsLoading(true);

  //   console.log("Form data received:", {
  //     days: formData.days,
  //     mealsPerDay: formData.mealsPerDay,
  //     calories: formData.calories,
  //     macros: {
  //       protein: formData.protein,
  //       carbs: formData.carbs,
  //       fats: formData.fats,
  //     },
  //     dietaryRestrictions: formData.dietaryRestrictions,
  //     preferredCuisines: formData.preferredCuisines,
  //     skillLevel: formData.skillLevel,
  //     excludedIngredients: formData.excludedIngredients,
  //   });

  //   try {
  //     const response = await fetch(`/api/generateMealPlan?t=${Date.now()}`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "Cache-Control": "no-cache, no-store, must-revalidate",
  //         Pragma: "no-cache",
  //       },
  //       body: JSON.stringify({
  //         formData: formData,
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log("API response:", data.data.object);

  //     if (data.success && data.data?.object) {
  //       // The meal plan is now nested inside data.data.object
  //       setPlan(data.data.object);
  //     } else {
  //       throw new Error("Failed to generate meal plan");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setIsLoading(false);
  //   }
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
    <main className="relative flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-slate-700" aria-hidden />

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
        {user && (
          <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-12">
            <h2 className="text-2xl font-bold mb-4 text-slate-50 flex items-center gap-2">
              <BookmarkCheck className="w-6 h-6" />
              Saved Meal Plans
            </h2>
            <div
              className="
        h-full max-h-60 md:max-h-160 overflow-y-auto
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
              {loadingSaved ? (
                <div className="flex items-center justify-center p-6 text-slate-300">
                  Loading...
                </div>
              ) : savedPlans.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-slate-400">
                  No saved plans yet.
                </div>
              ) : (
                savedPlans.map((saved, idx) => (
                  <div
                    key={saved.id}
                    className={`flex items-center px-3 py-2 text-sm text-slate-50 ${
                      idx !== savedPlans.length - 1
                        ? "border-b border-slate-200/20 dark:border-slate-700/40"
                        : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="font-medium truncate text-slate-50">
                        {saved.planDetails.name || "Meal Plan"}
                      </span>
                      <span className="text-xs text-slate-200">
                        Days: {saved.days?.length ?? "?"}, Meals/Day:{" "}
                        {saved.days?.[0]?.meals?.length ?? "?"}
                      </span>
                      <div className="flex-1 min-w-0 flex gap-1">
                        <span className="text-xs text-slate-300 truncate max-w-xs">
                          {saved.planDetails.description || "-"}
                        </span>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <span
                              className="cursor-pointer inline-flex items-center ml-1"
                              title="Show more"
                            >
                              <MoreHorizontal className="w-4 h-4 text-slate-200" />
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent className="bg-slate-900/80 text-slate-50 border border-slate-200/20 backdrop-blur-md">
                            {saved.planDetails.description || "-"}
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      <div className="flex gap-1 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadPlan(saved)}
                          className="px-2 flex-1 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/60 hover:text-green-400"
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePlanFromSaved(saved.id)}
                          aria-label="Delete"
                          className="px-2 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-red-900/60"
                        >
                          <Trash2 className="w-4 h-4 text-slate-200" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </aside>
        )}

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
            />
          )}

          {isLoading && object?.days && (
            <PlanGeneratingWindow
              object={object as MealPlan}
              progressPercent={progressPercent}
            />
          )}

          {plan && !isLoading && (
            <MealPlanResults
              plan={plan}
              user={user}
              onNewPlan={handleStartNewPlan}
              savedPlanId={currentSavedPlanId}
              onPlanSaved={handlePlanSavedFromForm}
              onPlanDeleted={
                currentSavedPlanId
                  ? (planId) => handlePlanDeletedFromForm(planId)
                  : undefined
              }
              deletedPlanId={deletedPlanId} // Pass null if no plan is saved
            />
          )}
        </div>
      </div>
    </main>
  );
}
