import type { InlineSegment } from "../types";

type MealOptionRow = {
  readonly option: InlineSegment[];
  readonly notes?: InlineSegment[];
};

type SingleColumnRow = {
  readonly option: InlineSegment[];
};

const text = (content: string): InlineSegment[] => [{ content }];

export const saturdayLunchOptions: MealOptionRow[] = [
  { option: text("Carne Asada Burrito") },
  { option: text("Grilled Chicken Burrito") },
  { option: text("Fried Tofu Burrito") },
  { option: text("Chicken Tinga Burrito"), notes: text("Halal Friendly") },
  { option: text("Chicken Al Pastor Burrito"), notes: text("Gluten Free Friendly") },
  {
    option: text("Tilapia Burrito"),
    notes: text("Allergy Free Friendly — No lactose, tree nut, peas, chickpea, mango, banana, or avocado"),
  },
];

export const saturdayDinnerOptions: MealOptionRow[] = [
  { option: text("Pepperoni Pizza") },
  { option: text("Cheese Pizza") },
  { option: text("Sausage Pizza") },
  { option: text("Veggie Pizza") },
  { option: text("Garden Veggie Papa Bowl"), notes: text("Option for no cheese and no Italian seasoning") },
];

export const sundayBreakfastBagels: SingleColumnRow[] = [
  { option: text("Asiago Bagel") },
  { option: text("Blueberry Bagel") },
  { option: text("Chocolate Chip Bagel") },
  { option: text("Cinnamon Raisin Bagel") },
  { option: text("Everything Bagel") },
  { option: text("Honey Whole Wheat Bagel") },
  { option: text("Plain Bagel") },
  { option: text("Pumpernickel Bagel") },
  { option: text("Sesame Bagel") },
];

export const sundayBreakfastShmears: SingleColumnRow[] = [
  { option: text("Garden Veggie Shmear") },
  { option: text("Onion and Chive Shmear") },
  { option: text("Strawberry Shmear") },
  { option: text("Honey Almond Shmear") },
  { option: text("Jalapeno Salsa Shmear") },
  { option: text("Regular Plain Shmear") },
];

export const sundayLunchOptions: MealOptionRow[] = [
  { option: text("K-BBQ Chicken Bowl") },
  { option: text("Fire Chicken Bowl") },
  { option: text("Katsu Chicken Bowl") },
  { option: text("Fire Chicken Bowl"), notes: text("Halal Friendly") },
  { option: text("K-BBQ Tofu Bowl"), notes: text("Vegan Friendly") },
  { option: text("K-BBQ Chicken Bowl (Gluten Free)"), notes: text("Gluten Free Friendly") },
  {
    option: text("Fire Chicken Bowl (Allergy-Free)"),
    notes: text("Allergy Free Friendly — No lactose, tree nut, peas, chickpea, mango, banana, or avocado"),
  },
  { option: text("K-BBQ Chicken Bowl (Kosher)"), notes: text("Kosher Friendly") },
];

export type { MealOptionRow, SingleColumnRow };
