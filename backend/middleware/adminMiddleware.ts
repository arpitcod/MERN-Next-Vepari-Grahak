// import { NextFunction, Request, Response } from "express";



// export const adminMiddleware = async (rq:Request,rs:Response,next:NextFunction) =>{
//     try {
//         if (!rq.isAdmin) {
//             rs.status(403).json({
//                 success:false,
//                 message:"Access Fail Vepari Admins Only "
//             })
//         }        
//         next()
//     } catch (error) {
//         console.log(error);
        
//     }
// }