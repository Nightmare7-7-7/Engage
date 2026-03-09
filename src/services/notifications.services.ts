import { prisma } from "../configs/client"
import { IUser } from "../types/user.types";
import { GotErr } from "../utils/error";


export const Check = async (user: IUser, notify_id: number) => {
    if (!notify_id) {
        throw new GotErr(400, "id is required")
    }

    const existingNotify = await prisma.notification.findUnique({
        where: {
            id: notify_id
        }
    })

    if (!existingNotify) {
        throw new GotErr(400, "notification with this id not found")
    }

    if (existingNotify.reciever_id !== user.id && !user.is_admin) {
        throw new GotErr(403, "you are not authorized to check others notifications")
    }

    //mark is_checked: true
    const check = await prisma.notification.update({
        where: {
            id: notify_id
        },
        data: {
            is_checked: true
        }
    });

    return "notification checked successfully";
}


export const DeleteAll = async (user_id: number) => {
    const del = await prisma.notification.deleteMany({
        where:{
            reciever_id: user_id
        }
    });

    if(!del){
        throw new Error("failed to clear notifications")
    }

    return "notifications cleared successfully"
}