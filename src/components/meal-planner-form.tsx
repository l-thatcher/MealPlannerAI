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
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

const dietaryOptions = [
  { id: "vegetarian", label: "Vegetarian" },
  { id: "vegan", label: "Vegan" },
  { id: "gluten-free", label: "Gluten-Free" },
  { id: "dairy-free", label: "Dairy-Free" },
  { id: "paleo", label: "Paleo" },
  { id: "keto", label: "Keto" },
];

const modelOptions = [
  // { id: "gpt-4.1-nano", label: "GPT 4.1 nano" },
  { id: "gpt-4.1-mini", label: "GPT 4.1 mini" },
  { id: "gpt-4.1", label: "GPT 4.1" },
  { id: "gpt-o3-mini", label: "GPT 3o mini" },
];

export function MealPlannerForm({
  onGenerate,
  isLoading,
  initialFormData,
  stopGeneration,
  handleFormData,
  user,
  userRole = "guest",
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
    selectedModel,
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

  useEffect(() => {
    if ((!user && days > 2) || selectedModel === "gpt-4.1-mini") {
      if (days !== 4 && days > 4) {
        setDays(4);
      }
    }
  }, [days, user, selectedModel]);

  return (
    <Card
      className="
    w-full
    border border-slate-200/20 dark:border-slate-700/40
    bg-slate-900/60
    backdrop-blur-md
    shadow-xl
    text-slate-50
  "
      style={{
        background: "rgba(30, 41, 59, 0.60)", // slate-900/60
        border: "1px solid rgba(148, 163, 184, 0.2)", // slate-200/20
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <CardHeader>
        <CardTitle className="text-2xl text-slate-50">
          Create Your Plan
        </CardTitle>
        <CardDescription className="text-slate-200">
          Fill out your details below to get started.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Plan Structure */}
          <div className="space-y-4">
            <div className="flex items-center justify-start gap-3">
              <h3 className="text-lg font-medium text-slate-50">Plan Basics</h3>

              {!user && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                      <p>
                        Unlock up to 14 day plans with the paid plan due to
                        model limitations.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {user && selectedModel === "gpt-4.1-mini" && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                      <p>
                        GPT 4 nano can only generate plans for up to 4 days,
                        change the model to generate more days
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="days" className="text-slate-200">
                  Number of Days:{" "}
                  <span className="text-blue-300 font-semibold">{days}</span>
                </Label>
                <Slider
                  id="days"
                  value={[days]}
                  defaultValue={[4]}
                  max={14}
                  min={1}
                  step={1}
                  onValueChange={(value) => setDays(value[0])}
                />
              </div>
              <div>
                <Label htmlFor="mealsPerDay" className="text-slate-200">
                  Meals Per Day:{" "}
                  <span className="text-blue-300 font-semibold">
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
            <h3 className="text-lg font-medium text-slate-50">
              Nutrition Goals
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="calories" className="text-slate-200">
                  Calories (kcal)
                </Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2200"
                  // value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  className="bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="protein" className="text-slate-200">
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="e.g., 150"
                  // value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="carbs" className="text-slate-200">
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="e.g., 200"
                  // value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
                />
              </div>
              <div>
                <Label htmlFor="fats" className="text-slate-200">
                  Fats (g)
                </Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="e.g., 80"
                  // value={fats}
                  onChange={(e) => setFats(e.target.value)}
                  className="bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
          {/* Section 3: Dietary Restrictions */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-50">Dietary Needs</h3>
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
                  <Label
                    htmlFor={option.id}
                    className="font-normal text-slate-200"
                  >
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          {/* Section 4: Fine-Tuning */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-50">
              Preferences & Exclusions
            </h3>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex flex-col flex-1">
                <Label htmlFor="cuisine" className="text-slate-200">
                  Preferred Cuisines (optional)
                </Label>
                <Input
                  id="cuisine"
                  placeholder="e.g., Italian, Mexican, Thai"
                  value={preferredCuisines}
                  onChange={(e) => setPreferredCuisines(e.target.value)}
                  className="w-full bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
                />
              </div>
              <div className="w-full md:w-64">
                <Label htmlFor="skillLevel" className="text-slate-200">
                  Cooking Skill Level
                </Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="w-full bg-slate-800/60 text-slate-50 border-slate-200/20">
                    <SelectValue placeholder="Select your skill level" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
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
                <Label htmlFor="exclude" className="text-slate-200">
                  Ingredients to Exclude
                  {!user && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
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
                    setExcludedIngredients("");
                  } else {
                    setExcludedIngredients(e.target.value);
                  }
                }}
                disabled={!user}
                className="bg-slate-800/60 text-slate-50 border-slate-200/20 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-2">
            <div className="flex items-center space-x-2">
              {(!user || userRole === "basic" || userRole === "guest") && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span
                      className="cursor-pointer inline-flex items-center ml-1"
                      title="Show more"
                    >
                      <Select disabled>
                        <SelectTrigger
                          id="model"
                          className="w-full bg-slate-800/60 text-slate-50 border-slate-200/20"
                        >
                          <SelectValue placeholder={"GPT 4.1 micro"} />
                        </SelectTrigger>
                      </Select>
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                    {!user
                      ? "Sign in to generate your meal plan and select different AI models."
                      : "Selecting models is only available on a paid plan."}
                  </HoverCardContent>
                </HoverCard>
              )}

              {user && (userRole === "pro" || userRole === "admin") && (
                <Select
                  value={selectedModel}
                  onValueChange={setSelectedModel}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="model"
                    className="w-full bg-slate-800/60 text-slate-50 border-slate-200/20 mr-0 min-h-10"
                  >
                    <SelectValue placeholder={selectedModel} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                    {modelOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {!user && (
              <HoverCard>
                <HoverCardTrigger>
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-slate-50  h-10 ${
                      isLoading ? "hidden md:flex" : ""
                    }`}
                    disabled
                  >
                    <Wand2 className="mr-2 h-5 w-5" />
                    Generate My Plan
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent>
                  Please sign in to generate your meal plan.
                </HoverCardContent>
              </HoverCard>
            )}

            {user && (
              <Button
                type="submit"
                size="lg"
                className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-slate-50  h-10 ${
                  isLoading ? "hidden md:flex" : ""
                }`}
                disabled={isLoading}
              >
                <Wand2 className="mr-2 h-5 w-5" />
                {isLoading ? "Generating..." : "Generate My Plan"}
              </Button>
            )}

            {isLoading && (
              <Button
                type="button"
                size="lg"
                variant="destructive"
                className="w-full md:w-auto text-slate-50"
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
