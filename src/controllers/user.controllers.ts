import { success, ZodError } from "zod";
import { RegisterUser , UploadImage } from "../services/user.services";
import { registerValidator } from "../validators/user.validators";
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

export const UploadProfile = async (req: Request, res: Response) => {
    try {

        if(!req.file){
            throw new GotErr(400,"Please upload valid profile image")
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