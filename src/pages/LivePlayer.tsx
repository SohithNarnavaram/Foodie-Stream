import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle, ShoppingCart, Plus, Send, MapPin, Clock, Tag, Utensils, X, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HygieneBadge } from "@/components/HygieneBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { Card } from "@/components/ui/card";
import { liveStreams } from "@/data/mockData";
import { toast } from "sonner";
import VideoPlayer, { VideoPlayerRef } from "@/components/VideoPlayer";
import { StreamMiniPlayer } from "@/components/StreamMiniPlayer";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

const LivePlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showChat, setShowChat] = useState(false);
  const [isPlaying, setIsPlaying] = useState(() => {
    // Check if we're maximizing from miniplayer - if so, auto-play
    const savedState = localStorage.getItem("user-stream-minimized");
    const savedStreamData = localStorage.getItem("user-stream-data");
    if (savedState === "false" && savedStreamData) {
      try {
        const parsed = JSON.parse(savedStreamData);
        if (parsed.streamId === id && parsed.isPlaying) {
          return true; // Auto-play if maximizing
        }
      } catch {
        // ignore parse errors
      }
    }
    return false;
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", username: "FoodLover23", message: "Looks amazing! 🤤", timestamp: new Date(Date.now() - 60000) },
    { id: "2", username: "ChefFan99", message: "Can you add extra spice?", timestamp: new Date(Date.now() - 45000) },
    { id: "3", username: "HungryNow", message: "How long until ready?", timestamp: new Date(Date.now() - 30000) },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [mockMessageTimer, setMockMessageTimer] = useState<NodeJS.Timeout | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const videoPlayerRef = useRef<VideoPlayerRef>(null);

  const stream = liveStreams.find((s) => s.id === id);

  if (!stream) {
    return <div>Stream not found</div>;
  }

  // Load minimized state from localStorage - only if it's for this specific stream
  useEffect(() => {
    const savedState = localStorage.getItem("user-stream-minimized");
    const savedStreamData = localStorage.getItem("user-stream-data");
    
    if (savedState === "true" && savedStreamData) {
      try {
        const parsed = JSON.parse(savedStreamData);
        // Only apply minimized state if it's for the current stream
        if (parsed.streamId === id) {
          setIsMinimized(true);
        } else {
          // Clear minimized state if it's for a different stream
          setIsMinimized(false);
          localStorage.setItem("user-stream-minimized", "false");
        }
      } catch {
        // If parsing fails, clear the state
        setIsMinimized(false);
        localStorage.setItem("user-stream-minimized", "false");
      }
    } else {
      // If no saved state or it's false, ensure we're not minimized
      setIsMinimized(false);
      
      // If maximizing (savedState is false but we have stream data), auto-play
      if (savedStreamData) {
        try {
          const parsed = JSON.parse(savedStreamData);
          if (parsed.streamId === id && parsed.isPlaying) {
            setIsPlaying(true); // Auto-play when maximizing
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  }, [id]);

  // Auto-play when maximizing from miniplayer
  useEffect(() => {
    const savedState = localStorage.getItem("user-stream-minimized");
    const savedStreamData = localStorage.getItem("user-stream-data");
    
    // If we're maximizing (savedState is false but we have stream data for this stream)
    if (savedState === "false" && savedStreamData && stream) {
      try {
        const parsed = JSON.parse(savedStreamData);
        if (parsed.streamId === stream.id && parsed.isPlaying && !isPlaying) {
          // Auto-play when maximizing
          setIsPlaying(true);
        }
      } catch {
        // ignore parse errors
      }
    }
  }, [stream, isPlaying]);

  // Save minimized state and stream data to localStorage
  useEffect(() => {
    if (stream && isMinimized) {
      localStorage.setItem("user-stream-minimized", "true");
      localStorage.setItem("user-stream-data", JSON.stringify({
        streamId: stream.id,
        dishName: stream.dishName,
        vendorName: stream.vendorName,
        viewers: stream.viewers,
        isPlaying,
        videoSrc: stream.streamUrl,
        poster: stream.thumbnail,
        currentTime: parseFloat(localStorage.getItem("user-stream-current-time") || "0"),
      }));
    } else if (stream && !isMinimized) {
      // Only clear if this is the stream that was minimized
      const savedStreamData = localStorage.getItem("user-stream-data");
      if (savedStreamData) {
        try {
          const parsed = JSON.parse(savedStreamData);
          if (parsed.streamId === stream.id) {
            localStorage.setItem("user-stream-minimized", "false");
          }
        } catch {
          // ignore parse errors
        }
      }
    }
  }, [isMinimized, stream, isPlaying]);

  // If minimized, navigate away from live player page
  useEffect(() => {
    if (isMinimized && window.location.pathname.startsWith("/live/")) {
      navigate("/home");
    }
  }, [isMinimized, navigate]);

  const handleMinimize = () => {
    // Get current playback time before minimizing
    let currentTime = 0;
    if (videoPlayerRef.current) {
      currentTime = videoPlayerRef.current.getCurrentTime();
    }
    
    // Save current time to localStorage
    if (stream) {
      localStorage.setItem("user-stream-current-time", currentTime.toString());
    }
    
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    if (stream) {
      navigate(`/live/${stream.id}`);
    }
  };

  const handleAddToCart = () => {
    toast.success("Added to cart!");
  };

  const handleRequestLive = () => {
    toast.info("Live cooking request sent to vendor!");
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        username: "You",
        message: newMessage,
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, message]);
      setNewMessage("");
      toast.success("Message sent!");
    }
  };

  // Simulate mock messages appearing
  useEffect(() => {
    if (showChat) {
      const timer = setInterval(() => {
        const mockMessages = [
          "This looks so good!",
          "Just ordered one!",
          "Best street food ever 🔥",
          "How much for delivery?",
          "Love watching this!",
          "Can't wait to try!",
          "Looks amazing! 🤤",
          "Ordering now! 🛒",
          "What's the special today?",
        ];
        const mockUsernames = ["FoodLover23", "ChefFan99", "HungryNow", "SpiceQueen", "TastyTime", "Foodie123"];
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        const randomUser = mockUsernames[Math.floor(Math.random() * mockUsernames.length)];
        
        setChatMessages(prev => [...prev, {
          id: Date.now().toString(),
          username: randomUser,
          message: randomMessage,
          timestamp: new Date(),
        }]);
      }, 8000); // New message every 8 seconds

      setMockMessageTimer(timer);
      return () => clearInterval(timer);
    }
  }, [showChat]);

  // Auto scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Don't render full player if minimized (only for the current stream)
  if (isMinimized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Video / Poster Section */}
      <div className="relative aspect-video bg-black overflow-hidden">
        {stream.streamUrl && isPlaying ? (
          <VideoPlayer
            ref={videoPlayerRef}
            src={stream.streamUrl}
            poster={stream.thumbnail}
            autoplay={true}
            controls={true}
            hideBigPlay={true}
            currentTime={parseFloat(localStorage.getItem("user-stream-current-time") || "0")}
          />
        ) : (
          <div className="relative w-full h-full">
            <img
              src={stream.thumbnail}
              alt={stream.dishName}
              className="w-full h-full object-cover"
            />
            {/* Play overlay */}
            {stream.streamUrl && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
              >
                <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 shadow-xl">
                  <svg
                    className="w-8 h-8 text-gray-900"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none">
          <div className="pointer-events-auto">
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="bg-black/30 hover:bg-black/50 text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleMinimize}
                className="bg-black/30 hover:bg-black/50 text-white"
                title="Minimize stream"
              >
                <Minimize2 className="w-5 h-5" />
              </Button>
            </div>
            
            <Badge className="bg-destructive text-destructive-foreground border-0 animate-pulse">
              <span className="relative flex h-2 w-2 mr-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              LIVE
            </Badge>
          </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 pointer-events-auto">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <h1 className="text-white font-bold text-xl">{stream.dishName}</h1>
                <p className="text-white/90 text-sm">{stream.vendorName}</p>
                <p className="text-white/80 text-xs">{stream.viewers} watching</p>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(!showChat)}
                className="bg-black/30 hover:bg-black/50 text-white"
              >
                <MessageCircle className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Sidebar / Bottom sheet - Transparent Overlay */}
      {showChat && (
        <>
          {/* Desktop: Transparent Overlay Sidebar */}
          <div 
            className="hidden md:flex absolute right-0 top-0 bottom-0 w-80 bg-transparent z-30 flex flex-col pointer-events-none"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <div className="absolute top-4 right-4 z-40 pointer-events-auto">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowChat(false)}
                className="text-white hover:bg-black/40 rounded-full bg-black/30 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div 
              className="flex-1 flex flex-col pt-16 pb-4 px-4 pointer-events-auto overflow-hidden"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <ScrollArea 
                className="flex-1"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="space-y-2">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className="animate-in slide-in-from-bottom-2"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-xs text-primary drop-shadow-lg">{msg.username}</p>
                        <p className="text-xs text-white/70 drop-shadow">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm text-white drop-shadow-lg">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
            </div>

            <div 
              className="p-4 pointer-events-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-black/60 backdrop-blur-md border-white/20 text-white placeholder:text-white/60 rounded-full"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 rounded-full shadow-lg"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile: Transparent Overlay Bottom Sheet */}
          <div 
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/80 backdrop-blur-md rounded-t-2xl max-h-[70vh] flex flex-col pointer-events-none overflow-hidden border-t border-white/20"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div 
              className="flex-1 flex flex-col pt-4 pb-20 px-4 pointer-events-auto overflow-hidden"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-white">Live Chat</h3>
                  <p className="text-xs text-white/70">{chatMessages.length} messages</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowChat(false)}
                  className="text-white hover:bg-white/20 rounded-full"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <ScrollArea 
                className="flex-1 min-h-0"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
              >
                <div className="space-y-3 pr-2">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className=""
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-xs text-primary">{msg.username}</p>
                        <p className="text-xs text-white/70">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <p className="text-sm text-white">{msg.message}</p>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>
              </ScrollArea>
            </div>

            {/* Fixed Input Box at Bottom */}
            <div 
              className="absolute bottom-0 left-0 right-0 p-4 bg-black/90 backdrop-blur-md border-t border-white/20 pointer-events-auto"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 focus:border-primary rounded-full h-11"
                />
                <Button 
                  size="icon" 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-primary hover:bg-primary/90 rounded-full h-11 w-11 flex-shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Details Section */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center gap-2">
          {stream.verified && <VerifiedBadge />}
          <HygieneBadge rating={stream.hygieneRating} />
        </div>

        <Card className="border-0 shadow-food-card rounded-2xl bg-white px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Utensils className="w-4 h-4" />
              <span>Cuisine</span>
            </div>
            <span className="font-semibold text-gray-900">{stream.cuisine}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>Distance</span>
            </div>
            <span className="font-semibold text-gray-900">{stream.distance}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>ETA</span>
            </div>
            <span className="font-semibold text-gray-900">{stream.eta}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Tag className="w-4 h-4" />
              <span>Price</span>
            </div>
            <span className="font-bold text-lg text-primary">₹{stream.price}</span>
          </div>
        </Card>
      </div>

      {/* Bottom Sheet CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 space-y-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="lg" className="w-full">
              <ShoppingCart className="w-5 h-5 mr-2" />
              View Order Options
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[400px]">
            <SheetHeader>
              <SheetTitle>{stream.dishName}</SheetTitle>
            </SheetHeader>
            <div className="py-6 space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div>
                  <p className="font-medium">{stream.dishName}</p>
                  <p className="text-sm text-muted-foreground">from {stream.vendorName}</p>
                </div>
                <p className="font-bold text-lg">₹{stream.price}</p>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Estimated delivery: {stream.eta}</p>
                <p className="text-sm text-muted-foreground">Distance: {stream.distance}</p>
              </div>

              <Button size="lg" className="w-full" onClick={handleAddToCart}>
                <Plus className="w-5 h-5 mr-2" />
                Add to Cart - ₹{stream.price}
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={handleRequestLive}
              >
                Request Live Cooking
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default LivePlayer;
