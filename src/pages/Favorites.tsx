import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FoodItemCard } from "@/components/FoodItemCard";
import { BottomNav } from "@/components/BottomNav";
import { useFavorites } from "@/contexts/FavoritesContext";
import { liveStreams } from "@/data/mockData";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

const Favorites = () => {
  const navigate = useNavigate();
  const { getFavoriteStreams, toggleFavorite, isFavorite } = useFavorites();
  const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

  const favoriteStreams = getFavoriteStreams(liveStreams);

  const handleLiveCardClick = (id: string) => {
    navigate(`/live/${id}`);
  };

  const handleAddToCart = (stream: typeof liveStreams[0]) => {
    addToCart({
      id: stream.id,
      dishName: stream.dishName,
      vendorName: stream.vendorName,
      price: stream.price,
      image: stream.thumbnail,
    });
  };

  const getQuantityForStream = (id: string) => {
    const item = cartItems.find((i) => i.id === id);
    return item?.quantity ?? 0;
  };

  const handleIncrement = (stream: typeof liveStreams[0]) => {
    const currentQty = getQuantityForStream(stream.id);
    if (currentQty > 0) {
      updateQuantity(stream.id, currentQty + 1);
    } else {
      handleAddToCart(stream);
    }
  };

  const handleDecrement = (stream: typeof liveStreams[0]) => {
    const currentQty = getQuantityForStream(stream.id);
    if (currentQty > 1) {
      updateQuantity(stream.id, currentQty - 1);
    } else if (currentQty === 1) {
      removeFromCart(stream.id);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-sm text-gray-600 mt-0.5">
                {favoriteStreams.length} {favoriteStreams.length === 1 ? "item" : "items"}
              </p>
            </div>
            <div className="w-10 h-10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-red-500 fill-red-500" />
            </div>
          </div>
        </div>
      </header>

      {favoriteStreams.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
          <div className="w-24 h-24 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No favorites yet</h2>
          <p className="text-gray-600 text-center mb-6 max-w-sm">
            Start adding dishes to your favorites by tapping the heart icon on any dish
          </p>
          <Button
            onClick={() => navigate("/home")}
            className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-2 font-semibold"
          >
            Browse Dishes
          </Button>
        </div>
      ) : (
        <div className="px-4 py-6 space-y-3">
          {favoriteStreams.map((stream) => (
            <FoodItemCard
              key={stream.id}
              id={stream.id}
              dishName={stream.dishName}
              vendorName={stream.vendorName}
              thumbnail={stream.thumbnail}
              price={stream.price}
              rating={4.5}
              distance={stream.distance}
              eta={stream.eta}
              badge={stream.verified ? "Bestseller" : undefined}
              layout="vertical"
              quantity={getQuantityForStream(stream.id)}
              onIncrement={() => handleIncrement(stream)}
              onDecrement={() => handleDecrement(stream)}
              onAdd={() => handleAddToCart(stream)}
              onClick={() => handleLiveCardClick(stream.id)}
              onFavorite={() => toggleFavorite(stream.id)}
              isFavorite={isFavorite(stream.id)}
            />
          ))}
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default Favorites;

