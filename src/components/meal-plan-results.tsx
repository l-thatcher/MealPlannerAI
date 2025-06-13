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
import { ShoppingCart, FileDown, Bookmark } from "lucide-react";
import { MealPlanResultsProps } from "@/types/interfaces";

export function MealPlanResults({ plan }: MealPlanResultsProps) {
  if (!plan) {
    return null;
  }

  return (
    <div className="mt-12">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-4 sm:mb-0">
          Your Custom Meal Plan
        </h2>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <ShoppingCart className="mr-2 h-4 w-4" /> Shopping List
          </Button>
          <Button variant="outline">
            <Bookmark className="mr-2 h-4 w-4" /> Save Plan
          </Button>
          <Button variant="secondary">
            <FileDown className="mr-2 h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

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
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-1">
                {dayData.meals.map((meal) => (
                  <Card key={meal.name} className="flex flex-col">
                    <CardHeader>
                      <CardTitle>{meal.name}</CardTitle>
                      <CardDescription>{meal.title}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      {/* You would populate ingredients and recipe here */}
                      <p className="text-sm text-slate-500">
                        Ingredients and recipe details will go here...
                      </p>
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
