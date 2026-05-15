import { Volume2, VolumeX } from "lucide-react";
import { useYoutubeAmbient } from "@/contexts/youtube-ambient-context";

export function AmbientMusic() {
  const { muted, playerReady, toggleSoundOrPlayback } = useYoutubeAmbient();

  return (
    <button
      type="button"
      className="fixed bottom-5 left-4 z-40 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card/95 text-foreground shadow-lg backdrop-blur-sm transition hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40"
      aria-pressed={!muted}
      aria-label={muted ? "Ndiz zërin" : "Fik zërin"}
      title={
        !playerReady
          ? "Duke ngarkuar…"
          : muted
            ? "Zëri: OFF (kliko për ON)"
            : "Zëri: ON (kliko për OFF)"
      }
      disabled={!playerReady}
      onClick={() => toggleSoundOrPlayback()}
    >
      {muted ? <VolumeX className="h-5 w-5 shrink-0" aria-hidden /> : <Volume2 className="h-5 w-5 shrink-0" aria-hidden />}
    </button>
  );
}
