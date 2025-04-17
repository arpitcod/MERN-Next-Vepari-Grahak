import { Request, Response } from "express";
import createShopModel from "../model/createShopModel";

interface AuthRequest extends Request {
  user?: string; // ✅ Changed to string
}

export const createShopController = async (rq: AuthRequest, rs: Response): Promise<void> => {
  try {
    const { shopname, description, profile, banner,address,category,contact,shopTime } = rq.body;
    const userId = rq.user;

    if (!userId) {
       rs.status(401).json({
        success: false,
        message: "User not logged in, please login",
      });
      return
    }

    console.log("User ID:", userId);

    if (!shopname) {
       rs.status(400).json({ success: false, message: "Shopname and description required" });
       return
      }
      if (!description) {
        rs.status(400).json({ success: false, message: "Shopname and description required" });
        return
        
    }
      if (!address) {
        rs.status(400).json({ success: false, message: "Shopname and address required" });
        return
        
    }
      if (!category) {
        rs.status(400).json({ success: false, message: "Shopname and category required" });
        return
        
    }
      if (!shopTime) {
        rs.status(400).json({ success: false, message: "Shopname and shoptime required" });
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
      address,
      category,
      contact,
      shopTime
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



// deleteShopController

export const deleteShopController = async (rq:Request,rs:Response) =>{
  try {

    const {id} = rq.params;

    if (!id) {
      rs.status(401).json({
        success:false,
        message:"shop id not match"
      })
    }

    const vepari_shop = await createShopModel.findById(id)
    if (!vepari_shop) {
      rs.status(400).json({
        success:false,
        message:"vepari shop not found"
      })
    }

    await createShopModel.findByIdAndDelete(id)


    rs.status(200).json({
      success:true,
      message:"shop deleted success",
      vepari_shop
    })
    
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success:false,
      message:"something went wrong server error",
      error
    })
    
  }
}