import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });
    mongoose.connection.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });

    await mongoose.connect(`${process.env.MONGODB_URI}/Feedback_Portal`).catch(err => {
        console.error("Failed to connect to MongoDB:", err);
    });

}

export default connectDB;
