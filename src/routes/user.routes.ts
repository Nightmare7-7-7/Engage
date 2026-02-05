import { Router } from "express";
import { Register, UploadProfile } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";

const userRoutes = Router()


userRoutes.post("/user/account/create",Register);
userRoutes.post("/user/acount/profile-picture",uploadImage.single("image"),UploadProfile);
export default userRoutes;