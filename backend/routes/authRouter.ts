import { deleteUserController, getAllUsersController, getSingleUserController, logoutController, registerController, updateUserController } from "../controller/authController"

import express, { Request, Response } from "express"
import { userMiddleware } from "../middleware/authMiddleware"

const router = express.Router()

//register http://localhost:2914/api/register
router.post("/register",registerController)


// get all users http://localhost:2914/api/all-users
router.get("/all-users",getAllUsersController) 

//get single user http://localhost:2914/api/single-user/67dc608f9dc51f884e86f637
router.get("/single-user/:id",getSingleUserController)

//update user http://localhost:2914/api/update-user/67dc608f9dc51f884e86f637
router.put('/update-user/:id',updateUserController)

//delete user http://localhost:2914/api/delete-user/67dc608f9dc51f884e86f637
router.delete("/delete-user/:id",deleteUserController)

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