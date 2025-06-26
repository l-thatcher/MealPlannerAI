import { ShoppingCart, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import { ShoppingListCardProps } from "@/types/interfaces";

export function ShoppingListCard({
  shoppingList,
  checkedItems,
  onToggleItem,
}: ShoppingListCardProps) {
  if (!shoppingList?.length) return null;

  return (
    <div className="mt-8">
      <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            Shopping List
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {shoppingList.map((category) => (
            <div
              key={`category-${category.category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="space-y-3"
            >
              <div className="flex items-center gap-2 pb-2 border-b border-white/10">
                <Package className="h-4 w-4 text-blue-400" />
                <h3 className="font-semibold text-white text-lg">
                  {category.category}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {category.items.map((item) => {
                  const itemKey = `item-${category.category}-${item.name}`
                    .toLowerCase()
                    .replace(/\s+/g, "-");
                  return (
                    <div
                      key={itemKey}
                      className="flex items-center space-x-3 p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
                    >
                      <Checkbox
                        checked={checkedItems[itemKey]}
                        onCheckedChange={() => onToggleItem(itemKey)}
                        id={itemKey}
                        className="border-white/30 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={itemKey}
                        className={`text-sm cursor-pointer select-none flex-1 transition-all duration-300 ${
                          checkedItems[itemKey]
                            ? "line-through text-slate-400"
                            : "text-white hover:text-blue-300"
                        }`}
                      >
                        <span className="font-medium">{item.quantity}</span>{" "}
                        <span>{item.name}</span>
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
