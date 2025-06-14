"use client";

import { useState } from "react";
import { MealPlan, MealPlannerFormData } from "@/types/interfaces";
import { MealPlannerForm } from "@/components/meal-planner-form";
import { MealPlanResults } from "@/components/meal-plan-results";

export default function HomePage() {
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // const [generation, setGeneration] = useState("");

  const handleGeneratePlan = async (formData: MealPlannerFormData) => {
    setIsLoading(true);

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: formData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data.data.object);

      if (data.success && data.data?.object) {
        // The meal plan is now nested inside data.data.object
        setPlan(data.data.object);
      } else {
        throw new Error("Failed to generate meal plan");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-8 md:p-24 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-4xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Your Personal AI Nutritionist
          </h1>
          <p className="mt-2 text-lg text-slate-600 dark:text-slate-400">
            Craft the perfect meal plan tailored to your goals and tastes.
          </p>
        </header>

        <MealPlannerForm
          onGenerate={handleGeneratePlan}
          isLoading={isLoading}
        />

        {/* We now pass the typed 'plan' state to the results component */}
        {plan && !isLoading && <MealPlanResults plan={plan} />}

        {/* You can add a more explicit loading indicator here if you want */}
        {isLoading && (
          <div className="mt-12 text-center text-slate-600">
            <p>Generating your perfect plan...</p>
            {/* Add a spinner icon here if you like */}
          </div>
        )}
      </div>
    </main>
  );
}
