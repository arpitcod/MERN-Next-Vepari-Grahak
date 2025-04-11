import { Request, Response } from "express";
import authModel from "../model/authModel";
import jwt from "jsonwebtoken";






// register type 
interface RegisterType {
    username:string,
    phone:string
}
// interface AuthReq extends Request {
//     user?: any; // Extend Request type to include user
//   }


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
        rs.cookie("user_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        await rs.status(201).json({
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


// getAllUsersController 

export const getAllUsersController = async (rq:Request,rs:Response) =>{
    try {
        
        const getAllUsers = await authModel.find({})

        if (!getAllUsers) {
            rs.status(404).json({
                success:false,
                message:"users not found"
            })
        }


        rs.status(200).json({
            success:true,
            message:"all users fetched",
            total_users:getAllUsers.length,
            getAllUsers
        })
    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,
            message:"something went wrong",
            error
        })
    }
}

// getSingleUserController 

export const getSingleUserController = async (rq:Request,rs:Response) =>{
    try {
        const {id} = rq.params;
        const getSingleUser = await authModel.findById(id)

        if (!getSingleUser) {
            rs.status(404).json({
                success:false,
                message:"user not found",

            })
        }

        rs.status(200).json({
            success:true,
            message:"user fecthed",
            getSingleUser
        })
    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,
            message:"something went wrong",
            error
        })
        
    }
}




// updateUserController 

export const updateUserController = async (rq:Request,rs:Response) =>{
    try {
        const {id} = rq.params;
        const {username} = rq.body


         if (!username) {
            rs.status(400).json({
                success:false,
                message:"username required"
            })
         }

         const updateUser = await authModel.findByIdAndUpdate(id,{username},{new:true})

         if (!updateUser) {
            rs.status(400).json({
                success:false,
                message:"user not found"
            })
            return
         }
         rs.status(200).json({
            success:true,
            message:"user update success",
            updateUser
         })

    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,
            message:"something went wrong",
            error
        })
        
    }
}



// deleteUserController

export const deleteUserController = async (rq:Request,rs:Response) =>{
    try {
        const {id} = rq.params;

        const deleteUser = await authModel.findByIdAndDelete(id);

        if (!deleteUser) {
            rs.status(401).json({
                success:false,
                message:"user not found"
            })

        }

        rs.status(200).json({
            success:true,
            message:"user delete success",
            deleteUser
        })
    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,
            message:"something went wrong"
        })
        
    }
}


  
//   export const getUserProfile = async (rq: AuthReq, rs: Response) => {
  export const getUserProfile = async (rq: Request, rs: Response) => {
    try {

        const user = await (rq as any).user 
      if (!user) {
         rs.status(401).json({
          success: false,
          message: "User not found",
        });
        return
      }
  
       rs.json({
        success: true,
        message: "User profile fetched successfully",
        // user: rq.user, // ✅ Correctly accessing the user property
        user
      });
    } catch (error) {
      console.log(error);
       rs.status(500).json({
        success: false,
        message: "Something went wrong",
      });
      return
    }
  };