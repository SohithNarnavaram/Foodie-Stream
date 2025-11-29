import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/BottomNav";
import { useOrders } from "@/contexts/OrdersContext";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { getCurrentOrder } = useOrders();

  const order = getCurrentOrder();

  const orderId = order?.id ?? "FS-1024";
  const orderDate = order
    ? new Date(order.createdAt).toLocaleString(undefined, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Today";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">Order Details</h1>
        </div>
      </header>

      <main className="px-4 pt-4 space-y-4">
        {/* Order summary */}
        <Card className="rounded-2xl px-4 py-3 border-0 shadow-sm bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Order ID</p>
              <p className="text-sm font-semibold text-gray-900">{orderId}</p>
            </div>
            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold px-3 py-1">
              On the way
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">{orderDate}</p>
        </Card>

        {/* Items */}
        <Card className="rounded-2xl px-4 py-4 border-0 shadow-sm bg-white space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Items</h2>
          {order?.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.dishName}
                  className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {item.dishName}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">{item.vendorName}</p>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
              </p>
            </div>
          ))}
          <Separator className="bg-gray-200 my-1" />
          <div className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-semibold text-gray-900">₹{order?.subtotal ?? 0}</span>
            </div>
            {order?.discountAmount ? (
              <div className="flex items-center justify-between text-primary">
                <span>Discount</span>
                <span>-₹{order.discountAmount}</span>
              </div>
            ) : null}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Delivery fee</span>
              <span className="font-semibold text-gray-900">₹{order?.deliveryFee ?? 0}</span>
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-primary text-lg">₹{order?.total ?? 0}</span>
            </div>
          </div>
        </Card>

        {/* Delivery info */}
        <Card className="rounded-2xl px-4 py-4 border-0 shadow-sm bg-white space-y-2">
          <h2 className="text-sm font-semibold text-gray-900">Delivery Details</h2>
          <p className="text-xs text-gray-500">
            Delivered to: 123, Main Street, City · Contact: +91-9876543210
          </p>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default OrderDetails;


