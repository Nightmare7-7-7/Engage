import jwt from "jsonwebtoken"

const secret: string = process.env.JWT_SECRET as string

export const Sign = (
    payload: object,
    expire: jwt.SignOptions = { expiresIn: '1h' }
) => { return jwt.sign(payload, secret, expire); }

export const Verify = (
    token: string
) =>{ return jwt.verify(token,secret)}





