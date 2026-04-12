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
  { option: text("Chicken Al Pastor Bowls"), notes: text("Gluten Free Friendly") },
  {
    option: text("Tilapia Burrito"),
    notes: text("Allergy Free Friendly"),
  },
];

export const saturdayDinnerOptions: MealOptionRow[] = [
  { option: text("Pepperoni Pizza") },
  { option: text("Cheese Pizza") },
  { option: text("Sausage Pizza") },
  { option: text("Veggie Pizza") },
  { option: text("Garden Veggie Papa Bowl"), notes: text("Option for no cheese and no Italian seasoning") },
];

export const midnightSnack: MealOptionRow[] = [
  { option: text("Chocolate Chunk") },
  { option: text("Cookies 'N Cream") },
  { option: text("Double Chocolate Chunk") },
  { option: text("Classic with M&M'S") },
  { option: text("Peanut Butter Chip") },
  { option: text("Snickerdoodle") },
  { option: text("Double Chocolate Mint") },
  { option: text("Oatmeal Raisin") },
  { option: text("Sugar") },
  { option: text("White Chocolate Macademia") },
  { option: text("Vegan Birthday Cake"), notes: text("Vegan Friendly") },
  { option: text("Vegan Chocolate Chunk"), notes: text("Vegan Friendly") },
  { option: text("Vegan Double Chocolate Chunk"), notes: text("Vegan Friendly") },
  { option: text("Vegan Gluten Free Chocolate Chip"), notes: text("Vegan and Gluten Free Friendly") },
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
    notes: text("Allergy Free Friendly"),
  },
  { option: text("K-BBQ Chicken Bowl (Kosher)"), notes: text("Kosher Friendly") },
];

export type { MealOptionRow, SingleColumnRow };
