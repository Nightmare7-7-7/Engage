import { Router } from "express";
import { Register } from "../controllers/user.controllers";

const userRoutes = Router()


userRoutes.get("/user/account/create",Register);

export default userRoutes;