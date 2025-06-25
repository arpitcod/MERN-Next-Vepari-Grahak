import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
  vepariId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "vepari_shop",
    // unique: true,
    // sparse: true, // Add this line,
    // default: null,
  },
  name:{
    type:String,
    required:true
  },
  brand:{
    type:String,
    required:true
  },
  price:{
    type:String,
    required:true
  },
  quantity:{
    type:String,
    required:true
  },
  category:{
    type:String,
    required:true
  },
  images:{
    type:[String],
    required:true
  },
  tags:{
    type:[String],
    required:true
  },
  description:{
    type:String,
    required:true
  },
  details:{
    type:String,
    required:true
  },
  mainImage:{
    type:String,
    required:true
  },
},{timestamps:true});


const productModel = mongoose.model("products",productsSchema)

export default productModel