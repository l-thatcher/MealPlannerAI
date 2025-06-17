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
import { ShoppingCart, FileDown, Bookmark, BookmarkCheck } from "lucide-react";
import { MealPlanResultsProps } from "@/types/interfaces";
import { ShoppingListCard } from "./shopping-list-card";
import { useState } from "react";

export function MealPlanResults({ plan, user }: MealPlanResultsProps) {
  const [showShoppingList, setShowShoppingList] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);

  if (!plan) {
    return null;
  }

  const handleSaveOrDeletePlan = async () => {
    if (!user) return;

    setSaveStatus("saving");

    if (!savedPlanId) {
      // Save plan
      const res = await fetch("/api/saveMealPlan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, user_id: user.id }),
      });
      if (res.ok) {
        const data = await res.json();
        setSavedPlanId(data.id); // Make sure your save API returns the new id
        setSaveStatus("saved");
      } else {
        setSaveStatus("error");
      }
    } else {
      // Delete plan
      const res = await fetch("/api/deleteMealPlan", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, plan_id: savedPlanId }),
      });
      if (res.ok) {
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
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 sm:mb-0">
          Your Custom Meal Plan
        </h2>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={toggleShoppingList}>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
          </Button>
          <Button
            variant={user ? "outline" : "secondary"}
            onClick={handleSaveOrDeletePlan}
            disabled={saveStatus === "saving"}
          >
            {saveStatus !== "saved" ? (
              <Bookmark className="mr-2 h-4 w-4" />
            ) : savedPlanId ? (
              <BookmarkCheck className="mr-2 h-4 w-4" />
            ) : (
              <Bookmark className="mr-2 h-4 w-4" />
            )}
            {saveStatus === "saving"
              ? "Saving..."
              : savedPlanId
              ? "Unsave Plan"
              : "Save Plan"}
          </Button>
          <Button variant="secondary">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {showShoppingList && (
        <ShoppingListCard
          shoppingList={plan.shoppingList}
          checkedItems={checkedItems}
          onToggleItem={toggleItem}
        />
      )}

      <Accordion
        type="single"
        collapsible
        defaultValue="item-1"
        className="w-full"
      >
        {plan.days.map((dayData) => (
          <AccordionItem key={dayData.day} value={`item-${dayData.day}`}>
            <AccordionTrigger className="text-xl font-medium">
              Day {dayData.day}
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex overflow-x-auto gap-4 p-1 pb-4 snap-x snap-mandatory">
                {dayData.meals.map((meal) => (
                  <Card
                    key={meal.name}
                    className="flex-shrink-0 w-[300px] snap-center py-0"
                  >
                    <CardHeader className="border-b border-slate-200 dark:border-slate-700 p-4 rounded-t-lg h-24">
                      <CardDescription>{meal.name}</CardDescription>
                      <CardTitle>{meal.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-between">
                      <p className="text-sm text-slate-500">{meal.recipe}</p>
                      <p className="pt-4">{meal.cals} cals</p>
                    </CardContent>
                    <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-b-lg">
                      <div className="flex justify-around w-full text-xs font-medium text-slate-700 dark:text-slate-300">
                        <span>Protein: {meal.macros.p}g</span>
                        <span>Carbs: {meal.macros.c}g</span>
                        <span>Fats: {meal.macros.f}g</span>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
