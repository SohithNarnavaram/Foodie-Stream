import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, MessageCircle, MapPin } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useOrders } from "@/contexts/OrdersContext";

interface TrackingLocationState {
  orderId?: string;
  etaMinutes?: number;
  status?: string;
}

const steps = [
  { label: "Order Accepted", time: "06:20 PM", done: true },
  { label: "Cooking Food", time: "06:25 PM", done: false },
  { label: "Food on the Way", time: "06:40 PM", done: false },
  { label: "Delivered to you", time: "06:50 PM", done: false },
];

const OrderTracking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCurrentOrder } = useOrders();
  const state = (location.state || {}) as TrackingLocationState;

  const currentOrder = getCurrentOrder();

  const etaMinutes = state.etaMinutes ?? currentOrder?.etaMinutes ?? 20;
  const orderId = state.orderId ?? currentOrder?.id ?? "FS-1024";
  const statusText = state.status ?? "The courier is on the way";

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
          <h1 className="text-xl font-bold text-gray-900">Track Order</h1>
        </div>
      </header>

      {/* Map placeholder */}
      <div className="relative">
        <div className="h-64 bg-gray-200">
          <div className="h-full w-full bg-[radial-gradient(circle_at_top,_#e5e7eb,_#d1d5db)] flex items-center justify-center">
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-primary" />
              <span>Live route preview coming soon</span>
            </div>
          </div>
        </div>

        {/* Delivery status card overlapping map */}
        <div className="px-4 -mt-10">
          <Card className="rounded-3xl bg-emerald-500 text-white px-5 py-4 shadow-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/10 flex flex-col items-center justify-center text-sm font-semibold">
                <span>{etaMinutes}</span>
                <span className="text-[11px] font-normal opacity-90">min</span>
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                  Delivery
                </p>
                <p className="text-base font-bold">{statusText}</p>
                <p className="text-xs opacity-90 mt-1">Order #{orderId}</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <button className="h-9 w-9 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-md">
                <Phone className="w-4 h-4" />
              </button>
              <button className="h-9 w-9 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-md">
                <MessageCircle className="w-4 h-4" />
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Driver card */}
      <section className="px-4 mt-4">
        <Card className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3 border-0 shadow-food-card bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
              JS
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">John Smith</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                Driver
                <span className="inline-flex items-center gap-0.5">
                  <span className="text-yellow-400">★</span>
                  <span>4.8</span>
                </span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-4 h-4" />
            </button>
            <button className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white shadow-md hover:bg-primary/90 transition-colors">
              <Phone className="w-4 h-4" />
            </button>
          </div>
        </Card>
      </section>

      {/* Timeline */}
      <section className="px-4 mt-5">
        <Card className="rounded-2xl px-4 py-4 border-0 shadow-sm bg-white">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Order Progress</h2>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                        step.done ? "border-primary bg-primary" : "border-gray-300 bg-white"
                      )}
                    >
                      {step.done && (
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    {index !== steps.length - 1 && (
                      <div className="absolute left-1/2 top-4 -translate-x-1/2 w-px h-7 bg-gray-200" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-sm",
                      step.done ? "text-gray-900 font-semibold" : "text-gray-500"
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{step.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <BottomNav />
    </div>
  );
};

export default OrderTracking;


