import { useState, useEffect, useRef } from "react";
import { menuData, type Product } from "@/lib/data";
import { ProductCard } from "@/components/product/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { Language } from "@/lib/translations";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";

type CategoryKey = "" | Product["category"];
type DrinkSectionKey = "soft-drinks" | "waters" | "beers" | "vino-bianco" | "vino-rosso" | "aperitivo";

const CATEGORY_KEYS: CategoryKey[] = ["", "Pizza", "Pasta", "Antipasti", "Dolci", "Bevande"];
const DRINK_SECTION_ORDER: DrinkSectionKey[] = [
  "soft-drinks",
  "waters",
  "beers",
  "vino-bianco",
  "vino-rosso",
  "aperitivo",
];

const DRINK_SECTION_LABELS: Record<Language, Record<DrinkSectionKey, string>> = {
  sq: {
    "soft-drinks": "Pije Joalkoolike",
    waters: "Ujëra",
    beers: "Birra",
    "vino-bianco": "Verë e Bardhë",
    "vino-rosso": "Verë e Kuqe",
    aperitivo: "Aperitivo",
  },
  en: {
    "soft-drinks": "Soft Drinks",
    waters: "Waters",
    beers: "Beers",
    "vino-bianco": "White Wine",
    "vino-rosso": "Red Wine",
    aperitivo: "Aperitivo",
  },
  it: {
    "soft-drinks": "Bibite",
    waters: "Acque",
    beers: "Birre",
    "vino-bianco": "Vino Bianco",
    "vino-rosso": "Vino Rosso",
    aperitivo: "Aperitivo",
  },
  de: {
    "soft-drinks": "Softdrinks",
    waters: "Wasser",
    beers: "Biere",
    "vino-bianco": "Weisswein",
    "vino-rosso": "Rotwein",
    aperitivo: "Aperitif",
  },
  tr: {
    "soft-drinks": "Mesrubatlar",
    waters: "Sular",
    beers: "Biralar",
    "vino-bianco": "Beyaz Sarap",
    "vino-rosso": "Kirmizi Sarap",
    aperitivo: "Aperitif",
  },
  fr: {
    "soft-drinks": "Boissons",
    waters: "Eaux",
    beers: "Bieres",
    "vino-bianco": "Vin Blanc",
    "vino-rosso": "Vin Rouge",
    aperitivo: "Aperitif",
  },
  bs: {
    "soft-drinks": "Bezalkoholna Pica",
    waters: "Vode",
    beers: "Piva",
    "vino-bianco": "Bijelo Vino",
    "vino-rosso": "Crno Vino",
    aperitivo: "Aperitiv",
  },
};

const DRINK_MODAL_TITLES: Record<Language, string> = {
  sq: "Kategoritë e pijeve",
  en: "Drink Categories",
  it: "Categorie Bevande",
  de: "Getränkekategorien",
  tr: "İçecek Kategorileri",
  fr: "Catégories de boissons",
  bs: "Kategorije pića",
};

const DRINK_SECTION_KEYS: Record<DrinkSectionKey, string[]> = {
  "soft-drinks": ["coca-cola", "coca-cola-zero", "fanta", "sprite", "schweppes", "tonic", "ice-tea", "juices"],
  waters: ["water-025", "water-075", "mineral-water-025", "mineral-water-075"],
  beers: [
    "peja-draught-03",
    "peja-draught-05",
    "heineken",
    "peja-bottle",
    "peroni-nastro-azzurro",
    "paulaner",
    "bavaria-00",
  ],
  "vino-bianco": [
    "vino-bianco",
    "stone-chardonnay-0187",
    "tarani-0187",
    "theranda-alba-0187",
    "stone-chardonnay-075",
    "pinot-grigio-075",
    "theranda-chardonnay-075",
    "hisari-white-075",
    "she-white-075",
  ],
  "vino-rosso": [
    "vino-rosso",
    "stone-cabernet-0187",
    "theranda-tramonto-0187",
    "stone-cabernet-075",
    "theranda-cabernet-075",
    "pinot-noir-075",
    "hisari-red-075",
    "stone-riserva-075",
    "she-red-075",
  ],
  aperitivo: ["campari-soda-orange", "aperol-spritz"],
};

