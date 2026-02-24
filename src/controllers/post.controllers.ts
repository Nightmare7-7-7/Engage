import { Request, Response } from "express";
import { Create, GetPosts } from "../services/post.services";
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
        return res.status(201).json({
            success: true,
            message: "Post created successfully",
            data: post
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
            message: "Internal server error"
        });
    }
};


export const GetAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await GetPosts();

        return res.status(200).json({
            success: true,
            message: "All posts has been retrieved successfully",
            data: posts
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
            message: "Internal server error"
        });
    }
}