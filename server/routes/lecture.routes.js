import express from "express"
import { createLectureController, getLectureById, getListOfLecturesController, removeLectureController, updateLecutreController } from "../controllers/lecture.controller.js"
import isAthenicated from "../middlewares/user.middleware.js"

const router  = express.Router()

router.route("/create/:courseId").post(isAthenicated,createLectureController)
router.route("/get/:courseId").get(isAthenicated,getListOfLecturesController)
router.route("/update/:courseId/lecture/:lectureId").post(isAthenicated,updateLecutreController)
router.route("/getById/:lectureId").get(isAthenicated,getLectureById)
router.route("/delete/:lectureId").delete(isAthenicated,removeLectureController)


export default router