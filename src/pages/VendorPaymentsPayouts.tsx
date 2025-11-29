import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Wallet, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { VendorBottomNav } from "@/components/VendorBottomNav";
import { toast } from "sonner";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountHolder: string;
  isDefault: boolean;
}

const VendorPaymentsPayouts = () => {
  const navigate = useNavigate();
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([
    {
      id: "1",
      bankName: "HDFC Bank",
      accountNumber: "****1234",
      ifsc: "HDFC0001234",
      accountHolder: "Rajesh Sharma",
      isDefault: true,
    },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
  });

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vendor-bank-accounts");
      if (stored) {
        setBankAccounts(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      ...formData,
      isDefault: bankAccounts.length === 0,
    };
    const updated = [...bankAccounts, newAccount];
    setBankAccounts(updated);
    localStorage.setItem("vendor-bank-accounts", JSON.stringify(updated));
    setShowAddForm(false);
    setFormData({ bankName: "", accountNumber: "", ifsc: "", accountHolder: "" });
    toast.success("Bank account added");
  };

  const handleDelete = (id: string) => {
    const updated = bankAccounts.filter((acc) => acc.id !== id);
    setBankAccounts(updated);
    localStorage.setItem("vendor-bank-accounts", JSON.stringify(updated));
    toast.success("Bank account removed");
  };

  const handleSetDefault = (id: string) => {
    const updated = bankAccounts.map((acc) => ({
      ...acc,
      isDefault: acc.id === id,
    }));
    setBankAccounts(updated);
    localStorage.setItem("vendor-bank-accounts", JSON.stringify(updated));
    toast.success("Default account updated");
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
            <h1 className="text-2xl font-bold text-gray-900">Payments & Payouts</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Earnings Summary */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <Wallet className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Earnings</h2>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Available Balance</span>
              <span className="text-2xl font-bold text-primary">₹12,450</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Pending</span>
              <span className="text-gray-900">₹3,200</span>
            </div>
            <Button className="w-full mt-4 bg-primary hover:bg-primary/90">
              Request Payout
            </Button>
          </div>
        </Card>

        {/* Bank Accounts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-gray-900">Bank Accounts</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Account
            </Button>
          </div>

          {showAddForm && (
            <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white mb-4">
              <form onSubmit={handleAddAccount} className="space-y-4">
                <div>
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Account Number</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>IFSC Code</Label>
                  <Input
                    value={formData.ifsc}
                    onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label>Account Holder Name</Label>
                  <Input
                    value={formData.accountHolder}
                    onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
                    Add Account
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          <div className="space-y-3">
            {bankAccounts.map((account) => (
              <Card key={account.id} className="p-4 border-0 shadow-food-card rounded-xl bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{account.bankName}</span>
                      {account.isDefault && (
                        <Badge className="bg-primary text-white text-xs">Default</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{account.accountNumber}</p>
                    <p className="text-xs text-gray-500">IFSC: {account.ifsc}</p>
                    <p className="text-xs text-gray-500">{account.accountHolder}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    {!account.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetDefault(account.id)}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(account.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorPaymentsPayouts;


