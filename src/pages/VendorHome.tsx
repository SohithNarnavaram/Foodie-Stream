import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Video, VideoOff, Users, ShoppingBag, TrendingUp, Bell, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { HygieneBadge } from "@/components/HygieneBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";
import { VendorBottomNav } from "@/components/VendorBottomNav";

const VendorHome = () => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(() => {
    // Check if currently on live stream page
    return window.location.pathname === "/vendor/live";
  });
  const [canCookLive, setCanCookLive] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  // Check for new orders (notifications)
  useEffect(() => {
    // Count new orders as notifications - in a real app, this would come from an API
    // For now, we'll count orders that are new or preparing
    const newOrders = [
      { id: "1", dish: "Butter Chicken", customer: "Rahul M.", status: "preparing", price: 180 },
      { id: "2", dish: "Paneer Tikka", customer: "Priya S.", status: "ready", price: 120 },
    ];
    // Count orders that are new or preparing (not completed)
    const count = newOrders.filter(order => order.status !== "completed").length;
    setNotificationCount(count);
  }, []);

  const handleGoLive = () => {
    if (!isLive) {
      navigate("/vendor/live");
    } else {
      setIsLive(false);
      toast.success("Stream ended");
    }
  };

  const stats = [
    { label: "Viewers", value: isLive ? "234" : "0", icon: Users, change: "+12%", color: "text-blue-600" },
    { label: "Orders", value: "42", icon: ShoppingBag, change: "+8%", color: "text-green-600" },
    { label: "Revenue", value: "₹8,400", icon: TrendingUp, change: "+15%", color: "text-primary" },
  ];

  const quickActions = [
    { label: "New Orders", count: 5, color: "bg-red-500", onClick: () => navigate("/vendor/orders") },
    { label: "Menu Items", count: 12, color: "bg-blue-500", onClick: () => navigate("/vendor/menu") },
    { label: "Live Requests", count: 3, color: "bg-orange-500", onClick: () => {} },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-sm text-gray-600">Sharma's Street Kitchen</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/orders")} className="relative">
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full border-2 border-white">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/profile")}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Stream Control */}
        <Card className="border-0 shadow-food-card rounded-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-primary to-orange-500 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold mb-1">Live Stream</h2>
                <p className="text-white/90 text-sm">
                  {isLive ? `${stats[0].value} viewers watching` : "Start streaming to connect with customers"}
                </p>
              </div>
              <Badge variant="secondary" className={isLive ? "bg-red-500 text-white animate-pulse" : "bg-white/20 text-white"}>
                {isLive ? "LIVE" : "OFFLINE"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Switch 
                  checked={canCookLive} 
                  onCheckedChange={setCanCookLive}
                  className="data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
                />
                <span className="text-sm font-medium">Accept Live Requests</span>
              </div>
            </div>

            <Button 
              size="lg" 
              className="w-full bg-white text-primary hover:bg-gray-100 font-bold" 
              onClick={handleGoLive}
            >
              {isLive ? (
                <>
                  <VideoOff className="w-5 h-5 mr-2" />
                  End Stream
                </>
              ) : (
                <>
                  <Video className="w-5 h-5 mr-2" />
                  Go Live Now
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-food-card rounded-xl">
              <CardContent className="p-4">
                <stat.icon className={`w-5 h-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-3 gap-3">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="border-0 shadow-food-card rounded-xl cursor-pointer hover:shadow-food-card-hover transition-all"
                onClick={action.onClick}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 ${action.color} rounded-full mx-auto mb-2 flex items-center justify-center`}>
                    <span className="text-white font-bold text-lg">{action.count}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-700">{action.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate("/vendor/orders")}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {[
              { id: "1", dish: "Butter Chicken", customer: "Rahul M.", status: "preparing", price: 180 },
              { id: "2", dish: "Paneer Tikka", customer: "Priya S.", status: "ready", price: 120 },
            ].map((order) => (
              <Card key={order.id} className="border-0 shadow-food-card rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{order.dish}</p>
                      <p className="text-sm text-gray-600">{order.customer}</p>
                    </div>
                    <div className="text-right mr-3">
                      <p className="font-bold text-primary">₹{order.price}</p>
                    </div>
                    <Badge 
                      variant={
                        order.status === "ready" ? "default" : 
                        order.status === "preparing" ? "secondary" : 
                        "outline"
                      }
                      className="capitalize"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Verification Badges */}
        <Card className="border-0 shadow-food-card rounded-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">Verification Status</span>
              <div className="flex items-center gap-2">
                <VerifiedBadge />
                <HygieneBadge rating={4.5} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorHome;

