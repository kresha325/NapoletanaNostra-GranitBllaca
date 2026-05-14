import { useState, useEffect } from "react";
import { menuData, type Product } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { useCartContext } from "@/contexts/cart-context";
import { toast } from "sonner";

type CategoryKey = "" | Product["category"];

const CATEGORY_KEYS: CategoryKey[] = ["", "Pizza", "Pasta", "Antipasti", "Dolci", "Bevande"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const { t } = useLanguage();
  const { addToCart } = useCartContext();
  const localizedProducts = (t.products as Record<string, { name: string; description: string }> | undefined) || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = menuData.filter((product) =>
    activeCategory === "" ? true : product.category === activeCategory
  );

  const getCategoryLabel = (key: CategoryKey) => {
    if (key === "") return t.menu.all;
    return t.categories?.[key] || key;
  };

  const activeProductIndex = activeProductId
    ? filteredProducts.findIndex((product) => product.id === activeProductId)
    : -1;
  const activeProduct = activeProductIndex >= 0 ? filteredProducts[activeProductIndex] : null;

  useEffect(() => {
    if (!activeProductId) return;
    const productStillVisible = filteredProducts.some((product) => product.id === activeProductId);
    if (!productStillVisible) {
      setActiveProductId(null);
    }
  }, [activeProductId, filteredProducts]);

  const showAdjacentProduct = (direction: 1 | -1) => {
    if (filteredProducts.length === 0 || activeProductIndex === -1) return;

    const nextIndex =
      (activeProductIndex + direction + filteredProducts.length) % filteredProducts.length;
    setActiveProductId(filteredProducts[nextIndex].id);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden border-b py-16 md:py-24">
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}images/menu-hero.jpg`}
            alt="Menu hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </div>

        <div className="container relative z-10 mx-auto px-4 text-center space-y-6 md:px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl font-bold text-white md:text-6xl"
          >
            {t.menu.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-2xl text-lg text-white/85 md:text-xl"
          >
            {t.menu.subtitle}
          </motion.p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={cn(
                "px-6 py-2.5 rounded-full font-medium transition-all duration-300 border",
                activeCategory === key
                  ? "bg-primary border-primary text-primary-foreground shadow-md"
                  : "bg-transparent border-border text-foreground hover:border-primary/50 hover:bg-primary/5"
              )}
            >
              {getCategoryLabel(key)}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={() => setActiveProductId(product.id)}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-lg">
            {t.menu.noProducts}
          </div>
        )}
      </div>

      <Dialog open={Boolean(activeProduct)} onOpenChange={(open) => !open && setActiveProductId(null)}>
        {activeProduct && (
          <DialogContent className="h-dvh w-screen max-w-none rounded-none border-0 bg-background/95 p-0 backdrop-blur-sm sm:rounded-none">
            <DialogTitle className="sr-only">
              {localizedProducts[activeProduct.key]?.name || activeProduct.key}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {localizedProducts[activeProduct.key]?.description || "Product details"}
            </DialogDescription>

            <div className="grid h-full grid-cols-1 lg:grid-cols-2">
              <div className="relative flex min-h-[40vh] items-center justify-center bg-muted px-6 py-16 lg:min-h-full lg:px-10">
                <img
                  src={activeProduct.image?.startsWith("http")
                    ? activeProduct.image
                    : `${import.meta.env.BASE_URL}${activeProduct.image || "images/margherita.png"}`}
                  alt={localizedProducts[activeProduct.key]?.name || activeProduct.key}
                  className="max-h-[55vh] w-auto max-w-full object-contain lg:max-h-[72vh]"
                  onError={(e) => {
                    e.currentTarget.src = `${import.meta.env.BASE_URL}images/margherita.png`;
                  }}
                />
              </div>

              <div className="flex h-full flex-col border-l border-border/60 bg-background px-6 py-16 md:px-8 lg:px-10">
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-primary/80">
                    {t.categories?.[activeProduct.category] || activeProduct.category}
                  </p>
                  <h2 className="font-serif text-4xl font-bold leading-tight md:text-5xl">
                    {localizedProducts[activeProduct.key]?.name || activeProduct.key}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground md:text-lg">
                    {localizedProducts[activeProduct.key]?.description || ""}
                  </p>
                </div>

                <div className="mt-auto space-y-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-serif text-4xl font-bold text-primary md:text-5xl">
                      €{activeProduct.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => showAdjacentProduct(-1)}
                        aria-label="Show previous product"
                        disabled={filteredProducts.length <= 1}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => showAdjacentProduct(1)}
                        aria-label="Show next product"
                        disabled={filteredProducts.length <= 1}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      addToCart(activeProduct);
                      toast.success(
                        `${localizedProducts[activeProduct.key]?.name || activeProduct.key} ${t.menu.addedToCart}`
                      );
                    }}
                    className="h-12 w-full border border-primary/20 bg-primary/10 text-base text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    {t.menu.addToOrder}
                  </Button>

                  <p className="text-sm text-muted-foreground">
                    Përdor shigjetat për të kaluar te produkti tjetër në këtë kategori.
                  </p>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
