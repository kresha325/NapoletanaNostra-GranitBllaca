import { useEffect } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type InstagramReel = {
  id: string;
  permalink: string;
  label: string;
};

type InstagramReelsCarouselProps = {
  reels: InstagramReel[];
  heading: string;
  subheading: string;
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
    const existingScript = document.querySelector<HTMLScriptElement>('script[data-instgrm-script="true"]');

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

export function InstagramReelsCarousel({ reels, heading, subheading }: InstagramReelsCarouselProps) {
  useEffect(() => {
    if (!reels.length) {
      return;
    }

    loadInstagramScript()
      .then(() => window.instgrm?.Embeds?.process())
      .catch(() => undefined);
  }, [reels]);

  if (!reels.length) {
    return null;
  }

  return (
    <section className="py-24 bg-muted/20 border-y border-border/40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-2xl space-y-3 mb-12">
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">{heading}</h2>
          <p className="text-lg text-muted-foreground">{subheading}</p>
        </div>

        <Carousel
          opts={{ align: "start", loop: reels.length > 2 }}
          className="mx-auto max-w-6xl px-3 md:px-12"
        >
          <CarouselContent>
            {reels.map((reel) => (
              <CarouselItem key={reel.id} className="basis-full md:basis-1/2 xl:basis-1/3">
                <div className="mx-auto max-w-[360px]">
                  <div className="relative aspect-[9/16] overflow-hidden rounded-[28px] border border-border bg-black shadow-sm">
                    <blockquote
                      className="instagram-media absolute inset-x-0 top-0 h-[calc(100%+260px)] w-full"
                      data-instgrm-permalink={reel.permalink}
                      data-instgrm-version="14"
                      style={{
                        background: "#FFF",
                        border: 0,
                        borderRadius: "28px",
                        boxShadow: "none",
                        margin: 0,
                        maxWidth: "100%",
                        minWidth: "100%",
                        padding: 0,
                        width: "100%",
                      }}
                    >
                      <a href={reel.permalink} target="_blank" rel="noopener noreferrer">
                        View this post on Instagram
                      </a>
                    </blockquote>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {reels.length > 1 ? <CarouselPrevious className="left-0 md:left-2" /> : null}
          {reels.length > 1 ? <CarouselNext className="right-0 md:right-2" /> : null}
        </Carousel>
      </div>
    </section>
  );
}