"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Wand2, StopCircle } from "lucide-react";
import { MealPlannerFormProps } from "@/types/interfaces";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "paleo", label: "Paleo" },
  { id: "keto", label: "Keto" },
];

export function MealPlannerForm({
  onGenerate,
  isLoading,
  // onFormDataUpdate,
  initialFormData,
  stopGeneration,
}: MealPlannerFormProps) {
  const [days, setDays] = useState(initialFormData.days);
  const [mealsPerDay, setMealsPerDay] = useState(initialFormData.mealsPerDay);
  const [calories, setCalories] = useState(initialFormData.calories.toString());
  const [protein, setProtein] = useState(initialFormData.protein.toString());
  const [carbs, setCarbs] = useState(initialFormData.carbs.toString());
  const [fats, setFats] = useState(initialFormData.fats.toString());
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>(
    initialFormData.dietaryRestrictions
  );
  const [preferredCuisines, setPreferredCuisines] = useState(
    initialFormData.preferredCuisines
  );
  const [skillLevel, setSkillLevel] = useState(initialFormData.skillLevel);
  const [excludedIngredients, setExcludedIngredients] = useState(
    initialFormData.excludedIngredients
  );

  // handle form submission here to call your AI API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newFormData = {
      days,
      mealsPerDay,
      calories: Number(calories),
      protein: Number(protein),
      carbs: Number(carbs),
      fats: Number(fats),
      dietaryRestrictions,
      preferredCuisines,
      skillLevel,
      excludedIngredients,
    };

    await onGenerate(newFormData);
  };

  const handleDietaryOptionChange = (checked: boolean, optionId: string) => {
    if (checked) {
      setDietaryRestrictions([...dietaryRestrictions, optionId]);
    } else {
      setDietaryRestrictions(
        dietaryRestrictions.filter((id) => id !== optionId)
      );
    }
  };

  return (
    <Card className="w-full border-slate-200 dark:border-slate-800">
      <CardHeader>
        <CardTitle className="text-2xl">Create Your Plan</CardTitle>
        <CardDescription>
          Fill out your details below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Plan Structure */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Plan Basics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="days">
                  Number of Days:{" "}
                  <span className="text-blue-600 font-semibold">{days}</span>
                </Label>
                <Slider
                  id="days"
                  value={[days]}
                  defaultValue={[7]}
                  max={14}
                  min={1}
                  step={1}
                  onValueChange={(value) => setDays(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="mealsPerDay">
                  Meals Per Day:{" "}
                  <span className="text-blue-600 font-semibold">
                    {mealsPerDay}
                  </span>
                </Label>
                <Slider
                  id="mealsPerDay"
                  value={[mealsPerDay]}
                  defaultValue={[3]}
                  max={6}
                  min={2}
                  step={1}
                  onValueChange={(value) => setMealsPerDay(value[0])}
                />
              </div>
            </div>
          </div>
          {/* Section 2: Macro Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Nutrition Goals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories">Calories (kcal)</Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2200"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="e.g., 150"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="e.g., 200"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fats">Fats (g)</Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="e.g., 80"
                  value={fats}
                  onChange={(e) => setFats(e.target.value)}
                />
              </div>
            </div>
          </div>
          {/* Section 3: Dietary Restrictions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Dietary Needs
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={dietaryRestrictions.includes(option.id)}
                    onCheckedChange={(checked) =>
                      handleDietaryOptionChange(checked as boolean, option.id)
                    }
                  />
                  <Label htmlFor={option.id} className="font-normal">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {/* Section 4: Fine-Tuning */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800 dark:text-slate-200">
              Preferences & Exclusions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="cuisine">Preferred Cuisines (optional)</Label>
                <Input
                  id="cuisine"
                  placeholder="e.g., Italian, Mexican, Thai"
                  value={preferredCuisines}
                  onChange={(e) => setPreferredCuisines(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="skillLevel">Cooking Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">
                      Beginner (Quick & Easy)
                    </SelectItem>
                    <SelectItem value="intermediate">
                      Intermediate (Comfortable in the kitchen)
                    </SelectItem>
                    <SelectItem value="advanced">
                      Advanced (Love a challenge)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="exclude">Ingredients to Exclude</Label>
              <Textarea
                id="exclude"
                placeholder="List any ingredients you dislike..."
                value={excludedIngredients}
                onChange={(e) => setExcludedIngredients(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              size="lg"
              className="w-full md:w-auto bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              <Wand2 className="mr-2 h-5 w-5" />
              {isLoading ? "Generating..." : "Generate My Plan"}
            </Button>
            {isLoading && (
              <Button
                type="button"
                size="lg"
                variant="destructive"
                className="w-full md:w-auto"
                onClick={stopGeneration}
              >
                <StopCircle className="mr-2 h-5 w-5" />
                Stop
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
