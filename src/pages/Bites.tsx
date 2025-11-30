import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Flame, MessageCircle, Share2, MoreVertical, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/BottomNav";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BiteVideo {
  id: string;
  title: string;
  creator: string;
  thumbnail: string;
  videoUrl: string;
  duration: number;
  likes: number;
  comments: number;
  shares: number;
  description: string;
}

// Sample video data
const sampleVideos: BiteVideo[] = [
  {
    id: "1",
    title: "Pizza Dough Stretching",
    creator: "Chef Marco",
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: 15,
    likes: 1234,
    comments: 89,
    shares: 45,
    description: "Watch the perfect pizza dough stretching technique"
  },
  {
    id: "2",
    title: "Topping Masterclass",
    creator: "Pizza Artisan",
    thumbnail: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: 20,
    likes: 2345,
    comments: 156,
    shares: 78,
    description: "Learn the art of perfect pizza toppings"
  },
  {
    id: "3",
    title: "Oven Magic",
    creator: "Fire & Flavor",
    thumbnail: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 12,
    likes: 3456,
    comments: 234,
    shares: 123,
    description: "The mesmerizing moment when pizza meets the oven"
  },
  {
    id: "4",
    title: "Butter Chicken Secrets",
    creator: "Spice Kitchen",
    thumbnail: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 25,
    likes: 4567,
    comments: 345,
    shares: 189,
    description: "Traditional butter chicken recipe revealed"
  },
  {
    id: "5",
    title: "Street Food Chronicles",
    creator: "Food Explorer",
    thumbnail: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 18,
    likes: 5678,
    comments: 456,
    shares: 234,
    description: "Exploring the best street food in the city"
  },
  {
    id: "6",
    title: "Biryani Perfection",
    creator: "Royal Kitchen",
    thumbnail: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=600&fit=crop",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    duration: 30,
    likes: 6789,
    comments: 567,
    shares: 345,
    description: "The ultimate biryani cooking guide"
  },
];

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  likes: number;
}

