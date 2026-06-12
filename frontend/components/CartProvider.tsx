"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProductId = "bar" | "cube" | "powder";

export interface CartItem {
  id: ProductId;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDetails {
  mobile?: string;
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  deliveryZone?: "local" | "state" | "national";
  coupon?: string;
  paymentMethod?: string;
  orderId?: string;
}

interface CartContextType {
  items: CartItem[];
  updateQuantity: (id: ProductId, qty: number) => void;
  getTotalWeight: () => number;
  getSubtotal: () => number;
  orderDetails: OrderDetails;
  updateOrderDetails: (details: Partial<OrderDetails>) => void;
  clearCart: () => void;
}

// Default items setup
const defaultItems: CartItem[] = [
  { id: "bar", name: "Jaggery Bar", price: 199, quantity: 0, image: "https://images.unsplash.com/photo-1584924697295-04b327168144?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "cube", name: "Jaggery Cube", price: 249, quantity: 0, image: "https://images.unsplash.com/photo-1671846534165-dc2e8bf8de87?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
  { id: "powder", name: "Jaggery Powder", price: 249, quantity: 0, image: "https://images.unsplash.com/photo-1613228295977-3b5ac7533b36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600" },
];

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(defaultItems);
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({});

  const updateQuantity = (id: ProductId, qty: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: Math.max(0, qty) } : item))
    );
  };

  const getTotalWeight = () => items.reduce((sum, item) => sum + item.quantity, 0);
  const getSubtotal = () => items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const updateOrderDetails = (details: Partial<OrderDetails>) => {
    setOrderDetails((prev) => ({ ...prev, ...details }));
  };

  const clearCart = () => {
    setItems(defaultItems);
    setOrderDetails({});
  };

  return (
    <CartContext.Provider
      value={{
        items,
        updateQuantity,
        getTotalWeight,
        getSubtotal,
        orderDetails,
        updateOrderDetails,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
