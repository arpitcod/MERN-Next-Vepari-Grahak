import mongoose from "mongoose";


const authSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true,
        unique:true
    },
    date:{
        type:Date,
        default:Date.now()
    }
},{timestamps:true})

const authModel = mongoose.model("users",authSchema)


export default authModel