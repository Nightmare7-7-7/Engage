import { Sign } from "../utils/jwt";
import { prisma } from "../configs/client"
import { GotErr } from "../utils/error";
import { compare, hash } from "../utils/hash";
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
            profile_picture: profile_picture
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

export const LoginUser = async (email: string, password: string) => {

    const userExists = await prisma.user.findUnique({
        where: { email }
    });

    // return error if email is invalid
    if (!userExists) {
        throw new GotErr(400, "Invalid email or password");
    }

    const passwordValid = await compare(password, userExists.password);

    if (!passwordValid) {
        throw new GotErr(400, "Invalid email or password");
    }

    // sign the jwt token 
    const token = await Sign({
        id: userExists.id,
        fullname: userExists.fullname,
        username: userExists.username,
        email: userExists.email,
        is_admin: userExists.is_admin,
        email_verified: userExists.email_verified
    }, { expiresIn: '18d' });


    if (!token) {
        throw new Error("Internal Server Error, try later");
    }

    return {
        id: userExists.id,
        fullname: userExists.fullname,
        username: userExists.username,
        email: userExists.email,
        email_verified: userExists.email_verified,
        profile_picture: userExists.profile_picture,
        bio: userExists.bio,
        is_admin: userExists.is_admin,
        auth_token:token
    };

}




//first upload profile image will be triggred by frontend later it will comeup with combining create-account profile_picture field 
export const UploadImage = async (image: Buffer) => {
    const imageUrl = await uploadToCloudinary(
        image,
        "profile_pics"
    );

    return imageUrl;

}