import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

interface Address {
  id: string;
  label: string;
  line1: string;
}

const STORAGE_KEY = "foodiestream-addresses";

const SavedAddresses = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newLabel, setNewLabel] = useState("");
  const [newLine1, setNewLine1] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setAddresses(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: Address[]) => {
    setAddresses(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = () => {
    if (!newLine1.trim()) {
      toast.info("Please enter an address");
      return;
    }
    const addr: Address = {
      id: String(Date.now()),
      label: newLabel.trim() || "Home",
      line1: newLine1.trim(),
    };
    persist([addr, ...addresses]);
    setNewLabel("");
    setNewLine1("");
    toast.success("Address added");
  };

  const handleDelete = (id: string) => {
    persist(addresses.filter((a) => a.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="sticky top-0 z-40 bg-white shadow-sm border-gray-100 border-b">
        <div className="px-4 py-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="rounded-xl hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Saved Addresses</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        <Card className="p-4 border-0 shadow-food-card rounded-2xl bg-white space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Add New Address</h2>
          <Input
            placeholder="Label (e.g. Home, Work)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Address line"
            value={newLine1}
            onChange={(e) => setNewLine1(e.target.value)}
            className="rounded-xl"
          />
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold flex items-center justify-center gap-2"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
            Save Address
          </Button>
        </Card>

        <div className="space-y-3">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              className="p-4 border-0 shadow-food-card rounded-2xl bg-white flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-lg bg-gray-50">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                    {addr.label}
                  </p>
                  <p className="text-xs text-gray-500 line-clamp-1">{addr.line1}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(addr.id)}
                className="rounded-full hover:bg-red-50 text-red-500 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
          {addresses.length === 0 && (
            <p className="text-xs text-gray-500 text-center">
              No saved addresses yet.
            </p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default SavedAddresses;


