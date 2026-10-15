'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Coupon } from './types';
import { SAMPLE_COUPONS, SAMPLE_CUSTOMER } from './data';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  user: typeof SAMPLE_CUSTOMER | null;
  loginUser: (phoneOrEmail: string) => void;
  logoutUser: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<typeof SAMPLE_CUSTOMER | null>(SAMPLE_CUSTOMER);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage after mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('bakeistry_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      } else {
        // Initial sample item so cart isn't empty when user looks at it first time
        setItems([
          {
            cartItemId: 'sample-item-1',
            type: 'cake',
            productId: 'cake-1',
            slug: 'belgian-dark-truffle',
            title: 'Belgian Dark Chocolate Truffle Gateau',
            image: '/images/cakes/belgian-truffle.jpg',
            unitPrice: 1450,
            quantity: 1,
            weight: '0.5kg',
            flavor: 'Signature 70% Dark Ganache',
            isEggless: true,
            customMessage: 'Happy Birthday!',
            deliveryDate: 'Today',
            deliverySlot: '06:00 PM - 09:00 PM',
          },
        ]);
      }
    } catch {
      // LocalStorage not available or parse error
    }
  }, []);

  // Sync to localStorage
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('bakeistry_cart', JSON.stringify(items));
      } catch {
        // LocalStorage failure
      }
    }
  }, [items, mounted]);

  const addItem = (newItem: Omit<CartItem, 'cartItemId'>) => {
    const cartItemId = `${newItem.type}-${newItem.productId}-${newItem.weight || 'std'}-${newItem.flavor || 'std'}-${Date.now()}`;
    setItems((prev) => [...prev, { ...newItem, cartItemId }]);
    setIsCartDrawerOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.cartItemId === cartItemId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (code: string) => {
    const found = SAMPLE_COUPONS.find(
      (c) => c.code.toLowerCase() === code.trim().toLowerCase()
    );
    if (!found) {
      return { success: false, message: 'Invalid coupon code. Try FIRSTBAKE10 or CHEFMITALI' };
    }
    if (subtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon applies on orders above ₹${found.minOrder}. Add items worth ₹${found.minOrder - subtotal} more.`,
      };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const discount = appliedCoupon
    ? appliedCoupon.discountType === 'percentage'
      ? Math.round((subtotal * appliedCoupon.value) / 100)
      : appliedCoupon.value
    : 0;

  // Free delivery above ₹1999 or if cart has only courses (digital)
  const hasPhysicalCake = items.some((item) => item.type === 'cake');
  const deliveryFee = !hasPhysicalCake || subtotal === 0 || subtotal >= 1999 ? 0 : 150;

  const total = Math.max(0, subtotal - discount + deliveryFee);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const loginUser = (phoneOrEmail: string) => {
    setUser({
      ...SAMPLE_CUSTOMER,
      email: phoneOrEmail.includes('@') ? phoneOrEmail : SAMPLE_CUSTOMER.email,
      phone: !phoneOrEmail.includes('@') ? phoneOrEmail : SAMPLE_CUSTOMER.phone,
    });
    setIsAuthModalOpen(false);
  };

  const logoutUser = () => {
    setUser(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        subtotal,
        discount,
        deliveryFee,
        total,
        itemCount,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isSearchOpen,
        setIsSearchOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
