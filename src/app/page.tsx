"use client";

import { useState } from "react";
import { MealPlan, MealPlannerFormData } from "@/types/interfaces";
import { MealPlannerForm } from "@/components/meal-planner-form";
import { MealPlanResults } from "@/components/meal-plan-results";

export default function HomePage() {
  // console.log(JSON.stringify(result.response.headers, null, 2));
  // console.log(JSON.stringify(result.response.body, null, 2));

  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generation, setGeneration] = useState("");

  const handleGeneratePlan = async (formData: MealPlannerFormData) => {
    setIsLoading(true);

    console.log("Form data received:", {
      days: formData.days,
      mealsPerDay: formData.mealsPerDay,
      calories: formData.calories,
      macros: {
        protein: formData.protein,
        carbs: formData.carbs,
        fats: formData.fats,
      },
      dietaryRestrictions: formData.dietaryRestrictions,
      preferredCuisines: formData.preferredCuisines,
      skillLevel: formData.skillLevel,
      excludedIngredients: formData.excludedIngredients,
    });

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            "You are an expert nutritionist and chef AI. Your primary function is to generate personalized weekly meal plans based on user-provided data. Your task is to create a comprehensive meal plan that strictly adheres to all user inputs. The final output must be a single, raw JSON object, without any additional text, explanations, or markdown formatting. Generate a random plan",
          maxDays: formData.days,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setGeneration(data);

      // Extract the meal plan object from the response and set it directly
      setPlan(data.object);
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
