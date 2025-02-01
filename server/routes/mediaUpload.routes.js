
import express from "express"
import multerUpload from "../utils/multer.js"
import { uploadMediaToCloudinary } from "../utils/cloudinary.js"

const router = express.Router()

router.route("/upload-video").post(multerUpload.single("file"),async(req,res)=>{
    try {
        const videoFile = req.file
        const result = await uploadMediaToCloudinary(videoFile?.path)
        
        res.status(200).json({
            success: true,
            message: "Video uploaded successfully",
            data:result
        })
    } catch (error) {
        console.log("error in upload video", error);

        res.status(500).json({
            success: false,
            message: "Error in upload video",
        })
    }
})


export default router