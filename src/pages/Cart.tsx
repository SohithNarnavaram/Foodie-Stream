import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/BottomNav";
import { useCart } from "@/contexts/CartContext";
import { useOrders } from "@/contexts/OrdersContext";
import { FoodItemCard } from "@/components/FoodItemCard";
import { liveStreams } from "@/data/mockData";
import { toast } from "sonner";

const Cart = () => {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [discountApplied, setDiscountApplied] = useState(false);
  const { cartItems, addToCart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { createOrderFromCart } = useOrders();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 40;
  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const total = subtotal - discountAmount + deliveryFee;

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    toast.success("Item removed from cart");
  };

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => {
      const order = createOrderFromCart({
        cartItems,
        subtotal,
        discountAmount,
        deliveryFee,
        total,
        etaMinutes: 20,
      });
      clearCart();
      navigate("/order-tracking", {
        state: {
          orderId: order.id,
          etaMinutes: order.etaMinutes,
          status: "The courier is on the way",
        },
      });
      toast.success("Order placed successfully!");
    }, 2000);
  };

  const handleApplyDiscount = () => {
    if (subtotal === 0) {
      toast.info("Add items to your cart to apply a discount.");
      return;
    }
    if (!discountApplied) {
      setDiscountApplied(true);
      toast.success("10% discount applied!");
    }
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="text-center space-y-6 animate-scale-in">
          <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-600 text-lg">
              Your delicious food is being prepared live
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Cart</h1>
          </div>
        </div>
      </header>

      {cartItems.length === 0 ? (
        <>
          <div className="flex items-center justify-center min-h-[40vh]">
            <div className="text-center space-y-4">
              <p className="text-xl text-gray-600 font-medium">Your cart is empty</p>
              <Button 
                onClick={() => navigate("/home")}
                className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-semibold"
              >
                Browse Live Streams
              </Button>
            </div>
          </div>

          {/* Browse Items */}
          <section className="px-4 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Browse Items</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary font-medium"
                onClick={() => navigate("/menu")}
              >
                See all
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {liveStreams.slice(0, 4).map((stream) => (
                <FoodItemCard
                  key={stream.id}
                  id={stream.id}
                  dishName={stream.dishName}
                  vendorName={stream.vendorName}
                  thumbnail={stream.thumbnail}
                  price={stream.price}
                  rating={stream.hygieneRating}
                  eta={stream.eta}
                  distance={stream.distance}
                  badge={stream.verified ? "Bestseller" : undefined}
                  layout="horizontal"
                  onAdd={() =>
                    addToCart({
                      id: stream.id,
                      dishName: stream.dishName,
                      vendorName: stream.vendorName,
                      price: stream.price,
                      image: stream.thumbnail,
                    })
                  }
                  onClick={() => navigate(`/live/${stream.id}`)}
                  className="h-full"
                />
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Cart Items */}
          <div className="px-4 py-6 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="w-full max-w-md md:max-w-3xl mx-auto">
                <Card className="p-4 border-0 shadow-food-card rounded-2xl bg-white">
                  <div className="flex gap-4">
                    <img
                      src={item.image}
                      alt={item.dishName}
                      className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg line-clamp-1">
                          {item.dishName}
                        </h3>
                        <p className="text-sm text-gray-600 font-medium line-clamp-1">
                          {item.vendorName}
                        </p>
                      </div>
                      <div className="mt-1 space-y-2">
                        <p className="font-bold text-primary text-lg flex items-center gap-1">
                          <span>₹{item.price}</span>
                          <span>×</span>
                          <span>{item.quantity}</span>
                          <span>=</span>
                          <span>₹{item.price * item.quantity}</span>
                        </p>
                        <div className="flex items-center gap-3 pt-1">
                          <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-1.5">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="flex items-center justify-center h-7 w-7 rounded-full border border-gray-300 text-gray-700 text-sm leading-none"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="text-sm font-semibold text-gray-900 min-w-[1.75rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-white text-sm leading-none"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="rounded-full hover:bg-red-50 text-red-500 ml-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>

          {/* Discount Code */}
          <div className="px-4 pb-4">
            <Card className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white border-0 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary text-lg font-bold">
                  %
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Do you have any discount code?
                  </p>
                  {discountApplied && (
                    <p className="text-xs font-semibold text-primary mt-0.5">
                      10% off applied · -₹{discountAmount}
                    </p>
                  )}
                </div>
              </div>
              <Button
                disabled={discountApplied}
                onClick={handleApplyDiscount}
                className="bg-primary hover:bg-primary/90 disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-full px-4 py-2 text-sm font-semibold"
              >
                {discountApplied ? "Applied" : "Apply"}
              </Button>
            </Card>
          </div>

          {/* Bill Summary */}
          <div className="fixed left-0 right-0 bottom-20 bg-white border-t border-gray-200 px-4 pt-4 pb-3 space-y-4 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] rounded-t-3xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Order Amount</span>
                <span className="font-semibold text-gray-900">₹{subtotal}</span>
              </div>
              {discountApplied && (
                <div className="flex items-center justify-between text-sm text-primary">
                  <span>Discount (10%)</span>
                  <span>-₹{discountAmount}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
              </div>
              <Separator className="bg-gray-200" />
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">Total Payment</span>
                <span className="font-bold text-2xl text-primary">₹{total}</span>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold text-base h-12 shadow-md"
              onClick={handlePlaceOrder}
            >
              Proceed to Checkout
            </Button>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
};

export default Cart;
