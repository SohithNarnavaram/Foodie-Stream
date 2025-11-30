import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, SlidersHorizontal, Flame, X, Heart } from "lucide-react";
import { LocationSelector } from "@/components/LocationSelector";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LiveCard } from "@/components/LiveCard";
import { FoodItemCard } from "@/components/FoodItemCard";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { FloatingCart } from "@/components/FloatingCart";
import { FilterSheet } from "@/components/FilterSheet";
import { BottomNav } from "@/components/BottomNav";
import { liveStreams } from "@/data/mockData";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";

interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  verifiedOnly: boolean;
  liveOnly: boolean;
  selectedCuisines: string[];
}

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: [0, 500],
    minRating: 0,
    verifiedOnly: false,
    liveOnly: false,
    selectedCuisines: [],
  });
  const navigate = useNavigate();
  const [emblaApi, setEmblaApi] = useState<any>(null);
  const { cartItems, addToCart, removeFromCart, updateQuantity, getTotalItems } = useCart();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  const handleLiveCardClick = (id: string) => {
    navigate(`/live/${id}`);
  };

  const handleGoLive = () => {
    toast.info("Go Live feature coming soon!");
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

  const categories = Array.from(new Set(liveStreams.map((s) => s.cuisine)));

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

  // Combined search and filter logic
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
    if (selectedCategory) {
      result = result.filter((s) => s.cuisine === selectedCategory);
    }

    // Price range filter
    result = result.filter(
      (s) => s.price >= filters.priceRange[0] && s.price <= filters.priceRange[1]
    );

    // Rating filter
    if (filters.minRating > 0) {
      // Using hygieneRating as proxy for rating (you can add actual rating to data)
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

    // Cuisine filter
    if (filters.selectedCuisines.length > 0) {
      result = result.filter((s) => filters.selectedCuisines.includes(s.cuisine));
    }

    return result;
  }, [searchQuery, selectedCategory, filters]);

  // Banner data
  const banners = [
    {
      id: 1,
      title: "Watch Live Cooking",
      description: "See your food being prepared in real-time",
      buttonText: "Explore Live Streams",
      bgColor: "bg-primary",
      gradientFrom: "from-primary",
      gradientTo: "to-orange-500",
      onClick: () => navigate("/menu"),
    },
    {
      id: 2,
      title: "Verified Vendors",
      description: "Trusted kitchens with hygiene ratings",
      buttonText: "View Verified",
      bgColor: "bg-purple-500",
      gradientFrom: "from-purple-500",
      gradientTo: "to-purple-600",
      onClick: () => navigate("/menu"),
    },
    {
      id: 3,
      title: "Bites",
      description: "Short-form food videos & cooking content",
      buttonText: "Watch Bites",
      bgColor: "bg-[#90b437]",
      gradientFrom: "from-[#90b437]",
      gradientTo: "to-[#7a9a2e]",
      onClick: () => navigate("/bites"),
    },
  ];

  // Auto-swipe functionality
  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000); // Auto-swipe every 4 seconds

    return () => clearInterval(interval);
  }, [emblaApi]);

  // Track current slide
  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentBanner(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
        <div className="px-4 py-3">
          {/* Location Bar */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <LocationSelector />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/favorites")}
              className={cn(
                "h-9 w-9 rounded-full hover:bg-gray-100 transition-all relative",
                favorites.length > 0 && "text-red-500 hover:text-red-600"
              )}
              aria-label="View favorites"
            >
              <Heart 
                className={cn(
                  "w-5 h-5 transition-all relative z-10",
                  favorites.length > 0 ? "fill-red-500 text-red-500" : "text-gray-600"
                )} 
              />
              {favorites.length > 0 && (
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white shadow-sm z-20 transform translate-x-1/2 -translate-y-1/2" />
              )}
            </Button>
          </div>
          
          {/* Search Bar */}
          <div className="flex gap-2">
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
            <Button 
              variant="outline" 
              size="icon"
              className={cn(
                "h-11 w-11 rounded-xl border-gray-200 hover:bg-gray-50 hover:border-gray-300 relative transition-all",
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
        </div>
      </header>

      {/* Hero Banner Carousel */}
      <section className="px-4 pt-4 pb-2">
        <Carousel
          setApi={setEmblaApi}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {banners.map((banner) => (
              <CarouselItem key={banner.id}>
                <div
                  className={cn(
                    "relative rounded-2xl overflow-hidden bg-gradient-to-r",
                    banner.gradientFrom,
                    banner.gradientTo,
                    "p-6 text-white shadow-lg"
                  )}
                >
                  <div className="relative z-10">
                    <h2 className="text-2xl font-bold mb-1">{banner.title}</h2>
                    <p className="text-white/90 text-sm mb-4">{banner.description}</p>
                    <Button
                      size="sm"
                      className={cn(
                        "bg-white hover:bg-gray-100 font-semibold rounded-lg",
                        banner.bgColor === "bg-primary"
                          ? "text-primary"
                          : banner.bgColor === "bg-purple-500"
                          ? "text-purple-500"
                          :                         banner.bgColor === "bg-[#90b437]"
                          ? "text-[#90b437]"
                          : "text-yellow-500"
                      )}
                      onClick={banner.onClick}
                    >
                      {banner.buttonText}
                    </Button>
                  </div>
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent to-black/10 opacity-50"></div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        
        {/* Banner Indicators */}
        <div className="flex justify-center gap-2 mt-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300 shadow-sm",
                currentBanner === index
                  ? "w-8 bg-white"
                  : "w-2 bg-white/60 hover:bg-white/80"
              )}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Category Chips */}
      <section className="px-4 py-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "category-chip whitespace-nowrap",
              selectedCategory === null && "category-chip-active"
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                "category-chip whitespace-nowrap",
                selectedCategory === category && "category-chip-active"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Live Now Carousel */}
      {(() => {
        const liveItems = filteredStreams.filter(s => s.isLive);
        const showLiveSection = !selectedCategory && !filters.verifiedOnly && !filters.liveOnly && filters.selectedCuisines.length === 0 && filters.minRating === 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 500;
        const showLiveInSearch = searchQuery.trim() && liveItems.length > 0;
        
        if (!showLiveSection && !showLiveInSearch) return null;
        
        return (
          <section className="px-4 py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-gray-900">Live Now</h2>
                {searchQuery.trim() && (
                  <span className="text-sm text-gray-500 font-normal">
                    ({liveItems.length} {liveItems.length === 1 ? 'result' : 'results'})
                  </span>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate("/discover")}
                className="text-primary font-medium"
              >
                See all
              </Button>
            </div>
            
            {liveItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm">No live streams found matching your search.</p>
              </div>
            ) : (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
                {liveItems.slice(0, 3).map((stream) => (
                  <div key={stream.id} className="min-w-[300px] snap-start">
                    <LiveCard
                      {...stream}
                      onClick={() => handleLiveCardClick(stream.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </section>
        );
      })()}

      {/* Your Trusted Picks - Horizontal Cards */}
      {(!searchQuery.trim() && !selectedCategory && !filters.verifiedOnly && !filters.liveOnly && filters.selectedCuisines.length === 0 && filters.minRating === 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 500) && (
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your trusted picks</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/menu")}
              className="text-gray-600 font-medium"
            >
              View all
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {filteredStreams.filter(s => s.verified).slice(0, 4).map((stream) => (
              <FoodItemCard
                key={stream.id}
                id={stream.id}
                dishName={stream.dishName}
                vendorName={stream.vendorName}
                thumbnail={stream.thumbnail}
                price={stream.price}
                rating={4.5}
                eta={stream.eta}
                calories="500 Kal"
                badge={stream.verified ? "Bestseller" : undefined}
                layout="horizontal"
                onAdd={() => handleAddToCart(stream)}
                onClick={() => handleLiveCardClick(stream.id)}
                onFavorite={() => toggleFavorite(stream.id)}
                isFavorite={isFavorite(stream.id)}
                className="h-full"
              />
            ))}
          </div>
        </section>
      )}

      {/* Search Results / Recommended Feed */}
      <section className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {searchQuery.trim() || selectedCategory || filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500
              ? searchQuery.trim() 
                ? `Search Results for "${searchQuery}"`
                : "Search Results"
              : "Recommended"}
          </h2>
          {(searchQuery.trim() || selectedCategory || filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
            <span className="text-sm text-gray-600">
              {filteredStreams.length} {filteredStreams.length === 1 ? "result" : "results"}
            </span>
          )}
        </div>
        
        {filteredStreams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-2">
              {searchQuery.trim() 
                ? `No results found for "${searchQuery}"`
                : "No results found"}
            </p>
            <p className="text-gray-400 text-sm mb-4">Try adjusting your search or filters</p>
            <div className="flex gap-2 justify-center">
              {searchQuery.trim() && (
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                >
                  Clear Search
                </Button>
              )}
              {(selectedCategory || filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500) && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFilters({
                      priceRange: [0, 500],
                      minRating: 0,
                      verifiedOnly: false,
                      liveOnly: false,
                      selectedCuisines: [],
                    });
                    setSelectedCategory(null);
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {(searchQuery.trim() || selectedCategory || filters.verifiedOnly || filters.liveOnly || filters.selectedCuisines.length > 0 || filters.minRating > 0 || filters.priceRange[0] > 0 || filters.priceRange[1] < 500
              ? filteredStreams
              : filteredStreams.slice(0, 5)
            ).map((stream) => (
              <FoodItemCard
                key={stream.id}
                id={stream.id}
                dishName={stream.dishName}
                vendorName={stream.vendorName}
                thumbnail={stream.thumbnail}
                price={stream.price}
                rating={4.5}
                distance={stream.distance}
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
      </section>

      {/* Street Explorer Preview */}
      {(!searchQuery.trim() && !selectedCategory && !filters.verifiedOnly && !filters.liveOnly && filters.selectedCuisines.length === 0 && filters.minRating === 0 && filters.priceRange[0] === 0 && filters.priceRange[1] === 500) && (
        <section className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Street Food Live
            </h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/street-explorer")}
              className="text-primary font-medium"
            >
              Explore
            </Button>
          </div>
          
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto md:overflow-x-visible pb-2 scrollbar-hide snap-x snap-mandatory">
            {liveStreams.filter(s => s.cuisine.toLowerCase().includes("street")).slice(0, 2).map((stream) => (
              <div key={stream.id} className="min-w-[300px] snap-start md:min-w-0 md:w-full">
                <LiveCard
                  {...stream}
                  onClick={() => handleLiveCardClick(stream.id)}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      <FloatingActionButton onClick={handleGoLive} />
      <FloatingCart itemCount={getTotalItems()} />
      <FilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        categories={categories}
        filters={filters}
        onFiltersChange={setFilters}
        onReset={() => {
          setFilters({
            priceRange: [0, 500],
            minRating: 0,
            verifiedOnly: false,
            liveOnly: false,
            selectedCuisines: [],
          });
          setSelectedCategory(null);
        }}
      />
      <BottomNav />
    </div>
  );
};

export default Home;
