import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw, X, Lightbulb } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

interface PlanGenerationErrorProps {
  error: string | null;
  onRetry: () => void;
  onDismiss: () => void;
}

export function PlanGenerationError({
  error,
  onRetry,
  onDismiss,
}: PlanGenerationErrorProps) {
  if (!error) return null;

  return (
    <div
      className="relative mx-auto mt-8 w-full animate-fade-in"
      data-testid="error-container"
    >
      <Card className="bg-white/10 backdrop-blur-xl border border-red-400/30 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl">
                  Generation Failed
                </CardTitle>
                <CardDescription className="text-slate-300">
                  We encountered an issue creating your meal plan
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="text-slate-400 hover:text-white hover:bg-white/10 rounded-full w-8 h-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-4 bg-red-500/10 border border-red-400/20 rounded-lg">
            <p className="text-white text-sm leading-relaxed">
              {(() => {
                try {
                  // Try to parse the error as JSON
                  const errorObj = JSON.parse(error || "{}");
                  return (
                    errorObj.reason ||
                    error ||
                    "An unexpected error occurred. Please try again with different parameters."
                  );
                } catch (e) {
                  console.error("Error parsing error text:", e);
                  return (
                    error ||
                    "An unexpected error occurred. Please try again with different parameters."
                  );
                }
              })()}
            </p>
          </div>

          {(() => {
            // Check if the error is about token limits
            const errorText = error || "";
            const isTokenLimitError =
              errorText.includes("Token limit reached") ||
              (() => {
                try {
                  const errorObj = JSON.parse(errorText);
                  return (
                    errorObj.reason?.includes("Token limit reached") || false
                  );
                } catch (e) {
                  console.error("Error parsing error text:", e);
                  return false;
                }
              })();

            // Only show suggestions if it's NOT a token limit error
            return !isTokenLimitError ? (
              <div className="p-4 bg-blue-500/10 border border-blue-400/20 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-blue-400" />
                  <h4 className="text-white font-medium">
                    Suggestions to try:
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Try reducing the number of days in your plan</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Be less restrictive with dietary requirements</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Check your internet connection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                    <span>Try different preferences or goals</span>
                  </li>
                </ul>
              </div>
            ) : null;
          })()}
        </CardContent>

        <CardFooter className="flex gap-3 pt-2">
          <Button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={onDismiss}
            className="text-white border-white/30 bg-white/10 backdrop-blur-md hover:bg-white/20 hover:border-white/50 transition-all duration-300"
          >
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
