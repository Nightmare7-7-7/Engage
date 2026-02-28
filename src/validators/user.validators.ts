import { verify } from "crypto";
import z from "zod"

const msgs = {
    json_err: 'please provide valid details in JSON format',
    empty_name: "fullname shouldnt be empty",
    short_name: 'fullname must be at least 3 characters long',
    empty_username: "username shouldnt be empty",
    short_username: 'username must be at least 3 characters long',
    empty_email: 'email shouldnt be empty',
    invalid_email: 'please provide a valid email address',
    empty_password: "password shouldnt be empty",
    short_password: 'password must be at least 6 characters long',
    empty_verfy_code: "verfyCode shouldn't be empty",
    short_verfy_code: "verfyCode code must be in 6digits",
    empty_newPassword: "newPassword shouldnt be empty",
    short_newPassword: "newPassword must be at least 6 characters long",
    empty_bio: "bio shouldn't be empty"
}

export const registerValidator = z.object({
    fullname: z.string(msgs.empty_name).min(3, msgs.short_name),
    username: z.string(msgs.empty_username).min(3, msgs.short_username),
    email: z.string(msgs.empty_email).email(msgs.invalid_email),
    password: z.string(msgs.empty_password).min(6, msgs.short_password),
    profile_picture: z.string().optional()
}, msgs.json_err);


export const loginValidator = z.object({
    email: z.string(msgs.empty_email).email(msgs.invalid_email),
    password: z.string(msgs.empty_password)
}, msgs.json_err);


export const ResetPassValidator = z.object({
    email: z.string(msgs.empty_email).email(msgs.invalid_email),
    newPassword: z.string(msgs.empty_newPassword).min(6, msgs.short_newPassword),
    verfyCode: z.number(msgs.empty_verfy_code).min(6, msgs.short_verfy_code)
}, msgs.json_err);



export const ChangePassValidator = z.object({
    password: z.string(msgs.empty_password),
    newPassword: z.string(msgs.empty_newPassword).min(6, msgs.short_newPassword)
}, msgs.json_err);



export const UpdateInfoValidator = z.object({
    fullname: z.string(msgs.empty_name).min(3, msgs.short_name).optional(),
    username: z.string(msgs.empty_username).min(3, msgs.short_username).optional(),
    bio: z.string(msgs.empty_bio).optional()
});