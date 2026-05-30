/** Ngjyra nga menuja e printuar (foto referencë). */
export const MENU_CREAM = "#F5F1E9";
export const MENU_BURGUNDY = "#9B393E";
export const MENU_GOLD = "#A88442";

export const MENU_FOOD = {
  bg: MENU_CREAM,
  title: MENU_BURGUNDY,
  description: MENU_GOLD,
  price: MENU_BURGUNDY,
  border: MENU_BURGUNDY,
} as const;

export const MENU_DRINK = {
  bg: MENU_BURGUNDY,
  text: MENU_CREAM,
  border: MENU_CREAM,
} as const;

export function formatMenuPrice(price: number): string {
  return price.toFixed(1);
}
