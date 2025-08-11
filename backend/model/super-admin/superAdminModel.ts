import mongoose from "mongoose";


const superAdminSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{timestamps:true})


const superAdminModel = mongoose.model("super-admin",superAdminSchema)

export default superAdminModel