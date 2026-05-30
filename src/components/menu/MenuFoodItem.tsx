import { Product } from "@/lib/data";
import { useCartContext } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
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
    <article className="flex w-full flex-col items-center px-1 py-2.5 text-center md:px-2 md:py-3">
      <button
        type="button"
        onClick={handleAdd}
        className="flex w-full flex-col items-center gap-0.5 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9B393E]/30 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5F1E9]"
        aria-label={`${t.menu.addToOrder}: ${name}`}
      >
        <h3
          className="text-balance text-[11px] font-bold uppercase leading-tight tracking-[0.03em] md:text-xs"
          style={{ color: MENU_FOOD.title }}
        >
          {name}
        </h3>
        {description ? (
          <p
            className="text-balance max-w-[11rem] text-[9px] font-normal uppercase leading-snug tracking-[0.04em] md:max-w-[12rem] md:text-[10px]"
            style={{ color: MENU_FOOD.description }}
          >
            {description}
          </p>
        ) : null}
        <p
          className="mt-0.5 text-[11px] font-bold md:text-xs"
          style={{ color: MENU_FOOD.price }}
        >
          {formatMenuPrice(product.price)}
        </p>
      </button>
    </article>
  );
}
