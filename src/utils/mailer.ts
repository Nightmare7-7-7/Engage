import nodemailer from "nodemailer"


const mailer = () =>{
    const mail = nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: process.env.EMAIL!,
            pass: process.env.PASSWORD!
        }});

    return mail
}

export default mailer();