import { useRef, useState } from "react";
import { Play, Volume2, VolumeX } from "lucide-react";

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
  const [soundOn, setSoundOn] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (!reel.videoSrc) return null;

  const src = resolvePublicMediaUrl(reel.videoSrc);
  const poster = reel.posterSrc ? resolvePublicMediaUrl(reel.posterSrc) : undefined;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.muted = !soundOn;
      video.play().catch(() => undefined);
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleSound = (e: React.MouseEvent) => {
    e.stopPropagation();
    const video = videoRef.current;
    if (!video) return;
    const next = !soundOn;
    setSoundOn(next);
    video.muted = !next;
  };

  return (
    <div
      className="relative min-w-[260px] max-w-[320px] flex-shrink-0 cursor-pointer overflow-hidden rounded-xl border-0 shadow-lg"
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
        muted={!soundOn}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {!playing ? (
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center bg-black/25"
          aria-hidden
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md">
            <Play className="ml-1 h-7 w-7 fill-current" />
          </span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={toggleSound}
        className="absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75"
        aria-label={soundOn ? "Çaktivizo zërin" : "Aktivizo zërin"}
      >
        {soundOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
      </button>
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
