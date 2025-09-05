import express from "express"
import { deleteVepariProfileController, getAllUserAdminData, loginController, superAdminLogoutController } from "../../controller/super-admin/superAdminController"
import superAdminMiddleware from "../../middleware/super-admin/superAdminMiddleware"
import { deleteUserController } from "../../controller/authController"
import { deleteShopController, getVepariController } from "../../controller/createShopController"
import { getSingleProductController } from "../../controller/createProductController"



const router = express.Router()

// http://localhost:5000/api/super-admin-auth/super-admin-login
router.post("/super-admin-login",loginController)

// http://localhost:5000/api/super-admin-auth/super-admin-logout
router.get("/super-admin-logout",superAdminMiddleware,superAdminLogoutController)

//get all users http://localhost:5000/api/super-admin-auth/get-all-users
router.get("/get-all-users",superAdminMiddleware,getAllUserAdminData)



// delete user http://localhost:5000/api/super-admin-auth/delete-user/68512fe52f138dd55981fe94
router.delete("/delete-user/:id",superAdminMiddleware,deleteUserController)

// get single vepari data http://localhost:5000/api/super-admin-auth/get-vepari-details/684aa1054eb53f02f0c4fd65
router.get("/get-vepari-details/:id",superAdminMiddleware,getVepariController)

//get single product details http://localhost:5000/api/super-admin-auth/get-vepari-single-product/687e35f61ea8c410f8b93b3f
router.get("/get-vepari-single-product/:id",superAdminMiddleware,getSingleProductController)

// delete vepari 
router.delete("/delete-vepari-profile/:id",superAdminMiddleware,deleteVepariProfileController)

export default router