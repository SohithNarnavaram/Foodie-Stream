import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, User, Bell, Settings, CreditCard, HelpCircle, LogOut, Shield, MapPin, Phone, Mail, ChefHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";
import { HygieneBadge } from "@/components/HygieneBadge";
import { VerifiedBadge } from "@/components/VerifiedBadge";

const VendorProfile = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("userType");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorName");
    
    toast.success("Logged out successfully");
    navigate("/vendor/signin");
  };

  const menuItems = [
    { icon: Store, label: "Business Info", onClick: () => navigate("/vendor/business-info") },
    { icon: User, label: "Profile Settings", onClick: () => navigate("/vendor/profile-settings") },
    { icon: Bell, label: "Notifications", onClick: () => navigate("/vendor/notifications") },
    { icon: Settings, label: "Preferences", onClick: () => navigate("/vendor/preferences") },
    { icon: CreditCard, label: "Payment & Payouts", onClick: () => navigate("/vendor/payments-payouts") },
    { icon: Shield, label: "Verification", onClick: () => navigate("/vendor/verification") },
    { icon: HelpCircle, label: "Help & Support", onClick: () => navigate("/vendor/help-support") },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/home")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          </div>
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-4 py-6">
        <Card className="p-6 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20 border-4 border-primary/10">
              <AvatarFallback className="bg-primary text-white text-2xl font-bold">
                SSK
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">Sharma's Street Kitchen</h2>
              <p className="text-sm text-gray-600 font-medium">vendor@example.com</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <Badge className="bg-orange-100 text-orange-700 border-0 hover:bg-orange-200">
                  <ChefHat className="w-3 h-3 mr-1" />
                  Chef
                </Badge>
                <VerifiedBadge />
                <HygieneBadge rating={4.5} />
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">123 Food Street, Mumbai, Maharashtra</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">+91 98765 43210</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-gray-700">vendor@example.com</span>
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

      <VendorBottomNav />
    </div>
  );
};

export default VendorProfile;
