import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VideoOff, Users, MessageCircle, ShoppingBag, Settings, X, Send, Bell, ChefHat, Camera, Mic, Volume2, Monitor, Minimize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useOrders } from "@/contexts/OrdersContext";

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
}

interface LiveOrder {
  id: string;
  customer: string;
  items: string[];
  total: number;
  time: string;
  orderId?: string; // Link to the actual order ID in OrdersContext
}

const VendorLiveStream = () => {
  const navigate = useNavigate();
  const { updateOrderStatus, orders } = useOrders();
  const [viewerCount, setViewerCount] = useState(234);
  const [isStreaming, setIsStreaming] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const [showOrders, setShowOrders] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "1", username: "FoodLover23", message: "Looks amazing! 🤤", timestamp: new Date(Date.now() - 120000) },
    { id: "2", username: "ChefFan99", message: "Can you add extra spice?", timestamp: new Date(Date.now() - 90000) },
    { id: "3", username: "HungryNow", message: "How long until ready?", timestamp: new Date(Date.now() - 60000) },
    { id: "4", username: "SpiceQueen", message: "Ordering now! 🛒", timestamp: new Date(Date.now() - 30000) },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [liveOrders, setLiveOrders] = useState<LiveOrder[]>([
    { id: "1", customer: "Rahul M.", items: ["Butter Chicken", "Naan x2"], total: 300, time: "2 min ago", orderId: "FS-1" },
    { id: "2", customer: "Priya S.", items: ["Paneer Tikka"], total: 120, time: "5 min ago", orderId: "FS-2" },
  ]);
  const [showSettings, setShowSettings] = useState(false);
  const [showEndStreamDialog, setShowEndStreamDialog] = useState(false);
  const [streamQuality, setStreamQuality] = useState("hd");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showViewerCount, setShowViewerCount] = useState(true);
  const [acceptLiveRequests, setAcceptLiveRequests] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamStartTime] = useState(Date.now()); // Track when stream started

  // Load minimized state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem("vendor-stream-minimized");
    if (savedState === "true") {
      setIsMinimized(true);
    }
  }, []);

  // Save minimized state and stream data to localStorage
  useEffect(() => {
    localStorage.setItem("vendor-stream-minimized", isMinimized.toString());
    localStorage.setItem("vendor-stream-data", JSON.stringify({
      viewerCount,
      isStreaming,
      streamStartTime,
      // For live camera feed, we save the start time instead of current time
      // The miniplayer will show the live feed
    }));
  }, [isMinimized, viewerCount, isStreaming, streamStartTime]);

  // Simulate viewer count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setViewerCount(prev => {
        const change = Math.floor(Math.random() * 10) - 5;
        return Math.max(0, prev + change);
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Simulate new chat messages
  useEffect(() => {
    const interval = setInterval(() => {
      const messages = [
        "This looks delicious!",
        "How much for this?",
        "Can I customize it?",
        "Ordering right now!",
        "Love your cooking! 👨‍🍳",
        "What's the special today?",
      ];
      const usernames = ["Foodie123", "HungryUser", "ChefLover", "SpiceFan", "TastyTime"];
      
      const newMsg: ChatMessage = {
        id: Date.now().toString(),
        username: usernames[Math.floor(Math.random() * usernames.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        timestamp: new Date(),
      };
      setChatMessages(prev => [...prev, newMsg]);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const handleEndStream = () => {
    setShowEndStreamDialog(true);
  };

  const confirmEndStream = () => {
    setIsStreaming(false);
    setIsMinimized(false);
    localStorage.removeItem("vendor-stream-minimized");
    localStorage.removeItem("vendor-stream-data");
    setShowEndStreamDialog(false);
    toast.success("Stream ended");
    navigate("/vendor/home");
  };

  const handleMinimize = () => {
    // For live camera feed, we don't need to capture current time
    // Just save the stream state
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
    navigate("/vendor/live");
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
    }
  };

  const handleAcceptOrder = (order: LiveOrder) => {
    // Update order status in OrdersContext if orderId exists
    if (order.orderId) {
      updateOrderStatus(order.orderId, "accepted");
    }

    // Remove order from live orders
    setLiveOrders(prev => prev.filter(o => o.id !== order.id));

    // Store notification for user
    const notification = {
      id: `notif-${Date.now()}`,
      type: "order_accepted",
      message: `Your order has been accepted! 🎉`,
      orderId: order.orderId || order.id,
      timestamp: new Date().toISOString(),
      read: false,
    };

    // Get existing notifications (using different key from notification settings)
    const existingNotifications = JSON.parse(
      localStorage.getItem("foodiestream-user-notifications") || "[]"
    );
    existingNotifications.unshift(notification);
    localStorage.setItem(
      "foodiestream-user-notifications",
      JSON.stringify(existingNotifications.slice(0, 50)) // Keep last 50 notifications
    );

    // Show success toast
    toast.success(`Order from ${order.customer} accepted!`, {
      description: "The customer has been notified.",
    });
  };

  // Request camera access (simulated)
  useEffect(() => {
    // In a real app, this would request camera/microphone access
    // navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    //   .then(stream => {
    //     if (videoRef.current) {
    //       videoRef.current.srcObject = stream;
    //     }
    //   })
    //   .catch(err => console.error("Error accessing media devices:", err));
  }, []);

  // If minimized, navigate away from live stream page
  useEffect(() => {
    if (isMinimized && window.location.pathname === "/vendor/live") {
      // Save current state before navigating
      localStorage.setItem("vendor-stream-minimized", "true");
      localStorage.setItem("vendor-stream-data", JSON.stringify({
        viewerCount,
        isStreaming,
        streamStartTime,
      }));
      navigate("/vendor/home");
    }
  }, [isMinimized, navigate, viewerCount, isStreaming, streamStartTime]);

  // Don't render full stream if minimized
  if (isMinimized) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge className="bg-red-500 text-white animate-pulse px-3 py-1">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              LIVE
            </Badge>
            <div className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              <span className="font-semibold">{viewerCount} viewers</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMinimize}
              className="text-white hover:bg-white/20"
              title="Minimize stream"
            >
              <Minimize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOrders(!showOrders)}
              className="text-white hover:bg-white/20 relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {liveOrders.length > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full border-2 border-black">
                  {liveOrders.length}
                </Badge>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowChat(!showChat)}
              className="text-white hover:bg-white/20"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              className="text-white hover:bg-white/20"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Video Area */}
      <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
        {/* Video Preview/Stream */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            {/* Camera Preview Placeholder */}
            <div className="text-center space-y-4">
              <div className="w-24 h-24 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <ChefHat className="w-12 h-12 text-white/50" />
              </div>
              <p className="text-white/70 text-lg">Camera Feed</p>
              <p className="text-white/50 text-sm">Your stream is live!</p>
            </div>
            {/* In production, this would be: */}
            {/* <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" /> */}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                HD Quality
              </Badge>
              <Badge variant="outline" className="bg-white/10 text-white border-white/20">
                Good Connection
              </Badge>
            </div>
            <Button
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white font-bold"
              onClick={handleEndStream}
            >
              <VideoOff className="w-5 h-5 mr-2" />
              End Stream
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Sidebar - Transparent Overlay (Desktop Only) */}
      {showChat && (
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

          <div className="p-4 pointer-events-auto">
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
      )}

      {/* Orders Sidebar */}
      {showOrders && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-black/95 backdrop-blur border-l border-white/10 z-30 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white">Live Orders</h3>
              <p className="text-xs text-white/60">{liveOrders.length} new orders</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowOrders(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-3">
              {liveOrders.map((order) => (
                <Card key={order.id} className="bg-white/10 border-white/20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-white">{order.customer}</p>
                      <Badge className="bg-green-500 text-white">New</Badge>
                    </div>
                    <div className="space-y-1 mb-2">
                      {order.items.map((item, idx) => (
                        <p key={idx} className="text-sm text-white/80">• {item}</p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <p className="font-bold text-primary">₹{order.total}</p>
                      <p className="text-xs text-white/50">{order.time}</p>
                    </div>
                    <Button 
                      size="sm" 
                      className="w-full mt-2 bg-primary hover:bg-primary/90"
                      onClick={() => handleAcceptOrder(order)}
                    >
                      Accept Order
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>

          {/* View Orders Button - Bottom */}
          <div className="p-4 border-t border-white/10">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                // Minimize stream and activate miniplayer
                setIsMinimized(true);
                localStorage.setItem("vendor-stream-minimized", "true");
                // Navigate to orders page
                navigate("/vendor/orders");
              }}
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              View Orders
            </Button>
          </div>
        </div>
      )}

      {/* Mobile Chat (Bottom Sheet) - Transparent Overlay */}
      {showChat && (
        <div 
          className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-transparent rounded-t-2xl max-h-[60vh] flex flex-col pointer-events-none overflow-hidden"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <div 
            className="flex-1 flex flex-col pt-4 pb-4 px-4 pointer-events-auto overflow-hidden"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-semibold text-white drop-shadow-lg">Live Chat</h3>
                <p className="text-xs text-white/70 drop-shadow">{chatMessages.length} messages</p>
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
              className="flex-1"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              <div className="space-y-2">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className=""
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

            <div className="pt-4">
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
                  className="bg-primary hover:bg-primary/90 rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Overlay - 90% on mobile, full width on desktop */}
      {showSettings && (
        <div className="absolute right-0 top-0 bottom-0 w-[90%] md:w-80 bg-black/95 backdrop-blur border-l border-white/10 z-30 flex flex-col">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-lg">Stream Settings</h3>
              <p className="text-xs text-white/60">Configure your live stream settings</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(false)}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
            {/* Stream Quality */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                Stream Quality
              </Label>
               <Select value={streamQuality} onValueChange={setStreamQuality}>
                 <SelectTrigger className="!bg-black/60 backdrop-blur-md !border-white/20 text-white hover:!bg-black/70 [&>span]:text-white [&>svg]:text-white/70">
                   <SelectValue placeholder="Select quality" />
                 </SelectTrigger>
                 <SelectContent className="!bg-black/95 backdrop-blur-md !border-white/10 [&>div]:!bg-black/95 [&_*]:!text-white [&>div[class*='viewport']]:!bg-black/95">
                   <SelectItem 
                     value="sd" 
                     className="!text-white !bg-black/60 hover:!bg-white/10 focus:!bg-white/10 data-[highlighted]:!bg-white/10 data-[state=checked]:!bg-white/10 cursor-pointer [&>span]:!text-white"
                   >
                     SD (480p)
                   </SelectItem>
                   <SelectItem 
                     value="hd" 
                     className="!text-white !bg-black/60 hover:!bg-white/10 focus:!bg-white/10 data-[highlighted]:!bg-white/10 data-[state=checked]:!bg-white/10 cursor-pointer [&>span]:!text-white"
                   >
                     HD (720p)
                   </SelectItem>
                   <SelectItem 
                     value="fhd" 
                     className="!text-white !bg-black/60 hover:!bg-white/10 focus:!bg-white/10 data-[highlighted]:!bg-white/10 data-[state=checked]:!bg-white/10 cursor-pointer [&>span]:!text-white"
                   >
                     Full HD (1080p)
                   </SelectItem>
                 </SelectContent>
               </Select>
            </div>

            {/* Video Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Camera className="w-5 h-5 text-white" />
                  <div>
                    <Label className="text-white font-semibold">Video</Label>
                    <p className="text-xs text-white/60">Enable camera feed</p>
                  </div>
                </div>
                <Switch
                  checked={videoEnabled}
                  onCheckedChange={setVideoEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-white" />
                  <div>
                    <Label className="text-white font-semibold">Audio</Label>
                    <p className="text-xs text-white/60">Enable microphone</p>
                  </div>
                </div>
                <Switch
                  checked={audioEnabled}
                  onCheckedChange={setAudioEnabled}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Display Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-white" />
                  <div>
                    <Label className="text-white font-semibold">Show Viewer Count</Label>
                    <p className="text-xs text-white/60">Display viewer count on stream</p>
                  </div>
                </div>
                <Switch
                  checked={showViewerCount}
                  onCheckedChange={setShowViewerCount}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChefHat className="w-5 h-5 text-white" />
                  <div>
                    <Label className="text-white font-semibold">Accept Live Requests</Label>
                    <p className="text-xs text-white/60">Allow customers to request live cooking</p>
                  </div>
                </div>
                <Switch
                  checked={acceptLiveRequests}
                  onCheckedChange={setAcceptLiveRequests}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>

            {/* Stream Info */}
            <Card className="bg-white/10 border-white/20">
              <div className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Stream Status</span>
                  <Badge className="bg-red-500 text-white">LIVE</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Current Viewers</span>
                  <span className="text-sm font-semibold text-white">{viewerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/70">Stream Duration</span>
                  <span className="text-sm font-semibold text-white">12:34</span>
                </div>
              </div>
            </Card>

            </div>
          </ScrollArea>

          {/* Action Buttons */}
          <div className="p-4 border-t border-white/10 space-y-2">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={() => {
                toast.success("Settings saved");
                setShowSettings(false);
              }}
            >
              Save Settings
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/20 bg-black/60 backdrop-blur-md text-white hover:bg-white/10 hover:text-white"
              onClick={() => setShowSettings(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* End Stream Confirmation Dialog */}
      <AlertDialog open={showEndStreamDialog} onOpenChange={setShowEndStreamDialog}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <AlertDialogTitle>End Stream</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end the stream? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmEndStream}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Yes, End Stream
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VendorLiveStream;

