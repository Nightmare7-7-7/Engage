import { Sign } from "../utils/jwt";
import { prisma } from "../configs/client"
import { GotErr } from "../utils/error";
import { compare, hash } from "../utils/hash";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import crypto from "crypto"
import mailer from "../utils/mailer";
import { forgotPasswordCodeContent, verifyEmailContent } from "../utils/mailContent";
import { JwtPayload } from "jsonwebtoken";
import cloudinary from "../configs/cloudinary";

type UserData = {
    fullname: string;
    username: string;
    email: string;
    password: string;
    profile_picture?: Buffer;
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
        throw new GotErr(400, "User with this username already exists kindly choose another username");
    }

    const hashed = await hash(password);

    if (!hashed) {
        throw new Error("Internal Server Error, try later");
    }

    if (!profile_picture) {
        const user = await prisma.user.create({
            data: {
                fullname,
                username,
                email,
                password: hashed
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

    //if requested with profile picture 

    const url = await uploadToCloudinary(profile_picture, "profile_pics");

    const user = await prisma.user.create({
        data: {
            fullname,
            username,
            email,
            password: hashed,
            profile_picture: url
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

export const SendVerifyEmail = async (email: string) => {
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
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    //send email+random 6digits code hash for more enhanced security
    const hash = crypto.createHash("sha256").update(email + code).digest('hex');

    const mail = await mailer.sendMail({
        from: process.env.EMAIL,
        to: user.email,
        subject: "Email verification link",
        html: verifyEmailContent(hash)
    });

    if (!mail) {
        throw new Error("Internal Server Error try later");
    }

    const savehash = await prisma.user.update({
        where: { id: user.id },
        data: {
            email_verification_hash: hash
        }
    });

    if (!savehash) {
        throw new Error("Internal Server Error try later");
    }
}


export const VerfyEmailToken = async (token: string) => {

    if (!token || token === 'undefined' || token === 'null') {
        throw new GotErr(400, "Please send your email verification token");
    }

    //search for token 
    const verify = await prisma.user.findFirst({
        where: {
            email_verification_hash: token
        }
    });

    if (!verify) {
        throw new GotErr(400, "Invalid email verification token")
    }

    //if the correct token then update the email_verified to true
    const user = await prisma.user.update({
        where: {
            id: verify.id
        },
        data: {
            email_verified: true,
            email_verification_hash: null
        }
    });

    if (!user) {
        throw new Error("Internal Server Error try later");
    }

    return;
}




export const GetSelfInfo = async (id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        },

        // also include user following and followers 
        include: {
            following: true,
            followers: true
        }
    });

    // even after passing authentication middleware if user fails that means something is wrong
    if (!user) {
        throw new Error("Internal Server Error try later");
    }

    // return user profile releted all infos for easy frontend use
    return {
        id: user.id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        profile_picture: user.profile_picture,
        bio: user.bio,
        active: user.active,
        email_verified: user.email_verified,
        following: user.following.length,
        followers: user.followers.length,
        is_admin: user.is_admin,

    }

}


export const ChangePass = async (password: string, newPassword: string, id: number) => {
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });

    // even after passing authentication middleware if user fails that means something is wrong 
    if (!user) {
        throw new Error("Internal Server Error try later");
    }

    //compare the pasword with the actual user password from db
    const passMatch = await compare(password, user.password);

    if (!passMatch) {
        throw new GotErr(400, "Invalid password entered")
    }

    //hash and reupdate the password in db
    const newHash = await hash(newPassword);

    const save = await prisma.user.update({
        where: { id: user.id },
        data: {
            password: newHash
        }
    });

    if (!save) {
        throw new Error("Internal Server Error try later");
    }

    return;


}

export const userPosts = async (user_id: number) => {
    const posts = await prisma.post.findMany({
        where: {
            creator_id: user_id
        },

        select: {
            id: true,
            caption: true,
            content_url: true,
            likes: true,
            comments: true,
            saves: true,
            visibility: true,
        },

    });


    if (!posts) {
        throw new GotErr(404, "No posts found for this user");
    }

    return posts.map((post) =>{
        return{
            id: post.id,
            caption: post.caption,
            content_url : post.content_url,
            likes: post.likes.length,
            comments: post.comments.length,
            saves: post.saves.length,
            visiblity: post.visibility
        }
    });
}


export const FollowUnfollow = async (user_id: number, folllowing_id: number, action: string) => {

    if (!folllowing_id) {
        throw new GotErr(400, "id is required");
    }

    if (!action) {
        throw new GotErr(400, "action is required");
    }

    if (action !== "follow" && action !== "unfollow") {
        throw new GotErr(400, "Invalid action value");
    }

    // prevent user not to follow or unfollow himself
    if (user_id === folllowing_id) {
        throw new GotErr(400, "you can't follow/unfollow yourself")
    }


    const existingUser = await prisma.user.findUnique({
        where: {
            id: folllowing_id
        }
    });

    if (!existingUser) {
        throw new GotErr(404, "user with this id not found");
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            follower_id_following_id: {
                follower_id: user_id,
                following_id: folllowing_id
            }
        }
    });


    if (action === "follow") {
        if (existingFollow) {
            throw new GotErr(400, "You have already followed this user")
        }

        const follow = await prisma.follow.create({
            data: {
                following_id: folllowing_id,
                follower_id: user_id
            }
        });

        if (!follow) {
            throw new Error("Failed to follow the user");
        }

        return "user followed successfully"


    }

    if (action === "unfollow") {
        if (!existingFollow) {
            throw new GotErr(400, "You doesn't follow this user");
        }

        const unfollow = await prisma.follow.delete({
            where: {
                follower_id_following_id: {
                    follower_id: user_id,
                    following_id: folllowing_id
                }
            }
        });

        if (!unfollow) {
            throw new Error("Failed to follow the user");
        }

        return "user unfollowed successfully"
    }
}



export const FindUser = async (user_id: number) => {

    if (!user_id) {
        throw new GotErr(400, "id is required");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: user_id
        },
        select: {
            id: true,
            fullname: true,
            username: true,
            profile_picture: true,
            bio: true,
            active: true,
            following: true,
            followers: true,
        }
    });

    if (!user) {
        throw new GotErr(404, "user with this id not found");
    }

    return {
        ...user,
        following: user.following.length,
        followers: user.followers.length
    }


}

interface UpdateInf {
    user_id: number
    fullname?: string,
    username?: string,
    bio?: string,
    image?: Buffer
}


export const UpdateInfo = async ({ user_id, fullname, username, bio, image }: UpdateInf) => {

    let url;

    if (!fullname && !username && !bio && !image) {
        throw new GotErr(400, "atleast one field is required")
    }


    if (username) {
        const existingUsername = await prisma.user.findUnique({
            where: {
                username: username
            }
        });

        if (existingUsername) {
            throw new GotErr(400, "this username is already taken please kindly choose another one")
        }
    }


    if (image) {
        url = await uploadToCloudinary(image, "profile_pics")
    }


    // Build update data object dynamically
    const updateData: any = {}

    if (fullname) updateData.fullname = fullname;
    if (username) updateData.username = username;
    if (bio) updateData.bio = bio;
    if (url) updateData.profile_picture = url;

    if (Object.keys(updateData).length > 0) {
        const update = await prisma.user.update({
            where: {
                id: user_id
            },
            data: updateData,
            select: {
                id: true,
                fullname: true,
                username: true,
                email: true,
                profile_picture: true,
                bio: true,
                email_verified: true,
            }
        });

        if (!update) {
            throw new Error("Failed to update info");
        }

        return update
    }
    else {
        throw new GotErr(400, "No valid fields to update");
    }

}