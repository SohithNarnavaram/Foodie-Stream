import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import type Player from "video.js/dist/types/player";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoplay?: boolean;
  controls?: boolean;
  className?: string;
  hideBigPlay?: boolean;
  onPlayerReady?: (player: Player) => void;
  currentTime?: number;
}

export interface VideoPlayerRef {
  getCurrentTime: () => number;
  seekTo: (time: number) => void;
  getPlayer: () => Player | null;
}

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({
  src,
  poster,
  autoplay = true,
  controls = true,
  className = "",
  hideBigPlay = false,
  onPlayerReady,
  currentTime,
}, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);

  useImperativeHandle(ref, () => ({
    getCurrentTime: () => {
      if (playerRef.current) {
        try {
          return playerRef.current.currentTime() || 0;
        } catch {
          return 0;
        }
      }
      return 0;
    },
    seekTo: (time: number) => {
      if (playerRef.current) {
        try {
          playerRef.current.currentTime(time);
        } catch (e) {
          console.error("Error seeking:", e);
        }
      }
    },
    getPlayer: () => playerRef.current,
  }));

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Video.js player
    const player = videojs(videoRef.current, {
      autoplay,
      controls,
      fluid: true,
      responsive: true,
      liveui: true,
      poster,
      html5: {
        vhs: {
          overrideNative: true,
        },
        nativeVideoTracks: false,
        nativeAudioTracks: false,
        nativeTextTracks: false,
      },
      controlBar: {
        volumePanel: {
          inline: false,
        },
      },
    });

    // Set source
    player.src({
      src,
      type: "application/x-mpegURL",
    });

    playerRef.current = player;

    // Seek to saved time if provided and ensure autoplay
    if (currentTime !== undefined && currentTime > 0) {
      player.ready(() => {
        try {
          player.currentTime(currentTime);
          // Ensure video plays after seeking
          if (autoplay) {
            // Use setTimeout to ensure the seek completes before playing
            setTimeout(() => {
              player.play().catch((e) => {
                console.log("Autoplay prevented, user interaction required:", e);
              });
            }, 100);
          }
        } catch (e) {
          console.error("Error seeking to saved time:", e);
        }
      });
    } else if (autoplay) {
      // If no currentTime but autoplay is true, ensure it plays
      player.ready(() => {
        player.play().catch((e) => {
          console.log("Autoplay prevented, user interaction required:", e);
        });
      });
    }
    
    // Also try to play when loadeddata event fires (for better reliability)
    player.on("loadeddata", () => {
      if (autoplay && !player.paused()) {
        // Video is already playing or will play
      } else if (autoplay) {
        player.play().catch((e) => {
          console.log("Autoplay on loadeddata prevented:", e);
        });
      }
    });

    // Notify parent that player is ready
    if (onPlayerReady) {
      player.ready(() => {
        onPlayerReady(player);
      });
    }

    // Handle errors
    player.on("error", () => {
      const error = player.error();
      console.error("Video player error:", error);
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, autoplay, controls, currentTime, onPlayerReady]);

  return (
    <div className={`video-player-wrapper ${hideBigPlay ? "hide-big-play" : ""} ${className}`}>
      <div data-vjs-player>
        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered vjs-theme-fantasy"
          playsInline
        />
      </div>
      <style>{`
        .video-player-wrapper {
          width: 100%;
          position: relative;
        }
        
        .video-js {
          width: 100%;
          height: 100%;
          font-family: inherit;
        }

        .vjs-theme-fantasy .vjs-big-play-button {
          background-color: hsl(var(--primary));
          border: none;
          border-radius: 50%;
          width: 80px;
          height: 80px;
          line-height: 80px;
          font-size: 3em;
          transition: all 0.3s;
        }

        .vjs-theme-fantasy .vjs-big-play-button:hover {
          background-color: hsl(var(--primary) / 0.9);
          transform: scale(1.1);
        }

        .video-player-wrapper.hide-big-play .vjs-big-play-button {
          display: none !important;
        }

        .vjs-theme-fantasy .vjs-control-bar {
          background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);
          backdrop-filter: blur(4px);
        }

        .vjs-theme-fantasy .vjs-play-control,
        .vjs-theme-fantasy .vjs-volume-panel,
        .vjs-theme-fantasy .vjs-fullscreen-control {
          color: white;
        }

        .vjs-theme-fantasy .vjs-play-progress {
          background-color: hsl(var(--primary));
        }

        .vjs-theme-fantasy .vjs-volume-level {
          background-color: hsl(var(--primary));
        }

        .vjs-theme-fantasy .vjs-slider {
          background-color: rgba(255,255,255,0.3);
        }

        .vjs-theme-fantasy .vjs-load-progress {
          background: rgba(255,255,255,0.2);
        }

        .vjs-live-control {
          display: flex;
          align-items: center;
        }
      `}</style>
    </div>
  );
});

VideoPlayer.displayName = "VideoPlayer";

export default VideoPlayer;
