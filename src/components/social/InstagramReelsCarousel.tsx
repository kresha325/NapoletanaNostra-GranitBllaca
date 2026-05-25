import { useEffect, useRef } from "react";

export type InstagramReel = {
  id: string;
  permalink?: string;
  label?: string;
  /** Path nën `public/` (p.sh. `videos/reel-1.mp4`) ose URL HTTPS */
  videoSrc?: string;
  posterSrc?: string;
};

type InstagramReelsCarouselProps = {
  reels: InstagramReel[];
  heading: string;
  subheading?: string;
};

function resolvePublicMediaUrl(pathOrUrl: string): string {
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  const base = import.meta.env.BASE_URL;
  const path = pathOrUrl.replace(/^\//, "");
  return `${base}${path}`;
}

function GalleryVideo({ reel }: { reel: InstagramReel }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    const video = videoRef.current;
    if (!el || !video || !reel.videoSrc) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reel.videoSrc]);

  if (!reel.videoSrc) return null;

  const src = resolvePublicMediaUrl(reel.videoSrc);
  const poster = reel.posterSrc ? resolvePublicMediaUrl(reel.posterSrc) : undefined;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => undefined);
    else video.pause();
  };

  return (
    <div
      ref={wrapRef}
      className="min-w-[260px] max-w-[320px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-0 shadow-lg"
      onClick={togglePlay}
      role="button"
      tabIndex={0}
      aria-label={reel.label || "Video"}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          togglePlay();
        }
      }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="h-96 w-full border-0 object-cover"
        playsInline
        muted
        loop
        preload="metadata"
      />
    </div>
  );
}

export function InstagramReelsCarousel({ reels, heading, subheading }: InstagramReelsCarouselProps) {
  const videoReels = reels.filter((r) => r.videoSrc);

  if (!videoReels.length) {
    return null;
  }

  return (
    <section className="border-b border-border/50 bg-muted/10 py-10 md:py-16">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="mb-8 text-center font-serif text-4xl font-bold md:text-5xl">{heading}</h2>
        {subheading ? (
          <p className="mx-auto mb-8 max-w-2xl text-center text-base text-muted-foreground md:text-lg">
            {subheading}
          </p>
        ) : null}
        <div className="no-scrollbar hide-scrollbar flex gap-6 overflow-x-auto pb-2">
          {videoReels.map((reel) => (
            <GalleryVideo key={reel.id} reel={reel} />
          ))}
        </div>
      </div>
    </section>
  );
}
