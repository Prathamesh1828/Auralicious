import express from "express"
import { loginUser, registerUser, forgotPassword, verifyOtp, resetPassword, googleLogin } from "../controllers/userController.js"

const userRouter = express.Router()

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)
userRouter.post("/forgot-password", forgotPassword)
userRouter.post("/verify-otp", verifyOtp)
userRouter.post("/reset-password", resetPassword)
userRouter.post("/google-login", googleLogin)

export default userRouter;