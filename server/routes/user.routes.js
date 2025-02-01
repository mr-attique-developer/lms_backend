import express  from "express"
import { getUserProfile, login, logout, register, updateUserProfile } from "../controllers/user.controller.js"
import isAthenicated from "../middlewares/user.middleware.js"
import multerUpload from "../utils/multer.js"

const router = express.Router()
router.route("/register").post(register)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/profile").get(isAthenicated,getUserProfile)
router.route("/profile/update").put(isAthenicated, multerUpload.single("profilePhoto"), updateUserProfile)


export default router