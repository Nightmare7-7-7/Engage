import { ChangePass } from './../services/user.services';
import { Request, Response } from "express";
import { IUser } from "../types/user.types";
import { RetrieveChat, Send } from "../services/chat.services";
import { GotErr } from "../utils/error";

interface Imessage {
    receiever_id: number,
    message: string
}

export const SendMessage = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser
        const { receiever_id, message }: Imessage = req.body
        console.log(req.body)
        const send = await Send(user.id, receiever_id, message)

        return res.status(200).json({
            success: true,
            message: "message has been successfully sent",
            data: send
        });

    } catch (err: any) {
        if (err instanceof GotErr) {
            return res.status(err.code).json({
                success: false,
                message: err.message
            });

        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}



export const UserChat = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser
        const chatting_with_id = req.params.id

        const chat = await RetrieveChat(user.id, Number(chatting_with_id))

        return res.status(200).json({
            success: true,
            message: "chat retrieved successfully",
            data: chat
        });

    } catch (err: any) {
        if (err instanceof GotErr) {
            return res.status(err.code).json({
                success: false,
                message: err.message
            });

        }

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}