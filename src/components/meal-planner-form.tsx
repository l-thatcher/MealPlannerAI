"use client";

import { useEffect, useState } from "react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Wand2, StopCircle } from "lucide-react";
import { MealPlannerFormData, MealPlannerFormProps } from "@/types/interfaces";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "paleo", label: "Paleo" },
  { id: "keto", label: "Keto" },
];

const modelOptions = [
  { id: "gpt-4.1-micro", label: "GPT 4.1 micro" },
  { id: "gpt-4.1-mini", label: "GPT 4.1 mini" },
  { id: "gpt-4.1", label: "GPT 4.1" },
];

export function MealPlannerForm({
  onGenerate,
  isLoading,
  initialFormData,
  stopGeneration,
  handleFormData,
  user,
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
  const [selectedModel, setSelectedModel] = useState(
    initialFormData.selectedModel
  );
  const [currentFormData, setCurrentFormData] =
    useState<MealPlannerFormData>(initialFormData);

  // Update currentFormData whenever any of the form fields change - seems to help fix broken schemas
  useEffect(() => {
    const newFormData = {
      days,
      mealsPerDay,
      calories: String(calories),
      protein: String(protein),
      carbs: String(carbs),
      fats: String(fats),
      dietaryRestrictions,
      preferredCuisines,
      skillLevel,
      excludedIngredients,
      selectedModel,
    };
    setCurrentFormData(newFormData);
  }, [
    days,
    mealsPerDay,
    calories,
    protein,
    carbs,
    fats,
    dietaryRestrictions,
    preferredCuisines,
    skillLevel,
    excludedIngredients,
  ]);

  useEffect(() => {
    handleFormData(currentFormData);
  }, [currentFormData, handleFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(currentFormData);
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
                  {!user && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Unlock up to 14 day plans with the paid plan.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
                <Slider
                  id="days"
                  value={[days]}
                  defaultValue={[7]}
                  max={14} // Always show full range
                  min={1}
                  step={1}
                  onValueChange={(value) => {
                    const newValue = value[0];

                    // Clamp to 7 if user is not logged in
                    if (!user && newValue > 7) {
                      setDays(7);
                    } else {
                      setDays(newValue);
                    }
                  }}
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
                  max={5}
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
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1">
                <Label htmlFor="cuisine">Preferred Cuisines (optional)</Label>
                <Input
                  id="cuisine"
                  placeholder="e.g., Italian, Mexican, Thai"
                  value={preferredCuisines}
                  onChange={(e) => setPreferredCuisines(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-64">
                <Label htmlFor="skillLevel">Cooking Skill Level</Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="w-full">
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
              <div className="flex items-center gap-2">
                <Label htmlFor="exclude">
                  Ingredients to Exclude
                  {!user && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Excluded ingredients is only available on the paid
                            plan.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </Label>
              </div>
              <Textarea
                id="exclude"
                placeholder="List any ingredients you dislike..."
                value={excludedIngredients}
                onChange={(e) => {
                  if (!user) {
                    setExcludedIngredients(""); // Or you could do nothing instead
                  } else {
                    setExcludedIngredients(e.target.value);
                  }
                }}
                disabled={!user}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <div className="flex items-center space-x-2">
              {/* <Label htmlFor="model" className="whitespace-nowrap">
                Model:
              </Label> */}
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="model" className="w-full">
                  <SelectValue placeholder={selectedModel} />
                </SelectTrigger>
                <SelectContent>
                  {modelOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="lg"
              className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 ${
                isLoading ? "hidden md:flex" : ""
              }`}
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
