import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Bell, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

interface NotificationSettings {
  push: boolean;
  email: boolean;
  sms: boolean;
}

const STORAGE_KEY = "foodiestream-notifications";

const Notifications = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>({
    push: true,
    email: true,
    sms: false,
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
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-50">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Push Notifications</p>
                <p className="text-xs text-gray-500">
                  Order status, offers and updates
                </p>
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
                <p className="text-xs text-gray-500">
                  Bills, receipts and important announcements
                </p>
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
                <p className="text-xs text-gray-500">
                  Delivery alerts and time-sensitive messages
                </p>
              </div>
            </div>
            <Switch
              checked={settings.sms}
              onCheckedChange={(val) => updateSetting("sms", val)}
            />
          </div>

          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold mt-2"
            onClick={handleSave}
          >
            Save Preferences
          </Button>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Notifications;


