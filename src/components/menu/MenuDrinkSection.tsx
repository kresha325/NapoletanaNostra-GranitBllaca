import { Product } from "@/lib/data";
import { MenuDrinkItem } from "./MenuDrinkItem";
import { MenuSectionFrame } from "./MenuSectionFrame";
import { MENU_DRINK } from "./menu-theme";
import { cn } from "@/lib/utils";

interface MenuDrinkSectionProps {
  title: string;
  products: Product[];
  layout?: "two-column" | "single-column";
}

export function MenuDrinkSection({ title, products, layout = "two-column" }: MenuDrinkSectionProps) {
  if (products.length === 0) {
    return null;
  }

  const twoColumns = layout === "two-column";

  return (
    <MenuSectionFrame
      title={title}
      borderColor={MENU_DRINK.border}
      backgroundColor={MENU_DRINK.bg}
      titleColor={MENU_DRINK.text}
    >
      <div
        className={cn(
          "grid w-full gap-y-2",
          twoColumns ? "grid-cols-1 md:grid-cols-2 md:gap-x-6" : "grid-cols-1"
        )}
      >
        {products.map((product) => (
          <MenuDrinkItem key={product.id} product={product} />
        ))}
      </div>
    </MenuSectionFrame>
  );
}
