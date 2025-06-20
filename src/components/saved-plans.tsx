import { MoreHorizontal, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { SavedMealPlansProps } from "@/types/interfaces";

export function SavedPlans({
  loadingSaved,
  savedPlans,
  handleLoadPlan,
  handleDeletePlanFromSaved,
}: SavedMealPlansProps) {
  return (
    <div>
      {loadingSaved ? (
        <div className="flex items-center justify-center p-6 text-slate-300">
          Loading...
        </div>
      ) : savedPlans.length === 0 ? (
        <div className="flex items-center justify-center p-6 text-slate-400">
          No saved plans yet.
        </div>
      ) : (
        savedPlans.map((saved, idx) => (
          <div
            key={saved.id}
            className={`flex items-center px-3 py-2 text-sm text-slate-50 ${
              idx !== savedPlans.length - 1
                ? "border-b border-slate-200/20 dark:border-slate-700/40"
                : ""
            }`}
          >
            <div className="flex-1 min-w-0 flex flex-col gap-1">
              <span className="font-medium truncate text-slate-50">
                {saved.planDetails.name || "Meal Plan"}
              </span>
              <span className="text-xs text-slate-200">
                Days: {saved.days?.length ?? "?"}, Meals/Day:{" "}
                {saved.days?.[0]?.meals?.length ?? "?"}
              </span>
              <div className="flex-1 min-w-0 flex gap-1">
                <span className="text-xs text-slate-300 truncate max-w-xs">
                  {saved.planDetails.description || "-"}
                </span>
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <span
                      className="cursor-pointer inline-flex items-center ml-1"
                      title="Show more"
                    >
                      <MoreHorizontal className="w-4 h-4 text-slate-200" />
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-slate-900/80 text-slate-50 border border-slate-200/20 backdrop-blur-md">
                    {saved.planDetails.description || "-"}
                  </HoverCardContent>
                </HoverCard>
              </div>

              <div className="flex gap-1 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleLoadPlan(saved)}
                  className="px-2 flex-1 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-slate-800/60 hover:text-green-400"
                >
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDeletePlanFromSaved(saved.id)}
                  aria-label="Delete"
                  className="px-2 h-9 text-slate-50 border-slate-200/30 bg-slate-900/60 backdrop-blur-md hover:bg-red-900/60"
                >
                  <Trash2 className="w-4 h-4 text-slate-200" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
