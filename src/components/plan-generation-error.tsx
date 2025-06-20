import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";
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
      <Card className="border border-red-400/30 bg-slate-900/70 backdrop-blur-xl shadow-xl text-slate-50">
        <CardHeader className="border-b border-red-400/20 pb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-400" />
            <CardTitle className="text-red-400">Generation Failed</CardTitle>
          </div>
          <CardDescription className="text-slate-300">
            We couldn&apos;t generate your meal plan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-slate-200">
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
              <div className="mt-4 text-sm text-slate-400">
                <p>Here are some suggestions:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Try reducing the number of days in your plan</li>
                  <li>Be less restrictive with dietary requirements</li>
                  <li>Check your internet connection</li>
                  <li>Try a different AI model (if available)</li>
                </ul>
              </div>
            ) : null;
          })()}
        </CardContent>
        <CardFooter className="flex gap-3 pt-2 pb-4">
          <Button
            onClick={onRetry}
            className="bg-blue-600 hover:bg-blue-700 text-slate-50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          <Button
            variant="outline"
            onClick={onDismiss}
            className="text-slate-50 border-slate-200/30 bg-slate-900/60 hover:bg-slate-800/60 hover:text-red-400"
          >
            Dismiss
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
