import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ProductClickState = {
  clicksByVepari: { [vepariId: string]: number };
};

const initialState: ProductClickState = {
  clicksByVepari:
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("productClicksByVepari") || "{}")
      : {},
};

const productClickSlice = createSlice({
  name: "productClick",
  initialState,
  reducers: {
    increaseClick: (state, action: PayloadAction<{ vepariId: string }>) => {
      const { vepariId } = action.payload; // Destructure vepariId from the payload
      if (vepariId) {
        state.clicksByVepari[vepariId] =
          (state.clicksByVepari[vepariId] || 0) + 1;
        if (typeof window !== "undefined") {
          localStorage.setItem(
            "productClicksByVepari",
            JSON.stringify(state.clicksByVepari)
          );
        }
      }
    },
  },
});

export const { increaseClick } = productClickSlice.actions;

// Selector માં specific vepari ના clicks return કરવા
export const selectVepariClicks = (vepariId: string) => 
  (state: { productClicks: ProductClickState }) => 
    state.productClicks.clicksByVepari[vepariId] || 0;

export default productClickSlice.reducer;