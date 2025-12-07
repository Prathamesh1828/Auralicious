// backend/test-db.js
import "dotenv/config";
import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

(async () => {
    try {
        const uri = (process.env.MONGODB_URI || "").trim();
        console.log("Using URI:", JSON.stringify(uri));

        await mongoose.connect(uri, { dbName: "food-del" });
        console.log("Connected to DB:", mongoose.connection.db.databaseName);

        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Collections in DB:", collections.map(c => c.name));

        const count = await foodModel.countDocuments();
        console.log("Food documents count:", count);

    } catch (err) {
        console.error("Error:", err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
})();
