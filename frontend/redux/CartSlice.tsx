import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cartItems: [], // [{_id, name, price, quantity, brand, mainImage}]
  },

  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.cartItems.find(
        (item) => item._id === newItem._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cartItems.push({ ...newItem, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      );
      if (item) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.cartItems.find(
        (item) => item._id === action.payload
      );
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1;
        } else {
          state.cartItems = state.cartItems.filter(
            (cartItem) => cartItem._id !== action.payload
          );
        }
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );
    },
  },
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
