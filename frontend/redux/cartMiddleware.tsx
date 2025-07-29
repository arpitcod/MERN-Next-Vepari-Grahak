import { Middleware } from '@reduxjs/toolkit';

export const cartMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save cart to localStorage after any cart action
  if (action.type?.startsWith('cart/')) {
    const state = store.getState() as any;
    localStorage.setItem('vg_cart', JSON.stringify(state.cart.cartItems));
  }
  
  return result;
};

export const loadCartFromStorage = () => {
  try {
    const savedCart = localStorage.getItem('vg_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return [];
  }
};