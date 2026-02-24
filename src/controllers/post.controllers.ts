import { Request, Response } from "express";
import { Create, GetPost, GetPosts, Update, Delete, LikeUnlikePost, Comment, CommentDelete } from "../services/post.services";
import { GotErr } from "../utils/error";

type post = {
    caption?: string,
    media?: string,
    visibility?: string
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


export const GetPostById = async (req: Request, res: Response) => {
    try {
        const post_id = req.query.post_id;
        const post = await GetPost(Number(post_id));

        return res.status(200).json({
            success: true,
            message: "Post has been retrieved successfully",
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
            message: err.message
        });
    }
}


enum Visibility {
    Public = "Public",
    Private = "Private",
}


type UpdatePost = {
    id: number,
    caption?: string,
    media?: string,
    visibility?: Visibility
}


export const UpdatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        const { id, caption, visibility }: UpdatePost = req.body;
        const media = req.file?.buffer;

        const post = await Update(user.id, Number(id), caption, media, visibility);

        return res.status(200).json({
            success: true,
            message: "Post updated successfully",
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
            message: err.message
        });
    }
}


export const DeletePost = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        const post_id = req.query.post_id;

        const post = await Delete(user.id, Number(post_id));

        return res.status(200).json({
            success: true,
            message: "Post deleted successfully",
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
            message: err.message
        });
    }
}

export const LikePost = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const post_id = req.query.post_id;
        const action = req.query.action;

        const like = await LikeUnlikePost(user.id, Number(post_id), String(action));

        return res.status(200).json({
            success: true,
            message: like
        })
    }

    catch (err: any) {
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

export const CommentPost = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const { id, comment } = req.body;

        const postComment = await Comment(user.id, Number(id), comment);

        return res.status(201).json({
            success: true,
            message: "Commented successfully",
            data: postComment
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


 export const DeleteComment = async (req: Request, res: Response) => {
    try{
        const user = req.user as IUser;

        const comment_id = req.query.comment_id;

        const del = await CommentDelete(user.id, Number(comment_id));

        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            data: del
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