import z from "zod"


export const registerValidator = z.object({
    fullname: z.string().min(3),
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6)
});