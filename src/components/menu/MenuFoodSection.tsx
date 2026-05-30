import { Product } from "@/lib/data";
import { MenuFoodItem } from "./MenuFoodItem";
import { MenuSectionFrame } from "./MenuSectionFrame";
import { MENU_FOOD } from "./menu-theme";

interface MenuFoodSectionProps {
  title: string;
  products: Product[];
}

export function MenuFoodSection({ title, products }: MenuFoodSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <MenuSectionFrame
      title={title}
      borderColor={MENU_FOOD.border}
      backgroundColor={MENU_FOOD.bg}
      titleColor={MENU_FOOD.title}
    >
      <div className="grid w-full grid-cols-1 gap-y-0 md:grid-cols-2 md:gap-x-4 md:gap-y-0">
        {products.map((product) => (
          <MenuFoodItem key={product.id} product={product} />
        ))}
      </div>
    </MenuSectionFrame>
  );
}
