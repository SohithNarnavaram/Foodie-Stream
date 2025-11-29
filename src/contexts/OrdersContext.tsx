import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { CartItem } from "@/data/mockData";

export type OrderStatus = "accepted" | "cooking" | "on_the_way" | "delivered";

export interface Order {
  id: string;
  createdAt: string;
  status: OrderStatus;
  etaMinutes: number;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee: number;
  total: number;
}

interface OrdersContextType {
  orders: Order[];
  currentOrderId: string | null;
  createOrderFromCart: (params: {
    cartItems: CartItem[];
    subtotal: number;
    discountAmount: number;
    deliveryFee: number;
    total: number;
    etaMinutes?: number;
  }) => Order;
  getCurrentOrder: () => Order | null;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

const STORAGE_KEY = "foodiestream-orders";

export const OrdersProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { orders: Order[]; currentOrderId: string | null };
        setOrders(parsed.orders ?? []);
        setCurrentOrderId(parsed.currentOrderId ?? null);
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Persist to localStorage when orders change
  useEffect(() => {
    try {
      const payload = JSON.stringify({ orders, currentOrderId });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch {
      // ignore storage errors
    }
  }, [orders, currentOrderId]);

  const createOrderFromCart: OrdersContextType["createOrderFromCart"] = ({
    cartItems,
    subtotal,
    discountAmount,
    deliveryFee,
    total,
    etaMinutes = 20,
  }) => {
    const id = `FS-${Date.now()}`;
    const newOrder: Order = {
      id,
      createdAt: new Date().toISOString(),
      status: "on_the_way",
      etaMinutes,
      items: cartItems.map((item) => ({ ...item })),
      subtotal,
      discountAmount,
      deliveryFee,
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderId(id);
    return newOrder;
  };

  const getCurrentOrder = () => {
    if (!currentOrderId) return orders[0] ?? null;
    return orders.find((o) => o.id === currentOrderId) ?? orders[0] ?? null;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        currentOrderId,
        createOrderFromCart,
        getCurrentOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export const useOrders = () => {
  const ctx = useContext(OrdersContext);
  if (!ctx) {
    throw new Error("useOrders must be used within OrdersProvider");
  }
  return ctx;
};


