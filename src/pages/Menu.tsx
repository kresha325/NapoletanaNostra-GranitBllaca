import { useState, useEffect, useRef } from "react";
import { menuData, type Product } from "@/lib/data";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { usePageSeo } from "@/lib/seo";
import { MenuFoodSection } from "@/components/menu/MenuFoodSection";
import { MenuDrinkSection } from "@/components/menu/MenuDrinkSection";
import { MENU_DRINK, MENU_FOOD } from "@/components/menu/menu-theme";
import { MenuBrandLogo } from "@/components/menu/MenuBrandLogo";

type CategoryKey = "" | Product["category"];
type DrinkSectionKey = "soft-drinks" | "waters" | "beers" | "vino-bianco" | "vino-rosso" | "aperitivo";
type FoodCategory = Exclude<Product["category"], "Bevande">;

const CATEGORY_KEYS: CategoryKey[] = ["", "Pizza", "Pasta", "Antipasti", "Dolci", "Bevande"];
const FOOD_CATEGORY_ORDER: FoodCategory[] = ["Antipasti", "Pasta", "Pizza", "Dolci"];
const FOOD_LEFT_COLUMN: FoodCategory[] = ["Antipasti", "Pasta"];
const FOOD_RIGHT_COLUMN: FoodCategory[] = ["Pizza", "Dolci"];

const DRINK_SECTION_ORDER: DrinkSectionKey[] = [
  "soft-drinks",
  "waters",
  "beers",
  "vino-bianco",
  "vino-rosso",
  "aperitivo",
];

const DRINK_SECTION_LAYOUT: Record<DrinkSectionKey, "two-column" | "single-column"> = {
  "soft-drinks": "two-column",
  waters: "two-column",
  beers: "single-column",
  "vino-bianco": "two-column",
  "vino-rosso": "two-column",
  aperitivo: "single-column",
};

