import React from "react";
import { PlanGeneratingWindowProps } from "@/types/interfaces";

function PlanGeneratingWindow({
  object,
  progressPercent,
}: PlanGeneratingWindowProps) {
  return (
    <div
      className="relative mx-auto mt-8 w-full rounded-2xl shadow-2xl border border-slate-200/20 bg-slate-900/70 backdrop-blur-xl p-8 flex flex-col items-center gap-4 animate-fade-in"
      style={{
        background: "rgba(30,41,59,0.75)",
        border: "1px solid rgba(148,163,184,0.2)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      {/* Latest day/meal preview */}
      <div className="w-full bg-slate-800/60 rounded-xl p-4 border border-slate-200/10 shadow-inner flex flex-col items-center gap-2">
        <span className="uppercase text-xs tracking-widest text-slate-400 mb-1">
          Preview
        </span>
        {[object.days[object.days.length - 1]].map((day, dayIndex) => (
          <div key={dayIndex} className="w-full">
            {[day?.meals?.[day.meals?.length - 1]].map((meal, mealIndex) => (
              <div key={mealIndex} className="flex flex-col items-center gap-1">
                <p className="text-lg font-bold text-slate-50">
                  Day {object?.days?.length} &mdash; {meal?.title}
                </p>
                <p className="text-slate-200 text-base">
                  {meal?.cals} calories
                  <span className="mx-2 text-slate-400">|</span>
                  <span className="text-pink-300">
                    {meal?.macros?.p}g protein
                  </span>
                  <span className="mx-1 text-slate-400">/</span>
                  <span className="text-blue-300">
                    {meal?.macros?.c}g carbs
                  </span>
                  <span className="mx-1 text-slate-400">/</span>
                  <span className="text-yellow-300">
                    {meal?.macros?.f}g fats
                  </span>
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Subtle progress bar (optional) */}
      <div className="w-full h-2 bg-slate-800/40 rounded-full overflow-hidden mt-2">
        <div
          className="h-full bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-300 animate-pulse transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Encouragement or tip */}
      <div className="text-xs text-slate-400 mt-2 italic">
        Your personalized plan is generating.
      </div>
    </div>
  );
}

export default PlanGeneratingWindow;
