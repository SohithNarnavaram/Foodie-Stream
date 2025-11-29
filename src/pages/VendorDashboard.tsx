import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Video, VideoOff, Users, ShoppingBag, TrendingUp, Plus, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { HygieneBadge } from "@/components/HygieneBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [canCookLive, setCanCookLive] = useState(true);

  const handleGoLive = () => {
    setIsLive(!isLive);
    toast.success(isLive ? "Stream ended" : "You're now live!");
  };

  const stats = [
    { label: "Current Viewers", value: isLive ? "234" : "0", icon: Users, change: "+12%" },
    { label: "Today's Orders", value: "42", icon: ShoppingBag, change: "+8%" },
    { label: "Revenue Today", value: "₹8,400", icon: TrendingUp, change: "+15%" },
  ];

  const recentOrders = [
    { id: "1", dish: "Butter Chicken", customer: "Rahul M.", status: "preparing", time: "2 min ago", price: 180 },
    { id: "2", dish: "Paneer Tikka", customer: "Priya S.", status: "ready", time: "5 min ago", price: 120 },
    { id: "3", dish: "Dal Makhani", customer: "Amit K.", status: "delivered", time: "15 min ago", price: 140 },
  ];

  const menuItems = [
    { id: "1", name: "Butter Chicken", price: 180, popular: true, available: true },
    { id: "2", name: "Paneer Tikka", price: 120, popular: true, available: true },
    { id: "3", name: "Dal Makhani", price: 140, popular: false, available: true },
    { id: "4", name: "Naan Basket", price: 60, popular: false, available: false },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-card border-b border-border">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="font-bold text-lg">Vendor Dashboard</h1>
                <p className="text-sm text-muted-foreground">Sharma's Street Kitchen</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <VerifiedBadge />
              <HygieneBadge rating={4.5} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Live Stream Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isLive ? <Video className="w-5 h-5 text-destructive" /> : <VideoOff className="w-5 h-5" />}
              Live Stream
            </CardTitle>
            <CardDescription>
              {isLive ? "You're currently live streaming" : "Start streaming to connect with customers"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Stream Status</p>
                <p className="text-sm text-muted-foreground">
                  {isLive ? `${stats[0].value} viewers watching` : "Not streaming"}
                </p>
              </div>
              <Badge variant={isLive ? "destructive" : "secondary"} className="animate-pulse">
                {isLive ? "LIVE" : "OFFLINE"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Accept Live Requests</p>
                <p className="text-sm text-muted-foreground">Allow customers to request live cooking</p>
              </div>
              <Switch checked={canCookLive} onCheckedChange={setCanCookLive} />
            </div>

            <Button 
              size="lg" 
              className="w-full" 
              variant={isLive ? "destructive" : "default"}
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
                  Go Live
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <stat.icon className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-green-600 mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent Orders</h3>
              <Badge>{recentOrders.length} active</Badge>
            </div>
            
            {recentOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{order.dish}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">₹{order.price}</p>
                      <p className="text-xs text-muted-foreground">{order.time}</p>
                    </div>
                  </div>
                  <Badge 
                    variant={
                      order.status === "delivered" ? "secondary" : 
                      order.status === "ready" ? "default" : 
                      "outline"
                    }
                  >
                    {order.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="menu" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Menu Items</h3>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            {menuItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium">{item.name}</p>
                        {item.popular && <Badge variant="secondary">Popular</Badge>}
                      </div>
                      <p className="font-bold text-primary">₹{item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={item.available} />
                      <Button variant="ghost" size="icon">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Orders</span>
                  <span className="font-bold">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Average Order Value</span>
                  <span className="font-bold">₹200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Peak Time</span>
                  <span className="font-bold">1:00 PM - 2:00 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Customer Rating</span>
                  <span className="font-bold">4.6 ⭐</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Most Popular Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Butter Chicken</span>
                  <Badge>24 orders</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Paneer Tikka</span>
                  <Badge>18 orders</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Dal Makhani</span>
                  <Badge>12 orders</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;
