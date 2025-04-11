"use client"
import { createSlice } from "@reduxjs/toolkit";




const userSlice = createSlice({
    name:"user",
    initialState:{
        user:null
    },

    reducers:{
        setUserData:(state,action) => {
            state.user = action.payload
        }
        // login:(state,action)=>{
        //     state.user = action.payload
        // },
        // logout:(state)=>{
        //     state.user = null
        // }
    }

})


export const {setUserData} = userSlice.actions
export default userSlice.reducer


