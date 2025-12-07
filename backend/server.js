import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js"
import userRouter from "./routes/userRoute.js"
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import foodModel from "./models/foodModel.js"
import mongoose from "mongoose"


// app config
const app = express()
const port = 4000

// middleware
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173', // For local development
    'https://auralicious.vercel.app', // Replace with your Vercel app URL
    'https://auralicious-admin.vercel.app/' // TODO: Replace with your actual Admin Panel URL
  ],
  credentials: true
}))

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/api/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState; // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const foodCount = await foodModel.countDocuments();
    res.json({ status: "ok", dbState, foodCount, dbName: mongoose.connection.db ? mongoose.connection.db.databaseName : "unknown" });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message, stack: error.stack });
  }
});

app.get("/", (req, res) => {
  res.send("API Working")
})


app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
