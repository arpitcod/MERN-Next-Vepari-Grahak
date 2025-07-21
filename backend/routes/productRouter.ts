import express from "express"
import { createProductController, deleteProductController, fetchAllProducts, getSingleProductController, getSingleVepariProducts, updateVepariProductController } from "../controller/createProductController"
import { adminMiddleware, userMiddleware } from "../middleware/authMiddleware"
import { upload } from "../middleware/multerMiddleware"

const router = express.Router()

// create product http://localhost:5000/api/create-product
router.post("/create-product",userMiddleware,adminMiddleware,upload.fields([{name:"mainImage",maxCount:1},{name:"images",maxCount:7}]),createProductController)

// get all products http://localhost:5000/api/fetch-all-products use for  homepage 
router.get("/fetch-all-products",userMiddleware,adminMiddleware,fetchAllProducts)


//get single vepari produtcs with vepari id http://localhost:5000/api/get-vepari-produtcs/685685203a7b0a6116731831
 router.get("/get-vepari-produtcs/:id",userMiddleware,adminMiddleware,getSingleVepariProducts)


 //get single product http://localhost:5000/api/get-single-product/685685203a7b0a6116731831
 router.get("/get-single-product/:id",userMiddleware,adminMiddleware,getSingleProductController)


 //update vepari product http://localhost:5000/api/update-vepari-product/685a71281ff1739b8e1ec511
 router.put("/update-vepari-product/:id",userMiddleware,adminMiddleware,upload.fields([
   { name: "mainImage", maxCount: 1 },
   { name: "images", maxCount: 7 },
]),updateVepariProductController)

// delete product http://localhost:5000/api/delete-product/6878e0796186fc6cfe46da53
router.delete("/delete-product/:id",userMiddleware,adminMiddleware,deleteProductController)
 
export default router 