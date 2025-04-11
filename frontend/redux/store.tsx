"use client"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./UserSlice"
import getUserReducer from "./GetUserSlice"



const store = configureStore({

    reducer:{
        user:userReducer,
        getUser:getUserReducer

    }
})

export default store