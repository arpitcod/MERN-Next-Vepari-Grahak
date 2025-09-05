import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"


const superAdminMiddleware = async (rq:Request,rs:Response,next:NextFunction) =>{
    try {
        const token = rq.cookies?.super_admin_token

        // if (!token) {
        //     rs.status(401).json({
        //         success:false,
        //         message:"Access fail token not provided"
        //     })
        //     return
        // }
        if (!token) {
      // Postman (application/json) hoy to JSON aapo, browser hoy to redirect
      if (rq.accepts("json")) {
         rs.status(401).json({
          success: false,
          message: "Access fail, token not provided",
        });
        return
      } else {
        return rs.redirect("/");
      }
    }

        // verify token 

        const decoded = jwt.verify(token,process.env.ADMIN_JWT_SECRET as string) as {email:string}

        if (decoded.email !== process.env.ADMIN_EMAIL) {
            rs.status(403).json({
                success:false,
                message:"super admin is not authorized"
            })
            return
        }
        
        rq.body.superAdmin = decoded;

        next()
    } catch (error) {
        console.log(error);
        rs.status(403).json({
            success:false,
            message:"invalid expired token"
        })
        return
        
    }
}

export default superAdminMiddleware