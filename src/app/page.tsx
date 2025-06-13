"use client";

import { useState } from "react";
import { MealPlan } from "@/types/interfaces";
import { MealPlannerForm } from "@/components/meal-planner-form";
import { MealPlanResults } from "@/components/meal-plan-results";

export default function HomePage() {
  // Tell useState that 'plan' will be of type MealPlan or null
  const [plan, setPlan] = useState<MealPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (formData: any) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Create mock data that matches the MealPlan interface
    const mockGeneratedPlan: MealPlan = {
      days: [
        {
          day: 1,
          meals: [
            {
              name: "Breakfast",
              title: "Greek Yogurt with Berries",
              macros: { p: 25, c: 30, f: 15 },
            },
            {
              name: "Lunch",
              title: "Grilled Chicken Salad",
              macros: { p: 40, c: 15, f: 20 },
            },
            {
              name: "Dinner",
              title: "Salmon with Asparagus",
              macros: { p: 35, c: 10, f: 25 },
            },
          ],
        },
        {
          day: 2,
          meals: [
            {
              name: "Breakfast",
              title: "Scrambled Eggs with Spinach",
              macros: { p: 20, c: 5, f: 18 },
            },
            {
              name: "Lunch",
              title: "Quinoa Bowl with Veggies",
              macros: { p: 15, c: 50, f: 12 },
            },
            {
              name: "Dinner",
              title: "Lean Beef Stir-fry",
              macros: { p: 30, c: 25, f: 18 },
            },
          ],
        },
      ],
    };

    setPlan(mockGeneratedPlan);
    setIsLoading(false);
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
