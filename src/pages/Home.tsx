import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { animate, motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InstagramReelsCarousel, type InstagramReel } from "@/components/social/InstagramReelsCarousel";
import { ArrowRight, Utensils, Clock, MapPin, ChefHat, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Language } from "@/lib/translations";

const PHONE = "+38349976100";
const PHONE_DISPLAY = "+383 49 976 100";
const OPEN_HOUR = 11;
const CLOSE_HOUR = 24;

const publicImage = (path: string) => `${import.meta.env.BASE_URL}${path}`;
/** Sfond seksionit të testimonialeve — përdor foto të gjerë (p.sh. ≥1920px); skedar i vogël zmadhohet në ekran dhe duket i turbullt. */
const TESTIMONIALS_BG = "images/testimonials-background.jpg";
/** Fotot e seksionit të historisë (pizzaiolo). */
const STORY_PIZZAIOLO_IMAGES = ["images/picaolo.webp", "images/pizzaiolo.png"] as const;
/** Intervali i ndërrimit të fotove (5 sekonda). */
const STORY_PIZZAIOLO_ROTATE_MS = 5 * 1000;

/** Shembull me video lokale (pa UI Instagram): shto videoSrc: "videos/emri.mp4" dhe opsionale posterSrc. */
const INSTAGRAM_REELS: InstagramReel[] = [
  {
    id: "deil6troq2s",
    permalink: "https://www.instagram.com/reel/DEIL6troQ2s/",
    label: "Reel i zgjedhur",
  },
  {
    id: "c_pqkqoin38",
    permalink: "https://www.instagram.com/reel/C_pqkqoIn38/",
    label: "Reel i dyte",
  },
  {
    id: "c_tg7hlo5l4",
    permalink: "https://www.instagram.com/reel/C_TG7hlo5L4/",
    label: "Reel i trete",
  },
  {
    id: "c59bzcklco4",
    permalink: "https://www.instagram.com/reel/C59BZcKLCo4/",
    label: "Reel i katert",
  },
  {
    id: "du_vjjvdb2m",
    permalink: "https://www.instagram.com/reel/DU_vjjVDB2M/",
    label: "Reel i peste",
  },
];

function getHoursStatus(lang: Language) {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  const isOpen = h >= OPEN_HOUR && h < CLOSE_HOUR;

  const totalMinLeft = isOpen ? (CLOSE_HOUR - h) * 60 - m : 0;
  const hLeft = Math.floor(totalMinLeft / 60);
  const mLeft = totalMinLeft % 60;

  const labels: Record<Language, { now: string; timeLabel: string; closesIn: string; closed: string; opensAt: string }> = {
    sq: { now: "Hapur tani 🟢", timeLabel: "Ora aktuale", closesIn: `Mbyllet pas ${hLeft}h ${mLeft}min`, closed: "Mbyllur 🔴", opensAt: "Hapet nesër në 11:00" },
    en: { now: "Open now 🟢", timeLabel: "Current time", closesIn: `Closes in ${hLeft}h ${mLeft}min`, closed: "Closed 🔴", opensAt: "Opens tomorrow at 11:00" },
    it: { now: "Aperto ora 🟢", timeLabel: "Ora attuale", closesIn: `Chiude tra ${hLeft}h ${mLeft}min`, closed: "Chiuso 🔴", opensAt: "Apre domani alle 11:00" },
    de: { now: "Jetzt geöffnet 🟢", timeLabel: "Aktuelle Uhrzeit", closesIn: `Schließt in ${hLeft}h ${mLeft}min`, closed: "Geschlossen 🔴", opensAt: "Öffnet morgen um 11:00" },
    tr: { now: "Şu an açık 🟢", timeLabel: "Şu anki saat", closesIn: `${hLeft}s ${mLeft}dk sonra kapanır`, closed: "Kapalı 🔴", opensAt: "Yarın 11:00'de açılır" },
    fr: { now: "Ouvert maintenant 🟢", timeLabel: "Heure actuelle", closesIn: `Ferme dans ${hLeft}h ${mLeft}min`, closed: "Fermé 🔴", opensAt: "Ouvre demain à 11h00" },
    bs: { now: "Otvoreno sada 🟢", timeLabel: "Trenutno vrijeme", closesIn: `Zatvara se za ${hLeft}h ${mLeft}min`, closed: "Zatvoreno 🔴", opensAt: "Otvara se sutra u 11:00" },
  };

  const l = labels[lang] ?? labels.sq;
  return { isOpen, time, label: isOpen ? l.now : l.closed, timeLabel: l.timeLabel, detail: isOpen ? l.closesIn : l.opensAt };
}

