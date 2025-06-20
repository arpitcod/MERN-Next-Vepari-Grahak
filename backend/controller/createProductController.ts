import { Request, Response } from "express";
import productModel from "../model/createProductModel";

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

export const createProductController = async (rq: AdminRequestType,rs: Response) : Promise<void> =>  {
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
        success:false,
        message:"vepari id not found",
        
      })
      return
    }
    const files = rq.files as{
      mainImage: Express.Multer.File[];
      images:Express.Multer.File[]
    }

    const mainImage = files?.mainImage?.[0]?.filename || "";
    const images = files?.images?.map((file) =>file.filename) || [];
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
      return
    }


    console.log("vepari",vepariId);
    
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


// get all products 

export const fetchAllProducts = async (rq:Request,rs:Response) =>{
  try {

    const fetchProducts = await productModel.find({})

    if (!fetchProducts) {
      rs.status(404).json({
        success:false,
        message:"products not found",
        
      })
      return
    }

    rs.status(200).json({
      totalProducts:fetchProducts.length, 
      success:true,
      message:"all products fetched",
      fetchProducts
    })
    
  } catch (error) {
    rs.status(500).json({
      success:false,
      message:"internel server error",
      error
    })
  }
}
