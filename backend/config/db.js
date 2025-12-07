import "dotenv/config";
import mongoose from "mongoose";

export const connectDB = async () => {
    const uri = (process.env.MONGODB_URI || "").trim();
    console.log("MONGODB_URI from env:", JSON.stringify(uri));

    try {
        await mongoose.connect(uri, { dbName: "food-del" });
        console.log("✅ DB Connected:", mongoose.connection.db.databaseName);
    } catch (err) {
        console.error("❌ DB connection error:", err);
        process.exit(1);
    }
};