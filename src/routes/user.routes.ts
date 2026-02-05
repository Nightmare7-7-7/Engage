import { Router } from "express";
import { ForgetPassword, Login, Logout, Register, UploadProfile } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";

const userRoutes = Router()


userRoutes.post("/user/account/create",Register);
userRoutes.post("/user/acount/profile-picture",uploadImage.single("image"),UploadProfile);
userRoutes.post("/user/account/login",Login);
userRoutes.get("/user/account/logout",Logout);
userRoutes.post("/user/account/forget-password",ForgetPassword);


export default userRoutes;