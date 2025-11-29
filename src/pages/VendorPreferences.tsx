import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Globe, Clock, DollarSign, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

const VendorPreferences = () => {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    language: "en",
    currency: "INR",
    timezone: "Asia/Kolkata",
    autoAccept: false,
    autoPrepare: false,
    showRevenue: true,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vendor-preferences");
      if (stored) {
        setPreferences(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("vendor-preferences", JSON.stringify(preferences));
    toast.success("Preferences saved");
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
            <h1 className="text-2xl font-bold text-gray-900">Preferences</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Language & Region</h3>
          </div>

          <div>
            <Label>Language</Label>
            <Select value={preferences.language} onValueChange={(val) => setPreferences({ ...preferences, language: val })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="mr">Marathi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Currency</Label>
            <Select value={preferences.currency} onValueChange={(val) => setPreferences({ ...preferences, currency: val })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR</SelectItem>
                <SelectItem value="USD">$ USD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Timezone</Label>
            <Select value={preferences.timezone} onValueChange={(val) => setPreferences({ ...preferences, timezone: val })}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Asia/Kolkata">IST (Asia/Kolkata)</SelectItem>
                <SelectItem value="UTC">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Order Management</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Auto Accept Orders</p>
              <p className="text-xs text-gray-500">Automatically accept incoming orders</p>
            </div>
            <Switch
              checked={preferences.autoAccept}
              onCheckedChange={(val) => setPreferences({ ...preferences, autoAccept: val })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Auto Start Preparing</p>
              <p className="text-xs text-gray-500">Begin preparation automatically</p>
            </div>
            <Switch
              checked={preferences.autoPrepare}
              onCheckedChange={(val) => setPreferences({ ...preferences, autoPrepare: val })}
            />
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-gray-900">Display Settings</h3>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Show Revenue</p>
              <p className="text-xs text-gray-500">Display revenue on dashboard</p>
            </div>
            <Switch
              checked={preferences.showRevenue}
              onCheckedChange={(val) => setPreferences({ ...preferences, showRevenue: val })}
            />
          </div>
        </Card>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold mt-2"
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorPreferences;


