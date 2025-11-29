import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingCartProps {
  itemCount: number;
  className?: string;
}

export const FloatingCart = ({ itemCount, className }: FloatingCartProps) => {
  const navigate = useNavigate();

  if (itemCount === 0) return null;

  return (
    <button
      onClick={() => navigate("/cart")}
      className={cn(
        "fixed bottom-24 left-1/2 -translate-x-1/2 z-40",
        "bg-gray-900 hover:bg-gray-800 text-white",
        "px-6 py-3 rounded-full shadow-lg",
        "flex items-center gap-3",
        "transition-all duration-200 hover:scale-105 active:scale-95",
        className
      )}
    >
      <ShoppingBag className="w-5 h-5" />
      <span className="font-semibold text-sm">
        {itemCount} {itemCount === 1 ? "Item" : "Items"}
      </span>
    </button>
  );
};

