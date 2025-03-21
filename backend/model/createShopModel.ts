import mongoose from "mongoose";


const createShopSchema = new mongoose.Schema({

    shopname:{
        type:String,
        required:true,

    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    profile:{
        type:String,

    },
    banner:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:true
    }

},{timestamps:true})


const createShopModel = mongoose.model("vepari_shop",createShopSchema)


export default createShopModel