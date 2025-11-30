import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, X, Eye, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { liveStreams } from "@/data/mockData";
import { cn } from "@/lib/utils";

const LiveStreamsFeed = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Filter streams based on search
  const filteredStreams = useMemo(() => {
    if (!searchQuery.trim()) {
      return liveStreams.filter(stream => stream.isLive);
    }

    const query = searchQuery.toLowerCase().trim();
    return liveStreams.filter(
      (stream) =>
        stream.dishName.toLowerCase().includes(query) ||
        stream.vendorName.toLowerCase().includes(query) ||
        stream.cuisine.toLowerCase().includes(query)
    ).filter(stream => stream.isLive);
  }, [searchQuery]);

  const handleStreamClick = (streamId: string) => {
    navigate(`/live/${streamId}`);
  };

  const formatViewers = (viewers: number) => {
    if (viewers >= 1000) {
      return `${(viewers / 1000).toFixed(1)}K`;
    }
    return viewers.toString();
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Live Streams</h1>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search live streams..."
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

      {/* Main Content - YouTube-like Grid */}
      <main className="px-4 py-6">
        {filteredStreams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredStreams.map((stream) => (
              <div
                key={stream.id}
                className="cursor-pointer group"
                onClick={() => handleStreamClick(stream.id)}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 mb-3">
                  <img
                    src={stream.thumbnail}
                    alt={stream.dishName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* LIVE Badge */}
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 animate-pulse shadow-lg font-semibold text-xs px-2.5 py-1 rounded-full">
                    <span className="relative flex h-2 w-2 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                  </Badge>

                  {/* Viewers Count */}
                  <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {formatViewers(stream.viewers)}
                  </div>

                  {/* Duration/ETA */}
                  <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-semibold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {stream.eta}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex gap-3">
                  {/* Vendor Avatar Placeholder */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-orange-500 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">
                    {stream.vendorName.charAt(0)}
                  </div>

                  {/* Title and Metadata */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 mb-1 group-hover:text-primary transition-colors">
                      {stream.dishName}
                    </h3>
                    <p className="text-xs text-gray-600 mb-1 line-clamp-1">
                      {stream.vendorName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{formatViewers(stream.viewers)} watching</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{stream.distance}</span>
                      </div>
                    </div>
                    {stream.verified && (
                      <div className="flex items-center gap-1 mt-1">
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 border-primary text-primary">
                          Verified
                        </Badge>
                        {stream.hygieneRating > 0 && (
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] text-gray-600">{stream.hygieneRating}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 text-lg mb-2">No live streams found</p>
            <p className="text-gray-400 text-sm mb-4">
              {searchQuery
                ? `No streams match "${searchQuery}"`
                : "There are no live streams available right now."}
            </p>
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="mt-2"
              >
                Clear Search
              </Button>
            )}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default LiveStreamsFeed;

