import { useState, useEffect } from "react";
import { menuData } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORY_KEYS = ["", "Pizza", "Pasta", "Antipasti", "Dolci", "Bevande"];

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("");
  const [activeProductId, setActiveProductId] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const filteredProducts = menuData.filter((product) =>
    activeCategory === "" ? true : product.category === activeCategory
  );

  const getCategoryLabel = (key: string) => {
    if (key === "") return t.menu.all;
    return t.categories?.[key] || key;
  };

  useEffect(() => {
    if (!activeProductId) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [activeProductId]);

  useEffect(() => {
    if (!activeProductId) return;
    const productStillVisible = filteredProducts.some((product) => product.id === activeProductId);
    if (!productStillVisible) {
      setActiveProductId(null);
    }
  }, [activeProductId, filteredProducts]);

  useEffect(() => {
    if (!activeProductId) return;

    const timer = window.setTimeout(() => {
      const target = document.getElementById(`fullscreen-product-${activeProductId}`);
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    return () => window.clearTimeout(timer);
  }, [activeProductId]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-muted py-16 md:py-24 border-b">
        <div className="container mx-auto px-4 md:px-6 text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-serif text-4xl md:text-6xl font-bold text-foreground"
          >
            {t.menu.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
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

      <AnimatePresence>
        {activeProductId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 h-dvh w-screen bg-background/95 backdrop-blur-sm"
          >
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 z-20 bg-background top-[max(1rem,env(safe-area-inset-top))]"
              onClick={() => setActiveProductId(null)}
              aria-label="Close fullscreen products"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="h-dvh w-screen overflow-y-auto snap-y snap-mandatory overscroll-contain">
              {filteredProducts.map((product) => {
                const productTranslation = (t.products as Record<string, { name: string; description: string }>)?.[product.key];
                const imageSrc = product.image?.startsWith("http")
                  ? product.image
                  : `${import.meta.env.BASE_URL}${product.image || "images/margherita.png"}`;

                return (
                  <section
                    key={product.id}
                    id={`fullscreen-product-${product.id}`}
                    className="min-h-dvh w-screen snap-start"
                  >
                    <div className="w-full min-h-dvh bg-card grid grid-cols-1 lg:grid-cols-2 items-center p-5 md:p-10 lg:p-14 gap-6 md:gap-10">
                      <div className="bg-muted rounded-2xl p-4 md:p-8 flex items-center justify-center h-[38svh] min-h-[260px] lg:h-[72dvh]">
                        <img
                          src={imageSrc}
                          alt={productTranslation?.name || product.key}
                          className="max-w-full max-h-[62dvh] object-contain"
                          onError={(e) => {
                            e.currentTarget.src = `${import.meta.env.BASE_URL}images/margherita.png`;
                          }}
                        />
                      </div>

                      <div className="space-y-4 md:space-y-6 self-center">
                        <p className="text-sm uppercase tracking-widest text-primary/80">{t.categories?.[product.category] || product.category}</p>
                        <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight">
                          {productTranslation?.name || product.key}
                        </h2>
                        <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
                          {productTranslation?.description || ""}
                        </p>
                        <p className="font-serif text-2xl md:text-4xl font-bold text-primary">
                          €{product.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Scroll lart/poshte per produktin tjeter.
                        </p>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
