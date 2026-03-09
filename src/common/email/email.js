import nodemailer from "nodemailer"
import { emailHost, emailPassword } from "../../../config/index.js"

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: emailHost,
        pass: emailPassword
    }
})

export const sendEmail = async (to, subject, text) => {
    const mailOptions = {
        from: `"Saraha App Security" <${emailHost}>`,
        to,
        subject,
        text
    }

    await transporter.sendMail(mailOptions)
}