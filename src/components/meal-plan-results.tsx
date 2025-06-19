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
  deletedPlanId = null,
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
    <div className="md:mt-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-50 mb-4 sm:mb-0">
            {plan.planDetails.name || "Your Meal Plan"}
          </h2>
        </div>
      </div>

      <p className="text-slate-200 mb-4">
        {plan.planDetails.description || "A detailed meal plan for you."}
      </p>

      <div className="flex flex-wrap items-center gap-2 md:pt-6 justify-end">
        <Button
          variant="outline"
          className={`text-slate-50 border-slate-200/30 bg-slate-900/60 hover:bg-slate-800/60 ${
            showShoppingList ? "hover:text-red-500" : "hover:text-green-400"
          }`}
          onClick={toggleShoppingList}
        >
          <ShoppingCart className="mr-2 h-4 w-4 text-slate-200" />
          {showShoppingList ? "Hide Shopping List" : "Show Shopping List"}
        </Button>
        <Button
          variant={user ? "outline" : "secondary"}
          className={`text-slate-50 border-slate-200/30 bg-slate-900/60 hover:bg-slate-800/60 ${
            savedPlanId ? "hover:text-red-500" : "hover:text-green-400"
          }`}
          onClick={handleSaveOrDeletePlan}
          disabled={!user}
        >
          {saveStatus === "saving" || saveStatus === "unsaving" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin text-slate-200" />
              {saveStatus === "saving" ? "Saving..." : "Unsaving..."}
            </>
          ) : savedPlanId ? (
            <>
              <BookmarkCheck className="mr-2 h-4 w-4 text-slate-200 " />
              Unsave Plan
            </>
          ) : (
            <>
              <Bookmark className="mr-2 h-4 w-4 text-slate-200" />
              Save Plan
            </>
          )}
        </Button>
        <Button
          variant="outline"
          disabled
          className="text-slate-50 border-slate-200/30 bg-slate-900/60 hover:bg-slate-800/60 hover:text-green-400"
        >
          <FileDown className="mr-2 h-4 w-4 text-slate-200" /> Export PDF
        </Button>
        <Button
          className="bg-emerald-500 hover:bg-emerald-600 text-slate-50 border-emerald-600 hover:text-slate-50"
          variant="outline"
          onClick={onNewPlan}
        >
          <RotateCcw className="mr-2 h-4 w-4 text-slate-50" />
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
            <AccordionTrigger className="text-xl font-medium text-slate-50">
              Day {dayData.day}
            </AccordionTrigger>
            <AccordionContent>
              <div className="overflow-hidden relative">
                <div
                  className="flex overflow-y-auto gap-4 snap-x snap-mandatory w-full scrollbar-thin pl-[30px]"
                  style={{
                    maskImage:
                      "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 18px), transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 18px), transparent 100%)",
                  }}
                >
                  {dayData.meals.map((meal, idx) => (
                    <Card
                      key={meal.name}
                      className={`flex-shrink-0 w-[300px] snap-center py-0 -ml-[20px] mr-[10px] bg-slate-900/60 backdrop-blur-md border border-slate-200/20 shadow-lg ${
                        idx === dayData.meals.length - 1 ? " mr-[20px]" : ""
                      }`}
                      style={{
                        background: "rgba(30, 41, 59, 0.60)",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        backdropFilter: "blur(12px)",
                        WebkitBackdropFilter: "blur(12px)",
                      }}
                    >
                      <CardHeader className="border-b border-slate-200/20 p-4 rounded-t-lg h-24 bg-transparent">
                        <CardDescription className="text-slate-300">
                          {meal.name}
                        </CardDescription>
                        <CardTitle className="text-slate-50">
                          {meal.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col justify-between text-slate-200 bg-transparent">
                        <p className="text-sm text-slate-400">{meal.recipe}</p>
                        <p className="pt-4 text-slate-200">{meal.cals} cals</p>
                      </CardContent>
                      <CardFooter className="bg-slate-900/70 p-4 rounded-b-lg">
                        <div className="flex justify-around w-full text-xs font-medium text-slate-200">
                          <span>Protein: {meal.macros.p}g</span>
                          <span>Carbs: {meal.macros.c}g</span>
                          <span>Fats: {meal.macros.f}g</span>
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
