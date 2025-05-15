"use client"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./UserSlice"
// import getUserReducer from "./GetUserSlice"
import getVepariReducer from "./GetVepariSlice"


const store = configureStore({

    reducer:{
        user:userReducer,
        // getUser:getUserReducer,
        getVepari:getVepariReducer,
        // vepari:vepariReducer 

    }
})

export type RootState = ReturnType<typeof store.getState>;

export default store