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

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${name} ${t.menu.addedToCart}`);
  };

  return (
    <button
      type="button"
      onClick={handleAdd}
      className="group flex w-full flex-col items-center gap-0.5 px-1 py-2 text-center transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      aria-label={`${t.menu.addToOrder}: ${name}`}
    >
      <span
        className="text-balance text-[11px] font-bold uppercase leading-snug tracking-[0.04em] md:text-xs"
        style={{ color: MENU_DRINK.text }}
      >
        {name}
      </span>
      <span className="text-xs font-bold md:text-sm" style={{ color: MENU_DRINK.text }}>
        {formatMenuPrice(product.price)}
      </span>
    </button>
  );
}
