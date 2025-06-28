'use client'
// src/contexts/CartContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from "react";
const CART_STORAGE_KEY = "cart-data"; // Fixed key, independent of language


// Define types for the items in the cart
type CartItem = {
  id: string;
  name_en: string;
  name_ar: string;
  name_fr: string;
  name_de: string;
  name_es: string;
  name_it: string;
  name_pt: string;
  name_nl: string;
  name_ru: string;
  name_sv: string;
  quantity: number;
  price: any;
  image_en: string;
  image_ar: string;
  image_fr: string;
  image_de: string;
  image_es: string;
  image_it: string;
  image_pt: string;
  image_nl: string;
  image_ru: string;
  image_sv: string;
  tag_en: string;
  tag_ar: string;
  tag_fr: string;
  tag_de: string;
  tag_es: string;
  tag_it: string;
  tag_pt: string;
  tag_nl: string;
  tag_ru: string;
  tag_sv: string;
  url_en: string;
  url_ar: string;
  url_fr: string;
  url_de: string;
  url_es: string;
  url_it: string;
  url_pt: string;
  url_nl: string;
  url_ru: string;
  url_sv: string;
  size: string | null;
  color:string | null;
  productID:number;
  dropshippingID:string;
  originalPrice?: number; // Add this to store original price before discount
  discounte?:any
};

type CartContextType = {
  cart: CartItem[];
  addItemToCart: (item: CartItem) => void;
  removeItemFromCart: (id: string) => void;
  increaseItemQuantity: (id: string) => void;
  decreaseItemQuantity: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  editCart: (productID: string | null, discount: number | null) => void; // Now accepts `null` for global discount
  applyGlobalDiscount: (discount: number | null) => void; // New function for global discount
  getTotalDiscount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
 // const [cart, setCart] = useState<CartItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  useEffect(() => {
    if (cart.length >= 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    }
  }, [cart]);


  // Load cart from local storage when the app loads
 // useEffect(() => {
  //  const savedCart = localStorage.getItem("cart");
   // if (savedCart) {
    //  setCart(JSON.parse(savedCart));
   // }
  //}, []);
 
  // Save cart to local storage whenever it changes
 // useEffect(() => {
  //  if (cart.length >= 0) {
  //    localStorage.setItem("cart", JSON.stringify(cart));
  //  }
 // }, [cart]);

  const addItemToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const increaseItemQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseItemQuantity = (id: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) } // Ensure quantity doesn't drop below 1
          : item
      )
    );
  };


  const removeItemFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };


  const getTotalDiscount = () => {
    return cart.reduce((total, item) => total + item.discounte * item.quantity, 0);
  };


 // Updated `editCart` to handle both single product & global discount
 const editCart = (productID: any | null, discount: number | null) => {
  setCart(prevCart => {
    return prevCart.map(item => {
      // If `productID` is provided, apply only to matching items
      // If `productID` is `null`, apply to ALL items (global discount)
      const shouldApplyDiscount = productID ? item.productID === +productID : true;

      if (shouldApplyDiscount) {
        if (discount !== null) {
          const originalPrice = item.originalPrice ?? item.price;
          const discountedPrice = originalPrice * (1 - discount);
          const discountAmount = originalPrice * discount;
          return {
            ...item,
            price: discountedPrice,
            originalPrice: originalPrice,
            discounte: discountAmount,
          };
        } else if (item.originalPrice) {
          return {
            ...item,
            price: item.originalPrice,
            originalPrice: undefined,
            discounte: undefined,
          };
        }
      }
      return item;
    });
  });
};

// New function: Applies discount to ALL products
const applyGlobalDiscount = (discount: number | null) => {
  editCart(null, discount); // Passing `null` means "apply to all"
};

  return (
    <CartContext.Provider value={{ cart, addItemToCart, removeItemFromCart, clearCart, getTotalPrice, increaseItemQuantity, decreaseItemQuantity, editCart, getTotalDiscount, applyGlobalDiscount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};