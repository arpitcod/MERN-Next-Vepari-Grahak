import mongoose from "mongoose"



const faqSchema = new mongoose.Schema({

    faq:{
        type:String,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
        
    },
  
 
},{timestamps:true})


const faqModel =  mongoose.model("faqs",faqSchema)


export default faqModel