import { Router } from "express";
import { Register } from "../controllers/user.controllers";

const userRoutes = Router()


userRoutes.post("/user/account/create",Register);
export default userRoutes;