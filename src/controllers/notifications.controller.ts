import { Request, Response } from "express";
import { IUser } from "../types/user.types";
import { Check, DeleteAll } from "../services/notifications.services";
import { GotErr } from "../utils/error";


export const CheckNotify = async (req: Request, res: Response) => {
    try {
        const notify_id = req.query.id
        const user = req.user as IUser
        const check = await Check(user, Number(notify_id));
        return res.status(200).json({
            success: true,
            message: check
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



export const ClearAllNotification = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser
        const clear = await DeleteAll(user.id);

        return res.status(200).json({
            success: true,
            message: clear
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