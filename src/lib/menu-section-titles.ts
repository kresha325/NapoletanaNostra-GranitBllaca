type Language = "sq" | "en" | "it" | "de" | "tr" | "fr" | "bs";

export type MenuFoodSectionKey = "Antipasti" | "Pasta" | "Pizza" | "Dolci";

export type MenuDrinkSectionKey =
  | "soft-drinks"
  | "waters"
  | "beers"
  | "vino-bianco"
  | "vino-rosso"
  | "aperitivo";

export const menuFoodSectionTitlesByLang: Record<Language, Record<MenuFoodSectionKey, string>> = {
  sq: {
    Antipasti: "ANTIPASTI",
    Pasta: "PASTA JONË",
    Pizza: "PICAT TONA",
    Dolci: "ËMBËLSIRA",
  },
  en: {
    Antipasti: "APPETIZERS",
    Pasta: "OUR PASTA",
    Pizza: "OUR PIZZAS",
    Dolci: "DESSERTS",
  },
  it: {
    Antipasti: "ANTIPASTI",
    Pasta: "LA NOSTRA PASTA",
    Pizza: "LE NOSTRE PIZZE",
    Dolci: "DOLCI",
  },
  de: {
    Antipasti: "VORSPEISEN",
    Pasta: "UNSERE PASTA",
    Pizza: "UNSERE PIZZEN",
    Dolci: "DESSERTS",
  },
  tr: {
    Antipasti: "MEZELER",
    Pasta: "PASTAMIZ",
    Pizza: "PİZZALARIMIZ",
    Dolci: "TATLILAR",
  },
  fr: {
    Antipasti: "ENTRÉES",
    Pasta: "NOS PÂTES",
    Pizza: "NOS PIZZAS",
    Dolci: "DESSERTS",
  },
  bs: {
    Antipasti: "PREDJELA",
    Pasta: "NAŠA PASTA",
    Pizza: "NAŠE PICE",
    Dolci: "DEZERTI",
  },
};

export const menuDrinkSectionTitlesByLang: Record<Language, Record<MenuDrinkSectionKey, string>> = {
  sq: {
    "soft-drinks": "PIJET",
    waters: "UJË",
    beers: "BIRRA",
    "vino-bianco": "VINO BIANCO",
    "vino-rosso": "VINO ROSSO",
    aperitivo: "APERITIVO",
  },
  en: {
    "soft-drinks": "DRINKS",
    waters: "WATER",
    beers: "BEER",
    "vino-bianco": "WHITE WINE",
    "vino-rosso": "RED WINE",
    aperitivo: "APERITIVO",
  },
  it: {
    "soft-drinks": "BEVANDE",
    waters: "ACQUA",
    beers: "BIRRA",
    "vino-bianco": "VINO BIANCO",
    "vino-rosso": "VINO ROSSO",
    aperitivo: "APERITIVO",
  },
  de: {
    "soft-drinks": "GETRÄNKE",
    waters: "WASSER",
    beers: "BIER",
    "vino-bianco": "WEISSWEIN",
    "vino-rosso": "ROTWEIN",
    aperitivo: "APERITIV",
  },
  tr: {
    "soft-drinks": "İÇECEKLER",
    waters: "SU",
    beers: "BİRA",
    "vino-bianco": "BEYAZ ŞARAP",
    "vino-rosso": "KIRMIZI ŞARAP",
    aperitivo: "APERİTİF",
  },
  fr: {
    "soft-drinks": "BOISSONS",
    waters: "EAUX",
    beers: "BIÈRES",
    "vino-bianco": "VIN BLANC",
    "vino-rosso": "VIN ROUGE",
    aperitivo: "APÉRITIF",
  },
  bs: {
    "soft-drinks": "PIĆA",
    waters: "VODE",
    beers: "PIVA",
    "vino-bianco": "BIJELO VINO",
    "vino-rosso": "CRNO VINO",
    aperitivo: "APERITIV",
  },
};

export const menuDrinkModalTitlesByLang: Record<Language, string> = {
  sq: "Kategoritë e pijeve",
  en: "Drink Categories",
  it: "Categorie Bevande",
  de: "Getränkekategorien",
  tr: "İçecek Kategorileri",
  fr: "Catégories de boissons",
  bs: "Kategorije pića",
};
