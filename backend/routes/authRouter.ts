import { logoutController, registerController } from "../controller/authController"

import express, { Request, Response } from "express"
import { userMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

//register http://localhost:2914/api/register
router.post("/register",registerController)

//logout 
router.get("/logout",logoutController)


//get user with token
router.get("/get_user",userMiddleware,(rq:Request,rs:Response) =>{
    rs.json({
        success:true,
        message:"user get success",
        userId:(rq as any).user
    })
})


export default router