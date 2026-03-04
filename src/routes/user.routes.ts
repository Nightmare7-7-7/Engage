import { Router } from "express";
import { ChangePassword, EmailVerification, ForgetPassword, Login, Logout, Register, ResetPassword, SelfInfo, UploadProfile, VerfyEmail, GetUserPosts, Follow, GetUser, UpdateSelfInfo, GetFollowList, GetFollowingPosts, GetUserSuggestions } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";
import RateLimiter from "../utils/rateLimiter";
import { AuthCheck } from "../middlewares/auth.middleware";
import { VerifiedEmail } from '../middlewares/verifiedEmail';
const userRoutes = Router()

//non authentication required routes
userRoutes.post("/user/account/create", uploadImage.single("image"), Register);
userRoutes.post("/user/acount/profile-picture", RateLimiter(10), uploadImage.single("image"), UploadProfile);
userRoutes.post("/user/account/login", RateLimiter(10), Login);
userRoutes.get("/user/account/logout", Logout);
userRoutes.post("/user/account/forget-password", RateLimiter(5), ForgetPassword);
userRoutes.post("/user/account/reset-password", RateLimiter(25), ResetPassword);
userRoutes.post("/user/account/email-verification", RateLimiter(8), EmailVerification);
userRoutes.get("/user/account/verify-email", VerfyEmail);
userRoutes.get("/user/get", AuthCheck, GetUser);
userRoutes.get("/user/follow-list", GetFollowList);
userRoutes.get('/user/following/posts', AuthCheck, GetFollowingPosts);
userRoutes.get('/user/suggestions',AuthCheck, GetUserSuggestions);

// authentication required routes
userRoutes.get("/user/account/me", AuthCheck, SelfInfo);
userRoutes.post("/user/account/change-password", AuthCheck, VerifiedEmail, ChangePassword);
userRoutes.get("/user/posts", AuthCheck, GetUserPosts);
userRoutes.get("/user/follow", AuthCheck, VerifiedEmail, Follow);
userRoutes.patch("/user/account/update", AuthCheck, VerifiedEmail, uploadImage.single("image"), UpdateSelfInfo)
export default userRoutes;