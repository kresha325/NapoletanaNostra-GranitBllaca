import { Product } from "@/lib/data";
import { useCartContext } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { MENU_FOOD, formatMenuPrice } from "./menu-theme";

interface MenuFoodItemProps {
  product: Product;
}

export function MenuFoodItem({ product }: MenuFoodItemProps) {
  const { addToCart } = useCartContext();
  const { t } = useLanguage();

  const productT = (t.products as Record<string, { name: string; description: string }>)[product.key];
  const name = productT?.name || product.key;
  const description = productT?.description || "";

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${name} ${t.menu.addedToCart}`);
  };

  return (
    <article className="w-full px-1 py-2 md:px-2 md:py-3">
      <button
        type="button"
        onClick={handleAdd}
        className={cn(
          "grid w-full grid-cols-[minmax(0,34%)_1fr_auto] items-start gap-x-2 text-left transition-opacity hover:opacity-80",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B393E]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E9]",
          "md:flex md:flex-col md:items-center md:gap-0.5 md:text-center"
        )}
        aria-label={`${t.menu.addToOrder}: ${name}`}
      >
        <h3
          className="text-[10px] font-bold uppercase leading-tight tracking-[0.03em] md:text-balance md:text-xs"
          style={{ color: MENU_FOOD.title }}
        >
          {name}
        </h3>
        {description ? (
          <p
            className="min-w-0 text-[8px] font-normal uppercase leading-snug tracking-[0.03em] md:max-w-[12rem] md:text-balance md:text-[10px]"
            style={{ color: MENU_FOOD.description }}
          >
            {description}
          </p>
        ) : (
          <span className="min-w-0 md:hidden" aria-hidden />
        )}
        <p
          className="shrink-0 text-[10px] font-bold tabular-nums md:mt-0.5 md:text-xs"
          style={{ color: MENU_FOOD.price }}
        >
          {formatMenuPrice(product.price)}
        </p>
      </button>
    </article>
  );
}
