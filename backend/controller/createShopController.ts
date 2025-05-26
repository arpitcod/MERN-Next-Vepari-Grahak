import { Request, Response } from "express";
import createShopModel from "../model/createShopModel";
import authModel from "../model/authModel";

interface AuthRequest extends Request {
  user?: string; // ✅ Changed to string
}

export const createShopController = async (
  rq: AuthRequest,
  rs: Response
): Promise<void> => {
  try {
    const { vepariname, shopname, description, category, contact } = rq.body;
    const userId = rq.user;

    // Extract address and shop time from form data
    const country = rq.body.country || "india";
    const state = rq.body.state || "";
    const city = rq.body.city || "";
    const startTime = rq.body.startTime || "";
    const endTime = rq.body.endTime || "";

    const files = rq.files as {
      banner?: Express.Multer.File[];
      profile?: Express.Multer.File[];
    };
    if (!userId) {
      rs.status(401).json({
        success: false,
        message: "User not logged in, please login",
      });
      return;
    }

    console.log("User ID:", userId);

    if (!vepariname) {
      rs.status(400).json({
        success: false,
        message: "vepari name required",
      });
      return;
    }
    if (!shopname) {
      rs.status(400).json({ success: false, message: "Shopname  required" });
      return;
    }
    if (!description) {
      rs.status(400).json({ success: false, message: " description required" });
      return;
    }

    if (!category) {
      rs.status(400).json({ success: false, message: " category required" });
      return;
    }
    if (!startTime || !endTime) {
      rs.status(400).json({ success: false, message: "Shop time required" });
      return;
    }

    // Check if shop already exists
    const existingShop = await createShopModel.findOne({ user: userId });
    if (existingShop) {
      rs.status(400).json({
        success: false,
        message: "User already created a shop",
      });
      return;
    }

    // Generate shop profile
    const banner = files?.banner?.[0]?.filename || "";
    const profile =
      files?.profile?.[0]?.filename ||
      `https://ui-avatars.com/api/?name=${shopname}`;

    // Create new shop
    const newShop = await new createShopModel({
      vepariname,
      shopname,
      user: userId,
      description,
      profile: profile
        ? `/uplodes/${profile}`
        : `https://ui-avatars.com/api/?name=${shopname}`,
      banner: banner ? `/uplodes/${banner}` : "",
      isAdmin: true,
      address: {
        country,
        state,
        city,
      },
      category,
      contact,
      shopTime: {
        startTime,
        endTime,
      },
    }).save();

    // Update the user's vepari_shop field
    await authModel.findByIdAndUpdate(userId, { vepari_shop: newShop._id });

    rs.status(201).json({
      success: true,
      message: "Shop created successfully. You are now a Vepari!",
      newShop,
    });
    return;
  } catch (error) {
    console.error(error);
    rs.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
    return;
  }
};

export const deleteShopController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;

    if (!id) {
      rs.status(401).json({
        success: false,
        message: "shop id not match",
      });
      return;
    }

    const vepari_shop = await createShopModel.findById(id);
    if (!vepari_shop) {
      rs.status(400).json({
        success: false,
        message: "vepari shop not found",
      });
      return;
    }

    await createShopModel.findByIdAndDelete(id);

    rs.status(200).json({
      success: true,
      message: "shop deleted success",
      vepari_shop,
    });
    return;
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong server error",
      error,
    });
    return;
  }
};

export const getVepariController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;
    if (!id) {
      rs.status(404).json({
        success: false,
        message: "vepari id not found",
      });
      return;
    }

    const getVepariData = await createShopModel.findById(id).populate("user");

    if (!getVepariData) {
      rs.status(404).json({
        success: false,
        message: "vepari data not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "vepari data fetched",
      getVepariData,
    });
    return;
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};

export const updateVepariProfileController = async (
  rq: Request,
  rs: Response
): Promise<void> => {
  try {
    const { id } = rq.params;
    const { vepariname, shopname, description, category, contact } = rq.body;

    const { address = {}, shopTime = {} } = rq.body;

    const country = address.country || "india";
    const state = address.state || "";
    const city = address.city || "";

    const startTime = shopTime.startTime || "";
    const endTime = shopTime.endTime || "";

    const files = rq.files as {
      banner?: Express.Multer.File[];
      profile?: Express.Multer.File[];
    };

    const existShop = await createShopModel.findById(id);
    if (!existShop) {
      rs.status(404).json({
        success: false,
        message: "shop not found",
      });
      return;
    }

    const banner = files?.banner?.[0]?.filename || "";
    const profile = files?.profile?.[0]?.filename || "";

    const updatedData = {
      vepariname,
      shopname,
      description,
      category,
      contact,
      profile: profile
        ? profile.startsWith("http")
          ? profile
          : `/uplodes/${profile.replace(/^\/?uplodes\/+/, "")}`
        : `https://ui-avatars.com/api/?name=${shopname}`,
      banner: banner ? `/uplodes/${banner.replace(/^\/?uplodes\/+/, "")}` : "",
      address: {
        country,
        state,
        city,
      },
      shopTime: {
        startTime,
        endTime,
      },
    };

    const updatedShop = await createShopModel.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    rs.status(200).json({
      success: true,
      message: "shop profile updated",
      updatedShop,
    });
    return;
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong pls try again",
      error,
    });
    return;
  }
};

export const getVepariProfile = async (rq: AuthRequest, rs: Response) => {
  try {
    const userId = rq.user;
    if (!userId) {
      rs.status(404).json({
        success: false,
        message: "user not logged in",
      });
      return;
    }

    const vepari = await createShopModel.findOne({ user: userId }).populate("user");

    if (!vepari) {
      rs.status(404).json({
        success: false,
        message: "vepari profile not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "vepari profile fetched",
      vepari,
    });
    return;
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};