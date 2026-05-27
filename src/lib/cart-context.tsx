import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  lineId: string;
  productId: string;
  name: string;
  imageUrl: string | null;
  size: string | null;
  unitPrice: number;
  quantity: number;
  comment: string;
};

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, "lineId">) => void;
  updateQuantity: (lineId: string, qty: number) => void;
  removeItem: (lineId: string) => void;
  clear: () => void;
  totalQuantity: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "tango-cart-v2";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const addItem: CartContextValue["addItem"] = (item) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) =>
          p.productId === item.productId &&
          p.size === item.size &&
          p.comment.trim() === item.comment.trim(),
      );
      if (existing) {
        return prev.map((p) =>
          p.lineId === existing.lineId ? { ...p, quantity: p.quantity + item.quantity } : p,
        );
      }
      const lineId = `${item.productId}-${item.size ?? "base"}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      return [...prev, { ...item, lineId }];
    });
  };

  const updateQuantity: CartContextValue["updateQuantity"] = (lineId, qty) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((p) => p.lineId !== lineId)
        : prev.map((p) => (p.lineId === lineId ? { ...p, quantity: qty } : p)),
    );
  };

  const removeItem: CartContextValue["removeItem"] = (lineId) => {
    setItems((prev) => prev.filter((p) => p.lineId !== lineId));
  };

  const clear = () => setItems([]);

  const totals = useMemo(
    () => ({
      totalQuantity: items.reduce((s, i) => s + i.quantity, 0),
      totalPrice: items.reduce((s, i) => s + i.unitPrice * i.quantity, 0),
    }),
    [items],
  );

  const value: CartContextValue = {
    items,
    isOpen,
    setOpen,
    addItem,
    updateQuantity,
    removeItem,
    clear,
    ...totals,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
