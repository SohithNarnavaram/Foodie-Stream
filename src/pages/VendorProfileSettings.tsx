import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

const VendorProfileSettings = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "Rajesh Sharma",
    email: "vendor@example.com",
    phone: "+91 98765 43210",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("vendor-profile-settings", JSON.stringify(formData));
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/profile")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-primary/10">
                <AvatarFallback className="bg-primary text-white text-3xl font-bold">
                  RS
                </AvatarFallback>
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full bg-primary hover:bg-primary/90"
              >
                <Camera className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">Tap to change profile picture</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1"
              />
            </div>
          </div>
        </Card>

        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold py-6">
          Save Changes
        </Button>
      </form>

      <VendorBottomNav />
    </div>
  );
};

export default VendorProfileSettings;


