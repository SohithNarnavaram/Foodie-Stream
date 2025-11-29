import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { toast } from "sonner";

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
}

const STORAGE_KEY = "foodiestream-payments";

const PaymentMethods = () => {
  const navigate = useNavigate();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [brand, setBrand] = useState("");
  const [cardNumber, setCardNumber] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setMethods(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: PaymentMethod[]) => {
    setMethods(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleAdd = () => {
    const sanitized = cardNumber.replace(/\s+/g, "");
    if (sanitized.length < 4) {
      toast.info("Enter a valid card number (only last 4 are stored)");
      return;
    }
    const method: PaymentMethod = {
      id: String(Date.now()),
      brand: brand.trim() || "Card",
      last4: sanitized.slice(-4),
    };
    persist([method, ...methods]);
    setBrand("");
    setCardNumber("");
    toast.success("Payment method added");
  };

  const handleDelete = (id: string) => {
    persist(methods.filter((m) => m.id !== id));
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
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        <Card className="p-4 border-0 shadow-food-card rounded-2xl bg-white space-y-3">
          <h2 className="text-sm font-semibold text-gray-900">Add New Card</h2>
          <Input
            placeholder="Card brand (e.g. Visa, Mastercard)"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className="rounded-xl"
          />
          <Input
            placeholder="Card number"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            className="rounded-xl"
          />
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-white rounded-full font-semibold flex items-center justify-center gap-2"
            onClick={handleAdd}
          >
            <Plus className="w-4 h-4" />
            Save Card
          </Button>
          <p className="text-[11px] text-gray-400">
            We only store the card brand and last 4 digits for display purposes. This is a UI
            demo, not a real payment integration.
          </p>
        </Card>

        <div className="space-y-3">
          {methods.map((m) => (
            <Card
              key={m.id}
              className="p-4 border-0 shadow-food-card rounded-2xl bg-white flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gray-50">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {m.brand} •••• {m.last4}
                  </p>
                  <p className="text-xs text-gray-500">Default payment method</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(m.id)}
                className="rounded-full hover:bg-red-50 text-red-500 flex-shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </Card>
          ))}
          {methods.length === 0 && (
            <p className="text-xs text-gray-500 text-center">
              No saved payment methods yet.
            </p>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default PaymentMethods;



