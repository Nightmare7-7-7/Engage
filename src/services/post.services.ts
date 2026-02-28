import { CommentPost } from './../controllers/post.controllers';
import { GotErr } from "../utils/error"
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { prisma } from "../configs/client";
import { number } from "zod";



export const Create = async (creator_id: number, caption?: string, media?: Buffer) => {

    if (!media && !caption) {
        throw new GotErr(400, "Post must have either media or caption");
    }

    if (media) {
        // logic to upload media to cloud storage and get the url
        const mediaUrl = await uploadToCloudinary(media, "post_media");


        if (caption) {
            // logic to save post to database with caption and mediaUrl
            const upload = await prisma.post.create({
                data: {
                    caption,
                    content_url: mediaUrl,
                    creator_id: creator_id
                },

                include: {
                    creator: {
                        select: {
                            fullname: true,
                            username: true,
                        }
                    }
                }
            });

            return upload;
        }

        // logic to save post to database with mediaUrl only

        const upload = await prisma.post.create({
            data: {
                content_url: mediaUrl,
                creator_id: creator_id
            },
            include: {
                creator: {
                    select: {
                        fullname: true,
                        username: true,
                    }
                }
            }
        })

        return upload;


    }

    // logic to save post to database with caption only
    const upload = await prisma.post.create({
        data: {
            caption,
            creator_id: creator_id
        },
        include: {
            creator: {
                select: {
                    fullname: true,
                    username: true,
                }
            }
        }
    });

    return upload;

}


export const GetPosts = async () => {

    const posts = await prisma.post.findMany(
        {
            where: {
                visibility: "Public"
            },
            select: {
                id: true,
                caption: true,
                content_url: true,
                creator: {
                    select: {
                        id: true,
                        fullname: true,
                        username: true,
                        profile_picture: true
                    }
                },
                likes: true,
                comments: true,
                saves: true,
                createdAt: true,
                updatedAt: true
            }
        }
    );

    if (!posts) {
        throw new GotErr(404, "No posts found");
    }

    return {
        posts: posts.map(post => ({
            ...post,
            likes: post.likes.length,
            comments: post.comments.length,
            saves: post.saves.length
        }))
    };
}


export const GetPost = async (post_id: number) => {

    if (!post_id) {
        throw new GotErr(400, "post_id is required");
    }

    // logic to get the post from database with the given post_id and return it

    const post = await prisma.post.findUnique({
        where: {
            id: post_id,
            visibility: "Public"
        },
        select: {
            id: true,
            caption: true,
            content_url: true,
            creator: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    profile_picture: true
                }
            },
            likes: true,
            comments: true,
            saves: true,
            createdAt: true,
            updatedAt: true
        }
    });

    if (!post) {
        throw new GotErr(404, "post with this id not found");
    }



    return {
        ...post,
        // no need to return all the data insted return lengths later they will fetched using other api endpoints
        likes: post.likes.length,
        comments: post.comments.length,
        saves: post.saves.length
    }
}

enum Visibility {
    Public = "Public",
    Private = "Private",
}

export const Update = async (user_id: number, post_id: number, caption?: string, media?: Buffer, visibility?: Visibility) => {

    if (!post_id) {
        throw new GotErr(400, "post id is required");
    }

    if (!caption && !media && !visibility) {
        throw new GotErr(400, "At least one field is required to update the post");
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: post_id
        }
    });

    if (!existingPost) {
        throw new GotErr(404, "post with this id not found");
    }

    if (existingPost.creator_id !== user_id) {
        throw new GotErr(403, "You are not authorized to update others post");
    }

    if (caption) {
        if (media && visibility) {
            const mediaUrl = await uploadToCloudinary(media, "post_media");
            const post = await prisma.post.update({
                where: {
                    id: post_id
                },
                data: {
                    caption,
                    content_url: mediaUrl,
                    visibility
                }
            });

            return post;
        }

        if (media) {
            const mediaUrl = await uploadToCloudinary(media, "post_media");
            const post = await prisma.post.update({
                where: {
                    id: post_id
                },
                data: {
                    caption,
                    content_url: mediaUrl
                }
            });

            return post;
        }

        if (visibility) {

            if (visibility !== Visibility.Public && visibility !== Visibility.Private) {
                throw new GotErr(400, "Invalid visibility value");
            }


            const post = await prisma.post.update({
                where: {
                    id: post_id
                },
                data: {
                    caption,
                    visibility
                }
            });
            return post;
        }

        const post = await prisma.post.update({
            where: {
                id: post_id
            },
            data: {
                caption
            }
        });

        return post;
    }

    if (media) {
        const mediaUrl = await uploadToCloudinary(media, "post_media");

        if (visibility) {

            if (visibility !== Visibility.Public && visibility !== Visibility.Private) {
                throw new GotErr(400, "Invalid visibility value");
            }


            const post = await prisma.post.update({
                where: {
                    id: post_id
                },
                data: {
                    content_url: mediaUrl,
                    visibility
                }
            });
            return post;
        }

        const post = await prisma.post.update({
            where: {
                id: post_id
            },
            data: {
                content_url: mediaUrl
            }
        })
        return post;
    }



    if (visibility !== Visibility.Public && visibility !== Visibility.Private) {
        throw new GotErr(400, "Invalid visibility value");
    }

    const post = await prisma.post.update({
        where: {
            id: post_id
        },
        data: {
            visibility
        }
    });

    return post;

}


