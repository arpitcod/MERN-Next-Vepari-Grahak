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
      $push: { products: newProduct._id },
    });

    // const updatedVepariData = await createShopModel.findById(vepariId);
    // if (!updatedVepariData) {
    //   rs.status(404).json({
    //     success:false,
    //     message:"vepari not found"
    //   })
    // }

    rs.status(201).json({
      success: true,
      message: "Product created successfully!",
      product: newProduct,
      // newVepariData:updatedVepariData
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
      mainImage:product.mainImage.startsWith("http") ? product.mainImage :  baseUrl + product.mainImage,
      images: product.images.map((img:string)=>img.startsWith("http")?img : baseUrl + img),
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

export const getSingleVepariProducts = async (
  rq: AdminRequestType,
  rs: Response
) => {
  try {
    // const { id } = rq.params;
    const vepariId = rq.vepari_shop;
    const products = await productModel.find({ vepariId });

    if (!products || products.length === 0) {
      rs.status(404).json({
        success: false,
        message: "vepari products not found",
      });
      return;
    }

    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;

    const productsWithUrls = products.map((product) => ({
      ...product.toObject(),
      mainImage:product.mainImage.startsWith("http") ? product.mainImage : baseUrl + product.mainImage,
      images: product.images.map((image: string) => image.startsWith("http") ? image : baseUrl + image),
    }));

    rs.status(200).json({
      totalProducts: products.length,
      success: true,
      message: "vepari products fetched successfully",
      products: productsWithUrls,
    });
  } catch (error) {
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
    return;
  }
};

// update vepari product

export const updateVepariProductController = async (
  rq: AdminRequestType,
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
    const vepariId = rq.vepari_shop;
    if (!vepariId) {
      rs.status(404).json({
        success: false,
        message: "vepari id not found",
      });
      return;
    }
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


// for images 
    let existingImages:string[] = rq.body.existingImages || []
    if (typeof existingImages === "string") existingImages = [existingImages]
    
    const files = rq.files as {
      mainImage: Express.Multer.File[];
      images: Express.Multer.File[];
    };

    const newImages = files?.images?.map((file) => file.filename) || [];
    const finalImages = [...existingImages,...newImages]

    const mainImage = files?.mainImage?.[0]?.filename || "";
    // Validation
    // if (
    //   !name ||
    //   !brand ||
    //   !price ||
    //   !quantity ||
    //   !category ||
    //   !images ||
    //   images.length === 0 ||
    //   !tags ||
    //   !description ||
    //   !details ||
    //   !mainImage
    // ) {
    //   rs.status(400).json({
    //     success: false,
    //     message: "fields are required.",
    //   });
    //   return;
    // }

    const existVepariProducts = await productModel.findById(id);
    if (!existVepariProducts) {
      rs.status(404).json({
        success: false,
        message: "product not found",
      });
      return;
    }

    const updatedData = {
      name: name || existVepariProducts.name,
      brand: brand || existVepariProducts.brand,
      price: price || existVepariProducts.price,
      quantity: quantity || existVepariProducts.quantity,
      category: category || existVepariProducts.category,
      // images: images.length > 0 ? images : existVepariProducts.images,
      images: finalImages,
      tags: tags || existVepariProducts.tags,
      description: description || existVepariProducts.description,
      details: details || existVepariProducts.details,
      mainImage: mainImage || existVepariProducts.mainImage,
    };

    const updatedProduct = await productModel.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    );

    if (!updatedProduct) {
      rs.status(404).json({
        success: false,
        message: "product not found after update",
      });
      return;
    }

    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;
    // console.log({...updatedData.toObject()});

    const productWithUrls = {
      ...updatedProduct.toObject(),
      mainImage: baseUrl + updatedProduct.mainImage,
      images: updatedProduct.images.map((image: string) => baseUrl + image),
    };
    
    await createShopModel.findByIdAndUpdate(vepariId, {
      $addToSet: { products: updatedProduct?._id },
    });

    rs.status(200).json({
      success: true,
      message: "product updated successfully",
      updatedProduct: productWithUrls,
    });
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong",
      error,
    });
  }
};

// get single product

export const getSingleProductController = async (rq: Request, rs: Response) => {
  try {
    const { id } = rq.params;
    if (!id) {
      rs.status(400).json({
        success: false,
        message: "id not found",
      });
      return;
    }

    const singleProduct = await productModel.findById(id);

    if (!singleProduct) {
      rs.status(404).json({
        success: false,
        message: "product not found",
      });
      return;
    }

    const baseUrl = `${rq.protocol}://${rq.get("host")}/uploads/products/`;
    console.log({ ...singleProduct.toObject() });

    const productWithUrls = {
      ...singleProduct.toObject(),
      mainImage: singleProduct.mainImage.startsWith("http") ? singleProduct.mainImage : baseUrl + singleProduct.mainImage,
      images: singleProduct.images.map((image: string) => image.startsWith("http") ? image : baseUrl + image),
    };

    rs.status(200).json({
      success: true,
      message: "product fetch successfully",
      singleProduct: productWithUrls,
    });
  } catch (error) {
    console.log(error);
    rs.status(500).json({
      success: false,
      message: "something went wrong ",
      error,
    });
  }
};
