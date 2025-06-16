import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { ShoppingListCardProps } from "@/types/interfaces";

export function ShoppingListCard({ shoppingList }: ShoppingListCardProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  if (!shoppingList?.length) return null;

  const toggleItem = (itemKey: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

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
          {shoppingList.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-6 last:mb-0">
              <h3 className="font-semibold mb-2 text-lg">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => {
                  const itemKey = `${categoryIndex}-${itemIndex}`;
                  return (
                    <div key={itemKey} className="flex items-center space-x-2">
                      <Checkbox
                        checked={checkedItems[itemKey]}
                        onCheckedChange={() => toggleItem(itemKey)}
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
