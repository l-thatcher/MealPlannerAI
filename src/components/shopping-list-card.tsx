import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ShoppingListCardProps } from "@/types/interfaces";

export function ShoppingListCard({ shoppingList }: ShoppingListCardProps) {
  if (!shoppingList) return null;

  return (
    <div className="mt-12">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="whitespace-pre-line">{shoppingList}</div>
        </CardContent>
      </Card>
    </div>
  );
}
