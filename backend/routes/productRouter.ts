import express from "express"
import { createProductController, fetchAllProducts } from "../controller/createProductController"
import { adminMiddleware, userMiddleware } from "../middleware/authMiddleware"
import { upload } from "../middleware/multerMiddleware"

const router = express.Router()

// create product http://localhost:5000/api/create-product
router.post("/create-product",userMiddleware,adminMiddleware,upload.fields([{name:"mainImage",maxCount:1},{name:"images",maxCount:7}]),createProductController)

// get all products http://localhost:5000/api/fetch-all-products
router.get("/fetch-all-products",userMiddleware,adminMiddleware,fetchAllProducts)


export default router