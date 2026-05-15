/** Minimal types për YouTube IFrame API (ngarkuar dinamikisht). */
declare namespace YT {
  enum PlayerState {
    UNSTARTED = -1,
    ENDED = 0,
    PLAYING = 1,
    PAUSED = 2,
    BUFFERING = 3,
    CUED = 5,
  }

  interface OnStateChangeEvent {
    data: PlayerState;
    target: Player;
  }

  interface PlayerOptions {
    height?: string | number;
    width?: string | number;
    videoId: string;
    playerVars?: Record<string, string | number | undefined>;
    events?: {
      onReady?: (e: { target: Player }) => void;
      onStateChange?: (e: OnStateChangeEvent) => void;
    };
  }

  class Player {
    constructor(elementId: string, options: PlayerOptions);
    playVideo(): void;
    pauseVideo(): void;
    getPlayerState(): PlayerState;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setSize(width: number, height: number): void;
    getIframe(): HTMLIFrameElement | null;
    destroy(): void;
  }
}

interface Window {
  YT?: { Player: typeof YT.Player };
  onYouTubeIframeAPIReady?: () => void;
}
