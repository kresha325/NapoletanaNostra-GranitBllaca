import { Product } from "@/lib/data";
import { useCartContext } from "@/contexts/cart-context";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";
import { MENU_DRINK, formatMenuPrice } from "./menu-theme";
import { cn } from "@/lib/utils";

interface MenuDrinkItemProps {
  product: Product;
}

export function MenuDrinkItem({ product }: MenuDrinkItemProps) {
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
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        "group grid w-full grid-cols-[minmax(0,34%)_1fr_auto] items-start gap-x-2 px-1 py-2 text-left transition-opacity hover:opacity-85",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
        "md:flex md:flex-col md:items-center md:gap-0.5 md:text-center"
      )}
      aria-label={`${t.menu.addToOrder}: ${name}`}
    >
      <span
        className="text-[10px] font-bold uppercase leading-snug tracking-[0.04em] md:text-balance md:text-xs"
        style={{ color: MENU_DRINK.text }}
      >
        {name}
      </span>
      {description ? (
        <span
          className="min-w-0 text-[8px] font-normal uppercase leading-snug tracking-[0.03em] md:max-w-[12rem] md:text-balance md:text-[10px]"
          style={{ color: MENU_DRINK.text }}
        >
          {description}
        </span>
      ) : (
        <span className="min-w-0 md:hidden" aria-hidden />
      )}
      <span
        className="shrink-0 text-[10px] font-bold tabular-nums md:text-sm"
        style={{ color: MENU_DRINK.text }}
      >
        {formatMenuPrice(product.price)}
      </span>
    </button>
  );
}
