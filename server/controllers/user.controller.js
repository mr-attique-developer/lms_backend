import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { deleteFromCloudinary, uploadMediaToCloudinary } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "Not all fields have been entered." });
    }
    if (password.length < 5) {
      return res
        .status(400)
        .json({ message: "The password needs to be at least 5 characters long." });
    }


    const existingUser = await User.findOne({email})
    if(existingUser){
      return res.status(400).json({message: "An account with this email already exists."})
    }

    const hashedPassword =  await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(200).json({
        success:true,
        message: "User registered successfully",
        user: newUser
    })
  } catch (error) {
    console.log("Error in register Controller", error);
    return res.status(500).json({
      success:false,
      message:"Failed to Register User"
  }) 
  }
};


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({message: "Not all fields have been entered."})
        }

        const existingUser = await User.findOne({email})
        if(!existingUser){
            return res.status(400).json({message: "No account with this email exists. Please signup first."})
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }
        const token = await jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET, {expiresIn: "7d"})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 24*60*60*1000,
            sameSite: "strict"
        })
        res.status(200).json({
            success:true,
            message: `Welcome back ${existingUser.username}`,
            user: existingUser,
            token
        })
    } catch (error) {
        console.log("Error in login Controller", error);
        return res.status(500).json({
          success:false,
          message:"Failed to Login User"
      }) 
        
    }
}


export const logout = async (req, res) => {
    try {
      return res.status(200).cookie("token", "", {maxAge:0}).json({
        message:"Logged out successfully.",
        success:true
    })
    } catch (error) {
        console.log("Error in logout Controller", error);
        return res.status(500).json({
          success:false,
          message:"Failed to logout"
      }) 
        
    }
}


export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id
    const user = await User.findById(userId).select("-password").populate("enrolledCourses")


    if(!user){
      return res.status(400).json({message: "can not get user Profile"})
    }

    res.status(200).json({
      success:true,
      message: "User profile fetched successfully",
      user
    })

  } catch (error) {
    console.log("Error in getting user profile Controller", error);
    return res.status(500).json({
      success:false,
      message:"Failed to get user profile"
  }) 
  }
}



export const updateUserProfile = async (req, res) => {
  try {
     const {username} = req.body
    //  console.log(username)
     const userId = req.id
     const profilePhoto = req.file

     const user = await User.findById(userId)
     if(!user){
       return res.status(400).json(
        {
          success: false,
          message: "User not found"
        })

     }
     if(user.photoUrl){
      const publicId = await user.photoUrl.split("/").pop().split(".")[0]
      deleteFromCloudinary(publicId)
     }

    //  upload a new photo
      const result = await uploadMediaToCloudinary(profilePhoto?.path)
      const photoUrl = result?.secure_url

      const updateData = { username, photoUrl}
// console.log(updateData)
      const updateUser = await User.findByIdAndUpdate(userId, updateData, {new: true}).select("-password")

      res.status(200).json({
        success:true,
        message: "User profile updated successfully",
        user: updateUser
      })
  } catch (error) {
    console.log("Error in updating user profile Controller", error);
    return res.status(500).json({
      success:false,
      message:"Failed to update user profile"
  })
    
  }
}