import { Eye, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface LiveCardProps {
  vendorName: string;
  dishName: string;
  thumbnail: string;
  distance: string;
  viewers: number;
  isLive?: boolean;
  className?: string;
  onClick?: () => void;
}

export const LiveCard = ({
  vendorName,
  dishName,
  thumbnail,
  distance,
  viewers,
  isLive = false,
  className,
  onClick,
}: LiveCardProps) => {
  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-food-card-hover hover:-translate-y-1 active:scale-[0.98] border-0 shadow-food-card rounded-2xl bg-white",
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        <img
          src={thumbnail}
          alt={dishName}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {isLive && (
          <Badge className="absolute top-3 left-3 bg-red-500 text-white border-0 animate-pulse shadow-lg font-semibold text-xs px-2.5 py-1 rounded-full">
            <span className="relative flex h-2 w-2 mr-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </Badge>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 drop-shadow-lg">
            {dishName}
          </h3>
          <p className="text-white/95 text-sm line-clamp-1 font-medium drop-shadow-md">{vendorName}</p>
        </div>
      </div>
      
      <div className="p-4 flex items-center justify-between bg-white">
        <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{distance}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-600 text-xs font-medium">
          <Eye className="w-4 h-4 text-primary" />
          <span>{viewers} watching</span>
        </div>
      </div>
    </Card>
  );
};
