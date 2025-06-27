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
import { Info, Calendar, Target, Users, Sparkles } from "lucide-react";
import { Wand2, StopCircle } from "lucide-react";
import { MealPlannerFormData, MealPlannerFormProps } from "@/types/interfaces";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import Link from "next/link";

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
  userRole = "basic",
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
  const [extraInstructions, setextraInstructions] = useState(
    initialFormData.extraInstructions
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
      extraInstructions,
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
    extraInstructions,
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
    if (
      (user && userRole === "basic" && days > 5) ||
      (user && selectedModel === "gpt-4.1-mini")
    ) {
      if (days !== 5 && days > 5) {
        setDays(5);
      }
    }
  }, [days, user, selectedModel, userRole]);

  // useEffect(() => {
  //   if (!user && days > 3) {
  //     if (days !== 3 && days > 3) {
  //       setDays(3);
  //     }
  //   }
  // }, [days, user, selectedModel]);

  return (
    <Card className="w-full bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
      <CardHeader className="space-y-6 pb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Wand2 className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              Create Your Perfect Meal Plan
            </CardTitle>
            <CardDescription className="text-slate-300 text-lg leading-relaxed">
              Customize every detail to create a personalized nutrition plan
              that fits your lifestyle
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-10">
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Section 1: Plan Structure */}
          <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Plan Structure
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {user && userRole === "basic" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                          <Info className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-yellow-400">
                            Limited
                          </span>
                        </div>
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
                {user &&
                  selectedModel === "gpt-4.1-mini" &&
                  (userRole === "admin" || userRole === "pro") && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded-full">
                            <Info className="w-3 h-3 text-blue-400" />
                            <span className="text-xs text-blue-400">
                              Model Limit
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                          <p>
                            GPT 4 mini can only generate plans for up to 5 days,
                            change the model to generate more days
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label
                  htmlFor="days"
                  className="text-slate-200 font-medium flex items-center justify-between"
                >
                  Number of Days
                  <span className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-300 font-bold text-sm">
                    {days}
                  </span>
                </Label>
                <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <Slider
                    id="days"
                    value={[days]}
                    defaultValue={[4]}
                    max={14}
                    min={1}
                    step={1}
                    onValueChange={(value) => setDays(value[0])}
                    className="slider-enhanced"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>1</span>
                    <span>14</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="mealsPerDay"
                  className="text-slate-200 font-medium flex items-center justify-between"
                >
                  Meals Per Day
                  <span className="px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 font-bold text-sm">
                    {mealsPerDay}
                  </span>
                </Label>
                <div className="px-4 py-3 bg-white/5 rounded-lg border border-white/10">
                  <Slider
                    id="mealsPerDay"
                    value={[mealsPerDay]}
                    defaultValue={[3]}
                    max={5}
                    min={2}
                    step={1}
                    onValueChange={(value) => setMealsPerDay(value[0])}
                    className="slider-enhanced"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>2</span>
                    <span>5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Section 2: Nutrition Goals */}
          <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Nutrition Goals
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <Label
                  htmlFor="calories"
                  className="text-slate-200 font-medium flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  Calories (kcal)
                </Label>
                <Input
                  id="calories"
                  type="number"
                  placeholder="e.g., 2200"
                  onChange={(e) => setCalories(e.target.value)}
                  className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-yellow-400/50 focus:ring-yellow-400/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="protein"
                  className="text-slate-200 font-medium flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                  Protein (g)
                </Label>
                <Input
                  id="protein"
                  type="number"
                  placeholder="e.g., 150"
                  onChange={(e) => setProtein(e.target.value)}
                  className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-green-400/50 focus:ring-green-400/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="carbs"
                  className="text-slate-200 font-medium flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                  Carbs (g)
                </Label>
                <Input
                  id="carbs"
                  type="number"
                  placeholder="e.g., 200"
                  onChange={(e) => setCarbs(e.target.value)}
                  className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-blue-400/50 focus:ring-blue-400/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="fats"
                  className="text-slate-200 font-medium flex items-center gap-2"
                >
                  <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                  Fats (g)
                </Label>
                <Input
                  id="fats"
                  type="number"
                  placeholder="e.g., 80"
                  onChange={(e) => setFats(e.target.value)}
                  className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-purple-400/20 transition-all duration-300"
                />
              </div>
            </div>
          </div>
          {/* Section 3: Dietary Restrictions */}
          <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Dietary Preferences
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dietaryOptions.map((option) => (
                <div key={option.id} className="group">
                  <div
                    className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer ${
                      dietaryRestrictions.includes(option.id)
                        ? "border-blue-400 bg-blue-500/20 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={dietaryRestrictions.includes(option.id)}
                        onCheckedChange={(checked) =>
                          handleDietaryOptionChange(
                            checked as boolean,
                            option.id
                          )
                        }
                        className="border-white/30 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                      <Label
                        htmlFor={option.id}
                        className={`font-medium cursor-pointer select-none transition-colors ${
                          dietaryRestrictions.includes(option.id)
                            ? "text-blue-300"
                            : "text-slate-200 group-hover:text-white"
                        }`}
                      >
                        {option.label}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Section 4: Preferences & Exclusions */}
          <div className="space-y-6 p-6 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">
                Preferences & Exclusions
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label htmlFor="cuisine" className="text-slate-200 font-medium">
                  Preferred Cuisines (optional)
                </Label>
                <Input
                  id="cuisine"
                  placeholder="e.g., Italian, Mexican, Thai"
                  value={preferredCuisines}
                  onChange={(e) => setPreferredCuisines(e.target.value)}
                  className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-pink-400/50 focus:ring-pink-400/20 transition-all duration-300"
                />
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="skillLevel"
                  className="text-slate-200 font-medium"
                >
                  Cooking Skill Level
                </Label>
                <Select value={skillLevel} onValueChange={setSkillLevel}>
                  <SelectTrigger className="bg-white/10 text-white border-white/20 focus:border-purple-400/50 focus:ring-purple-400/20 transition-all duration-300">
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

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label htmlFor="exclude" className="text-slate-200 font-medium">
                  Ingredients to Exclude
                </Label>
                {!user && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full">
                          <Info className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-orange-400">
                            Pro Only
                          </span>
                        </div>
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
              </div>
              <Textarea
                id="exclude"
                placeholder="List any ingredients you dislike..."
                value={excludedIngredients}
                onChange={(e) => {
                  if (userRole === "basic") {
                    setExcludedIngredients("");
                  } else {
                    setExcludedIngredients(e.target.value);
                  }
                }}
                disabled={!!user && userRole === "basic"}
                className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-orange-400/50 focus:ring-orange-400/20 transition-all duration-300 disabled:opacity-50"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="instructions"
                  className="text-slate-200 font-medium"
                >
                  Other Instructions
                </Label>
                {!user && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-1 px-2 py-1 bg-orange-500/20 rounded-full">
                          <Info className="w-3 h-3 text-orange-400" />
                          <span className="text-xs text-orange-400">
                            Pro Only
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900/90 text-slate-50 border border-slate-200/20">
                        <p>
                          Extra instructions are only available on the paid
                          plan.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <Textarea
                id="instructions"
                placeholder="List any other instructions or preferences, such as high protein meals."
                value={extraInstructions}
                onChange={(e) => {
                  if (userRole === "basic") {
                    setextraInstructions("");
                  } else {
                    setextraInstructions(e.target.value);
                  }
                }}
                disabled={!!user && userRole === "basic"}
                className="bg-white/10 text-white border-white/20 placeholder:text-slate-400 focus:border-purple-400/50 focus:ring-purple-400/20 transition-all duration-300 disabled:opacity-50"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-2">
            <div className="flex items-start space-x-2">
              {(!user || userRole === "basic") && (
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
                          <SelectValue placeholder={"GPT 4.1 mini"} />
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
                    className="w-full bg-slate-800/60 text-slate-50 border-slate-200/20 mr-0 min-h-10 py-5"
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

            {/* Submit Section */}
            <div className="">
              {!user && (
                <div className="text-center space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] h-10 text-base font-semibold"
                    asChild
                  >
                    <Link href="/sign-up">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Sign Up to Generate Your Plan
                    </Link>
                  </Button>

                  <p className="text-slate-400 text-sm">
                    Join thousands creating their perfect nutrition plans
                  </p>
                </div>
              )}

              {user && (
                <div className="space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    className={`w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] h-10 text-base font-semibold ${
                      isLoading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    <Wand2
                      className={`mr-2 h-5 w-5 ${
                        isLoading ? "animate-spin" : ""
                      }`}
                    />
                    {isLoading
                      ? "Creating Your Plan..."
                      : "Generate My Meal Plan"}
                  </Button>

                  {isLoading && (
                    <Button
                      type="button"
                      size="default"
                      variant="outline"
                      className="w-full border-red-400/50 text-red-300 hover:bg-red-500/10 hover:text-red-200 hover:border-red-400 transition-all duration-300 h-10"
                      onClick={stopGeneration}
                    >
                      <StopCircle className="mr-2 h-4 w-4" />
                      Stop Generation
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
