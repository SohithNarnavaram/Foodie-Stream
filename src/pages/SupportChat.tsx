import { FormEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BottomNav } from "@/components/BottomNav";
import { useOrders } from "@/contexts/OrdersContext";

type Sender = "user" | "bot";

interface Message {
  id: string;
  from: Sender;
  text: string;
}

const SupportChat = () => {
  const navigate = useNavigate();
  const { getCurrentOrder } = useOrders();
  const order = getCurrentOrder();

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const firstText = order
      ? `Hi! I can help you with order #${order.id}. Ask about delivery time, payment or any issue.`
      : "Hi! I’m here to help with your orders, payments, or account issues.";
    setMessages([
      {
        id: "welcome",
        from: "bot",
        text: firstText,
      },
    ]);
  }, [order]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (from: Sender, text: string) => {
    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}-${prev.length}`, from, text },
    ]);
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    addMessage("user", trimmed);
    setInput("");

    // Simple canned bot reply
    const lower = trimmed.toLowerCase();
    let reply =
      "Thanks for your message. Our team will review it and get back to you shortly.";

    if (order && (lower.includes("where") || lower.includes("order") || lower.includes("status"))) {
      reply = `Your order #${order.id} is currently "${order.status.replace("_", " ")}" with an ETA of about ${order.etaMinutes} minutes.`;
    } else if (lower.includes("refund") || lower.includes("payment") || lower.includes("pay")) {
      reply = "For payment or refund issues, please share your order ID and a short description. We’ll review and update you on the resolution steps.";
    } else if (lower.includes("address") || lower.includes("change")) {
      reply = "If you need to change your delivery address, please cancel and reorder, or contact the restaurant if your order is already being prepared.";
    }

    setTimeout(() => {
      addMessage("bot", reply);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 flex flex-col">
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
          <h1 className="text-2xl font-bold text-gray-900">Support Chat</h1>
        </div>
      </header>

      {/* Chat body */}
      <main className="flex-1 px-4 pt-4 flex flex-col gap-3">
        {order && (
          <Card className="mb-2 px-4 py-3 rounded-2xl bg-white border-0 shadow-sm flex items-center justify-between">
            <div className="text-xs text-gray-600">
              <p className="font-semibold text-gray-900 text-sm">
                Order #{order.id}
              </p>
              <p>ETA: {order.etaMinutes} min</p>
            </div>
            <span className="text-xs text-primary font-semibold">
              Total: ₹{order.total}
            </span>
          </Card>
        )}

        <Card className="flex-1 flex flex-col border-0 shadow-food-card rounded-2xl bg-white overflow-hidden">
          <div
            ref={listRef}
            className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.from === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-2 ${
                    msg.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
                      msg.from === "user" ? "bg-primary" : "bg-gray-400"
                    }`}
                  >
                    {msg.from === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      msg.from === "user"
                        ? "bg-primary text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="border-t border-gray-200 px-3 py-2 flex items-center gap-2 bg-white"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full bg-gray-50 border-gray-200"
            />
            <Button
              type="submit"
              className="h-9 w-9 rounded-full bg-primary hover:bg-primary/90 text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default SupportChat;


