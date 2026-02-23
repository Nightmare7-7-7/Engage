import { Request, Response } from "express";
import { Create } from "../services/post.services";
import { GotErr } from "../utils/error";
type post = {
    caption?: string,
    media?: string
}

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


export const CreatePost = async (req: Request, res: Response) => {

    try {
        const user = req.user as IUser;
        const { caption }: post = req.body;
        const media = req.file;

        const post = await Create(user.id, caption, media?.buffer);
        res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
        });


        } catch (err: any) {
            if (err instanceof GotErr) {
                res.status(err.code).json({
                    success: false,
                    message: err.message
                });
                return;
            }
    
            res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };