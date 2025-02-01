
import mongoose from "mongoose"

const lectureProgressSchema = new mongoose.Schema({
    lectureId:{type:String},
    viewed:{type:Boolean, default:false},
})


const courseProgressSchema = new mongoose.Schema({
    courseId:{type:String},
    userId:{type:String},
    lectureProgress: [lectureProgressSchema],
    completed:{type:Boolean, default:false},

})

const CourseProgress = mongoose.model('CourseProgress', courseProgressSchema)
export default CourseProgress