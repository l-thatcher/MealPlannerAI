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
  FileDown,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Loader2,
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
  deletedPlanId,
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

  // useEffect(() => {
  //   if (deletedPlanId && deletedPlanId === savedPlanId) {
  //     setSavedPlanId(null);
  //     setSaveStatus("idle");
  //   }
  // }, [deletedPlanId, savedPlanId]);

  const handleSaveOrDeletePlan = async () => {
    if (!user) return;

    if (!savedPlanId) {
      setSaveStatus("saving");

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
        body: JSON.stringify({ user_id: user.id, plan_id: savedPlanId }),
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
    <div className="md:mt-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 sm:mb-0 p">
            {plan.planDetails.name || "Your Meal Plan"}
          </h2>
        </div>
      </div>

      <p>{plan.planDetails.description || "A detailed meal plan for you."}</p>

      <div className="flex flex-wrap items-center gap-2 md:pt-6">
        <Button variant="outline" onClick={toggleShoppingList}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
        </Button>
        <Button
          variant={user ? "outline" : "secondary"}
          onClick={handleSaveOrDeletePlan}
          disabled={saveStatus === "saving"}
        >
          {saveStatus === "saving" || saveStatus === "unsaving" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {saveStatus === "saving" ? "Saving..." : "Unsaving..."}
            </>
          ) : savedPlanId ? (
            <>
              <BookmarkCheck className="mr-2 h-4 w-4" />
              Unsave Plan
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-4 w-4" />
              Save Plan
            </>
          )}
        </Button>
        <Button variant="secondary">
          <FileDown className="mr-2 h-4 w-4" /> Export PDF
        </Button>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600"
          variant="outline"
          onClick={onNewPlan}
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          New Plan
        </Button>
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
        className="mt-6"
      >
        {plan.days.map((dayData) => (
          <AccordionItem key={dayData.day} value={`item-${dayData.day}`}>
            <AccordionTrigger className="text-xl font-medium">
              Day {dayData.day}
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-hidden relative">
                {/* Left fade gradient */}
                <div className="absolute left-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-r from-[#F7FAFB] dark:from-slate-900 to-transparent"></div>

                <div className="flex overflow-y-auto gap-4 px-5 snap-x snap-mandatory w-full scrollbar-thin">
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

                {/* Right fade gradient */}
                <div className="absolute right-0 top-0 bottom-0 w-12 z-10 pointer-events-none bg-gradient-to-l from-[#F7FAFB] dark:from-slate-900 to-transparent"></div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
