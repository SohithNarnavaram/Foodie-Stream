import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, User, Bell, MapPin, CreditCard, HelpCircle, LogOut, Store, ListOrdered, Route } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Load user data from localStorage - check both login data and saved profile
    const loadUserData = () => {
      // First check saved profile, then fallback to login data
      try {
        const savedProfile = localStorage.getItem("foodiestream-profile");
        if (savedProfile) {
          const profile = JSON.parse(savedProfile);
          setUserName(profile.name || localStorage.getItem("userName") || "");
          setUserEmail(profile.email || localStorage.getItem("userEmail") || "");
        } else {
          // Use login data
          setUserName(localStorage.getItem("userName") || "");
          setUserEmail(localStorage.getItem("userEmail") || "");
        }
      } catch {
        // Fallback to login data
        setUserName(localStorage.getItem("userName") || "");
        setUserEmail(localStorage.getItem("userEmail") || "");
      }
    };
    
    loadUserData();
  }, [location.pathname]); // Reload when navigating back from edit profile

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "FU"; // Default: Foodie User
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Display name or fallback
  const displayName = userName || "Foodie User";
  const displayEmail = userEmail || "foodie@example.com";

  const handleLogout = () => {
    // Get user type before clearing
    const userType = localStorage.getItem("userType");
    
    // Clear authentication data
    localStorage.removeItem("userType");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorName");
    
    // Clear cart, favorites, and orders (optional - you might want to keep these)
    // localStorage.removeItem("cart");
    // localStorage.removeItem("favorites");
    // localStorage.removeItem("orders");
    
    toast.success("Logged out successfully");
    
    // Redirect to appropriate sign-in page
    if (userType === "vendor") {
      navigate("/vendor/signin");
    } else {
      navigate("/user/signin");
    }
  };

  const menuItems = [
    { icon: Store, label: "Vendor Dashboard", onClick: () => navigate("/vendor-dashboard") },
    { icon: ListOrdered, label: "Your Orders", onClick: () => navigate("/order-details") },
    { icon: Route, label: "Track Orders", onClick: () => navigate("/order-tracking") },
    { icon: User, label: "Edit Profile", onClick: () => navigate("/edit-profile") },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/notifications") },
    { icon: MapPin, label: "Saved Addresses", onClick: () => navigate("/saved-addresses") },
    { icon: CreditCard, label: "Payment Methods", onClick: () => navigate("/payment-methods") },
    { icon: HelpCircle, label: "Help & Support", onClick: () => navigate("/help-support") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="rounded-xl hover:bg-gray-100">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <Card className="p-6 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20 border-4 border-primary/10">
              <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
              <p className="text-sm text-gray-600 font-medium">{displayEmail}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-4 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Card
              key={index}
              className="p-4 cursor-pointer hover:shadow-food-card-hover transition-all duration-200 border-0 shadow-food-card rounded-xl bg-white"
              onClick={item.onClick}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="font-semibold text-gray-900">{item.label}</span>
              </div>
            </Card>
          );
        })}

        <Separator className="my-4 bg-gray-200" />

        <Card
          className="p-4 cursor-pointer hover:bg-red-50 transition-all duration-200 border-0 shadow-food-card rounded-xl bg-white"
          onClick={handleLogout}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-50">
              <LogOut className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-semibold text-red-500">Logout</span>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Profile;
