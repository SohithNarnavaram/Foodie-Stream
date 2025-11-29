import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, SlidersHorizontal, Search, X, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FoodItemCard } from "@/components/FoodItemCard";
import { LiveCard } from "@/components/LiveCard";
import { FilterSheet } from "@/components/FilterSheet";
import { BottomNav } from "@/components/BottomNav";
import { FloatingCart } from "@/components/FloatingCart";
import { LocationSelector } from "@/components/LocationSelector";
import { liveStreams } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  verifiedOnly: boolean;
  liveOnly: boolean;
  selectedCuisines: string[];
}

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 500],
    minRating: 0,
    verifiedOnly: false,
    liveOnly: false,
    selectedCuisines: [],
  });
  const { toggleFavorite, isFavorite } = useFavorites();
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems } = useCart();

  const cuisines = Array.from(new Set(liveStreams.map((s) => s.cuisine)));

  // Combined search, category and filter logic
  const filteredStreams = useMemo(() => {
    let result = [...liveStreams];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.dishName.toLowerCase().includes(query) ||
          s.vendorName.toLowerCase().includes(query) ||
          s.cuisine.toLowerCase().includes(query) ||
          (query === "live" && s.isLive) ||
          (query.includes("live") && s.isLive)
      );
    }

    // Category filter
    if (selectedCuisine) {
      result = result.filter((s) => s.cuisine === selectedCuisine);
    }

    // Price range filter
    result = result.filter(
      (s) => s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.minRating > 0) {
      result = result.filter((s) => s.hygieneRating >= filters.minRating);
    }

    // Verified filter
    if (filters.verifiedOnly) {
      result = result.filter((s) => s.verified);
    }

    // Live filter
    if (filters.liveOnly) {
      result = result.filter((s) => s.isLive);
    }

    // Cuisine filter from FilterSheet
    if (filters.selectedCuisines.length > 0) {
      result = result.filter((s) => filters.selectedCuisines.includes(s.cuisine));
    }

    return result;
  }, [searchQuery, selectedCuisine, filters]);

  const handleResetFilters = () => {
    setFilters({
      priceRange: [0, 500],
      minRating: 0,
      verifiedOnly: false,
      liveOnly: false,
      selectedCuisines: [],
    });
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
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
                <button
                  type="button"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      liveOnly: !prev.liveOnly,
                    }))
                  }
                  className="flex items-center gap-2"
                  aria-pressed={filters.liveOnly}
                >
                  <div
                    className={cn(
                      "relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200",
                      filters.liveOnly ? "bg-primary" : "bg-gray-300"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-block h-4 w-4 rounded-full bg-white shadow-md transform transition-transform duration-200",
                        filters.liveOnly ? "translate-x-4" : "translate-x-1"
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-semibold tracking-wide",
                      filters.liveOnly ? "text-primary" : "text-gray-500"
                    )}
                  >
                    {filters.liveOnly ? "🔥 Live" : "Live"}
                  </span>
                </button>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className={cn(
                "rounded-xl border-gray-200 hover:bg-gray-50 relative transition-all",
                (filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && "border-primary bg-primary/10"
              )}
              onClick={() => setFilterOpen(true)}
              aria-label="Open filters"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {(filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-white shadow-sm" />
              )}
            </Button>
          </div>

          {/* Location Bar */}
          <div className="mb-3">
            <LocationSelector />
          </div>

          {/* Search Bar */}
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-primary rounded-xl text-sm font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Cuisine Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button
              onClick={() => setSelectedCuisine(null)}
              className={cn(
                "category-chip whitespace-nowrap",
                selectedCuisine === null && "category-chip-active"
              )}
            >
              All
            </button>
            {cuisines.map((cuisine) => (
              <button
                key={cuisine}
                onClick={() => setSelectedCuisine(cuisine)}
                className={cn(
                  "category-chip whitespace-nowrap",
                  selectedCuisine === cuisine && "category-chip-active"
                )}
              >
                {cuisine}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Live Kitchens List */}
      <div className="px-4 py-6 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {filters.liveOnly ? (
              <>
                <Flame className="w-5 h-5 text-primary" />
                <span>Live Now</span>
              </>
            ) : (
              <>
                <span>Nearby Live Kitchens</span>
                {selectedCuisine && (
                  <span className="text-gray-500 font-normal">
                    {" "}· {selectedCuisine}
                  </span>
                )}
              </>
            )}
          </h2>
          {(searchQuery.trim() || filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
            <span className="text-sm text-gray-500">
              {filteredStreams.length} {filteredStreams.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {filteredStreams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery.trim() 
                ? `No items found matching "${searchQuery}"` 
                : "No items found matching your filters."}
            </p>
            <div className="flex gap-2 justify-center mt-4">
              {searchQuery.trim() && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
              {(filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                <Button
                  variant="outline"
                  onClick={handleResetFilters}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>
        ) : filters.liveOnly ? (
          <div className="space-y-4">
            {filteredStreams.map((stream) => (
              <LiveCard
                key={stream.id}
                vendorName={stream.vendorName}
                dishName={stream.dishName}
                thumbnail={stream.thumbnail}
                distance={stream.distance}
                viewers={stream.viewers}
                isLive={stream.isLive}
                onClick={() => navigate(`/live/${stream.id}`)}
              />
            ))}
          </div>
        ) : (
          filteredStreams.map((stream) => (
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
              onClick={() => navigate(`/live/${stream.id}`)}
              onFavorite={() => toggleFavorite(stream.id)}
              isFavorite={isFavorite(stream.id)}
            />
          ))
        )}
      </div>

      {/* Filter Sheet */}
      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={cuisines}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={handleResetFilters}
      />

      <FloatingCart itemCount={getTotalItems()} />
      <BottomNav />
    </div>
  );
};

export default Discover;