function getDrinkSectionKey(product: Product): DrinkSectionKey | null {
  if (product.category !== "Bevande") {
    return null;
  }

  return DRINK_SECTION_ORDER.find((section) => DRINK_SECTION_KEYS[section].includes(product.key)) ?? null;
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("");
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
  const [pendingDrinkSection, setPendingDrinkSection] = useState<DrinkSectionKey | null>(null);
  const { t, lang } = useLanguage();
  const drinkSectionRefs = useRef<Partial<Record<DrinkSectionKey, HTMLElement | null>>>({});

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

  const groupedDrinkProducts = DRINK_SECTION_ORDER.map((section) => ({
    key: section,
    label: (DRINK_SECTION_LABELS[lang] || DRINK_SECTION_LABELS.sq)[section],
    products: filteredProducts.filter((product) => getDrinkSectionKey(product) === section),
  })).filter((section) => section.products.length > 0);

  useEffect(() => {
    if (activeCategory !== "Bevande" || !pendingDrinkSection) {
      return;
    }

    const targetSection = drinkSectionRefs.current[pendingDrinkSection];
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingDrinkSection(null);
    }
  }, [activeCategory, pendingDrinkSection, groupedDrinkProducts]);

  const handleCategoryClick = (key: CategoryKey) => {
    if (key === "Bevande") {
      setActiveCategory("Bevande");
      setIsDrinkModalOpen(true);
      return;
    }

    setIsDrinkModalOpen(false);
    setPendingDrinkSection(null);
    setActiveCategory(key);
  };

  const handleDrinkSectionSelect = (section: DrinkSectionKey) => {
    setActiveCategory("Bevande");
    setPendingDrinkSection(section);
    setIsDrinkModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="relative overflow-hidden border-b py-16 md:py-24">
        <div className="absolute inset-0">
          <img
            src={`${import.meta.env.BASE_URL}images/menu-hero2.jpg`}
            alt=""
            className="h-full w-full object-cover object-center"
            fetchpriority="high"
            decoding="async"
          />
          <div className="absolute inset-0 bg-black/15" />
          <div
            className="absolute inset-0 bg-[radial-gradient(ellipse_95%_75%_at_50%_42%,rgba(0,0,0,0.38)_0%,rgba(0,0,0,0.1)_58%,rgba(0,0,0,0.18)_100%)]"
            aria-hidden
          />
        </div>

        <div className="container relative z-10 mx-auto flex justify-center px-4 md:px-6">
          <div className="max-w-2xl rounded-2xl border border-white/10 bg-black/10 px-8 py-9 text-center shadow-[0_16px_40px_-16px_rgba(0,0,0,0.28)] backdrop-blur-[2px] md:max-w-3xl md:px-12 md:py-11">
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-serif text-4xl font-bold tracking-tight text-balance text-white [text-shadow:0_2px_20px_rgba(0,0,0,0.4)] md:text-6xl md:tracking-tight"
            >
              {t.menu.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="mx-auto mt-5 max-w-xl text-pretty text-base font-medium leading-relaxed tracking-wide text-white [text-shadow:0_1px_14px_rgba(0,0,0,0.5)] md:mt-6 md:max-w-2xl md:text-xl md:leading-relaxed md:tracking-[0.02em]"
            >
              {t.menu.subtitle}
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Categories */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
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
        {activeCategory === "Bevande" ? (
          <div className="space-y-12">
            {groupedDrinkProducts.map((section) => (
              <section
                key={section.key}
                ref={(element) => {
                  drinkSectionRefs.current[section.key] = element;
                }}
                className="scroll-mt-24 space-y-6"
              >
                <div className="flex items-center gap-4">
                  <h2 className="font-serif text-2xl font-bold md:text-3xl">{section.label}</h2>
                  <div className="h-px flex-1 bg-border" />
                </div>

                <motion.div
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {section.products.map((product, index) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={index}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              </section>
            ))}
          </div>
        ) : (
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
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-lg">
            {t.menu.noProducts}
          </div>
        )}
      </div>

      <Dialog open={isDrinkModalOpen} onOpenChange={setIsDrinkModalOpen}>
        <DialogContent className="overflow-hidden border-border/70 bg-background p-0 shadow-2xl sm:max-w-xl">
          <div className="border-b border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/20 px-6 py-6 sm:px-8">
            <DialogTitle className="font-serif text-3xl leading-tight text-foreground">
              {DRINK_MODAL_TITLES[lang] || DRINK_MODAL_TITLES.sq}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Zgjidh një kategori pijesh.
            </DialogDescription>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:gap-4 sm:p-6">
            {groupedDrinkProducts.map((section) => (
              <button
                key={section.key}
                type="button"
                className="group flex min-h-[88px] items-center justify-between rounded-2xl border border-border/70 bg-card px-5 py-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                onClick={() => handleDrinkSectionSelect(section.key)}
              >
                <span className="font-serif text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                  {section.label}
                </span>
                <span className="text-lg font-semibold text-primary transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
