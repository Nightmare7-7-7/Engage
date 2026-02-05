import { prisma } from "../configs/client"
import { GotErr } from "../utils/error";
import { hash } from "../utils/hash";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";

type UserData = {
    fullname: string;
    username: string;
    email: string;
    password: string;
    profile_picture?: string;
};

export const RegisterUser = async ({ fullname, username, email, password, profile_picture }: UserData) => {
    const emailExists = await prisma.user.findUnique({
        where: { email }
    });

    if (emailExists) {
        throw new GotErr(400, "User with this email already exists.kindly choose another email");
    }

    const usernameExists = await prisma.user.findUnique({
        where: { username }
    });

    if (usernameExists) {
        throw new GotErr(400, "User with this username already exists.kindly choose another username");
    }

    const hashed = await hash(password);

    if (!hashed) {
        throw new Error("Internal Server Error, try later");
    }

    const user = await prisma.user.create({
        data: {
            fullname,
            username,
            email,
            password: hashed,
            profile_picture:profile_picture
        },
        select: {
            id: true,
            fullname: true,
            username: true,
            email: true,
            profile_picture: true,
            email_verified: true,
        }
    });

    if (!user) {
        throw new Error("Internal Server Error, try later")
    }

    return user

}


//first upload profile image will be triggred by frontend later it will comeup with combining create-account profile_picture field 
export const UploadImage = async (image:Buffer) =>{
    const imageUrl = await uploadToCloudinary(
        image,
        "profile_pics"
    );

    return imageUrl;

}