const Bites = () => {
  const navigate = useNavigate();
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [likedVideos, setLikedVideos] = useState<Set<string>>(new Set());
  const [openCommentsVideoId, setOpenCommentsVideoId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sample comments data
  const [comments, setComments] = useState<Record<string, Comment[]>>({
    "1": [
      { id: "c1", author: "FoodLover23", text: "Amazing technique! 🔥", timestamp: "2h ago", likes: 12 },
      { id: "c2", author: "ChefPro", text: "I've been doing this wrong all along!", timestamp: "5h ago", likes: 8 },
      { id: "c3", author: "PizzaFan", text: "Can't wait to try this at home!", timestamp: "1d ago", likes: 5 },
    ],
    "2": [
      { id: "c4", author: "CookingEnthusiast", text: "The toppings look perfect!", timestamp: "3h ago", likes: 15 },
      { id: "c5", author: "HomeChef", text: "Great tips, thanks for sharing!", timestamp: "6h ago", likes: 9 },
    ],
    "3": [
      { id: "c6", author: "Foodie", text: "That oven shot is incredible!", timestamp: "4h ago", likes: 20 },
    ],
  });

  const currentVideo = sampleVideos[currentVideoIndex];

  useEffect(() => {
    // Auto-play current video
    const currentVideoElement = videoRefs.current[currentVideoIndex];
    if (currentVideoElement) {
      if (isPlaying) {
        currentVideoElement.play().catch(() => {
          // Auto-play was prevented
        });
      } else {
        currentVideoElement.pause();
      }
    }

    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentVideoIndex) {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentVideoIndex, isPlaying]);

  // Sync muted state with all video elements
  useEffect(() => {
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = isMuted;
      }
    });
  }, [isMuted]);

  const handleScroll = () => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const scrollTop = container.scrollTop;
    const containerHeight = container.clientHeight;
    const videoHeight = containerHeight; // Each video takes full height

    const newIndex = Math.round(scrollTop / videoHeight);
    
    if (newIndex !== currentVideoIndex && newIndex >= 0 && newIndex < sampleVideos.length) {
      setCurrentVideoIndex(newIndex);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    
    // Update all video elements
    videoRefs.current.forEach((video) => {
      if (video) {
        video.muted = newMutedState;
      }
    });
  };

  const toggleLike = (videoId: string) => {
    setLikedVideos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleOpenComments = (videoId: string) => {
    setOpenCommentsVideoId(videoId);
  };

  const handleAddComment = (videoId: string) => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: `c${Date.now()}`,
      author: "You",
      text: newComment,
      timestamp: "now",
      likes: 0,
    };

    setComments((prev) => ({
      ...prev,
      [videoId]: [comment, ...(prev[videoId] || [])],
    }));

    setNewComment("");
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="h-screen bg-black overflow-hidden flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="px-4 py-3 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl hover:bg-gray-800 text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-white">Bites</h1>
        </div>
      </header>

      {/* Video Feed Container */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide md:overflow-x-hidden"
        style={{ scrollBehavior: "smooth" }}
      >
        {sampleVideos.map((video, index) => (
          <div
            key={video.id}
            className="h-screen md:h-auto md:min-h-screen w-full snap-start relative flex items-center justify-center bg-black md:py-8"
          >
            {/* Desktop Layout Container */}
            <div className="w-full h-full md:h-auto md:max-w-6xl md:mx-auto md:flex md:items-center md:gap-6 md:px-6">
              {/* Video Container */}
              <div className="w-full h-full md:h-auto md:flex-1 md:max-w-4xl md:relative md:bg-black md:rounded-xl md:overflow-hidden">
                {/* Video Player */}
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el;
                  }}
                  src={video.videoUrl}
                  className="w-full h-full md:aspect-video md:h-auto md:w-full object-cover"
                  muted={isMuted}
                  loop
                  playsInline
                  poster={video.thumbnail}
                />

                {/* Overlay Gradient - Mobile only */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none md:hidden" />

                {/* Creator Info - Top of Video Container (Mobile) */}
                <div className="absolute top-0 left-0 right-0 px-4 pt-4 pb-2 md:hidden z-20 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-base">
                      {video.creator.charAt(0)}
                    </div>
                    <span className="text-white font-semibold text-base">{video.creator}</span>
                  </div>
                  <p className="text-white text-sm mb-1 line-clamp-2">{video.description}</p>
                  <p className="text-white/70 text-xs">{video.title}</p>
                </div>

                {/* Action Buttons - Right Side (Mobile) */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2 md:hidden z-10">
                  <div className="flex flex-col items-center gap-4">
                      <button
                        onClick={() => toggleLike(video.id)}
                        className="flex flex-col items-center gap-1"
                      >
                        <Flame
                          className={cn(
                            "w-8 h-8 transition-all",
                            likedVideos.has(video.id)
                              ? "fill-orange-500 text-orange-500"
                              : "text-white"
                          )}
                        />
                        <span className="text-white text-xs font-medium">
                          {formatNumber(video.likes + (likedVideos.has(video.id) ? 1 : 0))}
                        </span>
                      </button>

                      <button 
                        onClick={() => handleOpenComments(video.id)}
                        className="flex flex-col items-center gap-1"
                      >
                        <MessageCircle className="w-8 h-8 text-white" />
                        <span className="text-white text-xs font-medium">
                          {formatNumber(video.comments)}
                        </span>
                      </button>

                      <button className="flex flex-col items-center gap-1">
                        <Share2 className="w-8 h-8 text-white" />
                        <span className="text-white text-xs font-medium">
                          {formatNumber(video.shares)}
                        </span>
                      </button>

                      <button>
                        <MoreVertical className="w-8 h-8 text-white" />
                      </button>
                    </div>
                </div>

                {/* Play/Pause Button */}
                <button
                  onClick={togglePlayPause}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/10 transition-all group"
                >
                  {!isPlaying && (
                    <div className="w-20 h-20 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-10 h-10 text-white ml-1" />
                    </div>
                  )}
                </button>

                {/* Mute Button */}
                <button
                  onClick={toggleMute}
                  className="absolute top-4 md:top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border-2 border-white/20 hover:bg-black/70 transition-all z-10"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>
              </div>

              {/* Desktop - Action Buttons and Info Sidebar */}
              <div className="hidden md:flex md:flex-col md:gap-6 md:w-80 md:flex-shrink-0">
                {/* Creator Info */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-base">
                    {video.creator.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-base">{video.creator}</p>
                    <p className="text-white/70 text-sm">{video.title}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white text-sm mb-4">{video.description}</p>

                {/* Action Buttons */}
                <div className="flex flex-col gap-6">
                  <button
                    onClick={() => toggleLike(video.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <Flame
                      className={cn(
                        "w-9 h-9 transition-all",
                        likedVideos.has(video.id)
                          ? "fill-orange-500 text-orange-500"
                          : "text-white"
                      )}
                    />
                    <span className="text-white text-sm font-medium">
                      {formatNumber(video.likes + (likedVideos.has(video.id) ? 1 : 0))}
                    </span>
                  </button>

                  <button 
                    onClick={() => handleOpenComments(video.id)}
                    className="flex flex-col items-center gap-2"
                  >
                    <MessageCircle className="w-9 h-9 text-white" />
                    <span className="text-white text-sm font-medium">
                      {formatNumber(video.comments)}
                    </span>
                  </button>

                  <button className="flex flex-col items-center gap-2">
                    <Share2 className="w-9 h-9 text-white" />
                    <span className="text-white text-sm font-medium">
                      {formatNumber(video.shares)}
                    </span>
                  </button>

                  <button>
                    <MoreVertical className="w-9 h-9 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Comments Sheet */}
      <Sheet open={openCommentsVideoId !== null} onOpenChange={(open) => !open && setOpenCommentsVideoId(null)}>
        <SheetContent side="bottom" className="h-[80vh] bg-black text-white border-t border-gray-800">
          <SheetHeader className="mb-4">
            <SheetTitle className="text-white text-xl font-bold">
              Comments ({comments[openCommentsVideoId || ""]?.length || 0})
            </SheetTitle>
          </SheetHeader>

          {openCommentsVideoId && (
            <>
              {/* Comments List */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                {(comments[openCommentsVideoId] || []).map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">{comment.author}</span>
                        <span className="text-gray-400 text-xs">{comment.timestamp}</span>
                      </div>
                      <p className="text-white text-sm mb-2">{comment.text}</p>
                      <button className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors">
                        <Flame className="w-4 h-4" />
                        <span className="text-xs">{formatNumber(comment.likes)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Comment Input */}
              <div className="flex gap-2 pt-4 border-t border-gray-800">
                <Input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment(openCommentsVideoId);
                    }
                  }}
                  placeholder="Add a comment..."
                  className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary"
                />
                <Button
                  onClick={() => handleAddComment(openCommentsVideoId)}
                  disabled={!newComment.trim()}
                  className="bg-primary hover:bg-primary/90 text-white"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <BottomNav />
    </div>
  );
};

export default Bites;

