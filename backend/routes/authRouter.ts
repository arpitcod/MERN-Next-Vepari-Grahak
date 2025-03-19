import { logoutController, registerController } from "../controller/authController"

import express from "express"

const router = express.Router()

//register http://localhost:2914/api/register
router.post("/register",registerController)

//logout 
router.get("/logout",logoutController)



export default router