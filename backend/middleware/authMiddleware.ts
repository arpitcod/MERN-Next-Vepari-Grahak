import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import authModel from "../model/authModel";
import createShopModel from "../model/createShopModel";

interface AuthReq extends Request {
  user?: any;
  isAdmin? :boolean;
  vepariId?: string;
  vepari_shop?:string
}

export const userMiddleware = async (rq: AuthReq, rs: Response, next: NextFunction):Promise <void> =>  {
  try {
    const authHeader = rq.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
       rs.status(401).json({ success: false, message: "Authorization header missing or malformed" });
       return
    }

    
    const token = authHeader.split(" ")[1];
    console.log("Token received:", token); // ✅ For debugging
    // Get token from cookies
    // const token = rq.headers.authorization;
    // const token = rq.headers.authorization?.split(" ")[1]; // split "Bearer token"
    // if (!token) {
    //    rs.status(400).json({ success: false, message: "Token not found" });
    //    return
    // }
    // if (!token) throw new Error("No token found");

    // Decode token
    const decode = jwt.verify(token, process.env.JWT_KEY as string) as { id: string };
    if (!decode) {
       rs.status(400).json({ success: false, message: "Invalid token" });
       return

    }

    const userData = await authModel.findById(decode.id)
    if (!userData) {
      rs.status(404).json({
        success:false,
        message:"user not found",

      })
      return
    }

    // const vepariId = await createShopModel.findById

    // let vepariData = null;
    // if (userData.vepari) {
    //   vepariData = await createShopModel.findById(userData.vepari)
    // }

    // rq.user = decode.id; // ✅ Assign correct type
    rq.user = userData;
    // rq.vepariId = vepariData?._id.toString();
    // rq.isAdmin = vepariData?.isAdmin || false
    
    // rq.user = userData
    
    next();
  } catch (error) {
    console.error("JWT verification failed:", error);
     rs.status(401).json({ success: false, message: "Invalid or expired token", error });
     return
  }
};

export const adminMiddleware = (req: AuthReq, res: Response, next: NextFunction) => {
  // const existAdmin = await authModel.findById(req.user)
  //   if (existAdmin?.vepari_shop === null) {
  //     res.status(403).json({
  //       success:false,
  //        message: "Access Fail Vepari Admins Only",
  //     })
  //     return
  //   }
  
 if (!req.vepari_shop)  {
     res.status(403).json({
      success: false,
      message: "Access Fail Vepari Admins Only",
    });
    return
  }
  next();
};
