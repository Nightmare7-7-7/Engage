import { Router } from "express";
import { ChangePassword, EmailVerification, ForgetPassword, Login, Logout, Register, ResetPassword, SelfInfo, UploadProfile, VerfyEmail, GetUserPosts, Follow, GetUser, UpdateSelfInfo, GetFollowList, GetFollowingPosts, GetUserSuggestions, GetUserNotifications, UserAvailableChats } from "../controllers/user.controllers";
import { uploadImage } from "../middlewares/multer";
import RateLimiter from "../utils/rateLimiter";
import { AuthCheck } from "../middlewares/auth.middleware";
import { VerifiedEmail } from '../middlewares/verifiedEmail';
import { CheckNotify, ClearAllNotification } from "../controllers/notifications.controller";
const userRoutes = Router()

//non authentication required routes
userRoutes.post("/account/create", uploadImage.single("image"), Register);
userRoutes.post("/acount/profile-picture", RateLimiter(10), uploadImage.single("image"), UploadProfile);
userRoutes.post("/account/login", RateLimiter(10), Login);
userRoutes.get("/account/logout", Logout);
userRoutes.post("/account/forget-password", RateLimiter(5), ForgetPassword);
userRoutes.post("/account/reset-password", RateLimiter(25), ResetPassword);
userRoutes.post("/account/email-verification", RateLimiter(8), EmailVerification);
userRoutes.get("/account/verify-email", VerfyEmail);
userRoutes.get("/follow-list", GetFollowList);


// authentication required routes
userRoutes.get("/account/me", AuthCheck, SelfInfo);
userRoutes.get('/suggestions', AuthCheck, GetUserSuggestions);
userRoutes.get('/following/posts', AuthCheck, GetFollowingPosts);
userRoutes.get("/get", AuthCheck, GetUser);
userRoutes.post("/account/change-password", AuthCheck, VerifiedEmail, ChangePassword);
userRoutes.get("/posts", AuthCheck, GetUserPosts);
userRoutes.get("/follow", AuthCheck, VerifiedEmail, Follow);
userRoutes.patch("/account/update", AuthCheck, VerifiedEmail, uploadImage.single("image"), UpdateSelfInfo);
userRoutes.get("/available-chats",AuthCheck, UserAvailableChats);

//notification releted paths
userRoutes.get('/notifications', AuthCheck, GetUserNotifications);
userRoutes.get('/notifications/check', AuthCheck, CheckNotify);
userRoutes.delete('/notifications/clear', AuthCheck, ClearAllNotification);
export default userRoutes;