const DRINK_SECTION_KEYS: Record<DrinkSectionKey, string[]> = {
  "soft-drinks": ["coca-cola", "coca-cola-zero", "fanta", "sprite", "schweppes", "tonic", "ice-tea", "juices"],
  waters: ["water-075", "mineral-water-075", "water-025", "mineral-water-025"],
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
  const { t } = useLanguage();
  const drinkSectionRefs = useRef<Partial<Record<DrinkSectionKey, HTMLElement | null>>>({});

  const isDrinkView = activeCategory === "Bevande";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  usePageSeo({
    title: "Menyja — Pizza napolitane Prizren | Napoletana Nostra",
    description:
      "Menyja e plotë: pizza napolitane, pasta, antipasti, ëmbëlsira dhe pije në Napoletana Nostra, Prizren.",
    path: "/menu",
  });

  const filteredProducts = menuData.filter((product) =>
    activeCategory === "" ? true : product.category === activeCategory
  );

  const getCategoryLabel = (key: CategoryKey) => {
    if (key === "") return t.menu.all;
    return t.categories?.[key] || key;
  };

  const getFoodSectionTitle = (category: FoodCategory) => t.menu.foodSections[category];

  const getDrinkSectionLabel = (section: DrinkSectionKey) => t.menu.drinkSections[section];

  const groupedFoodSections = FOOD_CATEGORY_ORDER.map((category) => ({
    category,
    title: getFoodSectionTitle(category),
    products: menuData.filter((product) => product.category === category),
  })).filter((section) => {
    if (activeCategory !== "" && activeCategory !== "Bevande") {
      return section.category === activeCategory;
    }
    if (activeCategory === "Bevande") {
      return false;
    }
    return section.products.length > 0;
  });

  const groupedDrinkProducts = DRINK_SECTION_ORDER.map((section) => ({
    key: section,
    label: getDrinkSectionLabel(section),
    layout: DRINK_SECTION_LAYOUT[section],
    products: filteredProducts.filter((product) => getDrinkSectionKey(product) === section),
  })).filter((section) => section.products.length > 0);

  const allGroupedDrinkProducts = DRINK_SECTION_ORDER.map((section) => ({
    key: section,
    label: getDrinkSectionLabel(section),
    layout: DRINK_SECTION_LAYOUT[section],
    products: menuData.filter(
      (product) => product.category === "Bevande" && getDrinkSectionKey(product) === section
    ),
  })).filter((section) => section.products.length > 0);

  const renderDrinkSections = (
    sections: Array<{
      key: DrinkSectionKey;
      label: string;
      layout: "two-column" | "single-column";
      products: Product[];
    }>
  ) => (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:gap-12 lg:grid-cols-2">
      {sections.map((section) => (
        <div
          key={section.key}
          ref={(element) => {
            drinkSectionRefs.current[section.key] = element;
          }}
          className="scroll-mt-24"
        >
          <MenuDrinkSection
            title={section.label}
            products={section.products}
            layout={section.layout}
          />
        </div>
      ))}
    </div>
  );

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
    <div
      className="font-menu min-h-screen flex flex-col transition-colors duration-300"
      style={{ backgroundColor: isDrinkView ? MENU_DRINK.bg : MENU_FOOD.bg }}
    >
      <div
        className={cn("py-6 md:py-8", !isDrinkView && "border-b-0")}
        style={{
          backgroundColor: isDrinkView ? MENU_DRINK.bg : MENU_FOOD.bg,
          borderColor: isDrinkView ? "rgba(255,255,255,0.25)" : "transparent",
        }}
      >
        <div className="container mx-auto px-4 text-center md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center pb-2 md:pb-3"
          >
            <MenuBrandLogo
              variant={isDrinkView ? "drinks" : "food"}
              size="menu"
            />
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-3 pb-8 md:px-6 md:pb-10">
        <h1
          className="mb-3 text-center text-xl font-bold uppercase tracking-[0.12em] md:mb-4 md:text-3xl"
          style={{ color: isDrinkView ? MENU_DRINK.text : MENU_FOOD.title }}
        >
          {t.menu.title}
        </h1>
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2 md:mb-10 md:gap-2.5">
          {CATEGORY_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleCategoryClick(key)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.07em] transition-all duration-300 md:px-5 md:py-2 md:text-xs",
                activeCategory === key
                  ? isDrinkView || key === "Bevande"
                    ? "shadow-md"
                    : "shadow-md"
                  : "bg-transparent hover:opacity-80"
              )}
              style={
                activeCategory === key
                  ? isDrinkView
                    ? {
                        backgroundColor: MENU_DRINK.text,
                        borderColor: MENU_DRINK.text,
                        color: MENU_DRINK.bg,
                      }
                    : {
                        backgroundColor: MENU_FOOD.title,
                        borderColor: MENU_FOOD.title,
                        color: MENU_FOOD.bg,
                      }
                  : isDrinkView
                    ? {
                        borderColor: "rgba(255,255,255,0.55)",
                        color: MENU_DRINK.text,
                      }
                    : {
                        borderColor: MENU_FOOD.border,
                        color: MENU_FOOD.title,
                      }
              }
            >
              {getCategoryLabel(key)}
            </button>
          ))}
        </div>

        {isDrinkView ? (
          renderDrinkSections(groupedDrinkProducts)
        ) : activeCategory === "" ? (
          <>
            <div className="mx-auto grid max-w-6xl grid-cols-1 items-start gap-y-10 md:gap-y-12 lg:grid-cols-2 lg:gap-x-6">
              <div className="flex flex-col gap-10 md:gap-12">
                {groupedFoodSections
                  .filter((section) => FOOD_LEFT_COLUMN.includes(section.category))
                  .map((section) => (
                    <MenuFoodSection
                      key={section.category}
                      title={section.title}
                      products={section.products}
                    />
                  ))}
              </div>
              <div className="flex flex-col gap-10 md:gap-12">
                {groupedFoodSections
                  .filter((section) => FOOD_RIGHT_COLUMN.includes(section.category))
                  .map((section) => (
                    <MenuFoodSection
                      key={section.category}
                      title={section.title}
                      products={section.products}
                    />
                  ))}
              </div>
            </div>

            {allGroupedDrinkProducts.length > 0 ? (
              <div
                className="relative left-1/2 mt-10 w-screen max-w-[100vw] -translate-x-1/2 px-3 py-10 transition-colors duration-300 md:mt-12 md:py-14"
                style={{ backgroundColor: MENU_DRINK.bg }}
              >
                <div className="mx-auto max-w-6xl md:px-3">
                  {renderDrinkSections(allGroupedDrinkProducts)}
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-10 md:gap-12">
            {groupedFoodSections.map((section) => (
              <MenuFoodSection
                key={section.category}
                title={section.title}
                products={section.products}
              />
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div
            className="py-24 text-center text-lg"
            style={{ color: isDrinkView ? MENU_DRINK.text : MENU_FOOD.title }}
          >
            {t.menu.noProducts}
          </div>
        )}
      </div>

      <Dialog open={isDrinkModalOpen} onOpenChange={setIsDrinkModalOpen}>
        <DialogContent
          className="font-menu overflow-hidden border-0 p-0 shadow-2xl sm:max-w-xl"
          style={{ backgroundColor: MENU_DRINK.bg }}
        >
          <div className="border-b px-6 py-6 sm:px-8" style={{ borderColor: "rgba(255,255,255,0.2)" }}>
            <DialogTitle
              className="text-2xl font-bold uppercase tracking-[0.1em] md:text-3xl"
              style={{ color: MENU_DRINK.text }}
            >
              {t.menu.drinkModalTitle}
            </DialogTitle>
            <DialogDescription className="sr-only">Zgjidh një kategori pijesh.</DialogDescription>
          </div>

          <div className="grid grid-cols-1 gap-3 p-5 sm:grid-cols-2 sm:gap-4 sm:p-6">
            {groupedDrinkProducts.map((section) => (
              <button
                key={section.key}
                type="button"
                className="rounded-2xl border px-5 py-4 text-left transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                style={{
                  borderColor: MENU_DRINK.border,
                  color: MENU_DRINK.text,
                  backgroundColor: "rgba(255,255,255,0.06)",
                }}
                onClick={() => handleDrinkSectionSelect(section.key)}
              >
                <span className="text-lg font-bold uppercase tracking-[0.08em]">
                  {section.label}
                </span>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
