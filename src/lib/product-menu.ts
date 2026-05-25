/**
 * Emrat dhe përbërësit sipas menusë së printuar (Napoletana NOSTRA) — 1:1 me menynë fizike.
 */
export const menuProductLabels: Record<string, { name: string; description: string }> = {
  bruschetta: {
    name: "BRUSCHETTA CLASSICA",
    description: "DOMATE, ULLINJE, BORZILOK",
  },
  "insalata-verde": {
    name: "INSALATA VERDE",
    description: "MARULLE, QEPË, ULLINJ",
  },
  "insalata-rucola": {
    name: "INSALATA RUCOLA",
    description: "RUCOLA, DOMATINA, GRANA PADANO, ARRA, RRUSH I TERUR",
  },
  "insalata-caprese": {
    name: "INSALATA CAPRESE TRICOLORE",
    description: "DJATH MOZZARELLA, DOMATE, BORZILOK",
  },

  "rigatoni-arrabiata": {
    name: "RIGATONI ALL'ARRABIATA",
    description: "SALCE DOMATESH, SPEC DJEGES, BORZILOK",
  },
  "linguine-scampi": {
    name: "LINGUINE CON SCAMPI",
    description: "KARKALECA, BORZILOK",
  },
  "spaghetti-aglio-olio": {
    name: "SPAGHETTI AGLIO, OLIO E PEPERONCINO",
    description: "HUDHER, VAJ ULLIRI, SPEC DJEGES",
  },
  "linguine-pesto": {
    name: "LINGUINE AL PESTO GENOVESE",
    description: "SALCE PESTO, HUDHER, KREM",
  },
  "spaghetti-bolognese": {
    name: "SPAGHETTI BOLOGNESE",
    description: "SALCE BOLONJEZE, GRANA PADANO, BORZILOK",
  },
  "tortellini-quattro-formaggi": {
    name: "TORTELLINI QUATTRO FORMAGGI",
    description: "MOZZARELLA, GRANA PADANO, GORGONZOLA, DJATHE I BARDHE",
  },
  "lasagne-casa": {
    name: "LASAGNE DELLA CASA",
    description: "",
  },

  marinara: {
    name: "MARINARA",
    description: "SALCE DOMATESH, HUDHER, BORZILOK, VAJ ULLIRI, ORIGANO",
  },
  "margherita-classica": {
    name: "MARGHERITA CLASSICA",
    description: "SALCE DOMATESH, MOZZARELLA, BORZILOK, VAJ ULLIRI",
  },
  funghi: {
    name: "FUNGHI",
    description: "SALCE DOMATESH, MOZZARELLA, KERPUDHA, BORZILOK",
  },
  "prosciutto-funghi": {
    name: "PROSCIUTTO E FUNGHI",
    description: "SALCE DOMATESH, MOZZARELLA, PROSHUTE, KERPUDHA",
  },
  diavola: {
    name: "DIAVOLA",
    description: "SALCE DOMATESH, MOZZARELLA, SUXHUK DJEGES, SPEC, ULLINJ, BOZILOK",
  },
  "quattro-formaggi": {
    name: "QUATTRO FORMAGGI",
    description: "SALCE DOMATESH, MOZZARELLA, GRANA PADANO, GORGONZOLA, DJATHE I BARDHE",
  },
  napoli: {
    name: "NAPOLI",
    description: "SALCE DOMATESH, MOZZARELLA, PESHK ACUGE (E KRIPOSUR), KAPERI",
  },
  "tonno-cipolla": {
    name: "TONNO E CIPOLLA",
    description: "SALCE DOMATESH, MOZZARELLA, PESHK TUNA, QEPE",
  },
  primavera: {
    name: "PRIMAVERA",
    description:
      "SALCE DOMATESH, MOZZARELLA, SPEC I KUQ JO DJEGES, KUNGULLESHE, PATELLXHAN I ZI, KERPUDHA, QEPE E KUQE, ULLINJ",
  },
  rucola: {
    name: "RUCOLA",
    description: "SALCE DOMATESH, MOZZARELLA, DOMATINA, PROSHUTE, RUCOLA, GRANA PADANO",
  },
  capricciosa: {
    name: "CAPRICIOSA",
    description: "SALCE DOMATESH, MOZZARELLA, PROSHUTE, ANGJINARE, KERPUDHA, ULLINJ",
  },
  enrico: {
    name: "ENRICO",
    description: "SALCE DOMATESH, MOZZARELLA, PROSHUTE, GORGONZOLA, DOMATINA, GRANA PADANO",
  },
  tartufina: {
    name: "TARTUFINA",
    description: "SALCE DOMATESH, MOZZARELLA, KEPURDHA, SALCE TARTUFI, VAJ ULLIRI, BORZILOK",
  },
  burratina: {
    name: "BURRATINA",
    description: "SALCE DOMATESH, MOZZARELLA, PROSHUTE, RUCOLA, GRANA PADANO BURRATINA",
  },

  tiramisu: { name: "TIRAMISU", description: "" },
  "panna-cotta": { name: "PANNA COTTA", description: "" },

  "coca-cola": { name: "COCA COLA", description: "" },
  "coca-cola-zero": { name: "COCA COLA ZERO", description: "" },
  fanta: { name: "FANTA", description: "" },
  sprite: { name: "SPRITE", description: "" },
  schweppes: { name: "SCHWEPPES", description: "" },
  tonic: { name: "TONIC", description: "" },
  "ice-tea": { name: "ICE TEA", description: "" },
  juices: { name: "JUICES", description: "" },

  "water-025": { name: "UJË NATYRAL MINERAL 250 ML", description: "" },
  "water-075": { name: "UJË NATYRAL MINERAL 750 ML", description: "" },
  "mineral-water-025": { name: "UJË MINERAL NATYRAL 250 ML", description: "" },
  "mineral-water-075": { name: "UJË MINERAL NATYRAL 750 ML", description: "" },

  "peja-draught-03": { name: "PEJA DRAUGHT 0.3", description: "" },
  "peja-draught-05": { name: "PEJA DRAUGHT 0.5", description: "" },
  heineken: { name: "HEINEKEN", description: "" },
  "peja-bottle": { name: "PEJA BOTTLE", description: "" },
  "peroni-nastro-azzurro": { name: "PERONI NASTRO AZZURRO", description: "" },
  paulaner: { name: "PAULANER", description: "" },
  "bavaria-00": { name: "BAVARIA 0.0%", description: "" },

  "vino-bianco": { name: "GLASS OF WHITE WINE", description: "" },
  "stone-chardonnay-0187": { name: "STONE CASTLE CHARDONNAY 0.187", description: "" },
  "tarani-0187": { name: "TARANI 0.187", description: "" },
  "theranda-alba-0187": { name: "THERANDA ALBA 0.187", description: "" },
  "stone-chardonnay-075": { name: "STONE CASTLE CHARDONNAY 0.75", description: "" },
  "pinot-grigio-075": { name: "PINOT GRIGIO 0.75", description: "" },
  "theranda-chardonnay-075": { name: "THERANDA CHARDONNAY 0.75", description: "" },
  "hisari-white-075": { name: "HISARI WHITE 0.75", description: "" },
  "she-white-075": { name: "SHE WHITE 0.75", description: "" },

  "vino-rosso": { name: "GLASS OF RED WINE", description: "" },
  "stone-cabernet-0187": { name: "STONE CASTLE CABERNET SAUVIGNON 0.187", description: "" },
  "theranda-tramonto-0187": { name: "THERANDA TRAMONTO 0.187", description: "" },
  "stone-cabernet-075": { name: "STONE CASTLE CABERNET SAUVIGNON 0.75", description: "" },
  "theranda-cabernet-075": { name: "THERANDA CABERNET SAUVIGNON 0.75", description: "" },
  "pinot-noir-075": { name: "PINOT NOIR 0.75", description: "" },
  "hisari-red-075": { name: "HISARI RED 0.75", description: "" },
  "stone-riserva-075": { name: "STONE RISERVA 0.75", description: "" },
  "she-red-075": { name: "SHE RED 0.75", description: "" },

  "campari-soda-orange": { name: "CAMPARI SODA / ORANGE", description: "" },
  "aperol-spritz": { name: "APEROL SPRITZ", description: "" },
};
