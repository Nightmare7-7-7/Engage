import { Router } from "express";
import { ForgetPassword, Login, Logout, Register, UploadProfile } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";
import RateLimiter from "../utils/rateLimiter";

const userRoutes = Router()


userRoutes.post("/user/account/create",Register);
userRoutes.post("/user/acount/profile-picture",RateLimiter(10),uploadImage.single("image"),UploadProfile);
userRoutes.post("/user/account/login",RateLimiter(10),Login);
userRoutes.get("/user/account/logout",Logout);
userRoutes.post("/user/account/forget-password",RateLimiter(5),ForgetPassword);


export default userRoutes;