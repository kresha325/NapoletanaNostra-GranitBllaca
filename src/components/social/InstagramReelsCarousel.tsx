import { useCallback, useEffect, useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";

import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export type InstagramReel = {
  id: string;
  permalink: string;
  label: string;
  /**
   * Path nën `public/` (p.sh. `videos/reel-1.mp4`) ose URL HTTPS.
   * Nëse është vendosur, luhet me `<video>` pa UI të Instagram-it.
   */
  videoSrc?: string;
  /** Opsionale: poster para luajtjes (path nën `public/` ose URL) */
  posterSrc?: string;
};

type InstagramReelsCarouselProps = {
  reels: InstagramReel[];
  heading: string;
  subheading: string;
  /** e.g. napoletana.nostra (without @) */
  profileHandle?: string;
  /** Path under public/, e.g. images/logo.png */
  profileAvatarSrc?: string;
  profileSubtitle?: string;
};

declare global {
  interface Window {
    instgrm?: {
      Embeds?: {
        process: () => void;
      };
    };
  }
}

let instagramScriptPromise: Promise<void> | null = null;

function loadInstagramScript() {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.instgrm?.Embeds) {
    return Promise.resolve();
  }

  if (instagramScriptPromise) {
    return instagramScriptPromise;
  }

  instagramScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-instgrm-script="true"]'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", () => reject(new Error("Instagram embed script failed to load")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.setAttribute("data-instgrm-script", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Instagram embed script failed to load"));
    document.body.appendChild(script);
  });

  return instagramScriptPromise;
}

