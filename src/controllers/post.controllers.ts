import { Request, Response } from "express";


type post = {
    caption:string,
    content_url?:string
}
export const CreatePost = async (req: Request, res: Response) => {
    const { caption, content_url }:post = req.body;


}