export const Delete = async (user_id: number, post_id: number) => {

    if (!post_id) {
        throw new GotErr(400, "post id is required");
    }


    const existingPost = await prisma.post.findUnique({
        where: {
            id: post_id
        }
    });

    if (!existingPost) {
        throw new GotErr(404, "post with this id not found");
    }

    if (existingPost.creator_id !== user_id) {
        throw new GotErr(403, "You are not authorized to delete others post");
    }

    const post = await prisma.post.delete({
        where: {
            id: post_id
        }
    });

    if (!post) {
        throw new Error("Failed to delete the post");
    }

    return post;
}


export const LikeUnlikePost = async (user_id: number, post_id: number, action: string) => {

    // action can be either "like" or "unlike"

    if (!post_id || !action) {
        throw new GotErr(400, "post_id and action are required");
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: post_id,
            visibility: "Public"
        }
    });


    if (!existingPost) {
        throw new GotErr(404, "post with this id not found");
    }

    // only public posts can be liked or unliked

    if (existingPost.visibility !== Visibility.Public) {
        throw new GotErr(404, "post with this id not found");
    }

    // logic to like or unlike the post based on the action value

    if (action === "like") {

        const existingLike = await prisma.like.findUnique({
            where: {
                liker_id_liked_id: {
                    liker_id: user_id,
                    liked_id: post_id
                }
            }
        });


        if (existingLike) {
            throw new GotErr(400, "You have already liked this post");
        }


        const like = await prisma.like.create({
            data: {
                liker_id: user_id,
                liked_id: post_id,
            }
        });

        return "post liked successfully";
    }

    if (action === "unlike") {

        const existingLike = await prisma.like.findUnique({
            where: {
                liker_id_liked_id: {
                    liker_id: user_id,
                    liked_id: post_id
                }
            }
        });

        if (!existingLike) {
            throw new GotErr(400, "You have not liked this post");
        }

        const unlike = await prisma.like.delete({
            where: {
                liker_id_liked_id: {
                    liker_id: user_id,
                    liked_id: post_id
                }
            }
        });

        return "post unliked successfully";
    }

    if (action !== "like" && action !== "unlike") {
        throw new GotErr(400, "Invalid action value");
    }




}

export const Comment = async (user_id: number, post_id: number, comment: string) => {

    if (!post_id) {
        throw new GotErr(400, "id is required")
    }

    if (!comment) {
        throw new GotErr(400, "comment shouldn't be empty")
    }

    const post = await prisma.post.findUnique({
        where: {
            id: post_id,
            visibility: "Public"
        }
    });

    if (!post) {
        throw new GotErr(404, "post with this id not found")
    }

    const CommentPost = await prisma.comment.create({
        data: {
            comment,
            commenter_id: user_id,
            commented_id: post.id

        }
    });

    if (!CommentPost) {
        throw new Error("Failed to delete the post")
    }

    return CommentPost;
}


export const CommentUpdate = async (user_id: number, comment_id: number, comment: string) => {

    if (!comment_id) {
        throw new GotErr(400, "comment id is required")
    }

    if (!comment) {
        throw new GotErr(400, "comment shouldn't be empty")
    }

    const existingComment = await prisma.comment.findUnique({
        where: {
            id: comment_id
        }
    });

    if (!existingComment) {
        throw new GotErr(404, "comment with this id not found");
    }

    if (existingComment.commenter_id !== user_id) {
        throw new GotErr(403, "You are not authorized to update others comment");
    }

    const updatedComment = await prisma.comment.update({
        where: {
            id: comment_id
        },
        data: {
            comment
        }
    });

    if (!updatedComment) {
        throw new Error("Failed to update the comment");
    }


    return updatedComment;
}








