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
        type:String,
        default:""
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    address:{
        country:{
            type:String,
            default:"india",
            required:true

        },
        state:{
            type:String,
            required:true

        },
        city:{
            type:String,
            required:true
        }
    },
    isActive:{
        type:Boolean,
        default:true
    },
    category:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        unique:true,
       
    },
    shopTime:{
        type:String
    }

},{timestamps:true})


const createShopModel = mongoose.model("vepari_shop",createShopSchema)


export default createShopModel