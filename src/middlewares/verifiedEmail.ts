import { NextFunction, Request, Response } from "express";
import { GotErr } from "../utils/error";


interface IUser {
    id: number,
    fullname: string,
    username: string,
    email: string,
    is_admin: boolean,
    email_verified: boolean,
    iat: number,
    exp: number
}

export const VerifiedEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user as IUser

        // return error if email is not verified and also is not admin

        if (!user.email_verified && !user.is_admin) {
            throw new GotErr(403, "you have to verify your email to access this feature")
        }
        next()
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