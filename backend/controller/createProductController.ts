import { Request, Response } from "express";
import productModel from "../model/createProductModel";
import createShopModel from "../model/createShopModel";

interface AdminRequestType extends Request {
  vepari_shop?: string;
}

// export const createProductController = async (rq:AdminRequestType,rs:Response): Promise<void> =>{
//     try {

//         const {name,brand,price,quantity,category,tags,description,details} = rq.body
//         const vepariId = rq.vepariID

//         // const files = rq.files as {
//         //     images:
//         // }

//     } catch (error) {
//         console.log(error);
//         rs.status(500).json({
//             success:false,
//             message:"internel server error",
//             error
//         })
//         return
//     }
// }

export const createProductController = async (
  rq: AdminRequestType,
  rs: Response
): Promise<void> => {
  try {
    const {
      name,
      brand,
      price,
      quantity,
      category,
      tags,
      description,
      details,
    } = rq.body;

    const vepariId = rq.vepari_shop;
    if (!vepariId) {
      rs.status(404).json({
        success: false,
        message: "vepari id not found",
      });
      return;
    }
    const files = rq.files as {
      mainImage: Express.Multer.File[];
      images: Express.Multer.File[];
    };

    const mainImage = files?.mainImage?.[0]?.filename || "";
    const images = files?.images?.map((file) => file.filename) || [];
    // Validation
    if (
      !name ||
      !brand ||
      !price ||
      !quantity ||
      !category ||
      !images ||
      images.length === 0 ||
      !tags ||
      !description ||
      !details ||
      !mainImage
    ) {
      rs.status(400).json({
        success: false,
        message: "fields are required.",
      });
      return;
    }

    console.log("vepari", vepariId);

    // Create product
    const newProduct = new productModel({
      vepariId: vepariId,
      name,
      brand,
      price,
      quantity,
      category,
      mainImage,
      images,
      tags,
      description,
      details,
    });

    await newProduct.save();
    await createShopModel.findByIdAndUpdate(vepariId, {
      $push: { products:newProduct._id },
    });

    rs.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: newProduct,
    });
    return;
  } catch (error) {
    console.error("Error creating product:", error);
    rs.status(500).json({
      success: false,
      message: "Server Error. Please try again later.",
    });
    return;
  }
};

// fetch product and  convert to url

// get all products

export const fetchAllProducts = async (rq: Request, rs: Response) => {
  try {
    const fetchProducts = await productModel.find({});

    if (!fetchProducts || fetchProducts.length === 0) {
      rs.status(404).json({
        success: false,
        message: "products not found",
      });
      return;
    }

    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;

    const productsWithUrls = fetchProducts.map((product) => ({
      ...product.toObject(),
      mainImage: baseUrl + product.mainImage,
      images: product.images.map((image: string) => baseUrl + image),
    }));

    rs.status(200).json({
      totalProducts: fetchProducts.length,
      success: true,
      message: "all products fetched",
      products: productsWithUrls,
    });
  } catch (error) {
    rs.status(500).json({
      success: false,
      message: "internel server error",
      error,
    });
  }
};

// fetch products with vepari id usng

export const getSingleVepariProducts = async (rq: AdminRequestType, rs: Response) => {
  try {
    // const { id } = rq.params;
     const vepariId = rq.vepari_shop;
    const products = await productModel.find({vepariId});

    if (!products || products.length === 0) {
      rs.status(404).json({
        success: false,
        message: "vepari products not found",
      });
      return;
    }

    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;

    const productsWithUrls = products.map((product) =>({
      ...product.toObject(),
      mainImage:baseUrl + product.mainImage,
      images:product.images.map((image:string) =>baseUrl + image)
    }))
    rs.status(200).json({
      totalProducts: products.length,
      success: true,
      message: "vepari products fetched successfully",
      products:productsWithUrls
    });
  } catch  (error){
      rs.status(500).json({
        success:false,
        message:"something went wrong",
        error
      })
      return
  }
};
