import Course from "../models/course.model.js";
import CourseProgress from "../models/courseProgress.model.js";

export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId }).populate("courseId");
    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }
    if (!courseProgress) {
      // Create a new CourseProgress document if it doesn't exist
      const newCourseProgress = new CourseProgress({
        courseId,
        userId,
        lectureProgress: course.lectures.map((lecture) => ({
          lectureId: lecture._id,
          viewed: false,
        })),
        completed: false,
      });
      await newCourseProgress.save();

      return res.status(200).json({
        data: {
          course,
          progress: newCourseProgress.lectureProgress,
          completed: newCourseProgress.completed,
        },
      });
    }

    return res.status(200).json({
      data: {
        course,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.log("Error in getting course progress ", error);
    res.status(500).json({ message: "Error in getting course progress" });
  }
};

export const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = new CourseProgress({
        courseId,
        userId,
        lectureProgress: [],
        completed: false,
      });
    }

    const lectureIndex = courseProgress.lectureProgress.findIndex((lecture) => lecture.lectureId === lectureId);

    if (lectureIndex === -1) {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    } else {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    }

    // Check if all lectures are viewed
    const lectureProgressLength = courseProgress.lectureProgress.filter((lecture) => lecture.viewed).length;
    const course = await Course.findById(courseId);

    if (lectureProgressLength === course.lectures.length) {
      courseProgress.completed = true;
    }
    await courseProgress.save();

    res.status(200).json({ message: "Course progress updated successfully" });
  } catch (error) {
    console.log("Error in update course progress ", error);
    res.status(500).json({ message: "Error in update course progress" });
  }
};

export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress)
      return res.status(404).json({ message: "Course progress not found" });

    courseProgress.lectureProgress.map(
      (lectureProgress) => (lectureProgress.viewed = true)
    );
    courseProgress.completed = true;
    await courseProgress.save();
    return res.status(200).json({ message: "Course marked as completed." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in marking course as completed" });
  }
};

export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    let courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({ message: "Course progress not found" });
    }
    courseProgress.lectureProgress.map((lecture) => (lecture.viewed = false));

    courseProgress.completed = false;
    await courseProgress.save();

    res.status(200).json({ message: "Course marked as incomplete successfully" });
  } catch (error) {
    console.log("Error in marking course as incomplete ", error);
    res.status(500).json({ message: "Error in marking course as incomplete" });
  }
};