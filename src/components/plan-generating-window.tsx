import React from "react";
import { PlanGeneratingWindowProps } from "@/types/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, ChefHat, Clock } from "lucide-react";

function PlanGeneratingWindow({
  object,
  progressPercent,
}: PlanGeneratingWindowProps) {
  return (
    <div className="relative mx-auto mt-8 w-full">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-fade-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <CardTitle className="text-white text-xl flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                Creating Your Meal Plan
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Latest day/meal preview */}
          <div className="bg-white/5 rounded-xl p-6 border border-white/10 shadow-inner">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-blue-400" />
              <span className="uppercase text-xs tracking-widest text-slate-300 font-semibold">
                Latest Preview
              </span>
            </div>

            {[object.days[object.days.length - 1]].map((day, dayIndex) => (
              <div key={dayIndex} className="w-full">
                {[day?.meals?.[day.meals?.length - 1]].map(
                  (meal, mealIndex) => (
                    <div key={mealIndex} className="text-center space-y-3">
                      <h3 className="text-xl font-bold text-white">
                        Day {object?.days?.length} — {meal?.title}
                      </h3>

                      <div className="flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                          <span className="text-white font-semibold">
                            {meal?.cals} calories
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="text-green-400 font-semibold">
                            {meal?.macros?.p}g
                          </p>
                          <p className="text-slate-400 text-xs">Protein</p>
                        </div>
                        <div className="text-center">
                          <p className="text-blue-400 font-semibold">
                            {meal?.macros?.c}g
                          </p>
                          <p className="text-slate-400 text-xs">Carbs</p>
                        </div>
                        <div className="text-center">
                          <p className="text-purple-400 font-semibold">
                            {meal?.macros?.f}g
                          </p>
                          <p className="text-slate-400 text-xs">Fats</p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            ))}
          </div>

          {/* Enhanced progress bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Progress</span>
              <span className="text-white font-semibold">
                {Math.round(progressPercent)}%
              </span>
            </div>

            <div className="relative w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-500 ease-out animate-pulse"
                style={{ width: `${progressPercent}%` }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            </div>
          </div>

          {/* Encouragement message */}
          <div className="text-center">
            <p className="text-slate-300 text-sm italic">
              AI is crafting your personalised nutrition plan...
            </p>
            <div className="flex items-center justify-center gap-1 mt-2">
              <div
                className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PlanGeneratingWindow;
