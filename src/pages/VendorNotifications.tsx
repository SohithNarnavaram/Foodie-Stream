import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
  newOrders: boolean;
  orderUpdates: boolean;
  reviews: boolean;
  promotions: boolean;
}

const STORAGE_KEY = "vendor-notification-settings";

const VendorNotifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
    newOrders: true,
    orderUpdates: true,
    reviews: true,
    promotions: false,
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const updateSetting = (key: keyof NotificationSettings, value: boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success("Notification preferences updated");
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
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          </div>
        </div>
      </div>

      <main className="px-4 pt-6 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">Order alerts and updates</p>
              </div>
            </div>
            <Switch
              checked={settings.push}
              onCheckedChange={(val) => updateSetting("push", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Updates</p>
                <p className="text-xs text-gray-500">Reports and summaries</p>
              </div>
            </div>
            <Switch
              checked={settings.email}
              onCheckedChange={(val) => updateSetting("email", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">SMS Alerts</p>
                <p className="text-xs text-gray-500">Urgent order notifications</p>
              </div>
            </div>
            <Switch
              checked={settings.sms}
              onCheckedChange={(val) => updateSetting("sms", val)}
            />
          </div>
        </Card>

        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <h3 className="font-semibold text-gray-900 mb-2">Notification Types</h3>
          
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">New Orders</p>
              <p className="text-xs text-gray-500">Get notified when new orders arrive</p>
            </div>
            <Switch
              checked={settings.newOrders}
              onCheckedChange={(val) => updateSetting("newOrders", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Order Updates</p>
              <p className="text-xs text-gray-500">Status changes and cancellations</p>
            </div>
            <Switch
              checked={settings.orderUpdates}
              onCheckedChange={(val) => updateSetting("orderUpdates", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Reviews & Ratings</p>
              <p className="text-xs text-gray-500">Customer feedback notifications</p>
            </div>
            <Switch
              checked={settings.reviews}
              onCheckedChange={(val) => updateSetting("reviews", val)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900">Promotions</p>
              <p className="text-xs text-gray-500">Platform offers and deals</p>
            </div>
            <Switch
              checked={settings.promotions}
              onCheckedChange={(val) => updateSetting("promotions", val)}
            />
          </div>
        </Card>

        <Button
          className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold mt-2"
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </main>

      <VendorBottomNav />
    </div>
  );
};

export default VendorNotifications;

