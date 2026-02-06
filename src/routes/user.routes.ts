import { Router } from "express";
import { EmailVerification, ForgetPassword, Login, Logout, Register, ResetPassword, UploadProfile, VerfyEmail } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";
import RateLimiter from "../utils/rateLimiter";
import { VerfyEmailToken } from "../services/user.services";

const userRoutes = Router()


userRoutes.post("/user/account/create",Register);
userRoutes.post("/user/acount/profile-picture",RateLimiter(10),uploadImage.single("image"),UploadProfile);
userRoutes.post("/user/account/login",RateLimiter(10),Login);
userRoutes.get("/user/account/logout",Logout);
userRoutes.post("/user/account/forget-password",RateLimiter(5),ForgetPassword);
userRoutes.post("/user/account/reset-password",RateLimiter(25),ResetPassword);
userRoutes.post("/user/account/email-verification",RateLimiter(8),EmailVerification);
userRoutes.get("/user/account/verify-email",VerfyEmail);
export default userRoutes;