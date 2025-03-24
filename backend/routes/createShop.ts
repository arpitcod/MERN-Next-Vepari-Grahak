import express from "express"
import { createShopController, deleteShopController } from "../controller/createShopController"
import { userMiddleware } from "../middleware/authMiddleware";

const router = express.Router();

//create shp http://localhost:2914/api/create-shop
router.post("/create-shop",userMiddleware,createShopController)

//delete shop 
router.delete("/delete-shop/:id",userMiddleware,deleteShopController)












export default router