import { useState, useMemo } from "react";
import { MapPin, Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Location {
  id: string;
  name: string;
  area?: string;
  state: string;
}

const indianCities: Location[] = [
  { id: "blr", name: "Bengaluru", area: "Koramangala", state: "Karnataka" },
  { id: "blr-2", name: "Bengaluru", area: "Indiranagar", state: "Karnataka" },
  { id: "blr-3", name: "Bengaluru", area: "Whitefield", state: "Karnataka" },
  { id: "blr-4", name: "Bengaluru", area: "HSR Layout", state: "Karnataka" },
  { id: "blr-5", name: "Bengaluru", area: "MG Road", state: "Karnataka" },
  { id: "mum", name: "Mumbai", area: "Andheri", state: "Maharashtra" },
  { id: "mum-2", name: "Mumbai", area: "Bandra", state: "Maharashtra" },
  { id: "mum-3", name: "Mumbai", area: "Powai", state: "Maharashtra" },
  { id: "del", name: "Delhi", area: "Connaught Place", state: "Delhi" },
  { id: "del-2", name: "Delhi", area: "Gurgaon", state: "Haryana" },
  { id: "del-3", name: "Delhi", area: "Noida", state: "Uttar Pradesh" },
  { id: "hyd", name: "Hyderabad", area: "Hitech City", state: "Telangana" },
  { id: "hyd-2", name: "Hyderabad", area: "Banjara Hills", state: "Telangana" },
  { id: "che", name: "Chennai", area: "T. Nagar", state: "Tamil Nadu" },
  { id: "che-2", name: "Chennai", area: "Anna Nagar", state: "Tamil Nadu" },
  { id: "kol", name: "Kolkata", area: "Park Street", state: "West Bengal" },
  { id: "pune", name: "Pune", area: "Koregaon Park", state: "Maharashtra" },
  { id: "ahm", name: "Ahmedabad", area: "Navrangpura", state: "Gujarat" },
  { id: "jaipur", name: "Jaipur", area: "Malviya Nagar", state: "Rajasthan" },
  { id: "lucknow", name: "Lucknow", area: "Gomti Nagar", state: "Uttar Pradesh" },
  { id: "chandigarh", name: "Chandigarh", area: "Sector 17", state: "Chandigarh" },
];

interface LocationSelectorProps {
  className?: string;
}

export const LocationSelector = ({ className }: LocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Load saved location from localStorage
  const savedLocation = localStorage.getItem("selectedLocation");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    savedLocation ? JSON.parse(savedLocation) : indianCities[0] // Default to first Bengaluru location
  );

  // Filter locations based on search
  const filteredLocations = useMemo(() => {
    if (!searchQuery.trim()) {
      return indianCities;
    }
    const query = searchQuery.toLowerCase();
    return indianCities.filter(
      (loc) =>
        loc.name.toLowerCase().includes(query) ||
        loc.area?.toLowerCase().includes(query) ||
        loc.state.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSelectLocation = (location: Location) => {
    setSelectedLocation(location);
    localStorage.setItem("selectedLocation", JSON.stringify(location));
    setIsOpen(false);
    setSearchQuery("");
  };

  const displayText = selectedLocation
    ? selectedLocation.area
      ? `${selectedLocation.area}, ${selectedLocation.name}`
      : selectedLocation.name
    : "Select Location";

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-1.5 text-sm font-semibold text-gray-900 hover:text-primary transition-colors",
            className
          )}
        >
          <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
          <span className="line-clamp-1">{displayText}</span>
          <ChevronDown className="w-4 h-4 flex-shrink-0" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md h-[80vh] max-h-[80vh] p-0 gap-0 bg-white rounded-2xl overflow-hidden flex flex-col [&>button]:hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">Select Location</DialogTitle>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>
        
        <div className="px-6 pt-4 pb-6 flex flex-col flex-1 min-h-0">
          {/* Search Input */}
          <div className="relative mb-4 flex-shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for city, area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 h-11 rounded-xl border-gray-200 focus:border-primary"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Location List */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="space-y-2 pr-4">
              {filteredLocations.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No locations found
                </div>
              ) : (
                filteredLocations.map((location) => {
                  const isSelected = selectedLocation?.id === location.id;
                  return (
                    <button
                      key={location.id}
                      onClick={() => handleSelectLocation(location)}
                      className={cn(
                        "w-full text-left p-4 rounded-xl border-2 transition-all hover:bg-gray-50",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 bg-white"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin
                          className={cn(
                            "w-5 h-5 mt-0.5 flex-shrink-0",
                            isSelected ? "text-primary" : "text-gray-400"
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={cn(
                                "font-semibold text-sm",
                                isSelected ? "text-primary" : "text-gray-900"
                              )}
                            >
                              {location.area || location.name}
                            </p>
                            {isSelected && (
                              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {location.area ? `${location.name}, ` : ""}
                            {location.state}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

