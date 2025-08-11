import { createSlice } from "@reduxjs/toolkit";



type ProductsType = {
  _id?: string;
  name: string;
  brand: string;
  price: string;
  quantity: string;
  category: string;
  tags: string[];
  description: string;
  details: string;
  mainImage?: string;
  images?: string[];
};


interface LikedState {
    likedProducts : ProductsType[];
}

const getInitialLikedProducts = (): ProductsType[] => {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("Liked_products");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    localStorage.removeItem("Liked_products");
    return [];
  }
};

const initialState: LikedState = {
  likedProducts: getInitialLikedProducts(),
};

const likedSlice = createSlice({
    name:"liked",
    initialState,
    reducers:{
        likeProduct:(state,action) =>{
            const exist = state.likedProducts.find((p) =>  p._id === action.payload._id)
            if (!exist) {
                state.likedProducts.push(action.payload)
                if (typeof window !== "undefined") {
                    localStorage.setItem("Liked_products", JSON.stringify(state.likedProducts))
                }
            }
        },
        unlikeProduct:(state,action) =>{
            state.likedProducts = state.likedProducts.filter((p) => p._id !== action.payload._id)
            if (typeof window !== "undefined") {
                localStorage.setItem("Liked_products", JSON.stringify(state.likedProducts))
            }
        },
        clearProducts:(state) =>{
            state.likedProducts = []
            if (typeof window !== "undefined") {
                localStorage.removeItem("Liked_products")
            }
        }
    }
})

export const {likeProduct, unlikeProduct,clearProducts} = likedSlice.actions

export default likedSlice.reducer
