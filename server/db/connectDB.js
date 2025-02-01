import mongoose from "mongoose";


export const connectDB = async (req, res) => {

    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Database connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        console.log("Database connected Error");
        process.exit(1);
        
    }
}