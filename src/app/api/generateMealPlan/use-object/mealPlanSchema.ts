import { z } from 'zod';
import { MealPlannerFormData } from "@/types/interfaces";

export const mealPlanSchema = (formData?: MealPlannerFormData) => {
  const defaults = {
    days: 7,
    mealsPerDay: 3
  };

  const config = {
    days: formData?.days ?? defaults.days,
    mealsPerDay: formData?.mealsPerDay ?? defaults.mealsPerDay
  };

  return z.object({
    days: z.array(
      z.object({
        day: z.number().min(1).max(config.days),
        meals: z.array(
          z.object({
            name: z.string().describe('Meal time (e.g., Breakfast, Lunch, Dinner)'),
            title: z.string().describe('Descriptive name of the meal'),
            cals: z.number().min(0).describe('Total calories for this meal'),
            macros: z.object({
              p: z.number().min(0).describe('Protein in grams'),
              c: z.number().min(0).describe('Carbohydrates in grams'),
              f: z.number().min(0).describe('Fats in grams')
            }).describe('Macronutrients for this meal')
          })
        ).length(config.mealsPerDay)
      })
    ).length(config.days)
  });
};