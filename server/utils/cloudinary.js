import { v2 as cloudinary } from 'cloudinary';
import "dotenv/config"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})


export const uploadMediaToCloudinary = async(file)=>{
    try {
        const result = await cloudinary.uploader.upload(file,{
            resource_type: "auto",

        })
        return result
    } catch (error) {
        console.log("Error in uploadMediaToCloudinary", error);
        
    }
}


export const deleteFromCloudinary =async( publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId)
    } catch (error) {
        console.log("Error in deleteFromCloudinar", error);
    }
}
export const deleteVideoFromCloudinary =async( publicId)=>{
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video"
        })
    } catch (error) {
        console.log("Error in delete Video from cloudinary", error);
    }
}