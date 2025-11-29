import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, MessageCircle, Phone, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { VendorBottomNav } from "@/components/VendorBottomNav";

const VendorHelpSupport = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I start a live stream?",
      answer: "Go to your dashboard and click 'Go Live Now'. Make sure your camera and microphone permissions are enabled.",
    },
    {
      question: "How do I manage orders?",
      answer: "Navigate to the Orders page from the bottom navigation. You can view, accept, and update order statuses there.",
    },
    {
      question: "When do I receive payouts?",
      answer: "Payouts are processed weekly. You can request an instant payout from the Payments & Payouts page.",
    },
    {
      question: "How do I update my menu?",
      answer: "Go to the Menu page, click on any item to edit, or use the '+' button to add new items.",
    },
    {
      question: "What are the verification requirements?",
      answer: "You need to submit business license, identity proof, address proof, bank account details, and hygiene certificate.",
    },
  ];

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/vendor/profile")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Contact */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <HelpCircle className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-gray-900">Get Help</h2>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full justify-start bg-primary hover:bg-primary/90 text-white"
              onClick={() => navigate("/support-chat")}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat with Support
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("tel:+911234567890")}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Support: +91 123 456 7890
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => window.open("mailto:support@foodiestream.com")}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email: support@foodiestream.com
            </Button>
          </div>
        </Card>

        {/* FAQs */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">Frequently Asked Questions</h3>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="border-0 shadow-food-card rounded-xl bg-white overflow-hidden"
              >
                <button
                  className="w-full p-4 text-left flex items-center justify-between"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronRight
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedFaq === index ? "rotate-90" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-4 pb-4">
                    <p className="text-sm text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Resources */}
        <Card className="p-5 border-0 shadow-food-card rounded-2xl bg-white">
          <h3 className="font-semibold text-gray-900 mb-3">Resources</h3>
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              Vendor Guide
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Terms & Conditions
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              Privacy Policy
            </Button>
          </div>
        </Card>
      </div>

      <VendorBottomNav />
    </div>
  );
};

export default VendorHelpSupport;

