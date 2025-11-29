import { useState } from "react";
import { X, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FilterOptions {
  priceRange: [number, number];
  minRating: number;
  verifiedOnly: boolean;
  liveOnly: boolean;
  selectedCuisines: string[];
}

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: string[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export const FilterSheet = ({
  open,
  onOpenChange,
  categories,
  filters,
  onFiltersChange,
  onReset,
}: FilterSheetProps) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultFilters: FilterOptions = {
      priceRange: [0, 500],
      minRating: 0,
      verifiedOnly: false,
      liveOnly: false,
      selectedCuisines: [],
    };
    setLocalFilters(defaultFilters);
    onReset();
  };

  const toggleCuisine = (cuisine: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      selectedCuisines: prev.selectedCuisines.includes(cuisine)
        ? prev.selectedCuisines.filter((c) => c !== cuisine)
        : [...prev.selectedCuisines, cuisine],
    }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[90%] md:w-[45%] max-w-[90%] md:max-w-[45%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-gray-900">Filters</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Price Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold text-gray-900">Price Range</Label>
              <span className="text-sm text-gray-600">
                ₹{localFilters.priceRange[0]} - ₹{localFilters.priceRange[1]}
              </span>
            </div>
            <Slider
              value={localFilters.priceRange}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))
              }
              min={0}
              max={500}
              step={10}
              className="w-full"
            />
          </div>

          <Separator />

          {/* Rating */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">Minimum Rating</Label>
            <div className="flex gap-2">
              {[0, 3, 4, 4.5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setLocalFilters((prev) => ({ ...prev, minRating: rating }))}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-lg border transition-all",
                    localFilters.minRating === rating
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                >
                  {rating > 0 && <Star className="w-4 h-4 fill-current" />}
                  <span className="font-medium">{rating === 0 ? "Any" : rating}</span>
                </button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Cuisine Types */}
          <div className="space-y-4">
            <Label className="text-base font-semibold text-gray-900">Cuisine Type</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cuisine) => (
                <Badge
                  key={cuisine}
                  variant={localFilters.selectedCuisines.includes(cuisine) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-3 py-1.5 text-sm font-medium transition-all",
                    localFilters.selectedCuisines.includes(cuisine)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-gray-700 border-gray-300 hover:border-primary"
                  )}
                  onClick={() => toggleCuisine(cuisine)}
                >
                  {localFilters.selectedCuisines.includes(cuisine) && (
                    <Check className="w-3 h-3 mr-1" />
                  )}
                  {cuisine}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-gray-900">Verified Only</Label>
                <p className="text-sm text-gray-500">Show only verified vendors</p>
              </div>
              <Switch
                checked={localFilters.verifiedOnly}
                onCheckedChange={(checked) =>
                  setLocalFilters((prev) => ({ ...prev, verifiedOnly: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-semibold text-gray-900">Live Only</Label>
                <p className="text-sm text-gray-500">Show only live streams</p>
              </div>
              <Switch
                checked={localFilters.liveOnly}
                onCheckedChange={(checked) =>
                  setLocalFilters((prev) => ({ ...prev, liveOnly: checked }))
                }
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 right-0 w-[90%] md:w-[45%] max-w-[90%] md:max-w-[45%] bg-white border-t border-gray-200 p-4 space-y-2">
          <Button
            onClick={handleReset}
            variant="outline"
            className="w-full border-gray-300"
          >
            Reset Filters
          </Button>
          <Button
            onClick={handleApply}
            className="w-full bg-primary hover:bg-primary/90 text-white"
          >
            Apply Filters
          </Button>
        </div>
        <div className="h-24" /> {/* Spacer for fixed footer */}
      </SheetContent>
    </Sheet>
  );
};

