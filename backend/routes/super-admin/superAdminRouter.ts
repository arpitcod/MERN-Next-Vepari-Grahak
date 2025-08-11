import express from "express"
import { loginController, superAdminLogoutController } from "../../controller/super-admin/superAdminController"
import superAdminMiddleware from "../../middleware/super-admin/superAdminMiddleware"



const router = express.Router()

// http://localhost:5000/api/super-admin-auth/super-admin-login
router.post("/super-admin-login",loginController)

// http://localhost:5000/api/super-admin-auth/super-admin-logout
router.get("/super-admin-logout",superAdminMiddleware,superAdminLogoutController)



export default router