import { forwardRef } from "react";
import { Heart } from "lucide-react";
import { Product } from "@/lib/data";
import { useCartContext } from "@/contexts/cart-context";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import { useLocation } from "wouter";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  index?: number;
  onClick?: () => void;
}

export const ProductCard = forwardRef<HTMLDivElement, ProductCardProps>(function ProductCard(
  { product, index = 0, onClick },
  ref
) {
  const { addToCart } = useCartContext();
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const isMobile = useIsMobile();

  // Helper to safely get product translation
  const getProductTranslation = (key: string) =>
    (t.products as Record<string, { name: string; description: string }>)[key];

  const handleAddToCart = () => {
    addToCart(product);
    const prodT = getProductTranslation(product.key);
    toast.success(`${prodT?.name || product.key} ${t.menu.addedToCart}`);
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      setLocation("/login");
      return;
    }
    toggleFavorite(product.id);
  };

  const isFav = user ? isFavorite(product.id) : false;
  const productName = getProductTranslation(product.key)?.name || product.key;
  const productDescription = getProductTranslation(product.key)?.description || "";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative flex h-full flex-col bg-card rounded-xl overflow-hidden border border-border transition-all duration-300",
        onClick && "cursor-pointer",
        isMobile ? "" : "hover:shadow-lg"
      )}
      onClick={onClick}
    >
      <div className="relative flex h-56 w-full shrink-0 items-center justify-center bg-white px-4 sm:h-60 md:h-64">
        <img
          src={
            product.image?.startsWith('http')
              ? product.image
              : `${import.meta.env.BASE_URL}${product.image || "images/margherita.png"}`
          }
          alt={productName}
          className="max-h-full max-w-full object-contain"
          onError={(e) => {
            e.currentTarget.src = `${import.meta.env.BASE_URL}images/margherita.png`;
          }}
        />
        {/* Heart always visible — gri kur jo loguar, e kuqe kur preferuar */}
        <button
          onClick={handleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm shadow-sm transition-all duration-200 hover:scale-110 active:scale-95 ${
            isFav
              ? "bg-destructive/10 border border-destructive/30"
              : "bg-background/80 border border-transparent"
          }`}
          aria-label="Toggle favorite"
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              isFav
                ? "fill-destructive text-destructive scale-110"
                : user
                ? "text-foreground/60 hover:text-destructive"
                : "text-foreground/30"
            }`}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex min-h-[4.5rem] items-start justify-between gap-3">
          <h3 className="line-clamp-3 font-serif text-xl font-bold leading-tight">{productName}</h3>
          <span className="shrink-0 font-serif text-lg font-bold text-primary whitespace-nowrap">
            €{product.price.toFixed(2)}
          </span>
        </div>

        {productDescription ? (
          <p className="mb-4 line-clamp-3 min-h-[3.75rem] text-sm leading-relaxed text-muted-foreground">
            {productDescription}
          </p>
        ) : null}

        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          className="w-full mt-auto bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 transition-colors"
        >
          {t.menu.addToOrder}
        </Button>
      </div>
    </motion.div>
  );
});
