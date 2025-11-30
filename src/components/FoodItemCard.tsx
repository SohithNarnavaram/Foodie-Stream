import { MapPin, Star, Plus, Clock, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface FoodItemCardProps {
  id: string;
  dishName: string;
  vendorName: string;
  thumbnail: string;
  price: number;
  rating: number;
  distance?: string;
  eta?: string;
  calories?: string;
  badge?: string;
  layout?: "vertical" | "horizontal";
  onAdd?: () => void;
  quantity?: number;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onClick?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
  className?: string;
}

export const FoodItemCard = ({
  dishName,
  vendorName,
  thumbnail,
  price,
  rating,
  distance,
  eta,
  calories,
  badge,
  layout = "vertical",
  onAdd,
  quantity,
  onIncrement,
  onDecrement,
  onClick,
  onFavorite,
  isFavorite = false,
  className,
}: FoodItemCardProps) => {
  const hasQuantityControls = typeof quantity === "number" && quantity > 0 && onIncrement && onDecrement;

  const renderAction = (isIconOnly?: boolean) => {
    const baseWidth = "w-[96px] h-10 flex-shrink-0";

    if (hasQuantityControls) {
      return (
        <div
          className={cn(
            "flex items-center justify-between gap-2 bg-primary text-white rounded-full px-3 py-1 shadow-md",
            baseWidth
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onDecrement}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold"
            aria-label="Decrease quantity"
          >
            -
          </button>
          <span className="text-sm font-semibold min-w-[1.5rem] text-center">
            {quantity}
          </span>
          <button
            onClick={onIncrement}
            className="flex items-center justify-center h-6 w-6 rounded-full bg-white text-primary text-xs font-semibold"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      );
    }

    if (isIconOnly) {
      return (
        <Button
          size="icon"
          className="h-10 w-10 rounded-full bg-primary hover:bg-primary/90 text-white shadow-md flex-shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            onAdd?.();
          }}
        >
          <Plus className="w-5 h-5" />
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        className={cn(
          "bg-primary hover:bg-primary/90 text-white rounded-full px-4 py-2 font-semibold flex items-center justify-center gap-2 shadow-md",
          baseWidth
        )}
        onClick={(e) => {
          e.stopPropagation();
          onAdd?.();
        }}
      >
        <Plus className="w-4 h-4" />
        Add
      </Button>
    );
  };

  if (layout === "horizontal") {
    return (
      <Card
        className={cn(
          "overflow-hidden border-0 shadow-food-card rounded-2xl bg-white cursor-pointer hover:shadow-food-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col",
          className
        )}
        onClick={onClick}
      >
        {/* Food Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={thumbnail}
            alt={dishName}
            className="w-full h-full object-cover"
          />
          
          {/* Bestseller Badge - Top Left */}
          {badge && (
            <Badge className="absolute top-3 left-3 bg-green-500 text-white border-0 text-xs font-semibold px-2.5 py-1 rounded-lg z-10">
              {badge}
            </Badge>
          )}
          
          {/* Favorite Button - Top Right */}
          {onFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className={cn(
                "absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all",
                isFavorite && "bg-red-50 hover:bg-red-100"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "w-4 h-4 transition-all",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          )}
          
          {/* Rating Badge - Top Right (if no favorite button) or Bottom Right */}
          {!onFavorite && (
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-white">{rating}</span>
            </div>
          )}
          {onFavorite && (
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1 bg-gray-800/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-white">{rating}</span>
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="flex flex-col flex-1 p-4 min-h-0">
          {/* Dish Name and Vendor */}
          <div className="mb-2">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-1 mb-1">{dishName}</h3>
            <p className="text-sm text-gray-500 font-medium line-clamp-1">{vendorName}</p>
          </div>

          {/* ETA and Calories */}
          {(eta || calories) && (
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
              {eta && (
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{eta}</span>
                </div>
              )}
              {calories && <span>{calories}</span>}
            </div>
          )}

          {/* Price and Add Button - Bottom aligned */}
          <div className="flex items-center justify-between mt-auto pt-2">
            <span className="font-bold text-xl text-gray-900">₹{price}</span>
            {renderAction(true)}
          </div>
        </div>
      </Card>
    );
  }

  // Vertical layout (like the first image)
  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-food-card rounded-2xl bg-white cursor-pointer hover:shadow-food-card-hover hover:-translate-y-1 transition-all duration-300",
        className
      )}
      onClick={onClick}
    >
      <div className="flex gap-4 p-4">
        {/* Image on left */}
        <div className="relative flex-shrink-0 w-28 h-28 rounded-xl overflow-hidden">
          <img
            src={thumbnail}
            alt={dishName}
            className="w-full h-full object-cover"
          />
          {badge && (
            <Badge className="absolute top-2 left-2 bg-green-500 text-white border-0 text-xs font-semibold px-2 py-0.5 rounded-full z-10">
              {badge}
            </Badge>
          )}
          {/* Favorite Button */}
          {onFavorite && (
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFavorite();
              }}
              className={cn(
                "absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all",
                isFavorite && "bg-red-50 hover:bg-red-100"
              )}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart
                className={cn(
                  "w-3.5 h-3.5 transition-all",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                )}
              />
            </Button>
          )}
        </div>

        {/* Details on right */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Rating in top right */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{dishName}</h3>
              <p className="text-sm text-gray-600 font-medium mt-0.5">{vendorName}</p>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-900">{rating}</span>
            </div>
          </div>

          {/* Location */}
          {distance && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="w-3.5 h-3.5" />
              <span>{distance}</span>
            </div>
          )}

          {/* Price and Add Button */}
          <div className="flex items-center justify-between pt-1">
            <span className="font-bold text-xl text-gray-900">₹{price}</span>
            {renderAction()}
          </div>
        </div>
      </div>
    </Card>
  );
};

