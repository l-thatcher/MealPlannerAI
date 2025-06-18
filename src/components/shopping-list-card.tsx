import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { ShoppingListCardProps } from "@/types/interfaces";

export function ShoppingListCard({
  shoppingList,
  checkedItems,
  onToggleItem,
}: ShoppingListCardProps) {
  if (!shoppingList?.length) return null;

  return (
    <div className="mt-12">
      <Card
        className="mb-8 bg-slate-900/60 backdrop-blur-md border border-slate-200/20 shadow-xl text-slate-50"
        style={{
          background: "rgba(30, 41, 59, 0.60)",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-50">
            <ShoppingCart className="h-5 w-5" />
            Shopping List
          </CardTitle>
        </CardHeader>
        <CardContent>
          {shoppingList.map((category) => (
            <div
              key={`category-${category.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="mb-6 last:mb-0"
            >
              <h3 className="font-semibold mb-2 text-lg">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item) => {
                  const itemKey = `item-${category.category}-${item.name}`
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <div key={itemKey} className="flex items-center space-x-2">
                      <Checkbox
                        checked={checkedItems[itemKey]}
                        onCheckedChange={() => onToggleItem(itemKey)}
                        id={itemKey}
                      />
                      <label
                        htmlFor={itemKey}
                        className={`text-sm ${
                          checkedItems[itemKey]
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {item.quantity} {item.name}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
