"use client"
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./UserSlice"
// import getUserReducer from "./GetUserSlice"
import getVepariReducer from "./GetVepariSlice"
import vepariProductsReducer from "./VepariProductSlice"
import cartReducer from "./CartSlice"
import { cartMiddleware } from "./cartMiddleware"
import likedReducer from './LikesSlice'
import searchReducer from './SearchSlice'
import allDataReduer from "./super-admin/AllDataSlice"
import superAdminSearchReducer from './super-admin/SuperAdminSearchSlice';


const store = configureStore({
    reducer:{
        user:userReducer,
        // getUser:getUserReducer,
        getVepari:getVepariReducer,
        vepariProducts:vepariProductsReducer,
        cart:cartReducer,
        liked :likedReducer,
        search: searchReducer,
        allData: allDataReduer,
        superAdminSearch: superAdminSearchReducer,
        // vepari:vepariReducer 
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(cartMiddleware),
})

export type RootState = ReturnType<typeof store.getState>;

export default store