import { Home, Compass, ShoppingCart, User, UtensilsCrossed } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: "Home", path: "/home" },
    { icon: UtensilsCrossed, label: "Menu", path: "/menu" },
    { icon: Compass, label: "Discover", path: "/discover" },
    { icon: ShoppingCart, label: "Cart", path: "/cart" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const isBitesPage = location.pathname === "/bites";

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 safe-area-bottom w-full max-w-md px-4">
      <div className={cn(
        "flex items-center justify-around gap-1 rounded-2xl px-2 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 h-[56px]",
        isBitesPage 
          ? "bg-black/40 backdrop-blur-md border-white/20" 
          : "bg-white"
      )}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className={cn(
                "relative flex items-center justify-center flex-1 h-full min-h-[44px] overflow-hidden",
                "rounded-xl",
                isBitesPage 
                  ? "hover:bg-white/10 active:scale-[0.98]"
                  : "hover:bg-gray-100 active:scale-[0.98]"
              )}
            >
              {/* Smooth background transition overlay */}
              <span
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className={cn(
                  "absolute inset-0 rounded-xl bg-primary",
                  isActive ? "opacity-100" : "opacity-0"
                )}
                aria-hidden="true"
              />
              {/* Icon with smooth color and scale transition */}
              <Icon 
                style={{
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
                className={cn(
                  "relative z-10 transform",
                  "w-5 h-5",
                  isActive 
                    ? "text-white scale-110" 
                    : isBitesPage 
                      ? "text-white scale-100"
                      : "text-gray-600 scale-100"
                )} 
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
};