export const CommentDelete = async (user_id: number, comment_id: number) => {

    if (!comment_id) {
        throw new GotErr(400, "comment id is required")
    }

    const existingComment = await prisma.comment.findUnique({
        where: {
            id: comment_id
        }
    });

    if (!existingComment) {
        throw new GotErr(404, "comment with this id not found");
    }

    if (existingComment.commenter_id !== user_id) {
        throw new GotErr(403, "You are not authorized to delete others comment");
    }

    const del = await prisma.comment.delete({
        where: {
            id: comment_id
        }
    });

    if (!del) {
        throw new Error("Failed to delete the comment");
    }

    return del;
}




export const SaveUnsave = async (user_id: number, post_id: number, action: string) => {

    if (!post_id) {
        throw new GotErr(400, "post_id is required");
    }

    if (!action) {
        throw new GotErr(400, "action is required");
    }


    if (action !== "save" && action !== "unsave") {
        throw new GotErr(400, "Invalid action value");
    }

    // only public posts can be saved or unsaved
    const existingPost = await prisma.post.findUnique({
        where: {
            id: post_id,
            visibility: "Public"
        }
    });

    if (!existingPost) {
        throw new GotErr(404, "post with this id not found");
    }


    const existingSave = await prisma.save.findUnique({
        where: {
            saver_id_post_id: {
                saver_id: user_id,
                post_id: post_id
            }
        }
    });




    if (action === "save") {


        if (existingSave) {
            throw new GotErr(400, "post is already saved");
        }

        const save = await prisma.save.create({
            data: {
                saver_id: user_id,
                post_id: post_id
            }
        });


        if (!save) {
            throw new Error("Failed to save the post");
        }

        return "post saved successfully";
    }


    if (action === "unsave") {

        if (!existingSave) {
            throw new GotErr(400, "post is not saved");
        }

        const unsave = await prisma.save.delete({
            where: {
                saver_id_post_id: {
                    saver_id: user_id,
                    post_id: post_id
                }
            }
        });

        if (!unsave) {
            throw new Error("Failed to unsave the post");
        }


        return "post unsaved successfully";
    }



}


export const GetComments = async (post_id: number) => {

    if (!post_id) {
        throw new GotErr(400, "post_id is required")
    }

    const existingPost = await prisma.post.findUnique({
        where: {
            id: post_id,
            visibility: "Public"
        },
        select: {
            // get all the comments of the given post id
            comments: {
                select: {
                    id: true,
                    comment: true,
                    likes: true,
                    replies: true,
                    createdAt: true,
                    updatedAt: true,
                    commenter: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profile_picture: true,

                        }
                    }
                },

            }
        }
    });

    if (!existingPost) {
        throw new GotErr(404, "post with this id not found");
    }

    return existingPost.comments.map(cmt => {
        return {
            id: cmt.id,
            comment: cmt.comment,
            commenter: cmt.commenter,
            likes: cmt.likes.length,
            replies: cmt.replies.length,
            createdAt: cmt.createdAt,
            updatedAt: cmt.updatedAt
        };
    });

}



enum typeof_like {
    Comment = "Comment",
    Reply = "Reply"
}



export const CommentLike = async (user_id: number, comment_id: number, action: string) => {
    if (!comment_id) {
        throw new GotErr(400, "comment_id is required");
    }

    if (!action) {
        throw new GotErr(400, "action is required");
    }


    if (action !== "like" && action !== "unlike") {
        throw new GotErr(400, "Invalid action value");
    }


    const existingComment = await prisma.comment.findUnique({
        where: {
            id: comment_id
        }
    });

    if (!existingComment) {
        throw new GotErr(404, "comment with this id not found");
    }

    const existingLike = await prisma.cmtOrReplyLike.findUnique({
        where: {
            like_type: typeof_like.Comment,
            liker_id_comment_id: {
                liker_id: user_id,
                comment_id: existingComment.id
            }
        }
    });



    if (action === "like") {

        //check if user has already liked the comment
        if (existingLike) {
            throw new GotErr(400, "you have already liked this comment");
        }

        const like = await prisma.cmtOrReplyLike.create({
            data: {
                like_type: typeof_like.Comment,
                comment_id: existingComment.id,
                liker_id: user_id
            },
            select: {
                id: true,
                like_type: true,
                liker_id: true,
                comment_id: true
            }
        });

        if (!like) {
            throw new Error("Failed to like the comment");
        }

        return like;
    }


    if (action === "unlike") {

        if (!existingLike) {
            throw new GotErr(400, "you haven't liked this comment");
        }

        const unlike = await prisma.cmtOrReplyLike.delete({
            where: {
                like_type: typeof_like.Comment,
                liker_id_comment_id: {
                    liker_id: user_id,
                    comment_id: existingComment.id
                }
            },
            select: {
                id: true,
                like_type: true,
                liker_id: true,
                comment_id: true
            }
        });

        if (!unlike) {
            throw new Error("Failed to unlike the comment");
        }

        return unlike;


    }



}


