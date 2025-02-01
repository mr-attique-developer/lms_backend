import express from  "express"
import isAthenicated from "../middlewares/user.middleware.js"
import { getCourseProgress, markAsCompleted, markAsInCompleted, updateCourseProgress } from "../controllers/courseProgress.controller.js"


const router = express.Router()
router.route("/getProgress/:courseId").get(isAthenicated, getCourseProgress)
router.route("/updateProgress/:courseId/lecture/:lectureId/view").post(isAthenicated, updateCourseProgress)
router.route("/markAsCompleted/:courseId").post(isAthenicated, markAsCompleted)
router.route("/markAsInCompleted/:courseId").post(isAthenicated, markAsInCompleted)

export default router