import express from "express"
import { createShopController } from "../controller/createShopController"
import { userMiddleware } from "../middleware/authMiddleware";

const router = express.Router();


router.post("/create-shop",userMiddleware,createShopController)












export default router