"use client"

import { createSlice } from "@reduxjs/toolkit"


const getUserSlice = createSlice({
    name:"getUser",
    initialState:{
        getUser:null
    },
    reducers:{
        setGetUser:(state,action) =>{
            state.getUser = action.payload
        }
    }

})
export const {setGetUser} = getUserSlice.actions
// export const getUserData = (state) => state.getUser.getUser;
export default getUserSlice.reducer