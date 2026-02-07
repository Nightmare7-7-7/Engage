import { success, ZodError } from "zod";
import { RegisterUser, LoginUser, UploadImage, SendCode, VerfyCode, SendVerifyEmail, VerfyEmailToken, GetSelfInfo } from "../services/user.services";
import { loginValidator, registerValidator, ResetPassValidator } from "../validators/user.validators";
import { Request, Response } from "express";
import { GotErr } from "../utils/error";

interface reg {
    fullname: string
    username: string
    email: string
    password: string
    profile_picture?: string

}

export const Register = async (req: Request, res: Response) => {
    try {
        const { fullname, username, email, password, profile_picture }: reg = registerValidator.parse(req.body)

        //Controller is expecting profile picture to come from frontend using our another api upload profile-picture 
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

        await VerfyEmailToken(String(token));

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