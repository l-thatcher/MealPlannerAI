import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Loader2,
  Calendar,
  Star,
  Clock,
} from "lucide-react";
import { MealPlanResultsProps } from "@/types/interfaces";
import { ShoppingListCard } from "./shopping-list-card";
import { useEffect, useState } from "react";

export function MealPlanResults({
  plan,
  user,
  onNewPlan,
  savedPlanId: initialSavedPlanId = null,
  onPlanSaved,
  onPlanDeleted,
  deletedPlanId = null,
  userRole = "basic",
}: MealPlanResultsProps) {
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error" | "unsaving"
  >(initialSavedPlanId ? "saved" : "idle");
  const [savedPlanId, setSavedPlanId] = useState<string | null>(
    initialSavedPlanId
  );

  useEffect(() => {
    if (initialSavedPlanId) {
      setSavedPlanId(initialSavedPlanId);
      setSaveStatus("saved");
    }
  }, [initialSavedPlanId]);

  useEffect(() => {
    if (deletedPlanId && deletedPlanId === savedPlanId) {
      setSavedPlanId(null);
      setSaveStatus("idle");
    }
  }, [deletedPlanId, savedPlanId]);

  if (!plan) {
    return null;
  }

  const handleSaveOrDeletePlan = async () => {
    if (!user) return;

    if (!savedPlanId) {
      setSaveStatus("saving");

      // Save plan
      const res = await fetch("/api/saveMealPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPlanId(data.id); // Make sure your save API returns the new id
        setSaveStatus("saved");
        // Notify parent component that a plan was saved
        if (onPlanSaved) onPlanSaved(data.id);
      } else {
        setSaveStatus("error");
      }
    } else {
      setSaveStatus("unsaving");
      // Delete plan
      const res = await fetch("/api/deleteMealPlan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan_id: savedPlanId }),
      });
      if (res.ok) {
        // Notify parent component that a plan was deleted
        if (onPlanDeleted) onPlanDeleted(savedPlanId);
        setSavedPlanId(null);
        setSaveStatus("idle");
      } else {
        setSaveStatus("error");
      }
    }
  };

  const toggleShoppingList = () => {
    setShowShoppingList((prev) => !prev);
  };

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  return (
    <div className="md:mt-8 w-full">
      {/* Header Section */}
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl mb-8 hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl text-white mb-1">
                {plan.planDetails.name || "Your Meal Plan"}
              </CardTitle>
              <CardDescription className="text-slate-300 text-base">
                {plan.planDetails.description ||
                  "A personalized meal plan crafted just for you"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-3 justify-end">
            <Button
              variant="outline"
              className={`text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 transition-all duration-300 group ${
                showShoppingList ? "hover:text-red-400" : "hover:text-green-400"
              }`}
              onClick={toggleShoppingList}
            >
              <ShoppingCart
                className={`mr-2 h-4 w-4 transition-colors ${
                  showShoppingList ? "text-red-400" : "text-slate-300"
                }`}
              />
              {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
            </Button>

            <Button
              variant={userRole === "basic" ? "outline" : "default"}
              className={`transition-all duration-300 group ${
                savedPlanId
                  ? "bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-0"
                  : "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white border-0"
              }`}
              onClick={handleSaveOrDeletePlan}
              disabled={!user}
            >
              {saveStatus === "saving" || saveStatus === "unsaving" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {saveStatus === "saving" ? "Saving..." : "Removing..."}
                </>
              ) : savedPlanId ? (
                <>
                  <BookmarkCheck className="mr-2 h-4 w-4" />
                  Remove from Saved
                </>
              ) : (
                <>
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save Plan
                </>
              )}
            </Button>

            <Button
              onClick={onNewPlan}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <RotateCcw className="mr-2 h-4 w-4" />
              Generate New Plan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shopping List Section */}
      {showShoppingList && (
        <ShoppingListCard
          shoppingList={plan.shoppingList}
          checkedItems={checkedItems}
          onToggleItem={toggleItem}
        />
      )}

      {/* Daily Meal Plan Section */}
      <Accordion type="single" collapsible className="w-full space-y-4 mt-6">
        {plan.days.map((dayData) => (
          <AccordionItem
            key={dayData.day}
            value={`day-${dayData.day}`}
            className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <AccordionTrigger className="px-6 py-4 text-white font-semibold text-lg hover:text-blue-300 transition-colors [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  {dayData.day}
                </div>
                Day {dayData.day}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="overflow-hidden relative">
                <div
                  className="flex overflow-x-auto gap-6 snap-x snap-mandatory w-full scrollbar-thin pb-4"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)",
                  }}
                >
                  {dayData.meals.map((meal) => (
                    <Card
                      key={meal.name}
                      className="flex-shrink-0 w-[320px] snap-center bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-[1.02]"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <CardDescription className="text-slate-300 font-medium">
                            {meal.name}
                          </CardDescription>
                        </div>
                        <CardTitle className="text-white text-xl group-hover:text-blue-300 transition-colors">
                          {meal.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {meal.recipe}
                        </p>

                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <span className="text-white font-semibold">
                            {meal.cals} calories
                          </span>
                        </div>
                      </CardContent>

                      <CardFooter className="bg-white/5 rounded-b-lg border-t border-white/10">
                        <div className="flex justify-between w-full text-sm">
                          <div className="text-center">
                            <p className="text-green-400 font-semibold">
                              {meal.macros.p}g
                            </p>
                            <p className="text-slate-400 text-xs">Protein</p>
                          </div>
                          <div className="text-center">
                            <p className="text-blue-400 font-semibold">
                              {meal.macros.c}g
                            </p>
                            <p className="text-slate-400 text-xs">Carbs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-purple-400 font-semibold">
                              {meal.macros.f}g
                            </p>
                            <p className="text-slate-400 text-xs">Fats</p>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
