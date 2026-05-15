import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AMBIENT_YOUTUBE_VIDEO_ID } from "@/lib/youtube-ambient-config";

export const YOUTUBE_AMBIENT_MOUNT_ID = "nn-yt-ambient-mount";
export const YOUTUBE_AMBIENT_WRAP_CLASS = "nn-yt-footer-wrap";

const YT_PLAYING = 1;

type YoutubeAmbientValue = {
  playing: boolean;
  muted: boolean;
  playerReady: boolean;
  /** Preferon zërin on/off (mute). Nëse API nuk ofron mute, bie në play/pause. */
  toggleSoundOrPlayback: () => void;
};

const YoutubeAmbientContext = createContext<YoutubeAmbientValue | null>(null);

function loadIframeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled || !window.YT?.Player) return;
      settled = true;
      resolve();
    };

    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      finish();
    };

    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      document.head.appendChild(tag);
    }

    const poll = window.setInterval(finish, 50);
    window.setTimeout(() => {
      window.clearInterval(poll);
      if (!settled) {
        settled = true;
        resolve();
      }
    }, 12000);
  });
}

export function YoutubeAmbientProvider({ children }: { children: ReactNode }) {
  const playerRef = useRef<YT.Player | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const videoId = AMBIENT_YOUTUBE_VIDEO_ID;

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 80;

    const tryCreate = () => {
      if (cancelled || playerRef.current) return true;
      const el = document.getElementById(YOUTUBE_AMBIENT_MOUNT_ID);
      if (!el || !window.YT?.Player) return false;

      playerRef.current = new window.YT.Player(YOUTUBE_AMBIENT_MOUNT_ID, {
        videoId,
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 1,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
          loop: 1,
          playlist: videoId,
          origin: window.location.origin,
        },
        events: {
          onReady: (e) => {
            if (cancelled) return;
            const p = e.target;
            try {
              p.mute();
              void p.playVideo();
              setMuted(p.isMuted());
            } catch {
              setMuted(true);
            }
            setPlayerReady(true);
          },
          onStateChange: (ev: YT.OnStateChangeEvent) => {
            if (cancelled) return;
            setPlaying(ev.data === YT_PLAYING);
            try {
              setMuted(ev.target.isMuted());
            } catch {
              /* ignore */
            }
          },
        },
      });
      return true;
    };

    const tick = async () => {
      await loadIframeApi();
      if (cancelled) return;

      const interval = window.setInterval(() => {
        if (cancelled) {
          window.clearInterval(interval);
          return;
        }
        attempts += 1;
        if (tryCreate() || attempts >= maxAttempts) {
          window.clearInterval(interval);
        }
      }, 100);
    };

    void tick();

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setPlayerReady(false);
      setPlaying(false);
      setMuted(true);
    };
  }, [videoId]);

  /** Mbush kornizën 16:9 të footer-it (`setSize` + iframe 100%); zoom i lehtë zvogëlon pillarbox për video jo-16:9. */
  useEffect(() => {
    if (!playerReady) return;
    const p = playerRef.current;
    const wrap = document.querySelector(`.${YOUTUBE_AMBIENT_WRAP_CLASS}`) as HTMLElement | null;
    if (!p || !wrap) return;

    const apply = () => {
      const { width, height } = wrap.getBoundingClientRect();
      const w = Math.floor(width);
      const h = Math.floor(height);
      if (w < 2 || h < 2) return;
      try {
        p.setSize(w, h);
      } catch {
        /* ignore */
      }
      try {
        const iframe = p.getIframe?.();
        if (!iframe) return;
        iframe.style.position = "absolute";
        iframe.style.left = "0";
        iframe.style.top = "0";
        iframe.style.right = "0";
        iframe.style.bottom = "0";
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.maxWidth = "none";
        iframe.style.border = "0";
        iframe.style.transform = "scale(1.12)";
        iframe.style.transformOrigin = "center center";
      } catch {
        /* ignore */
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [playerReady]);

  const toggleSoundOrPlayback = useCallback(() => {
    const p = playerRef.current;
    if (!p || !playerReady) return;

    try {
      if (typeof p.isMuted === "function") {
        if (p.isMuted()) {
          p.unMute();
          if (p.getPlayerState() !== YT_PLAYING) void p.playVideo();
          setMuted(false);
        } else {
          p.mute();
          setMuted(true);
        }
        return;
      }
    } catch {
      /* fallback */
    }

    const state = p.getPlayerState();
    if (state === YT_PLAYING) p.pauseVideo();
    else void p.playVideo();
  }, [playerReady]);

  const value = useMemo(
    () => ({ playing, muted, playerReady, toggleSoundOrPlayback }),
    [playing, muted, playerReady, toggleSoundOrPlayback],
  );

  return <YoutubeAmbientContext.Provider value={value}>{children}</YoutubeAmbientContext.Provider>;
}

export function useYoutubeAmbient() {
  const ctx = useContext(YoutubeAmbientContext);
  if (!ctx) {
    throw new Error("useYoutubeAmbient must be used within YoutubeAmbientProvider");
  }
  return ctx;
}
