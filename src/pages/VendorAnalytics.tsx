import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Users, ShoppingBag, DollarSign, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorBottomNav } from "@/components/VendorBottomNav";

const VendorAnalytics = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Revenue", value: "₹1,24,500", change: "+15%", trend: "up", icon: DollarSign, color: "text-green-600" },
    { label: "Total Orders", value: "1,234", change: "+8%", trend: "up", icon: ShoppingBag, color: "text-blue-600" },
    { label: "Avg Order Value", value: "₹201", change: "+5%", trend: "up", icon: TrendingUp, color: "text-primary" },
    { label: "Customer Rating", value: "4.6", change: "+0.2", trend: "up", icon: Star, color: "text-yellow-600" },
  ];

  const topItems = [
    { name: "Butter Chicken", orders: 234, revenue: "₹42,120", growth: "+12%" },
    { name: "Paneer Tikka", orders: 189, revenue: "₹22,680", growth: "+8%" },
    { name: "Biryani", orders: 156, revenue: "₹39,000", growth: "+15%" },
    { name: "Dal Makhani", orders: 142, revenue: "₹19,880", growth: "+5%" },
  ];

  const timeStats = [
    { time: "12:00 PM - 1:00 PM", orders: 45, revenue: "₹9,000" },
    { time: "1:00 PM - 2:00 PM", orders: 62, revenue: "₹12,400" },
    { time: "7:00 PM - 8:00 PM", orders: 58, revenue: "₹11,600" },
    { time: "8:00 PM - 9:00 PM", orders: 52, revenue: "₹10,400" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/home")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-food-card rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Top Items</TabsTrigger>
            <TabsTrigger value="timing">Peak Times</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-0 shadow-food-card rounded-xl">
              <CardHeader>
                <CardTitle>Today's Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Orders</span>
                  <span className="font-bold text-gray-900">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Revenue</span>
                  <span className="font-bold text-primary">₹8,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Avg Order Value</span>
                  <span className="font-bold text-gray-900">₹200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Customer Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-bold text-gray-900">4.6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-food-card rounded-xl">
              <CardHeader>
                <CardTitle>This Week</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Orders</span>
                  <span className="font-bold text-gray-900">287</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Revenue</span>
                  <span className="font-bold text-primary">₹57,400</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Growth</span>
                  <Badge className="bg-green-100 text-green-700">+12%</Badge>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="items" className="space-y-3">
            {topItems.map((item, index) => (
              <Card key={index} className="border-0 shadow-food-card rounded-xl">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-gray-900">{item.name}</h3>
                    <Badge className="bg-green-100 text-green-700">{item.growth}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{item.orders} orders</span>
                    <span className="font-semibold text-primary">{item.revenue}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="timing" className="space-y-3">
            <Card className="border-0 shadow-food-card rounded-xl">
              <CardHeader>
                <CardTitle>Peak Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {timeStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between pb-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-900">{stat.time}</p>
                      <p className="text-sm text-gray-600">{stat.orders} orders</p>
                    </div>
                    <p className="font-bold text-primary">{stat.revenue}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorAnalytics;


