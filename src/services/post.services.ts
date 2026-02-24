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
                saves: true
            }
        }
    );

    if (!posts) {
        throw new GotErr(404, "No posts found");
    }

    return posts;
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
            comments: true,
            saves: true
        }
    });

    if (!post) {
        throw new GotErr(404, "post with this id not found");
    }
    
    // get the likers of the post

    const likers = await prisma.like.findMany({
        where: {
            liked_id: post_id
        },
        select: {
            liker: {
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                }
            }
        }
    });


    return {
        ...post,
        likers: likers.map(like => like.liker)
    };
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
            id: post_id
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