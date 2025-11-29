import { useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, Phone, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";

const faqs = [
  {
    q: "Where is my order?",
    a: "You can track your current order from Profile → Track Orders, or from the success screen after checkout.",
  },
  {
    q: "How do I modify or cancel an order?",
    a: "Changes are supported only while the restaurant is still preparing your food. Please contact support or the restaurant directly.",
  },
  {
    q: "I have an issue with a delivery.",
    a: "Reach out to support with your order ID and a short description. We’ll review and help you quickly.",
  },
  {
    q: "Can I add special instructions for the chef?",
    a: "Yes. You can add cooking notes or special instructions on the checkout page before placing your order.",
  },
  {
    q: "What payment methods are supported?",
    a: "You can save and manage cards under Profile → Payment Methods. UPI and wallet integrations can be added in future updates.",
  },
  {
    q: "How do I change my address?",
    a: "You can add or edit addresses from Profile → Saved Addresses. For a live order, changing the address may not always be possible.",
  },
  {
    q: "Why did I not receive a notification?",
    a: "Check that notifications are enabled under Profile → Notifications and that system permissions are granted for FoodieStream.",
  },
];

const HelpSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
        </div>
      </header>

      <main className="px-4 pt-6 space-y-4">
        {/* Quick contact card */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-50">
              <HelpCircle className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Need help with an order?</p>
              <p className="text-xs text-gray-500">
                Our support team is here to help you with live orders, payments, or account issues.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full text-sm font-semibold flex items-center justify-center gap-2"
              onClick={() => navigate("/support-chat")}
            >
              <MessageCircle className="w-4 h-4" />
              Chat with support
            </Button>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="inline-flex items-center gap-1">
              <Phone className="w-3 h-3" />
              +91-98765-43210
            </span>
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3 h-3" />
              support@foodiestream.app
            </span>
          </div>
        </Card>

        {/* FAQs */}
        <Card className="p-4 border-0 shadow-sm rounded-2xl bg-white space-y-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-1">Quick FAQs</h2>
          {faqs.map((item) => (
            <div key={item.q} className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">{item.q}</p>
              <p className="text-xs text-gray-500">{item.a}</p>
            </div>
          ))}
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default HelpSupport;