function getReelShortcode(permalink: string): string | null {
  const match = permalink.match(/instagram\.com\/(?:reel|p|tv)\/([^/?#]+)/i);
  return match?.[1] ?? null;
}

/** Distanca më e shkurtrë në indeks për efekt cilindrik kur loop është aktiv */
function circularSlideOffset(index: number, center: number, length: number, loop: boolean): number {
  if (length <= 1) return 0;
  if (!loop) return index - center;
  let d = index - center;
  while (d > length / 2) d -= length;
  while (d < -length / 2) d += length;
  return d;
}

function cylinderTransform(offset: number): { transform: string; opacity: number; zIndex: number } {
  const abs = Math.abs(offset);
  const capped = Math.min(abs, 3);
  const anglePer = 26;
  const rawAngle = -offset * anglePer;
  /** Mbi ~50° fillon të duket “mbrapa” e kartës — mos e kalojmë */
  const maxAngleDeg = 44;
  const angle = Math.sign(rawAngle) * Math.min(Math.abs(rawAngle), maxAngleDeg);
  const translateZ = -capped * 52 - abs * 4;
  const scale = 1 - Math.min(capped, 3) * 0.05;
  const opacity = 1 - Math.min(abs, 3) * 0.09;
  return {
    transform: `rotateY(${angle}deg) translateZ(${translateZ}px) scale(${scale})`,
    opacity: Math.max(0.55, opacity),
    zIndex: 30 - abs,
  };
}

function resolvePublicMediaUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = import.meta.env.BASE_URL;
  const path = pathOrUrl.replace(/^\//, "");
  return `${base}${path}`;
}

function ReelMedia({
  permalink,
  label,
  videoSrc,
  posterSrc,
}: {
  permalink: string;
  label: string;
  videoSrc?: string;
  posterSrc?: string;
}) {
  const shortcode = useMemo(() => getReelShortcode(permalink), [permalink]);
  const embedSrc = shortcode ? `https://www.instagram.com/reel/${shortcode}/embed/?captioned=0` : null;

  useEffect(() => {
    if (videoSrc || embedSrc) return;
    loadInstagramScript()
      .then(() => window.instgrm?.Embeds?.process())
      .catch(() => undefined);
  }, [videoSrc, embedSrc, permalink]);

  if (videoSrc) {
    const src = resolvePublicMediaUrl(videoSrc);
    const poster = posterSrc ? resolvePublicMediaUrl(posterSrc) : undefined;
    return (
      <video
        className="absolute inset-0 z-[1] h-full w-full touch-manipulation object-cover bg-black"
        src={src}
        poster={poster}
        controls
        playsInline
        preload="metadata"
        title={label}
      >
        Video
      </video>
    );
  }

  if (embedSrc) {
    return (
      <iframe
        title={label}
        src={embedSrc}
        className="absolute inset-0 z-[1] h-full w-full touch-manipulation border-0 bg-black"
        loading="lazy"
        allow="encrypted-media; picture-in-picture; clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <blockquote
      className="instagram-media m-0 w-full max-w-none !min-w-0 border-0 bg-white p-0"
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
    >
      <a href={permalink} target="_blank" rel="noopener noreferrer" className="block p-6 text-center text-sm text-muted-foreground">
        Hap në Instagram
      </a>
    </blockquote>
  );
}

export function InstagramReelsCarousel({
  reels,
  heading,
  subheading,
  profileHandle = "napoletana.nostra",
  profileAvatarSrc = "images/logo.png",
  profileSubtitle = "Prizren · Pica napolitane",
}: InstagramReelsCarouselProps) {
  const base = import.meta.env.BASE_URL;
  const avatarUrl = profileAvatarSrc.startsWith("http") ? profileAvatarSrc : `${base}${profileAvatarSrc}`;

  useEffect(() => {
    if (!reels.length) return;
    const needsBlockquote = reels.some((r) => !r.videoSrc && !getReelShortcode(r.permalink));
    if (!needsBlockquote) return;
    loadInstagramScript()
      .then(() => window.instgrm?.Embeds?.process())
      .catch(() => undefined);
  }, [reels]);

  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!reels.length) {
    return null;
  }

  const handleSelect = (api?: CarouselApi) => {
    if (!api) return;
    setSelectedIndex(api.selectedScrollSnap());
  };

  /** Pa loop: në skaj nuk “kapërcehet” lista dhe efekti 3D mbetet i lexueshëm */
  const loop = false;

  /** Në mobile Embla kap touch-in; për slide-in aktiv lirojmë video/iframe që të marrin play/pause. */
  const reelWatchDrag = useCallback((emblaApi: CarouselApi | undefined, evt: MouseEvent | TouchEvent) => {
    if (!emblaApi) return true;
    const raw = evt.target;
    if (!(raw instanceof Element)) return true;
    const zone = raw.closest("[data-reel-touch-zone]");
    if (!zone) return true;
    const slides = emblaApi.slideNodes();
    const selected = slides[emblaApi.selectedScrollSnap()];
    if (selected?.contains(zone)) return false;
    return true;
  }, []);

  const reelCarouselOpts = useMemo(
    () => ({
      align: "center" as const,
      loop,
      skipSnaps: false,
      watchDrag: reelWatchDrag,
    }),
    [loop, reelWatchDrag]
  );

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-muted/30 via-background to-muted/20 border-y border-border/50 overflow-x-clip">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mx-auto max-w-2xl space-y-3 text-center md:text-left mb-6 md:mb-10">
          <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground tracking-tight">{heading}</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{subheading}</p>
        </div>

        <div
          className="mx-auto max-w-6xl px-6 sm:px-10 md:px-14"
          style={{
            perspective: 1200,
            perspectiveOrigin: "50% 40%",
            transformStyle: "preserve-3d",
          }}
        >
          <Carousel
            opts={reelCarouselOpts}
            setApi={(api) => {
              if (!api) return;
              setSelectedIndex(api.selectedScrollSnap());
              api.on("select", () => handleSelect(api));
            }}
            className="relative"
          >
            <CarouselContent
              viewportClassName="py-6 md:py-12 px-2 sm:px-4"
              className="-ml-2 md:-ml-4 [transform-style:preserve-3d]"
            >
              {reels.map((reel, idx) => {
                const offset = circularSlideOffset(idx, selectedIndex, reels.length, loop);
                const isActive = offset === 0;
                const { transform, opacity, zIndex } = cylinderTransform(offset);

                return (
                  <CarouselItem
                    key={reel.id}
                    style={{ transform, opacity, zIndex }}
                    className={cn(
                      "pl-2 md:pl-4 basis-[88%] sm:basis-[75%] md:basis-1/2 xl:basis-[38%] flex justify-center transition-[transform,opacity] duration-500 ease-out [transform-style:preserve-3d] will-change-transform [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                    )}
                  >
                    <article
                      className={cn(
                        "mx-auto flex w-full max-w-[340px] flex-col overflow-hidden rounded-[1.35rem] bg-card shadow-lg transition-shadow duration-500 [transform-style:preserve-3d]",
                        isActive ? "ring-2 ring-primary shadow-2xl ring-offset-2 ring-offset-background" : "ring-1 ring-border/60"
                      )}
                    >
                    {/* Profile bar — si Instagram */}
                    <header className="flex items-center gap-3 border-b border-border/80 bg-muted/40 px-3.5 py-3">
                      <div className="relative shrink-0">
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-background shadow-sm"
                          onError={(e) => {
                            e.currentTarget.src = `${base}images/margherita.png`;
                          }}
                        />
                        <span
                          className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] ring-2 ring-card"
                          aria-hidden
                        >
                          <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 text-white" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                          </svg>
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-foreground">@{profileHandle}</p>
                        <p className="truncate text-xs text-muted-foreground">{profileSubtitle}</p>
                      </div>
                      <a
                        href={reel.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/80 bg-background/80 text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                        aria-label="Hap reel në Instagram"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </header>

                    {/* Media — iframe ose blockquote fallback; data-reel-touch-zone + watchDrag liron play në mobile */}
                    <div
                      data-reel-touch-zone
                      className="relative aspect-[9/16] w-full overflow-hidden bg-zinc-950 [&_.instagram-media]:!m-0"
                    >
                      <ReelMedia
                        permalink={reel.permalink}
                        label={reel.label}
                        videoSrc={reel.videoSrc}
                        posterSrc={reel.posterSrc}
                      />
                    </div>

                    <footer className="border-t border-border/60 bg-muted/20 px-3 py-2.5 text-center">
                      <p className="text-sm font-medium text-foreground/90">{reel.label}</p>
                    </footer>
                  </article>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Mobile: shigjetat poshtë videos; md+: anash (justify-between) */}
          <div
            className={cn(
              "z-40 mt-1 flex w-full items-center justify-center gap-12 pb-1",
              "md:pointer-events-none md:absolute md:inset-x-0 md:top-[42%] md:mt-0 md:-translate-y-1/2 md:justify-between md:gap-0 md:px-2 md:pb-0"
            )}
          >
            <CarouselPrevious
              hideWhenDisabled
              className="static h-10 w-10 shrink-0 translate-y-0 border-border/80 bg-background/95 shadow-md hover:bg-primary hover:text-primary-foreground md:pointer-events-auto"
            />
            <CarouselNext
              hideWhenDisabled
              className="static h-10 w-10 shrink-0 translate-y-0 border-border/80 bg-background/95 shadow-md hover:bg-primary hover:text-primary-foreground md:pointer-events-auto"
            />
          </div>
        </Carousel>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Për video pa kornizën e Instagram-it, vendos skedarë MP4 në <code className="rounded bg-muted px-1">public/videos/</code> dhe shto{" "}
          <code className="rounded bg-muted px-1">videoSrc</code> te çdo reel. Përndryshe prek ikonën e jashtëm për Instagram.
        </p>
      </div>
    </section>
  );
}
