import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Store, MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

const VendorBusinessInfo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    businessName: "Sharma's Street Kitchen",
    ownerName: "Rajesh Sharma",
    email: "vendor@example.com",
    phone: "+91 98765 43210",
    address: "123 Food Street",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400001",
    cuisine: "North Indian",
    description: "Authentic North Indian street food with a modern twist",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Save to localStorage
    localStorage.setItem("vendor-business-info", JSON.stringify(formData));
    toast.success("Business information updated successfully");
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
            <h1 className="text-2xl font-bold text-gray-900">Business Info</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <Store className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Business Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="ownerName">Owner Name</Label>
              <Input
                id="ownerName"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="cuisine">Cuisine Type</Label>
              <Input
                id="cuisine"
                value={formData.cuisine}
                onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
                className="mt-1"
                placeholder="e.g., North Indian, South Indian"
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1"
                rows={3}
                placeholder="Tell customers about your business"
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-primary/10">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Contact Information</h2>
          </div>

          <div className="space-y-4">
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

            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
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

export default VendorBusinessInfo;


