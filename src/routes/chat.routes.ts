import { Router } from "express";
import { AuthCheck } from "../middlewares/auth.middleware";
import { SendMessage, UserChat } from "../controllers/chat.controllers";

const chatRoutes = Router();


chatRoutes.post('/send-message', AuthCheck, SendMessage);
chatRoutes.get('/get/:id', AuthCheck, UserChat);
export default chatRoutes;