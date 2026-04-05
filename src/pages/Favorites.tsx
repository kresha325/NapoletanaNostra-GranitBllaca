import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useFavorites } from "@/hooks/use-favorites";
import { menuData } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { HeartCrack } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

export default function Favorites() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) {
      setLocation("/login");
    }
  }, [user, setLocation]);

  if (!user) return null;

  const favoriteProducts = menuData.filter(product => favorites.includes(product.id));

  return (
    <div className="min-h-screen bg-background flex flex-col py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">{t.favorites.title}</h1>
          <p className="text-lg text-muted-foreground">{t.favorites.subtitle}</p>
        </div>

        {favoriteProducts.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
          >
            {favoriteProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center">
              <HeartCrack className="w-12 h-12 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-bold">{t.favorites.empty}</h2>
            <p className="text-muted-foreground max-w-md">{t.favorites.emptyDesc}</p>
            <Button onClick={() => setLocation("/menu")} className="mt-4">
              {t.favorites.goToMenu}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
