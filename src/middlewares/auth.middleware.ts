import { NextFunction, Request, Response } from "express";
import { GotErr } from "../utils/error";
import { Verify } from "../utils/jwt";

export const AuthCheck = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.get('authorization') || req.get('auth_token');

        if (!token) {
            throw new GotErr(401, "Unauthorized");
        }

        const validToken = await Verify(token);

        if (!validToken) {
            throw new GotErr(401, "Unauthorized");
        }

        req.user = validToken

        next();

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