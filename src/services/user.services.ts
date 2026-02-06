import { Sign } from "../utils/jwt";
import { prisma } from "../configs/client"
import { GotErr } from "../utils/error";
import { compare, hash } from "../utils/hash";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import crypto from "crypto"
import mailer from "../utils/mailer";
import forgotPasswordCodeContent from "../utils/mailContent";

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
        auth_token: token
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


export const SendCode = async (email: string) => {

    if (!email) {
        throw new GotErr(400, "email shouldnt be empty");
    }


    // basic fragile valid email check 
    if (!email.includes("@")) {
        throw new GotErr(400, "'please provide a valid email address");
    }

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new GotErr(400, "User with this email doesn't exists please kindly provide a valid one");
    }

    // generate random 6 digits code
    const code = Math.floor(100000 + Math.random() * 900000).toString();


    // hashing code  so even if someone breaks into db he/she couldn't use code to reset others account password
    const codeHash = await crypto.createHash("sha256").update(code).digest("hex");

    const setCode = await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            reset_code_hash: codeHash,
            reset_code_expiry: new Date(Date.now() + 10 * 60 * 1000)
        }
    });

    if (!setCode) {
        throw new Error("Internal Server Error try later");
    }

    // send mail to the user email

    const send = await mailer.sendMail({
        from: process.env.EMAIL,
        to: email,
        subject: "Password Reset Code",
        html: forgotPasswordCodeContent(code)
    });

    if (!send) {
        throw new Error("Internal Server Error try later");
    }

    return;

}



export const VerfyCode = async (email: string, newPassword: string, verfyCode: Number) => {
    const userExists = await prisma.user.findUnique({
        where: { email }
    });

    if (!userExists) {
        throw new GotErr(400, "User with this email doesn't exists please kindly provide a valid one");
    }

    //check if reset code exists in db
    if (!userExists.reset_code_hash) {
        throw new GotErr(400, "Given verification code has been expired please initiate a new one")
    }

    const cryptohash = crypto.createHash("sha256").update(String(verfyCode)).digest("hex");

    //compare db hashcode and user given code hash 
    if (cryptohash !== userExists.reset_code_hash) {
        throw new GotErr(400, "Invalid verification code");
    }

    if (!userExists.reset_code_expiry) {
        throw new GotErr(400, "Given verification code has been expired please initiate a new one");
    }

    const currentDate = new Date();

    //check if reset code has been expired
    if (currentDate > userExists.reset_code_expiry) {
        throw new GotErr(400, "Given verification code has been expired please initiate a new one");
    }

    const hashed = await hash(newPassword);

    if (!hashed) {
        throw new Error("Internal Server Error try later");
    }

    const updatePassword = await prisma.user.update({
        where: { id: userExists.id },
        data: {
            password: hashed
        }
    });

    if (!updatePassword) {
        throw new Error("Internal Server Error try later");
    }

    return;


}