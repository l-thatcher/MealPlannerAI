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
    selectedModel: "gpt-4.1-micro",
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

      // setFormData(newFormData);

      console.log("Form data received:", {
        days: newFormData.days,
        mealsPerDay: newFormData.mealsPerDay,
        calories: newFormData.calories,
        macros: {
          protein: newFormData.protein,
          carbs: newFormData.carbs,
          fats: newFormData.fats,
        },
        dietaryRestrictions: newFormData.dietaryRestrictions,
        preferredCuisines: newFormData.preferredCuisines,
        skillLevel: newFormData.skillLevel,
        excludedIngredients: newFormData.excludedIngredients,
      });
      submit(newFormData);
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
      const res = await fetch(`/api/getSavedMealPlans?user_id=${user.id}`);
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

  const handleDeletePlanFromSaved = async (planId: string) => {
    await fetch("/api/deleteMealPlan", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: user?.id, plan_id: planId }),
    });
    setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
    setDeletedPlanId(planId);
  };

  const handlePlanSavedFromForm = () => {
    fetchSavedPlans();
  };

  const handlePlanDeletedFromForm = () => {
    fetchSavedPlans();
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

  // const handleGeneratePlan = async (formData: MealPlannerFormData) => {
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

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-slate-50 dark:bg-slate-950">
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
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Your Personal AI Nutritionist
        </h1>
        <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
          Craft the perfect meal plan tailored to your goals and tastes.
        </p>
      </header>

      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar for Saved Plans */}
        {user && (
          <aside className="w-full md:w-80 flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-12">
            <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-slate-50 flex items-center gap-2">
              <BookmarkCheck className="w-6 h-6" />
              Saved Meal Plans
            </h2>
            <div className="h-full max-h-60 md:max-h-160 overflow-y-auto bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-inner">
              {loadingSaved ? (
                <div className="flex items-center justify-center p-6 text-slate-500">
                  Loading...
                </div>
              ) : savedPlans.length === 0 ? (
                <div className="flex items-center justify-center p-6 text-slate-500">
                  No saved plans yet.
                </div>
              ) : (
                savedPlans.map((saved, idx) => (
                  <div
                    key={saved.id}
                    className={`flex items-center px-3 py-2 text-sm text-slate-700 dark:text-slate-200 ${
                      idx !== savedPlans.length - 1
                        ? "border-b border-slate-200 dark:border-slate-700"
                        : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 flex flex-col gap-1">
                      <span className="font-medium truncate">
                        {saved.planDetails.name || "Meal Plan"}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Days: {saved.days?.length ?? "?"}, Meals/Day:{" "}
                        {saved.days?.[0]?.meals?.length ?? "?"}
                      </span>
                      <div className="flex-1 min-w-0 flex gap-1">
                        <span className="text-xs text-slate-400 truncate max-w-xs">
                          {saved.planDetails.description || "-"}
                        </span>
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <span
                              className="cursor-pointer inline-flex items-center ml-1"
                              title="Show more"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </span>
                          </HoverCardTrigger>
                          <HoverCardContent>
                            {saved.planDetails.description || "-"}
                          </HoverCardContent>
                        </HoverCard>
                      </div>

                      <div className="flex gap-1 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleLoadPlan(saved)}
                          className="px-2 flex-1 h-9"
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => handleDeletePlanFromSaved(saved.id)}
                          aria-label="Delete"
                          className="px-2 h-9"
                        >
                          <Trash2 className="w-4 h-4" />
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
            <div className="mt-4 text-center text-slate-400 animate-slide-up p-3 rounded-md bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 pb-0">
              {/* Only show the latest day */}
              {[object.days[object.days.length - 1]].map((day, dayIndex) => (
                <div key={dayIndex} className="mb-4">
                  {/* Only show the latest meal in the current day */}
                  {[day?.meals?.[day.meals?.length - 1]].map(
                    (meal, mealIndex) => (
                      <div key={mealIndex} className="">
                        <p className="text-lg font-medium text-slate-600 dark:text-slate-100">
                          Day {object?.days?.length} - {meal?.title}:
                        </p>
                        <p>
                          {meal?.cals} calories, {meal?.macros?.p}g protein,
                          {meal?.macros?.c}g carbs, {meal?.macros?.f}g fats
                        </p>
                      </div>
                    )
                  )}
                </div>
              ))}
            </div>
          )}

          {plan && !isLoading && (
            <MealPlanResults
              plan={plan}
              user={user}
              onNewPlan={handleStartNewPlan}
              savedPlanId={currentSavedPlanId}
              onPlanSaved={handlePlanSavedFromForm}
              onPlanDeleted={handlePlanDeletedFromForm}
              deletedPlanId={deletedPlanId} // Pass null if no plan is saved
            />
          )}
        </div>
      </div>
    </main>
  );
}
