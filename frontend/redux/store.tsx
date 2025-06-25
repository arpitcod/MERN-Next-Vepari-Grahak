"use client"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./UserSlice"
// import getUserReducer from "./GetUserSlice"
import getVepariReducer from "./GetVepariSlice"
import vepariProductsReducer from "./VepariProductSlice"

const store = configureStore({

    reducer:{
        user:userReducer,
        // getUser:getUserReducer,
        getVepari:getVepariReducer,
        vepariProducts:vepariProductsReducer
        // vepari:vepariReducer 

    }
})

export type RootState = ReturnType<typeof store.getState>;

export default store