export interface reg {
    fullname: string
    username: string
    email: string
    password: string,
    profile_picture: Buffer

}


export interface IUser {
    id: number,
    fullname: string,
    username: string,
    email: string,
    is_admin: boolean,
    email_verified: boolean,
    iat: number,
    exp: number
}



export interface UpdateInf {
    fullname?: string,
    username?: string,
    bio?: string

}





