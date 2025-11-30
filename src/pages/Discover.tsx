import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Search, X, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { cn } from "@/lib/utils";
import bitesIcon from "@/assets/bites.png";
import liveIcon from "@/assets/live_icon.png";

interface CategoryTile {
  id: string;
  title: string;
  subtitle?: string;
  discount?: string;
  image?: string;
}

const Discover = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const topCategories: CategoryTile[] = [
    { id: "pizza", title: "PIZZA", subtitle: "Italian Classics", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { id: "burgers", title: "BURGERS", subtitle: "Juicy & Tasty", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: "biryani", title: "BIRYANI", subtitle: "Aromatic Rice", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop" },
    { id: "momos", title: "MOMOS", subtitle: "Steamed Delights", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop" },
    { id: "shawarma", title: "SHAWARMA", subtitle: "Middle Eastern", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
    { id: "chaat", title: "CHAAT", subtitle: "Street Food", image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400&h=300&fit=crop" },
    { id: "desserts", title: "DESSERTS", subtitle: "Sweet Treats", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
    { id: "coffee", title: "COFFEE", subtitle: "Brewed Fresh", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop" },
    { id: "ice-cream-rolls", title: "ICE CREAM ROLLS", subtitle: "Frozen Art", image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop" },
    { id: "wok-cooking", title: "WOK COOKING", subtitle: "Stir Fried", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
  ];

  const byRegion: CategoryTile[] = [
    { id: "north-indian", title: "NORTH INDIAN", subtitle: "Rich & Spicy", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
    { id: "south-indian", title: "SOUTH INDIAN", subtitle: "Traditional", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop" },
    { id: "bengali", title: "BENGALI", subtitle: "East Indian", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
    { id: "hyderabadi", title: "HYDERABADI", subtitle: "Nizami Cuisine", image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=300&fit=crop" },
    { id: "goan", title: "GOAN", subtitle: "Coastal Flavors", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "kerala", title: "KERALA", subtitle: "Spice Coast", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
  ];

  const byCuisine: CategoryTile[] = [
    { id: "chinese", title: "CHINESE", subtitle: "Asian Fusion", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "thai", title: "THAI", subtitle: "Exotic Flavors", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop" },
    { id: "korean", title: "KOREAN", subtitle: "Bold & Spicy", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "italian", title: "ITALIAN", subtitle: "Mediterranean", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { id: "mexican", title: "MEXICAN", subtitle: "Fiery & Fresh", image: "https://images.unsplash.com/photo-1565299585323-38174c3d0e3a?w=400&h=300&fit=crop" },
    { id: "turkish", title: "TURKISH", subtitle: "Middle Eastern", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop" },
  ];

  const byVendorType: CategoryTile[] = [
    { id: "street-food", title: "STREET FOOD", subtitle: "Local Favorites", image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400&h=300&fit=crop" },
    { id: "cafes", title: "CAFES", subtitle: "Cozy Spaces", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop" },
    { id: "food-trucks", title: "FOOD TRUCKS", subtitle: "On The Go", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: "fast-food-chains", title: "FAST FOOD CHAINS", subtitle: "Quick Bites", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: "restaurants", title: "RESTAURANTS", subtitle: "Fine Dining", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { id: "cloud-kitchen", title: "CLOUD KITCHEN", subtitle: "Delivery Only", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "home-chefs", title: "HOME CHEFS", subtitle: "Homemade Love", image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop" },
  ];

  const byCookingStyle: CategoryTile[] = [
    { id: "live-cooking", title: "LIVE COOKING", subtitle: "Watch & Order", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "asmr", title: "ASMR", subtitle: "Satisfying Sounds", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
    { id: "high-flame", title: "HIGH FLAME", subtitle: "Intense Heat", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "fine-dining", title: "FINE DINING", subtitle: "Elegant Experience", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { id: "baking", title: "BAKING", subtitle: "Freshly Baked", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop" },
    { id: "grilling", title: "GRILLING", subtitle: "Smoky Flavors", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "healthy", title: "HEALTHY", subtitle: "Nutritious Options", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop" },
  ];

  const byGlobalFoodChains: CategoryTile[] = [
    { id: "dominos", title: "DOMINO'S", subtitle: "Pizza & More", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png" },
    { id: "pizza-hut", title: "PIZZA HUT", subtitle: "Italian Classics", image: "https://1000logos.net/wp-content/uploads/2017/05/Pizza-Hut-Logo.png" },
    { id: "kfc", title: "KFC", subtitle: "Finger Lickin' Good", image: "https://1000logos.net/wp-content/uploads/2017/03/KFC-Logo.png" },
    { id: "mcdonalds", title: "MCDONALD'S", subtitle: "I'm Lovin' It", image: "https://1000logos.net/wp-content/uploads/2017/03/McDonalds-logo.png" },
    { id: "burger-king", title: "BURGER KING", subtitle: "Have It Your Way", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Burger_King_logo_%281999%29.svg/1200px-Burger_King_logo_%281999%29.svg.png" },
    { id: "subway", title: "SUBWAY", subtitle: "Eat Fresh", image: "https://1000logos.net/wp-content/uploads/2017/06/Subway-Logo.png" },
    { id: "taco-bell", title: "TACO BELL", subtitle: "Live Más", image: "https://1000logos.net/wp-content/uploads/2017/05/Taco-Bell-Logo.png" },
    { id: "popeyes", title: "POPEYES", subtitle: "Louisiana Kitchen", image: "https://1000logos.net/wp-content/uploads/2017/05/Popeyes-Logo.png" },
    { id: "starbucks", title: "STARBUCKS", subtitle: "Coffee & More", image: "https://1000logos.net/wp-content/uploads/2017/05/Starbucks-Logo.png" },
    { id: "costa-coffee", title: "COSTA COFFEE", subtitle: "Crafted Coffee", image: "https://1000logos.net/wp-content/uploads/2020/03/Costa-Coffee-Logo.png" },
    { id: "ccd", title: "CCD", subtitle: "A Lot Can Happen Over Coffee", image: "https://1000logos.net/wp-content/uploads/2021/08/Cafe-Coffee-Day-Logo.png" },
    { id: "local-artisan-cafes", title: "LOCAL ARTISAN CAFÉS", subtitle: "Handcrafted", image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop" },
  ];

  const trendingNow: CategoryTile[] = [
    { id: "viral-food", title: "VIRAL FOOD", subtitle: "Trending Now", discount: "HOT", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
    { id: "new-live-streams", title: "NEW LIVE STREAMS", subtitle: "Just Started", discount: "NEW", image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop" },
    { id: "near-you", title: "NEAR YOU", subtitle: "Local Favorites", discount: "NEAR", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
    { id: "premium-hotels-live", title: "PREMIUM HOTELS LIVE", subtitle: "Luxury Dining", discount: "PREMIUM", image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop" },
    { id: "late-night-live", title: "LATE NIGHT LIVE", subtitle: "Midnight Cravings", discount: "24/7", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop" },
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/category/${categoryId}`);
  };

  // Combine all categories for search
  const allCategories = [
    ...topCategories,
    ...byRegion,
    ...byCuisine,
    ...byVendorType,
    ...byCookingStyle,
    ...byGlobalFoodChains,
    ...trendingNow,
  ];

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return {
        topCategories,
        byRegion,
        byCuisine,
        byVendorType,
        byCookingStyle,
        byGlobalFoodChains,
        trendingNow,
      };
    }

    const query = searchQuery.toLowerCase().trim();
    const filter = (categories: CategoryTile[]) =>
      categories.filter(
        (cat) =>
          cat.title.toLowerCase().includes(query) ||
          cat.subtitle?.toLowerCase().includes(query) ||
          cat.id.toLowerCase().includes(query)
      );

    return {
      topCategories: filter(topCategories),
      byRegion: filter(byRegion),
      byCuisine: filter(byCuisine),
      byVendorType: filter(byVendorType),
      byCookingStyle: filter(byCookingStyle),
      byGlobalFoodChains: filter(byGlobalFoodChains),
      trendingNow: filter(trendingNow),
    };
  }, [searchQuery]);

  const CategorySection = ({ title, categories }: { title: string; categories: CategoryTile[] }) => (
    <div className="mb-6 md:mb-8">
      <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 px-1">{title}</h2>
      <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
        {categories.map((category) => (
          <Card
            key={category.id}
            className="min-w-[140px] md:min-w-[180px] max-w-[140px] md:max-w-[180px] bg-white rounded-2xl p-3 md:p-5 shadow-sm border-0 cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 relative overflow-hidden group flex-shrink-0"
            onClick={() => handleCategoryClick(category.id)}
          >
            {/* Discount Banner */}
            {category.discount && (
              <div className="absolute top-0 left-0 right-0 bg-orange-100 text-orange-600 text-[9px] md:text-[10px] font-bold py-1 md:py-1.5 px-2 md:px-3 text-center uppercase tracking-wide z-10">
                {category.discount}
              </div>
            )}
            
            <div className={cn("flex flex-col h-full relative", category.discount && "pt-6 md:pt-8")}>
              {/* Title */}
              <h3 className="text-sm md:text-base font-bold text-gray-800 mb-0.5 md:mb-1 uppercase leading-tight tracking-tight line-clamp-2 z-10 relative">
                {category.title}
              </h3>
              
              {/* Subtitle */}
              {category.subtitle && (
                <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-4 uppercase tracking-wide line-clamp-1 z-10 relative">
                  {category.subtitle}
                </p>
              )}
              
              {/* Image/Illustration area - fills bottom portion */}
              <div className="flex-1 min-h-[90px] md:min-h-[120px] mt-auto relative overflow-hidden rounded-b-2xl bg-gray-50 -mx-3 md:-mx-5 -mb-3 md:-mb-5">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to placeholder if image fails to load
                      e.currentTarget.src = "https://via.placeholder.com/280x200?text=" + category.title;
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                )}
                
                {/* Action Button - positioned over image */}
                <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3">
                  <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-md z-20">
                    <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="rounded-xl hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
                <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/live-streams-feed")}
                className="rounded-xl hover:bg-gray-100 w-12 h-12 md:w-14 md:h-14 transition-all duration-300 active:scale-95 group"
                aria-label="Live Streams"
              >
                <img 
                  src={liveIcon} 
                  alt="Live" 
                  className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:rotate-12"
                />
              </Button>
            <Button 
                variant="ghost"
              size="icon"
                onClick={() => navigate("/bites")}
                className="rounded-xl hover:bg-gray-100 w-12 h-12 md:w-14 md:h-14 transition-all duration-300 active:scale-95 group"
                aria-label="Bites"
              >
                <img 
                  src={bitesIcon} 
                  alt="Bites" 
                  className="w-9 h-9 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:rotate-12"
                />
            </Button>
          </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search categories..."
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
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4">
        {/* Banners */}
        {!searchQuery.trim() && (
          <div className="flex flex-col gap-3 mb-6">
            {/* Explore Live Streams Banner */}
            <div
              className={cn(
                "relative rounded-2xl overflow-hidden bg-gradient-to-r from-primary to-orange-500 p-6 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
              )}
              onClick={() => navigate("/live-streams-feed")}
            >
              <div className="relative z-10">
                <h2 className="text-2xl font-bold mb-1">Watch Live Cooking</h2>
                <p className="text-white/90 text-sm mb-4">See your food being prepared in real-time</p>
                <Button
                  size="sm"
                  className="bg-white hover:bg-gray-100 font-semibold rounded-lg text-primary"
                >
                  Explore Live Streams
                </Button>
              </div>
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-transparent to-black/10 opacity-50"></div>
            </div>

            {/* Bites Banners - Collage Style */}
            <div className="grid grid-cols-2 gap-3">
              {/* Bites Banner 1 */}
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden p-4 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                )}
                style={{ background: 'linear-gradient(to right, #90b437, #7a9a2e)' }}
                onClick={() => navigate("/bites")}
              >
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-1">Bites</h2>
                  <p className="text-white/90 text-xs mb-5 line-clamp-3">Short-form food videos, cooking tips, recipes & daily inspiration for food lovers</p>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 font-semibold rounded-lg text-xs px-3 py-1.5 h-auto"
                    style={{ color: '#90b437' }}
                  >
                    Watch
                  </Button>
          </div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-transparent to-black/10 opacity-50"></div>
        </div>

              {/* Explore Categories Banner */}
              <div
                className={cn(
                  "relative rounded-2xl overflow-hidden bg-gradient-to-r from-purple-500 to-purple-600 p-4 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all active:scale-[0.98]"
                )}
                onClick={() => {
                  const categoriesSection = document.querySelector('[data-categories-section]');
                  if (categoriesSection) {
                    categoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              >
                <div className="relative z-10">
                  <h2 className="text-xl font-bold mb-1">Explore Categories</h2>
                  <p className="text-white/90 text-xs mb-3 line-clamp-2">Browse by cuisine, region & more</p>
                  <Button
                    size="sm"
                    className="bg-white hover:bg-gray-100 font-semibold rounded-lg text-xs px-3 py-1.5 h-auto text-purple-500"
                  >
                    View
                  </Button>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-transparent to-black/10 opacity-50"></div>
              </div>
            </div>
          </div>
        )}

        {searchQuery.trim() ? (
          // Show filtered results when searching
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4 px-1">
              Search Results for "{searchQuery}"
          </h2>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1 flex-wrap">
              {Object.values(filteredCategories).flat().length > 0 ? (
                Object.values(filteredCategories)
                  .flat()
                  .map((category) => (
                    <Card
                      key={category.id}
                      className="min-w-[140px] md:min-w-[180px] max-w-[140px] md:max-w-[180px] bg-white rounded-2xl p-3 md:p-5 shadow-sm border-0 cursor-pointer hover:shadow-xl hover:-translate-y-1 active:scale-95 transition-all duration-300 relative overflow-hidden group flex-shrink-0"
                      onClick={() => handleCategoryClick(category.id)}
                    >
                      {/* Discount Banner */}
                      {category.discount && (
                        <div className="absolute top-0 left-0 right-0 bg-orange-100 text-orange-600 text-[9px] md:text-[10px] font-bold py-1 md:py-1.5 px-2 md:px-3 text-center uppercase tracking-wide z-10">
                          {category.discount}
                        </div>
                      )}
                      
                      <div className={cn("flex flex-col h-full relative", category.discount && "pt-6 md:pt-8")}>
                        {/* Title */}
                        <h3 className="text-sm md:text-base font-bold text-gray-800 mb-0.5 md:mb-1 uppercase leading-tight tracking-tight line-clamp-2 z-10 relative">
                          {category.title}
                        </h3>
                        
                        {/* Subtitle */}
                        {category.subtitle && (
                          <p className="text-[10px] md:text-xs text-gray-500 mb-2 md:mb-4 uppercase tracking-wide line-clamp-1 z-10 relative">
                            {category.subtitle}
                          </p>
                        )}
                        
                        {/* Image/Illustration area - fills bottom portion */}
                        <div className="flex-1 min-h-[90px] md:min-h-[120px] mt-auto relative overflow-hidden rounded-b-2xl bg-gray-50 -mx-3 md:-mx-5 -mb-3 md:-mb-5">
                          {category.image ? (
                            <img
                              src={category.image}
                              alt={category.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://via.placeholder.com/280x200?text=" + category.title;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200"></div>
                          )}
                          
                          {/* Action Button - positioned over image */}
                          <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3">
                            <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center transition-all group-hover:scale-105 active:scale-95 shadow-md z-20">
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            </button>
                          </div>
                        </div>
        </div>
                    </Card>
                  ))
              ) : (
                <div className="w-full text-center py-12">
            <p className="text-gray-500 text-lg">
                    No categories found matching "{searchQuery}"
            </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                    className="mt-4"
                >
                  Clear Search
                </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Show all sections when not searching
          <div data-categories-section>
            <CategorySection title="Top Categories" categories={topCategories} />
            <CategorySection title="Trending Now" categories={trendingNow} />
            <CategorySection title="By Global Food Chains" categories={byGlobalFoodChains} />
            <CategorySection title="By Cuisine" categories={byCuisine} />
            <CategorySection title="By Cooking Style" categories={byCookingStyle} />
            <CategorySection title="By Type of Vendor" categories={byVendorType} />
            <CategorySection title="By Region" categories={byRegion} />
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default Discover;
