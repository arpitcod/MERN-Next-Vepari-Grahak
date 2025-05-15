import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import authModel from "../model/authModel";
import createShopModel from "../model/createShopModel";

interface AuthReq extends Request {
  user?: any;
  isAdmin? :boolean;
  vepariId?: string;
}

export const userMiddleware = async (rq: AuthReq, rs: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = rq.headers.authorization;
    if (!token) {
       rs.status(400).json({ success: false, message: "Token not found" });
       return
    }

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
    console.error(error);
     rs.status(500).json({ success: false, message: "Error in middleware", error });
     return
  }
};

export const adminMiddleware = (req: AuthReq, res: Response, next: NextFunction) => {
  if (!req.isAdmin) {
     res.status(403).json({
      success: false,
      message: "Access Fail Vepari Admins Only",
    });
    return
  }
  next();
};
