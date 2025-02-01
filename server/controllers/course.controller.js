import Course from "../models/course.model.js";
import {
  deleteFromCloudinary,
  uploadMediaToCloudinary,
} from "../utils/cloudinary.js";

export const createCourseController = async (req, res) => {
  try {
    const { title,category } = req.body;
    if (!title || !category) {
      return res.status(400).json({
        success: false,
        message: "Title and Category are required",
      });
    }
    const creater = req.id;
    const course = new Course({
      title,
    category, 
    creater
    });

    await course.save();

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.log("Error in create course controller", error);
    res.status(500).json({
      success: false,
      message: "Error in course controller",
    });
  }
};

export const getCreaterCoursesController = async (req, res) => {
  try {
    const userId = req.id;
    // console.log(userId);
    const courses = await Course.find({ creater: userId });
    if (!courses) {
      return res.status(404).json({
        success: false,
        message: "No courses found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Courses Fetched Successfully",
      courses,
    });
  } catch (error) {
    console.log("Error in get creater courses controller", error);
    res.status(500).json({
      success: false,
      message: "Error in get creater courses controller",
    });
  }
};


export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    // create search query
    const searchCriteria = {
      isPublished: true,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    // if categories selected
    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    // define sorting order
    const sortOptions = {};
    if (sortByPrice === "low") {
      sortOptions.price = 1; // sort by price in ascending
    } else if (sortByPrice === "high") {
      sortOptions.price = -1; // sort by price in descending
    }

    let courses = await Course.find(searchCriteria)
      .populate({ path: "creater", select: "username photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses: courses || [],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in search courses controller",
    });
  }
};
export const updateCreaterCourseController = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const { title, subTitle, level, category, description, price } = req.body;
    const courseThumbnail = req.file;
  
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let thumbnail;
    if (courseThumbnail) {
      if (course.courseThumbnail) {
        const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
        deleteFromCloudinary(publicId);
      }
      const result = await uploadMediaToCloudinary(courseThumbnail?.path);
      thumbnail = result?.secure_url;
    }

    const updatedData = {
      title,
      subTitle,
      level,
      category,
      description,
      price,
      courseThumbnail: thumbnail,
    };

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatedData,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log("Error in update creater courses controller", error);
    res.status(500).json({
      success: false,
      message: "Error in update creater  courses controller",
    });
  }
};

export const getCourseById = async(req, res) => {
try {
  
  const courseId = req.params.courseId
  const course = await Course.findById(courseId)
  if(!course){
    return res.status(404).json({
      success: false,
      message: "Course not found"
    })
  }
  return res.status(200).json({
    success: true,
    message: "Course fetched successfully",
    course
  })
} catch (error) {
  console.log("Error in getting creater courses controller", error);
  res.status(500).json({
    success: false,
    message: "Error in getting  creater  courses controller",
  });
}
}


export const togglePublishedCourseController = async(req, res) => {
  try {
    const {courseId} = req.params
    const {publish} = req.query

    const course = await Course.findById(courseId)
    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course not found"
      })

    }
    course.isPublished = publish === "true"
    await course.save()
    const status = publish === "true" ? "published" : "unpublished"
    return res.status(200).json({
      success: true,
      message: `Course ${status} successfully`,
      course
    })
  } catch (error) {
    console.log("Error in toggle Publised controller",error)
    res.status(500).json({
      success: false,
      message: "Error in toggle Publised controller"
    })
  }
}



export const getPublishedCoursesOnly = async (req,res)=>{

  try {

    const course = await Course.find({isPublished:true}).populate({path: "creater" , select: "username photoUrl"} )
    if(!course){
      return res.status(404).json({
        success: false,
        message: "Course not found"
      })

    }

    return res.status(200).json({
      success: true,
      message: "Published Course fetched successfully",
      course
    })
    
  }catch (error) {
    console.log("Error in toggle Publised controller",error)
    res.status(500).json({
      success: false,
      message: "Error in get  Publised courses controller"
    })
  }
}