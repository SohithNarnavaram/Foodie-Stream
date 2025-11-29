import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
}

const STORAGE_KEY = "foodiestream-profile";

const EditProfile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileData>({
    name: "Foodie User",
    email: "foodie@example.com",
    phone: "",
  });

  useEffect(() => {
    // Load from login data first, then from saved profile
    const loginName = localStorage.getItem("userName") || "";
    const loginEmail = localStorage.getItem("userEmail") || "";
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const savedProfile = JSON.parse(stored);
        setProfile({
          name: savedProfile.name || loginName || "Foodie User",
          email: savedProfile.email || loginEmail || "foodie@example.com",
          phone: savedProfile.phone || "",
        });
      } else {
        // Use login data if no saved profile
        setProfile({
          name: loginName || "Foodie User",
          email: loginEmail || "foodie@example.com",
          phone: "",
        });
      }
    } catch {
      // Fallback to login data
      setProfile({
        name: loginName || "Foodie User",
        email: loginEmail || "foodie@example.com",
        phone: "",
      });
    }
  }, []);

  const handleChange = (field: keyof ProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Save to both profile storage and sync with login data
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem("userName", profile.name);
    localStorage.setItem("userEmail", profile.email);
    if (profile.phone) {
      localStorage.setItem("userPhone", profile.phone);
    }
    toast.success("Profile updated");
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={profile.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={profile.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={profile.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="rounded-xl"
              placeholder="+91-"
            />
          </div>
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold mt-2"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default EditProfile;


