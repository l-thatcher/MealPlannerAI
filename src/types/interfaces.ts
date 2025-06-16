export interface MacroNutrients {
  p: number; // Protein
  c: number; // Carbs
  f: number; // Fats
}

export interface Meal {
  name: string;
  title: string;
  cals: number;
  macros: MacroNutrients;
  recipe: string;
}

export interface DayPlan {
  day: number;
  meals: Meal[];
}

export interface MealPlan {
  days: DayPlan[];
  shoppingList: ShoppingCategory[];
}

export interface MealPlanResultsProps {
  plan: MealPlan | null; 
}

export interface MealPlannerFormData {
  days: number;
  mealsPerDay: number;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  dietaryRestrictions: string[];
  preferredCuisines: string;
  skillLevel: string;
  excludedIngredients: string;
}

export interface MealPlannerFormProps {
  onGenerate: (formData: MealPlannerFormData) => void;
  isLoading: boolean;
  initialFormData: MealPlannerFormData;
  stopGeneration: () => void; 
  handleFormData: (formData: MealPlannerFormData) => void;
}

export interface ShoppingItem {
  name: string;
  quantity: string;
}

export interface ShoppingCategory {
  category: string;
  items: ShoppingItem[];
}

export interface ShoppingListCardProps {
  shoppingList: ShoppingCategory[];
  checkedItems: Record<string, boolean>;
  onToggleItem: (itemKey: string) => void;
}

