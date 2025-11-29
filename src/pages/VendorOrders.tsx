import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Filter, CheckCircle2, Clock, Package, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

const VendorOrders = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const orders = {
    new: [
      { id: "1", orderId: "#ORD-001", customer: "Rahul M.", items: ["Butter Chicken", "Naan x2"], total: 300, time: "2 min ago", phone: "+91 98765 43210" },
      { id: "2", orderId: "#ORD-002", customer: "Priya S.", items: ["Paneer Tikka", "Rice"], total: 180, time: "5 min ago", phone: "+91 98765 43211" },
      { id: "3", orderId: "#ORD-003", customer: "Amit K.", items: ["Dal Makhani", "Roti x3"], total: 200, time: "8 min ago", phone: "+91 98765 43212" },
    ],
    preparing: [
      { id: "4", orderId: "#ORD-004", customer: "Sneha R.", items: ["Biryani", "Raita"], total: 250, time: "12 min ago", phone: "+91 98765 43213" },
      { id: "5", orderId: "#ORD-005", customer: "Vikram P.", items: ["Chole Bhature x2"], total: 180, time: "15 min ago", phone: "+91 98765 43214" },
    ],
    ready: [
      { id: "6", orderId: "#ORD-006", customer: "Anjali M.", items: ["Samosa x4", "Chutney"], total: 120, time: "20 min ago", phone: "+91 98765 43215" },
    ],
    completed: [
      { id: "7", orderId: "#ORD-007", customer: "Rajesh K.", items: ["Thali"], total: 220, time: "1 hour ago", phone: "+91 98765 43216" },
      { id: "8", orderId: "#ORD-008", customer: "Meera S.", items: ["Dosa x2", "Sambar"], total: 160, time: "2 hours ago", phone: "+91 98765 43217" },
    ],
  };

  const handleStatusChange = (orderId: string, newStatus: string) => {
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "new":
        return <Clock className="w-4 h-4" />;
      case "preparing":
        return <Package className="w-4 h-4" />;
      case "ready":
        return <CheckCircle2 className="w-4 h-4" />;
      case "completed":
        return <Truck className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "bg-blue-500";
      case "preparing":
        return "bg-orange-500";
      case "ready":
        return "bg-green-500";
      case "completed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const renderOrderCard = (order: any, status: string) => (
    <Card key={order.id} className="border-0 shadow-food-card rounded-xl mb-3">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs">{order.orderId}</Badge>
              <Badge className={`${getStatusColor(status)} text-white capitalize`}>
                {getStatusIcon(status)}
                <span className="ml-1">{status}</span>
              </Badge>
            </div>
            <h3 className="font-bold text-gray-900 mt-2">{order.customer}</h3>
            <p className="text-sm text-gray-600">{order.phone}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-primary">₹{order.total}</p>
            <p className="text-xs text-gray-500">{order.time}</p>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-semibold text-gray-700 mb-1">Items:</p>
          <div className="flex flex-wrap gap-2">
            {order.items.map((item: string, idx: number) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          {status === "new" && (
            <Button
              size="sm"
              className="flex-1 bg-orange-500 hover:bg-orange-600"
              onClick={() => handleStatusChange(order.orderId, "preparing")}
            >
              Start Preparing
            </Button>
          )}
          {status === "preparing" && (
            <Button
              size="sm"
              className="flex-1 bg-green-500 hover:bg-green-600"
              onClick={() => handleStatusChange(order.orderId, "ready")}
            >
              Mark Ready
            </Button>
          )}
          {status === "ready" && (
            <Button
              size="sm"
              className="flex-1 bg-primary hover:bg-primary/90"
              onClick={() => handleStatusChange(order.orderId, "completed")}
            >
              Mark Delivered
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={() => window.open(`tel:${order.phone}`)}>
            Call
          </Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/home")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="new" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="new" className="text-xs">
              New ({orders.new.length})
            </TabsTrigger>
            <TabsTrigger value="preparing" className="text-xs">
              Preparing ({orders.preparing.length})
            </TabsTrigger>
            <TabsTrigger value="ready" className="text-xs">
              Ready ({orders.ready.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed ({orders.completed.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="new" className="space-y-3">
            {orders.new.map((order) => renderOrderCard(order, "new"))}
          </TabsContent>

          <TabsContent value="preparing" className="space-y-3">
            {orders.preparing.map((order) => renderOrderCard(order, "preparing"))}
          </TabsContent>

          <TabsContent value="ready" className="space-y-3">
            {orders.ready.map((order) => renderOrderCard(order, "ready"))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-3">
            {orders.completed.map((order) => renderOrderCard(order, "completed"))}
          </TabsContent>
        </Tabs>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorOrders;

