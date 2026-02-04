import z from "zod"

const msgs = {
    json_err:'please provide valid details in JSON format',
    empty_name:"fullname shouldnt be empty",
    short_name:'fullname must be at least 3 characters long',
    empty_username:"username shouldnt be empty",
    short_username:'username must be at least 3 characters long',
    empty_email:'email shouldnt be empty',
    invalid_email:'please provide a valid email address',
    empty_password:"password shouldnt be empty",
    short_password:'password must be at least 6 characters long',
}

export const registerValidator = z.object({
    fullname: z.string(msgs.empty_name).min(3,msgs.short_name),
    username: z.string(msgs.empty_username).min(3,msgs.short_username),
    email: z.string(msgs.empty_email).email(msgs.invalid_email),
    password: z.string(msgs.empty_password).min(6,msgs.short_password),
    profile_picture: z.string().optional()
},msgs.json_err);