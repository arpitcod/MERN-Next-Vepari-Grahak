import express from "express"
import { createProductController, fetchAllProducts, getSingleVepariProducts } from "../controller/createProductController"
import { adminMiddleware, userMiddleware } from "../middleware/authMiddleware"
import { upload } from "../middleware/multerMiddleware"

const router = express.Router()

// create product http://localhost:5000/api/create-product
router.post("/create-product",userMiddleware,adminMiddleware,upload.fields([{name:"mainImage",maxCount:1},{name:"images",maxCount:7}]),createProductController)

// get all products http://localhost:5000/api/fetch-all-products use for  homepage 
router.get("/fetch-all-products",userMiddleware,adminMiddleware,fetchAllProducts)


//get single vepari produtcs with id http://localhost:5000/api/get-vepari-produtcs/685685203a7b0a6116731831
 router.get("/get-vepari-produtcs/:id",userMiddleware,adminMiddleware,getSingleVepariProducts)

export default router 