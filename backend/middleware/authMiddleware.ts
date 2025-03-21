import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface AuthReq extends Request {
  user?: string;
}

export const userMiddleware = async (rq: AuthReq, rs: Response, next: NextFunction) => {
  try {
    // Get token from cookies
    const token = rq.cookies?.user_token;
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

    rq.user = decode.id; // ✅ Assign correct type
    next();
  } catch (error) {
    console.error(error);
     rs.status(500).json({ success: false, message: "Error in middleware", error });
     return
  }
};
