import { Request, Response } from "express";
import createShopModel from "../model/createShopModel";

interface AuthRequest extends Request {
  user?: string; // ✅ Changed to string
}

export const createShopController = async (rq: AuthRequest, rs: Response): Promise<void> => {
  try {
    const { shopname, description, profile, banner } = rq.body;
    const userId = rq.user;

    if (!userId) {
       rs.status(401).json({
        success: false,
        message: "User not logged in, please login",
      });
      return
    }

    console.log("User ID:", userId);

    if (!shopname || !description) {
       rs.status(400).json({ success: false, message: "Shopname and description required" });
       return
    }

    // Check if shop already exists
    const existingShop = await createShopModel.findOne({ user: userId });
    if (existingShop) {
       rs.status(400).json({ success: false, message: "User already created a shop" });
       return
    }

    // Generate shop profile
    const shopProfile = profile || `https://ui-avatars.com/api/?name=${shopname}`;

    // Create new shop
    const newShop = await new createShopModel({
      shopname,
      user: userId,
      description,
      profile: shopProfile,
      banner,
      isAdmin: true,
    }).save();

     rs.status(201).json({
      success: true,
      message: "Shop created successfully. You are now a Vepari!",
      newShop,
    });
    return
  } catch (error) {
    console.error(error);
     rs.status(500).json({ success: false, message: "Something went wrong", error });
     return
  }
};
