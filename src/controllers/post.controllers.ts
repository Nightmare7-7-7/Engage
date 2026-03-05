import { Request, Response } from "express";
import { Create, GetPost, GetPosts, Update, Delete, LikeUnlikePost, Comment, CommentDelete, CommentUpdate, SaveUnsave, GetComments, CommentLike, CommentReply, GetReplies, DeleteReply, LikeUnlikeReply } from "../services/post.services";
import { GotErr } from "../utils/error";
import { IUser } from "../types/user.types";
import { post, PostUodate } from "../types/post.types"





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
        const user = req.user as IUser
        const posts = await GetPosts(user.id);

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

        const user = req.user as IUser;

        const post_id = req.query.post_id;
        const post = await GetPost(user.id, Number(post_id));

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


export const UpdatePost = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        const { id, caption, visibility }: PostUodate = req.body;
        const media = req.file?.buffer;

        const post = await Update(user, Number(id), caption, media, visibility);

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

        const post = await Delete(user, Number(post_id));

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


export const UpdateComment = async (req: Request, res: Response) => {

    try {
        const user = req.user as IUser;
        const { id, comment } = req.body;

        const updatedComment = await CommentUpdate(user, Number(id), comment);

        return res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            data: updatedComment
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
    try {
        const user = req.user as IUser;

        const comment_id = req.query.comment_id;

        const del = await CommentDelete(user, Number(comment_id));

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



export const Save = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const { post_id, action } = req.query;

        const save = await SaveUnsave(user.id, Number(post_id), action as string);

        return res.status(200).json({
            success: true,
            message: save
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



export const GetAllComments = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser

        const id = req.query.post_id
        const comments = await GetComments(user.id, Number(id));

        return res.status(200).json({
            success: true,
            message: "Comments has been retrieved successfully",
            data: comments
        })
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


export const LikeComment = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser
        const { comment_id, action } = req.query

        const like = await CommentLike(user.id, Number(comment_id), action as string);

        //retutn message based on action type 
        const msg = action === "like" ? "comment liked successfully" : "comment unliked successfully";

        return res.status(200).json({
            success: true,
            message: msg,
            data: like
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



export const Reply = async (req: Request, res: Response) => {
    try {

        const user = req.user as IUser
        const { id, reply_text } = req.body

        const reply = await CommentReply(user.id, Number(id), reply_text as string);

        return res.status(200).json({
            success: true,
            message: "Successfully replied to the comment",
            data: reply
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


export const GetCommentReplies = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser
        const comment_id = req.query.comment_id;

        const Replies = await GetReplies(user.id, Number(comment_id));

        return res.status(200).json({
            success: true,
            message: "comment replies retrived successfully",
            data: Replies
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


export const DeleteCommentReply = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;
        const reply_id = req.query.reply_id;

        const reply = await DeleteReply(user, Number(reply_id));

        return res.status(200).json({
            success: true,
            message: "reply has been deleted successfully",
            data: reply
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


export const LikeCommentReply = async (req: Request, res: Response) => {
    try {

        const user = req.user as IUser;
        const { reply_id, action } = req.query

        const msg = action === "like" ? "reply liked successfully" : "reply unliked successfully";

        const like = await LikeUnlikeReply(user.id, Number(reply_id), action as string)

        return res.status(200).json({
            success: true,
            message: msg,
            data: like
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