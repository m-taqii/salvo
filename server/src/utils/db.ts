import mongoose from "mongoose";

export async function connectDB() {
    const MONGO_URI = process.env.MONGO_URI;
    try {
        if (!MONGO_URI) {
            throw new Error("Please provide MONGO_URI in the .env file");
        }
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("Error in connectDB:", error);
        process.exit(1);
    }
}

export async function disconnectDB() {
    try {
        await mongoose.disconnect();
        console.log("MongoDB disconnected successfully");
    } catch (error) {
        console.error("Error in disconnectDB:", error);
        process.exit(1);
    }
}