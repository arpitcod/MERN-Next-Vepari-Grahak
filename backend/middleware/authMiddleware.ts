import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"



interface AuthReq extends Request {
    user: string
}


export const userMiddleware = async (rq:AuthReq,rs:Response,next:NextFunction) =>{
    try {
        // token 
        const token = rq.cookies.user_token;
        if (!token) {
            rs.status(400).json({
                success:false,
                message:"token not found"
            })
            return
        }

        // decde 
        const decode =  jwt.verify(token,process.env.JWT_KEY as string) as {id :string} ;
        if (!decode) {
            rs.status(400).json({
                success:false,
                message:"invalid token"
            })
            return
        }

        rq.user = decode.id as string

        next()
    } catch (error) {
        console.log(error);
        rs.status(500).json({
            success:false,  
            message:"error in middleware",
            error
        })
        
    }
}