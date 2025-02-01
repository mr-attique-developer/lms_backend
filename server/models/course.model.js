import mongoose from "mongoose"


const courseSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    subTitle:{
        type: String,
    },
    description:{
        type: String,
    },
    category:{
        type: String,
        required: true
    },
    level:{
        type: String,
        enum : ['Beginner', 'Intermediate', 'Advance'],
    },
    price:{
        type: Number
    },
    courseThumbnail:{
        type: String
    },
    creater:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    enrolledStudents:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    lectures:[{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Lecture'
    }
],
    isPublished:{
        type:Boolean,
        default:false
    }


},{timestamps:true})

const Course = mongoose.model('Course', courseSchema)

export default Course