const reserveLabels: Record<Language, { title: string; call: string; or: string }> = {
  sq:  { title: "Bëni një rezervim", call: "Thirr tani", or: "ose" },
  en:  { title: "Make a reservation", call: "Call now", or: "or" },
  it:  { title: "Fai una prenotazione", call: "Chiama ora", or: "o" },
  de:  { title: "Reservierung vornehmen", call: "Jetzt anrufen", or: "oder" },
  tr:  { title: "Rezervasyon yapın", call: "Şimdi ara", or: "veya" },
  fr:  { title: "Faire une réservation", call: "Appeler maintenant", or: "ou" },
  bs:  { title: "Napravite rezervaciju", call: "Pozovite sada", or: "ili" },
};

export default function Home() {
  const [, setLocation] = useLocation();
  const { t: tRaw, lang } = useLanguage();
  const [storyImgIdx, setStoryImgIdx] = useState(0);
  const storyStatsRef = useRef<HTMLDivElement>(null);
  const storyStatsInView = useInView(storyStatsRef, { once: true, margin: "-80px" });
  const storyYearsTarget = useMemo(() => new Date().getFullYear() - 1989, []);
  const [statYears, setStatYears] = useState(0);
  const [statHours, setStatHours] = useState(0);
  // Fallback i sigurt për t
  const t = tRaw || { products: {}, home: {} };
  const localizedProducts = (t.products as Record<string, { name?: string; description?: string }> | undefined) || {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setStoryImgIdx((i) => (i + 1) % STORY_PIZZAIOLO_IMAGES.length);
    }, STORY_PIZZAIOLO_ROTATE_MS);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!storyStatsInView) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStatYears(storyYearsTarget);
      setStatHours(48);
      return;
    }
    const duration = 1.35;
    const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
    const yCtrl = animate(0, storyYearsTarget, {
      duration,
      ease,
      onUpdate: (v) => setStatYears(Math.round(v)),
    });
    const hCtrl = animate(0, 48, {
      duration,
      ease,
      onUpdate: (v) => setStatHours(Math.round(v)),
    });
    return () => {
      yCtrl.stop();
      hCtrl.stop();
    };
  }, [storyStatsInView, storyYearsTarget]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={`${import.meta.env.BASE_URL}images/hero-oven.png`}
          alt="Wood fired pizza oven"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center text-white px-4 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium tracking-wider uppercase"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            {t.home.heroBadge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 max-w-4xl"
          >
            {t.home.heroTitle}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/80 max-w-2xl mb-10 font-light"
          >
            {t.home.heroSubtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
              onClick={() => setLocation("/menu")}
            >
              {t.home.heroCta} <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-14 md:py-20 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">
                {t.home.storyTitle}
              </h2>
              <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
                <p>{t.home.storyP1}</p>
                <p>{t.home.storyP2}</p>
              </div>
              <div ref={storyStatsRef} className="flex items-center gap-6 pt-4">
                <div className="flex flex-col">
                  <span className="font-serif text-4xl font-bold text-primary tabular-nums">
                    {statYears < storyYearsTarget ? statYears : `${storyYearsTarget}+`}
                  </span>
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground mt-1">{t.home.storyYears}</span>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="flex flex-col">
                  <span className="font-serif text-4xl font-bold text-primary tabular-nums">{statHours}h</span>
                  <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground mt-1">{t.home.storyFerment}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative mb-16 md:mb-0"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={publicImage(STORY_PIZZAIOLO_IMAGES[storyImgIdx])}
                  alt="Pizzaiolo at work"
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = publicImage("images/pizzaiolo.png");
                  }}
                />
              </div>
              <div className="absolute z-10 max-w-[min(280px,calc(100%-1.5rem))] rounded-xl border border-border bg-card/95 p-4 shadow-xl backdrop-blur-sm sm:p-6 md:max-w-[240px] bottom-0 left-3 translate-y-12 sm:left-4 md:translate-y-0 md:-bottom-8 md:-left-8">
                <ChefHat className="mb-3 h-7 w-7 text-primary sm:mb-4 sm:h-8 sm:w-8" />
                <p className="font-serif text-base font-medium leading-snug sm:text-lg sm:leading-tight">
                  &ldquo;{t.home.storyQuote}&rdquo;
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Atmosfera/Instagram Carousel Section */}
      <section className="bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <InstagramReelsCarousel
            reels={INSTAGRAM_REELS}
            heading={t.home.atmosphereTitle || "Atmosfera që sjellim ne"}
            subheading={t.home.atmosphereSubtitle || "Përjetoni magjinë e vërtetë të Napolit në Prizren."}
          />
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-10 md:py-16 bg-muted/10 border-b border-border/50">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-center mb-8">{t.home.galleryTitle || "Galeria"}</h2>
          <div className="flex gap-6 overflow-x-auto pb-2 no-scrollbar hide-scrollbar">
            {[
              "galleri-1.jpg",
              "galleri-2.jpg",
              "galleri-3.jpg",
              "galleri-4.jpg",
              "galleri-5.jpg",
              "galleri-6.jpg",
              "galleri-7.jpg",
              "galleri-8.jpg",
              "galleri-9.jpg",
            ].map((img, i) => (
              <div key={img} className="rounded-xl overflow-hidden shadow-lg min-w-[260px] max-w-[320px] flex-shrink-0">
                <img
                  src={`${import.meta.env.BASE_URL}images/${img}`}
                  alt={`Galeria ${i + 1}`}
                  className="w-full h-96 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative isolate overflow-hidden py-14 md:py-20">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src={publicImage(TESTIMONIALS_BG)}
            alt=""
            className="h-full w-full object-cover object-center"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-10 space-y-3"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold">{t.home.testimonialsTitle}</h2>
            <p className="text-lg text-muted-foreground">{t.home.testimonialsSubtitle}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Facebook */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0 }}
              className="rounded-2xl border border-border/30 bg-background/22 p-8 backdrop-blur-md shadow-md shadow-black/6 dark:bg-background/22 dark:shadow-black/20 flex flex-col gap-5 hover:bg-background/34 hover:shadow-lg transition-[box-shadow,background-color] cursor-pointer"
              onClick={() => window.open("https://www.facebook.com/share/17Xivws7xJ/?mibextid=wwXIfr", "_blank")}
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div
                  className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/60"
                  aria-label="5 / 5"
                >
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1877F2]/10 text-[#1877F2]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  <span className="text-xs font-semibold">Facebook</span>
                </div>
              </div>
              <p className="text-foreground leading-relaxed flex-1 font-medium">
                &ldquo;{t.home.reviewFacebook}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <img src={`${import.meta.env.BASE_URL}images/avatar-ardita.jpg`} alt="Ardita Hoxha" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-sm">Ardita Hoxha</p>
                  <p className="text-xs text-muted-foreground">Prizren</p>
                </div>
              </div>
            </motion.div>

            {/* Instagram */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="rounded-2xl border border-border/30 bg-background/22 p-8 backdrop-blur-md shadow-md shadow-black/6 dark:bg-background/22 dark:shadow-black/20 flex flex-col gap-5 hover:bg-background/34 hover:shadow-lg transition-[box-shadow,background-color] cursor-pointer"
              onClick={() => window.open("https://www.instagram.com/napoletana.nostra?igsh=cDV3ZzU2dGo5bG5s", "_blank")}
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div
                  className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/60"
                  aria-label="5 / 5"
                >
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E1306C]/10 text-[#E1306C]">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  <span className="text-xs font-semibold">Instagram</span>
                </div>
              </div>
              <p className="text-foreground leading-relaxed flex-1 font-medium">
                &ldquo;{t.home.reviewInstagram}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <img src={`${import.meta.env.BASE_URL}images/avatar-blerim.jpg`} alt="Blerim Krasniqi" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-sm">@blerim.krasniqi</p>
                  <p className="text-xs text-muted-foreground">Prizren</p>
                </div>
              </div>
            </motion.div>

            {/* TikTok */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-2xl border border-border/30 bg-background/22 p-8 backdrop-blur-md shadow-md shadow-black/6 dark:bg-background/22 dark:shadow-black/20 flex flex-col gap-5 hover:bg-background/34 hover:shadow-lg transition-[box-shadow,background-color] cursor-pointer"
              onClick={() => window.open("https://www.tiktok.com/@napoletana.nostra?_r=1&_t=ZS-95GN6BUOGnZ", "_blank")}
            >
              <div className="flex items-center justify-center gap-2 flex-wrap">
                <div
                  className="inline-flex items-center gap-0.5 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/60"
                  aria-label="5 / 5"
                >
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-3.5 w-3.5 shrink-0 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-foreground/5 text-foreground">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.54V6.78a4.85 4.85 0 01-1.02-.09z"/></svg>
                  <span className="text-xs font-semibold">TikTok</span>
                </div>
              </div>
              <p className="text-foreground leading-relaxed flex-1 font-medium">
                &ldquo;{t.home.reviewTikTok}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-border">
                <img src={`${import.meta.env.BASE_URL}images/avatar-genta.jpg`} alt="Genta Prizren" className="w-10 h-10 rounded-full object-cover shrink-0" />
                <div>
                  <p className="font-semibold text-sm">@genta_prizren</p>
                  <p className="text-xs text-muted-foreground">Prizren</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Removed duplicate InstagramReelsCarousel at the end */}

      {/* Info Section */}
      <section className="relative overflow-hidden py-14 md:py-20">
        <div className="absolute inset-0 z-0 bg-primary/5" />
        <div className="container relative z-10 mx-auto px-4 md:px-6">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-xl md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center divide-y md:divide-y-0 md:divide-x divide-border">
              <a
                href="https://maps.app.goo.gl/UnXT5EhxT7uk8Y6L6?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center space-y-4 pt-8 md:pt-0 group"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors">{t.home.infoWhere}</h3>
                <p className="text-muted-foreground">Marin Barleti 2<br />Prizren, Kosovo 20000</p>
              </a>

              {/* Hours — clickable popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex flex-col items-center space-y-4 pt-8 md:pt-0 group cursor-pointer w-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Clock className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors">{t.home.infoHours}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t.home.infoHoursVal}</p>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 text-center space-y-3 p-5">
                  {(() => {
                    const s = getHoursStatus(lang);
                    return (
                      <>
                        <p className="font-semibold text-base">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.timeLabel}: <span className="font-mono font-bold text-foreground">{s.time}</span></p>
                        <p className="text-sm text-muted-foreground">{s.detail}</p>
                      </>
                    );
                  })()}
                </PopoverContent>
              </Popover>

              {/* Reservations — clickable popover */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex flex-col items-center space-y-4 pt-8 md:pt-0 group cursor-pointer w-full">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Utensils className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif text-2xl font-bold group-hover:text-primary transition-colors">{t.home.infoReservations}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{t.home.infoReservationsVal}</p>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-5 space-y-4">
                  <p className="font-serif font-semibold text-center text-base">{(reserveLabels[lang] ?? reserveLabels.sq).title}</p>
                  <a
                    href={`tel:${PHONE}`}
                    className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 bg-primary text-white font-medium text-sm hover:bg-primary/90 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    {(reserveLabels[lang] ?? reserveLabels.sq).call}
                  </a>
                  <p className="text-center text-xs text-muted-foreground">{(reserveLabels[lang] ?? reserveLabels.sq).or}</p>
                  <a
                    href={`https://wa.me/${PHONE.replace("+", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full rounded-full py-2.5 bg-[#25D366] text-white font-medium text-sm hover:bg-[#22c55e] transition-colors"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    WhatsApp
                  </a>
                  <p className="text-center text-xs text-muted-foreground font-mono">{PHONE_DISPLAY}</p>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
