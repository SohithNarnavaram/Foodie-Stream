import { Video, ShoppingBag, Utensils, BarChart3, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const VendorBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { icon: Video, label: "Live", path: "/vendor/home" },
    { icon: ShoppingBag, label: "Orders", path: "/vendor/orders" },
    { icon: Utensils, label: "Menu", path: "/vendor/menu" },
    { icon: BarChart3, label: "Analytics", path: "/vendor/analytics" },
    { icon: User, label: "Profile", path: "/vendor/profile" },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 safe-area-bottom w-full max-w-md px-4">
      <div className="flex items-center justify-around gap-1 bg-white rounded-2xl px-2 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-100 h-[56px]">
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
                "hover:bg-gray-100 active:scale-[0.98]"
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

