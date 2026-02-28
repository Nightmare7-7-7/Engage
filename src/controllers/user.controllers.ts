import { success, ZodError } from "zod";
import { RegisterUser, LoginUser, UploadImage, SendCode, VerfyCode, SendVerifyEmail, VerfyEmailToken, GetSelfInfo, ChangePass, userPosts, FollowUnfollow, FindUser, UpdateInfo, FollowList } from "../services/user.services";
import { ChangePassValidator, loginValidator, registerValidator, ResetPassValidator, UpdateInfoValidator } from "../validators/user.validators";
import { Request, Response } from "express";
import { GotErr } from "../utils/error";

interface reg {
    fullname: string
    username: string
    email: string
    password: string

}

export const Register = async (req: Request, res: Response) => {
    try {

        const body = {
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        }

        const { fullname, username, email, password }: reg = registerValidator.parse(body);

        const profile_picture = req.file?.buffer

        const register = await RegisterUser({ fullname, username, email, password, profile_picture });

        return res.status(201).json({
            success: true,
            message: "Account has been created successfully",
            data: register
        });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

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



export const Login = async (req: Request, res: Response) => {
    try {
        const { email, password } = loginValidator.parse(req.body);

        const user = await LoginUser(email, password);

        //send cookie in response
        res.cookie("auth_token", user.auth_token, {
            maxAge: 18 * 24 * 60 * 60 * 1000, // 18 days in milliseconds
            httpOnly: true,
            secure: true
        });
        return res.status(200).json({
            success: true,
            message: `Hello,${user.fullname} you have been loggedIn successfully`,
            data: {
                user
            }
        });


    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

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




export const UploadProfile = async (req: Request, res: Response) => {
    try {

        if (!req.file) {
            throw new GotErr(400, "Please upload valid profile image")
        }

        // UploadImage will return profile picture image url 
        const profile = await UploadImage(req.file.buffer);

        return res.status(200).json({
            success: true,
            message: "Profile image has been selected successfully",
            profile_picture: profile
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


export const Logout = async (req: Request, res: Response) => {

    // clear auth token on logout action
    res.clearCookie("auth_token");

    return res.status(200).json({
        success: true,
        message: "You have been loggedOut successfully"
    });
}


export const ForgetPassword = async (req: Request, res: Response) => {
    try {

        const { email } = req.body

        await SendCode(email);

        return res.status(200).json({
            success: true,
            message: "Password reset code has been successfully sent your emial address"
        });


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


export const ResetPassword = async (req: Request, res: Response) => {
    try {
        const { email, newPassword, verfyCode } = ResetPassValidator.parse(req.body);
        await VerfyCode(email, newPassword, verfyCode);

        return res.status(200).json({
            success: true,
            message: "Password has been reseted successfully"
        });


    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

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


export const EmailVerification = async (req: Request, res: Response) => {
    try {
        const { email } = req.body
        await SendVerifyEmail(email);

        return res.status(200).json({
            success: true,
            message: "Email Verification token has been successfully sent your emial address"
        });
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


export const VerfyEmail = async (req: Request, res: Response) => {
    try {
        const token = req.query.token;

        const verify = await VerfyEmailToken(String(token));

        //send updated cookie in response as the data is changed in db
        res.cookie("auth_token", verify, {
            maxAge: 18 * 24 * 60 * 60 * 1000, // 18 days in milliseconds
            httpOnly: true,
            secure: true
        });

        return res.status(200).json({
            success: true,
            message: "Your email has been successfully verified"
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




interface IUser {
    id: number,
    fullname: string,
    username: string,
    email: string,
    is_admin: boolean,
    email_verified: boolean,
    iat: number,
    exp: number
}

export const SelfInfo = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        const info = await GetSelfInfo(user.id);

        return res.status(200).json({
            success: true,
            message: "UserInfo has been gathered successfully",
            data: info
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



export const ChangePassword = async (req: Request, res: Response) => {
    try {

        const { password, newPassword } = ChangePassValidator.parse(req.body);

        const user = req.user as IUser;

        const change = await ChangePass(password, newPassword, user.id);

        return res.status(200).json({
            success: true,
            message: "Your password has been changed successfully"
        });

    } catch (err: any) {
        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

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

export const GetUserPosts = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser;

        const posts = await userPosts(user.id);

        return res.status(200).json({
            success: true,
            message: "Posts retrieved successfully",
            posts
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


export const Follow = async (req: Request, res: Response) => {
    try {

        const user = req.user as IUser

        const { id, action } = req.query

        const follow = await FollowUnfollow(user.id, Number(id), action as string);

        return res.status(200).json({
            success: true,
            message: follow
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


export const GetUser = async (req: Request, res: Response) => {
    try {
        const id = req.query.id

        const user = await FindUser(Number(id));

        return res.status(200).json({
            success: true,
            message: "UserInfo retrieved successfully",
            data: user
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


interface UpdateInf {
    fullname?: string,
    username?: string,
    bio?: string

}

export const UpdateSelfInfo = async (req: Request, res: Response) => {
    try {
        const user = req.user as IUser

        const body: UpdateInf = {
            fullname: req.body.fullname,
            username: req.body.username,
            bio: req.body.bio
        }

        const { fullname, username, bio }: UpdateInf = UpdateInfoValidator.parse(body);

        const image = req.file?.buffer

        const update = await UpdateInfo({ user_id: user.id, fullname, username, bio, image })

        //send updated cookie in response as the data is changed in db
        res.cookie("auth_token", update.token, {
            maxAge: 18 * 24 * 60 * 60 * 1000, // 18 days in milliseconds
            httpOnly: true,
            secure: true
        });
        return res.status(200).json({
            success: true,
            message: "information has been updated successfully",
            data: update.info
        });


    } catch (err: any) {
        if (err instanceof GotErr) {
            return res.status(err.code).json({
                success: false,
                message: err.message
            });

        }


        if (err instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: err.issues[0].message
            });
        }

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
}



export const GetFollowList = async (req: Request, res: Response) => {
    try {
        const id = req.query.user_id

        const list = await FollowList(Number(id));

        return res.status(200).json({
            success: true,
            message: "user follow list has been retrived successfully",
            data: list
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