import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import authModel from "../../model/authModel";
import createShopModel from "../../model/createShopModel";
import faqModel from "../../model/faqModel";

let isSuperAdminLoggedIn = false;
export const loginController = async (rq: Request, rs: Response) => {
  try {
    const { email, password } = rq.body;

    console.log({ email, password });

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    // console.log(process.env.ADMIN_EMAIL);
    // console.log(process.env.ADMIN_PASSWORD);

    if (!email || !password) {
      rs.status(400).json({
        success: false,
        message: "email or password required",
      });
      return;
    }
    if (email !== adminEmail || password !== adminPassword) {
      rs.status(403).json({
        success: false,
        message: "incorrect email or password",
      });
      return;
    }
    if (isSuperAdminLoggedIn) {
      rs.status(400).json({
        success: false,
        messgae: "this id already logged in",
      });
      return;
    }

    isSuperAdminLoggedIn = true;

    const token = jwt.sign({ email }, process.env.ADMIN_JWT_SECRET as string, {
      expiresIn: "7d",
    });

    rs.cookie("super_admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    rs.status(201).json({
      success: true,
      message: "super admin auth successfully",
      data: { email },
    });
  } catch (error) {
    rs.status(503).json({
      success: false,
      message: "internel sever error",
      error,
    });
    return;
  }
};

//super admin logout

export const superAdminLogoutController = async (rq: Request, rs: Response) => {
  try {
    isSuperAdminLoggedIn = false;
    rs.clearCookie("super_admin_token");

    rs.status(200).json({
      success: true,
      message: "super admin logout successfully",
    });
  } catch (error) {
    console.log(error);
    rs.status(503).json({
      success: false,
      message: "internel server error",
      error,
    });
    return;
  }
};

// ===================================================================
//  get all the data
// =========================================================================

export const getAllUserAdminData = async (rq: Request, rs: Response) => {
  try {
    // user
    const getAllUsers = await authModel.find();
    if (!getAllUsers) {
      rs.status(404).json({
        success: false,
        message: "users not found",
      });
      return;
    }

    // vepari
    const getAllVepari = await createShopModel.find().populate("user products");
    if (!getAllVepari) {
      rs.status(404).json({
        success: false,
        message: "vepari not found",
      });
      return;
    }

    // Format vepari data with URLs
    const host = `${rq.protocol}://${rq.get("host")}`;
    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;

    const vepariWithUrls = getAllVepari.map((vepari: any) => {
      const profileUrl = vepari.profile?.startsWith("http")
        ? vepari.profile
        : `${host}${vepari.profile}`;
      const bannerUrl = vepari.banner ? `${host}${vepari.banner}` : "";

      const productsWithUrls = vepari.products.map((product: any) => ({
        ...product.toObject(),
        vepariId: vepari._id,
        mainImage: product.mainImage
          ? product.mainImage.startsWith("http")
            ? product.mainImage
            : baseUrl + product.mainImage
          : "",
        images: product.images
          ? product.images.map((image: string) =>
              image.startsWith("http") ? image : baseUrl + image
            )
          : [],
      }));

      return {
        ...vepari.toObject(),
        profile: profileUrl,
        banner: bannerUrl,
        products: productsWithUrls,
      };
    });

    //faqs

    const getAllFaqs = await faqModel.find().populate("user");

    if (!getAllFaqs) {
      rs.status(404).json({
        success: false,
        message: "faqs not found",
      });
      return;
    }

    rs.status(200).json({
      success: true,
      message: "all data fetched",
      data: {
        userData: getAllUsers,
        vepariData: vepariWithUrls,
        faqsData: getAllFaqs,
      },
    });
  } catch (error) {
    console.log(error);
    rs.status(503).json({
      success: false,
      message: "internel server error",
    });
  }
};

// ==================================
// delete user
// ==================================

// export const deleteUserController = async (rq:Request,rs:Response) =>{

//   try {
//     const {id} = rq.params

//     if (!id) {
//       rs.status(403).json({
//         success:false,
//         message:"id not  found"
//       })
//       return
//     }

//   } catch (error) {
//     console.log(error);
//     rs.status(503).json({
//       success:false,
//       message:"internel server error"
//     })
//     return
//   }

// }

// ============================================
// delete vepari profile
// ================================================

export const deleteVepariProfileController = async (
  rq: Request,
  rs: Response
) => {
  try {
    const { id } = rq.params;
    if (!id) {
      rs.status(404).json({
        success: false,
        message: "id not found",
      });
      return;
    }

    const vepariShop = await createShopModel.findById(id);
    if (!vepariShop) {
      rs.status(404).json({
        success: false,
        message: "vepari shop not found",
      });
    }

    // Get the actual shop owner's user ID from the shop document
    const shopOwnerId = vepariShop?.user;
    console.log("shopOwnerId",shopOwnerId);
    

    await createShopModel.findByIdAndDelete(id);
    await authModel.findByIdAndUpdate(shopOwnerId, { vepari_shop: null });

    rs.status(200).json({
      success: true,
      message: "vepari shop deleted successfully",
      vepariShop,
    });
    return;

  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "internel server error",
    });
    return
  }
};
