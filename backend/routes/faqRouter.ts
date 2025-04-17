import express from "express"
import { faqController, getAllFaqs } from "../controller/faqController"
import { userMiddleware } from "../middleware/authMiddleware"
const router = express.Router()

// http://localhost:2929/api/user/faq
router.post("/user/faq",userMiddleware,faqController)

router.get("/user/get-all-faqs",getAllFaqs)







export default router