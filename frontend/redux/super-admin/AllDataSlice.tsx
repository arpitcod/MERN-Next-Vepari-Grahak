import { createSlice } from "@reduxjs/toolkit";



const allDataSlice = createSlice({

    name:"allData",
    initialState:{
        allData:null
    },

    reducers:{
        setAllData : (state,action) =>{
            state.allData = action.payload
        }
    }
})



export const {setAllData} = allDataSlice.actions

export default allDataSlice.reducer