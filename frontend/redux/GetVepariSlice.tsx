import { createSlice } from "@reduxjs/toolkit";


const getVepariSlice = createSlice({
    name:"vepari",
    initialState:{
        getVepari:null
    },

    reducers:{
        setGetVepari : (state,action) =>{
            state.getVepari = action.payload
        }
    }
})


export const {setGetVepari} = getVepariSlice.actions


export default getVepariSlice.reducer