import { Request, Response } from "express";
import authModel from "../model/authModel";
import jwt from "jsonwebtoken";






// register type 
interface RegisterType {
    username:string,
    phone:string
}


// register controller 

export const registerController = async (rq:Request,rs:Response) =>{

    try {
        const {username,phone}:RegisterType = rq.body;

 
        // Check Required Fields
        if (!username) {
             rs.status(400).json({ success: false, message: "Username is required" });
             return
          }
          if (!phone) {
             rs.status(400).json({ success: false, message: "Phone is required" });
             return
          }
        let existUser = await authModel.findOne({phone})
        if (!existUser) {
           existUser= await new authModel({username,phone}).save()
            return
            
        }else if (phone.length !== 10) {
            rs.status(400).json({
                success:false,
                message:"phone number must be 10 digits"
            })
            return
        }
 
        
        
      
        
        // user token 
        const token = jwt.sign({id : existUser._id},process.env.JWT_KEY as string ,{expiresIn:"7d"})

        // cookie 
            rs.cookie("user_token",token ,{
                httpOnly:true,
                sameSite:"strict",
                maxAge:7 * 24 * 60 * 60 * 1000,
        
            })

         rs.status(201).json({
            success:true,
            message:"register success",
            existUser,
            token
    
        })
        
    } catch (error) {
    
       rs.status(500).json({
        success:false,
        message:"error in register",
        error
       })
    }

   

}


// login controller 

// export const loginController = async (rq:Request,rs:Response) =>{
//     try {
// const
        
//     } catch (error) {
//         console.log(error);
//         rs.status(500).json({
//             success:false,
//             message:"error in login",
//             error
//         })
        
        
//     }
// }



//logout controller

export const logoutController= async (rq:Request,rs:Response) =>{
    try {
        
        rs.clearCookie("user_token")
        rs.status(200).json({
            success:true,
            message:"success logout"
        })
        return
    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,
            message:"logout error",
            error
        })

        
    }
}