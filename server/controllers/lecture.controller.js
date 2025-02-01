import Course from "../models/course.model.js";
import Lecture from "../models/lecture.model.js";
import { deleteVideoFromCloudinary } from "../utils/cloudinary.js";

export const createLectureController = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title} = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "Course ID and Lecture Title are required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    
    const lecture = new Lecture({
      title,
    });

    await lecture.save();

    course.lectures.push(lecture._id);
    await course.save();

    res.status(201).json({
      success: true,
      message: "Lecture created successfully",
      lecture,
    });
  } catch (error) {
    console.log("Error in create lecture controller", error);
    res.status(500).json({
      success: false,
      message: "Error in create lecture controller",
    });
  }
};


export const getListOfLecturesController = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "List of lectures fetched successfully",
      lectures: course.lectures,
    });
  } catch (error) {
    console.log("Error in get list of lectures controller", error);
    res.status(500).json({
      success: false,
      message: "Error in get list of lectures controller",
    });
    
  }
}
export const updateLecutreController= async(req,res)=>{
  try {
    const {isPreviewFree, videoInfo,title} = req.body
    const {courseId, lectureId} = req.params

    const lecture = await Lecture.findByIdAndUpdate(lectureId)

    if(title) lecture.title = title
    lecture.isPreviewFree = isPreviewFree
    if(videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl
    if(videoInfo?.publicId) lecture.publicId = videoInfo.publicId
    await lecture.save()

    const course = await Course.findById(courseId)

    if(course && !course.lectures.includes(lecture._id)){
      course.lectures.push(lecture._id)
      await course.save()
    }

    res.status(200).json({
      success: true,
      message: "Lecture Updated Successfuly",
      lecture
    })
  } catch (error) {
    console.log("Error in update lecture controller", error)

    res.status(500).json({
      success: false,
      message: "Error in update lecture controller "
    })
  }
}


export const  removeLectureController = async( req, res)=>{
try {
  const { lectureId} = req.params
  const lecture = await Lecture.findByIdAndDelete(lectureId)
  if(!lecture){
    return res.status(400).json({
      success: false,
      message: "Lecture not found",
    });
  }
// Remove from cloudinay
   if(lecture.publicId){
    await deleteVideoFromCloudinary(lecture.publicId)
   }

  //  remove the refrence from the course 
  await Course.updateOne({lectures: lectureId}, {$pull: {lectures: lectureId}})

  res.status(200).json({
    success: true,
    message: "Lecture Deleted Successfully",
    lecture
  }
  )
} catch (error) {
  console.log("Error in remove lecture controller", error);
  res.status(500).json({
    success: false,
    message: "Error in remove lecture controller",
  });
}
} 



export const getLectureById = async(req, res)=>{
  try {
    const {lectureId}= req.params
    const lecture = await Lecture.findById(lectureId)
    if(!lecture){
      return res.status(400).json({
        success: false,
        message: "Lecture not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Lecture Get By Id successfuly",
      lecture
    })
  } catch (error) {
    console.log("Error in get Lectures By Id Controller",error)
    return res.status(400).json({
      success: false,
      message: "Error in get Lectures By Id Controller",
    });
  }
}