import { prisma } from "../configs/client"
import { io } from "../server";
import { GotErr } from "../utils/error"


export const Send = async (user_id: number, receiever_id: number, message: string) => {
    console.log("Send function called with:", { user_id, receiever_id, message });

    if (!receiever_id && !message) {
        throw new GotErr(400, "receiever_id and message is required")
    }

    //prevent user not to message himself
    if (receiever_id === user_id) {
        throw new GotErr(403, "you cannot send messages to yourself")
    }

    const send = await prisma.chat.create({
        data: {
            message: message,
            sender_id: user_id,
            reciever_id: receiever_id
        }
    });

    if (!send) {
        throw new Error("failed to send message")
    }

    io.to(`user_${receiever_id}`).emit('message', {
        send
    });

    return send;

}


export const RetrieveChat = async (user_id: number, chatting_with_id: number) => {
    if (!chatting_with_id) {
        throw new GotErr(400, "id is required")
    }

    // since the req user retrieved the chat therefore,set the chatting with users messages on isRead true

    await prisma.chat.updateMany({
        where: {
            sender_id: chatting_with_id,
            reciever_id: user_id,
            isRead: false
        },
        data: {
            isRead: true,
        }
    });

    const retrieve = await prisma.chat.findMany({
        where: {
            OR: [
                {
                    sender_id: user_id,
                    reciever_id: chatting_with_id
                },
                {
                    sender_id: chatting_with_id,
                    reciever_id: user_id
                }
            ]
        },
        orderBy: {
            createdAt: 'desc'
        }
    });


    const usersInfo = await prisma.user.findMany({
        where: {
            OR: [{
                id: user_id
            },
            {
                id: chatting_with_id
            },
            ]
        },
        select: {
            id: true,
            fullname: true,
            username: true,
            profile_picture: true
        }
    });

    return {
        users: usersInfo,
        messages: retrieve || []
    };
}