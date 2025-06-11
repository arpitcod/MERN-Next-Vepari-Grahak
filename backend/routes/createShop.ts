import express from "express"
import { createShopController, deleteShopController, getVepariBanner, getVepariController, getVepariProfile, getVepariProfileBannerController, updateVepariProfileController } from "../controller/createShopController"
import { adminMiddleware, userMiddleware } from "../middleware/authMiddleware";
import { upload } from "../middleware/multerMiddleware";

const router = express.Router();

//create shp http://localhost:2929/api/create-shop
router.post("/create-shop",userMiddleware,
    upload.fields([
        {name:"banner"},
        {name:"profile"}
])
    ,createShopController)

//delete shop http://localhost:2929/api/delete-shop/67dd42160dc23313eea6db42
router.delete("/delete-shop/:id",userMiddleware,adminMiddleware,deleteShopController)


//get vepari http://localhost:2929/api/get-vepari/680cabb729b21acc6ff4a26b
router.get("/get-vepari/:id",userMiddleware,adminMiddleware,getVepariController)

//update shop profile --> http://localhost:5000/api/shop-profile-update/680cabb729b21acc6ff4a26b
router.put("/shop-profile-update/:id", userMiddleware, adminMiddleware, updateVepariProfileController)


// get vepari profile http://localhost:2929/api/get-vepari-profile
router.get("/get-vepari-profile",userMiddleware,getVepariProfile)

//get vepari profile and banner http://localhost:5000/api/get-vepari-banner-profile/68404622769332e86441cd98
router.get("/get-vepari-banner-profile/:id", userMiddleware, adminMiddleware, getVepariProfileBannerController)

// get bepari banner
router.get('/get-vepari-banner/:id',adminMiddleware,getVepariBanner)








export default router