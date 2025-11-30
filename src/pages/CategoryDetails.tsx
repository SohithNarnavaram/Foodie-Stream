import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveCard } from "@/components/LiveCard";
import { BottomNav } from "@/components/BottomNav";
import { liveStreams } from "@/data/mockData";
import { cn } from "@/lib/utils";

const CategoryDetails = () => {
  const navigate = useNavigate();
  const { categoryId } = useParams<{ categoryId: string }>();
  const [activeTab, setActiveTab] = useState<"live" | "videos">("live");

  // Map category IDs to search terms for filtering
  const getCategorySearchTerms = (categoryId: string): string[] => {
    const categoryMap: Record<string, string[]> = {
      // Top Categories
      pizza: ["pizza", "italian"],
      burgers: ["burger", "burgers"],
      biryani: ["biryani", "rice"],
      momos: ["momo", "momos", "dumpling"],
      shawarma: ["shawarma", "wrap"],
      chaat: ["chaat", "street food"],
      desserts: ["dessert", "sweet", "cake", "ice cream"],
      coffee: ["coffee", "cafe"],
      "ice-cream-rolls": ["ice cream", "frozen"],
      "wok-cooking": ["wok", "stir fry", "noodles"],
      
      // By Region
      "north-indian": ["north indian", "butter chicken", "tandoori", "naan"],
      "south-indian": ["south indian", "dosa", "idli", "sambar"],
      bengali: ["bengali", "fish", "curry"],
      hyderabadi: ["hyderabadi", "biryani"],
      goan: ["goan", "seafood", "fish"],
      kerala: ["kerala", "coconut", "curry"],
      
      // By Cuisine
      chinese: ["chinese", "noodles", "hakka"],
      thai: ["thai", "pad thai", "curry"],
      korean: ["korean", "kimchi"],
      italian: ["italian", "pasta", "pizza"],
      mexican: ["mexican", "taco", "burrito"],
      turkish: ["turkish", "kebab"],
      
      // By Vendor Type
      "street-food": ["street food", "chaat", "vada pav", "pani puri"],
      cafes: ["cafe", "coffee"],
      "food-trucks": ["food truck", "mobile"],
      "fast-food-chains": ["fast food", "quick"],
      restaurants: ["restaurant", "dining"],
      "cloud-kitchen": ["cloud kitchen", "delivery"],
      "home-chefs": ["home", "homemade"],
      
      // By Cooking Style
      "live-cooking": ["live", "cooking"],
      asmr: ["asmr"],
      "high-flame": ["flame", "grill", "tandoor"],
      "fine-dining": ["fine dining", "premium"],
      baking: ["bake", "bread", "pastry"],
      grilling: ["grill", "bbq", "kebab"],
      healthy: ["healthy", "salad", "organic"],
      
      // Trending
      "viral-food": ["viral", "trending"],
      "new-live-streams": ["new", "live"],
      "near-you": ["near", "local"],
      "premium-hotels-live": ["premium", "hotel", "luxury"],
      "late-night-live": ["late night", "midnight"],
    };

    return categoryMap[categoryId] || [categoryId];
  };

  // Get category title from ID
  const getCategoryTitle = (categoryId: string): string => {
    const titleMap: Record<string, string> = {
      pizza: "Pizza",
      burgers: "Burgers",
      biryani: "Biryani",
      momos: "Momos",
      shawarma: "Shawarma",
      chaat: "Chaat",
      desserts: "Desserts",
      coffee: "Coffee",
      "ice-cream-rolls": "Ice Cream Rolls",
      "wok-cooking": "Wok Cooking",
      "north-indian": "North Indian",
      "south-indian": "South Indian",
      bengali: "Bengali",
      hyderabadi: "Hyderabadi",
      goan: "Goan",
      kerala: "Kerala",
      chinese: "Chinese",
      thai: "Thai",
      korean: "Korean",
      italian: "Italian",
      mexican: "Mexican",
      turkish: "Turkish",
      "street-food": "Street Food",
      cafes: "Cafes",
      "food-trucks": "Food Trucks",
      "fast-food-chains": "Fast Food Chains",
      restaurants: "Restaurants",
      "cloud-kitchen": "Cloud Kitchen",
      "home-chefs": "Home Chefs",
      "live-cooking": "Live Cooking",
      asmr: "ASMR",
      "high-flame": "High Flame",
      "fine-dining": "Fine Dining",
      baking: "Baking",
      grilling: "Grilling",
      healthy: "Healthy",
      "viral-food": "Viral Food",
      "new-live-streams": "New Live Streams",
      "near-you": "Near You",
      "premium-hotels-live": "Premium Hotels Live",
      "late-night-live": "Late Night Live",
    };

    return titleMap[categoryId] || categoryId.toUpperCase();
  };

  // Filter live streams based on category
  const filteredStreams = useMemo(() => {
    if (!categoryId) return [];

    const searchTerms = getCategorySearchTerms(categoryId);
    const lowerSearchTerms = searchTerms.map(term => term.toLowerCase());

    return liveStreams.filter((stream) => {
      const dishNameLower = stream.dishName.toLowerCase();
      const cuisineLower = stream.cuisine.toLowerCase();
      const vendorNameLower = stream.vendorName.toLowerCase();

      return lowerSearchTerms.some((term) => {
        return (
          dishNameLower.includes(term) ||
          cuisineLower.includes(term) ||
          vendorNameLower.includes(term)
        );
      });
    });
  }, [categoryId]);

  const handleLiveCardClick = (streamId: string) => {
    navigate(`/live/${streamId}`);
  };

  const categoryTitle = categoryId ? getCategoryTitle(categoryId) : "Category";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">{categoryTitle}</h1>
          </div>

          {/* Toggle Tabs */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab("live")}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all",
                activeTab === "live"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Live Streams
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all",
                activeTab === "videos"
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              Short Form Video Feed
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="px-4 py-6">
        {activeTab === "live" ? (
          <>
            {filteredStreams.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {filteredStreams.map((stream) => (
                  <LiveCard
                    key={stream.id}
                    {...stream}
                    onClick={() => handleLiveCardClick(stream.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-gray-500 text-lg mb-2">No live streams found</p>
                <p className="text-gray-400 text-sm">
                  There are no live streams available for this category right now.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-2">Coming Soon</p>
            <p className="text-gray-400 text-sm">
              Short form video feed will be available soon.
            </p>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default CategoryDetails;

