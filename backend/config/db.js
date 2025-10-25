import mongoose from "mongoose";

export const connectDB = async ()=>{
    await mongoose.connect('mongodb+srv://prathamesh:182829@cluster0.y9dfvfp.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}