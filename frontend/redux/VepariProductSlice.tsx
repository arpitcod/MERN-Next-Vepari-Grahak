import { createSlice } from "@reduxjs/toolkit";



const vepariProductSlice = createSlice({
    name:"VepariProducts",
    initialState:{
        vepariProducts:null
    },

    reducers:{
        setVepariProducts:(state,action) => {
            state.vepariProducts = action.payload
        }
    }
})


export const {setVepariProducts} = vepariProductSlice.actions


export default vepariProductSlice.reducer