"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  // Always start empty — identical on server and client.
  // localStorage is loaded after mount to avoid hydration mismatches.
  const [cart, setCart] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  // Load persisted cart after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("apex_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.error(e);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persist cart changes — but ONLY after hydration,
  // otherwise the first render would overwrite storage with [].
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem("apex_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, hydrated]);

  const addToCart = (product, quantity = 1, customSpecs = []) => {
    // Generate a deterministic, non-scrambled unique signature using join("|")
    const specsString = customSpecs.length > 0 ? customSpecs.join("|") : "default";
    const uniqueCartItemId = `${product.id}__${specsString}`;

    setCart((prev) => {
      const idx = prev.findIndex((item) => (item.cartItemId || item.id) === uniqueCartItemId);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx].quantity += quantity;
        return copy;
      }
      return [
        ...prev,
        {
          ...product,
          cartItemId: uniqueCartItemId,
          specs: customSpecs.length > 0 ? customSpecs : product.specs || [],
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prev) => prev.filter((item) => (item.cartItemId || item.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId, qty) => {
    if (qty < 1) return removeFromCart(cartItemId);
    setCart((prev) =>
      prev.map((item) =>
        (item.cartItemId || item.id) === cartItemId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const subtotal = cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}