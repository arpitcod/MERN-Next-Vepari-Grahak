 
 import { Request, Response } from "express"
 import jwt from 'jsonwebtoken'


 let isSuperAdminLoggedIn = false
 export const loginController = async (rq:Request,rs:Response) =>{
     try {
         const {email,password} = rq.body;

         console.log({email,password});
         
         const adminEmail =process.env.ADMIN_EMAIL
         const adminPassword =process.env.ADMIN_PASSWORD

             // console.log(process.env.ADMIN_EMAIL);
             // console.log(process.env.ADMIN_PASSWORD);
             
         if (!email || !password ) {
             rs.status(400).json({
                 success:false,
                 message:"email or password required"
             })
             return
         }
         if (email !== adminEmail || password !== adminPassword) {
             
             rs.status(403).json({
                 success:false,
                 message:"incorrect email or password"
             })
             return
         }
         if (isSuperAdminLoggedIn) {
             rs.status(400).json({
                 success:false,
                 messgae:"this id already logged in"
             })
             return
         }

         isSuperAdminLoggedIn = true

   
         const token = jwt.sign({email},process.env.ADMIN_JWT_SECRET as string,{expiresIn:"7d"})

         rs.cookie("super_admin_token",token,{
             httpOnly:true,
             secure: process.env.NODE_ENV === 'production',
             sameSite:"strict"
         })

         rs.status(201).json({
             success:true,
             message:"super admin auth successfully",
             data:{email}
         })


     } catch (error) {
         
         rs.status(503).json({
             success:false,
             message:"internel sever error",
             error
         })
         return
     }
 }

 //super admin logout

 export const superAdminLogoutController = async (rq:Request,rs:Response) =>{

     try {
         isSuperAdminLoggedIn = false
         rs.clearCookie("super_admin_token")

         rs.status(200).json({
             success:true,
             message:"super admin logout successfully"
         })
         
     } catch (error) {
         console.log(error);
         rs.status(503).json({
             success:false,
             message:"internel server error",
             error
         })
         return
         
     }
 }