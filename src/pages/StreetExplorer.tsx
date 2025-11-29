import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveCard } from "@/components/LiveCard";
import { streetFoods } from "@/data/mockData";

const StreetExplorer = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Street Food Explorer</h1>
          </div>
          <p className="text-sm text-gray-600 ml-12 font-medium">
            Authentic street food, live and verified
          </p>
        </div>
      </header>

      {/* Street Food Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {streetFoods.map((food) => (
            <LiveCard
              key={food.id}
              {...food}
              onClick={() => navigate(`/live/${food.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreetExplorer;
