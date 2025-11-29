import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Maximize2, X, Users, ChefHat, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import VideoPlayer, { VideoPlayerRef } from "@/components/VideoPlayer";

interface StreamMiniPlayerProps {
  viewerCount: number;
  isStreaming: boolean;
  onMaximize: () => void;
  onEndStream?: () => void;
  isUserStream?: boolean;
  videoSrc?: string;
  poster?: string;
  isPlaying?: boolean;
  currentTime?: number;
}

export const StreamMiniPlayer = ({
  viewerCount,
  isStreaming,
  onMaximize,
  onEndStream,
  isUserStream = false,
  videoSrc,
  poster,
  isPlaying = false,
  currentTime = 0,
}: StreamMiniPlayerProps) => {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load position from localStorage (desktop only) or set mobile position
  useEffect(() => {
    const updatePosition = () => {
      if (!isMobile) {
        const savedPosition = localStorage.getItem("stream-miniplayer-position");
        if (savedPosition) {
          try {
            setPosition(JSON.parse(savedPosition));
          } catch {
            // ignore parse errors
          }
        }
      } else {
        // On mobile, position at bottom-right (above bottom nav)
        const width = 200;
        const height = 120;
        // Bottom nav is at bottom-4 (16px) with height 56px, so total ~72px from bottom
        // Add some extra space (16px) for padding
        const bottomNavHeight = 88; // 72px nav + 16px padding
        const safeArea = 16; // Safe area padding
        const newX = Math.max(safeArea, window.innerWidth - width - safeArea);
        const newY = Math.max(safeArea, window.innerHeight - height - bottomNavHeight);
        setPosition({ x: newX, y: newY });
      }
    };

    // Initial position update
    updatePosition();
    
    // Update on resize for mobile
    if (isMobile) {
      window.addEventListener("resize", updatePosition);
      // Also update after a short delay to ensure viewport is ready
      const timeout = setTimeout(updatePosition, 100);
      return () => {
        window.removeEventListener("resize", updatePosition);
        clearTimeout(timeout);
      };
    }
  }, [isMobile]);

  // Save position to localStorage (desktop only)
  useEffect(() => {
    if (!isMobile && !isDragging) {
      localStorage.setItem("stream-miniplayer-position", JSON.stringify(position));
    }
  }, [position, isMobile, isDragging]);

  const handleStartDrag = (clientX: number, clientY: number, target?: EventTarget | null) => {
    if (target && (target as HTMLElement).closest("button")) return;
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y,
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    handleStartDrag(e.clientX, e.clientY, e.target);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleStartDrag(touch.clientX, touch.clientY, e.target);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const width = isMobile ? 200 : 280;
    const height = isMobile ? 120 : 160;
    const newX = clientX - dragStart.x;
    const newY = clientY - dragStart.y;
    
    // Constrain to viewport
    const maxX = window.innerWidth - width;
    const maxY = window.innerHeight - height;
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleEndDrag = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleEndDrag);
      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      document.addEventListener("touchend", handleEndDrag);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleEndDrag);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleEndDrag);
      };
    }
  }, [isDragging, dragStart, isMobile]);

  const width = isMobile ? 200 : 280;
  const height = isMobile ? 120 : 160;

  // Don't render if not streaming
  if (!isStreaming) return null;

  return (
    <div
      className="fixed z-[9999] bg-black/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl cursor-move touch-none pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: "calc(100vw - 32px)",
        maxHeight: "calc(100vh - 32px)",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Video Preview Area */}
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-black">
        {/* Actual Video Player */}
        {videoSrc && isPlaying ? (
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <style>{`
              .stream-miniplayer-video .video-js {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
              }
              .stream-miniplayer-video .video-js video {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover;
              }
              .stream-miniplayer-video .vjs-control-bar {
                display: none !important;
              }
              .stream-miniplayer-video .vjs-big-play-button {
                display: none !important;
              }
            `}</style>
            <div className="stream-miniplayer-video w-full h-full">
              <VideoPlayer
                ref={videoPlayerRef}
                src={videoSrc}
                poster={poster}
                autoplay={true}
                controls={false}
                hideBigPlay={true}
                className="w-full h-full"
                currentTime={currentTime}
              />
            </div>
          </div>
        ) : (
          /* Fallback Placeholder */
          <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                {isUserStream ? (
                  <Play className="w-6 h-6 text-white/50" />
                ) : (
                  <ChefHat className="w-6 h-6 text-white/50" />
                )}
              </div>
              <p className="text-white/70 text-xs">Live Stream</p>
            </div>
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none">
          {/* Top Bar */}
          <div className="absolute top-0 left-0 right-0 p-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5 animate-pulse">
                <div className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                LIVE
              </Badge>
              <div className="flex items-center gap-1 text-xs text-white/80">
                <Users className="w-3 h-3" />
                <span className="font-semibold">{viewerCount}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // Get current playback time before maximizing
                  let currentTime = 0;
                  if (videoPlayerRef.current) {
                    currentTime = videoPlayerRef.current.getCurrentTime();
                  }
                  // Save current time to localStorage
                  if (isUserStream) {
                    localStorage.setItem("user-stream-current-time", currentTime.toString());
                  }
                  onMaximize();
                }}
                title="Maximize"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </Button>
              {onEndStream && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-white hover:bg-white/20 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEndStream();
                  }}
                  title={isUserStream ? "Close Stream" : "End Stream"}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

