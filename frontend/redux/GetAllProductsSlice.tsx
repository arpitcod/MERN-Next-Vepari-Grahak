import { createSlice } from "@reduxjs/toolkit";

const fetchAllVepariProductsSlice = createSlice({
    name:"AllVepariProducts",
    initialState:{
        AllVepariProducts:null
    },
    reducers:{
        setAllVepariProducts : (state,action) =>{
            state.AllVepariProducts = action.payload
        },
        removeProduct: (state, action) => {
            if (state.AllVepariProducts) {
                state.AllVepariProducts = state.AllVepariProducts.filter(
                    (product: any) => product._id !== action.payload
                )
            }
        }
    }
})

export const {setAllVepariProducts, removeProduct} = fetchAllVepariProductsSlice.actions

export default fetchAllVepariProductsSlice.reducer