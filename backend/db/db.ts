import mongoose from "mongoose";




// connect db 

const connectDb = async () =>{
    try {
        await mongoose.connect(process.env.MONGOOSE_URI as string)
        console.log("databse connect successful");
        
    } catch (error) {
        console.log("error in databse",error);
        
    }
}

export default connectDb