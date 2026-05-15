import { useEffect, useRef, useState } from "react";
import { Pause, Volume2 } from "lucide-react";

const srcFor = (path: string) => `${import.meta.env.BASE_URL}${path}`;
const AMBIENT_AUDIO = "audio/music.mp3";

export function AmbientMusic() {
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const [ambientPlaying, setAmbientPlaying] = useState(false);

  useEffect(() => {
    return () => {
      const el = ambientRef.current;
      if (!el) return;
      el.pause();
      el.currentTime = 0;
    };
  }, []);

  return (
    <>
      <audio
        ref={ambientRef}
        src={srcFor(AMBIENT_AUDIO)}
        preload="metadata"
        loop
        playsInline
        onPlay={() => setAmbientPlaying(true)}
        onPause={() => setAmbientPlaying(false)}
      />
      <button
        type="button"
        className="fixed bottom-5 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-pressed={ambientPlaying}
        aria-label={ambientPlaying ? "Ndalo muzikën" : "Luaj muzikë"}
        title="Muzikë"
        onClick={() => {
          const el = ambientRef.current;
          if (!el) return;
          if (el.paused) void el.play().catch(() => setAmbientPlaying(false));
          else el.pause();
        }}
      >
        {ambientPlaying ? <Pause className="h-5 w-5 shrink-0" aria-hidden /> : <Volume2 className="h-5 w-5 shrink-0" aria-hidden />}
      </button>
    </>
  );
}
