import { GotErr } from "../utils/error"
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import { prisma } from "../configs/client";



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