export const CommentReply = async (user_id: number, comment_id: number, reply: string) => {
    if (!comment_id) {
        throw new GotErr(400, "comment id is required");
    }

    if (!reply) {
        throw new GotErr(400, "reply_text is required")
    }

    const existingComment = await prisma.comment.findUnique({
        where: {
            id: comment_id
        }
    });

    if (!existingComment) {
        throw new GotErr(404, "comment with this id not found")
    }

    const replyComment = await prisma.reply.create({
        data: {
            reply,
            replier_id: user_id,
            replied_id: comment_id

        }
    });

    if (!replyComment) {
        throw new Error("Failed to give reply to the comment")
    }

    return replyComment;
}


export const GetReplies = async (comment_id: number) => {

    if (!comment_id) {
        throw new GotErr(400, "comment id is required");
    }

    const existingComment = await prisma.comment.findUnique({
        where: {
            id: comment_id
        },
        select: {
            replies: {
                select: {
                    id: true,
                    reply: true,
                    likes: true,
                    replier: {
                        select: {
                            id: true,
                            fullname: true,
                            username: true,
                            profile_picture: true       
                        }
                    },
                    createdAt: true,
                    updatedAt: true
                }
            }
        }
    });

    if (!existingComment) {
        throw new GotErr(404, "comment with this id not found")
    }

    return existingComment.replies.map((reply) => {
        return {
            id: reply.id,
            reply: reply.reply,
            likes: reply.likes.length,
            replier: reply.replier,
            createdAt: reply.createdAt,
            updatedAt: reply.updatedAt,
        };
    });



}



export const DeleteReply = async (user_id: number, reply_id: number) => {
    if (!reply_id) {
        throw new GotErr(400, "reply_id is required")
    }

    const existingReply = await prisma.reply.findUnique({
        where: {
            id: reply_id
        }
    });

    if (!existingReply) {
        throw new GotErr(404, "reply with this id not found")
    }

    //check if the reply belongs to requesting user

    if (existingReply.replier_id !== user_id) {
        throw new GotErr(403, "You are not authorized to delete others reply")
    }

    const del = await prisma.reply.delete({
        where: {
            id: reply_id
        }
    });

    if (!del) {
        throw new Error("failed to delete reply")
    }

    return del;

}



export const LikeUnlikeReply = async (user_id: number, reply_id: number, action: string) => {
    if (!reply_id) {
        throw new GotErr(400, "reply_id is required")
    }

    if (!action) {
        throw new GotErr(400, "action is required")
    }

    if (action !== "like" && action !== "unlike") {
        throw new GotErr(400, "Invalid action value");
    }

    const existingReply = await prisma.reply.findUnique({
        where: {
            id: reply_id
        }
    });

    if (!existingReply) {
        throw new GotErr(404, "reply with this id not found")
    }

    const existingLike = await prisma.cmtOrReplyLike.findUnique({
        where: {
            like_type: typeof_like.Reply,
            liker_id_reply_id: {
                liker_id: user_id,
                reply_id: reply_id
            }
        }
    });

    if (action === "like") {

        if (existingLike) {
            throw new GotErr(400, "you have already liked this comment reply")
        }

        const like = await prisma.cmtOrReplyLike.create({
            data: {
                like_type: typeof_like.Reply,
                reply_id: reply_id,
                liker_id: user_id
            },
            select:{
                id: true,
                like_type: true,
                reply_id: true,
                liker_id: true
            }
        });

        if (!like) {
            throw new Error("failed to like reply")
        }

        return like;
    }


    if (action === "unlike") {
        if (!existingLike) {
            throw new GotErr(400, "you haven't like this comment reply")
        }

        const unlike = await prisma.cmtOrReplyLike.delete({
            where: {
                like_type: typeof_like.Reply,
                liker_id_reply_id: {
                    liker_id: user_id,
                    reply_id: reply_id
                },
            },
            select:{
                id: true,
                like_type: true,
                reply_id: true,
                liker_id: true
            }
            
        });

        if(!unlike){
             throw new Error("failed to unlike reply")
        }

        return unlike;
    }
}