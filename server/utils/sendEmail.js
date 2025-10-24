import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

})

export const sendEmail = async (to, otp) => {
    await transporter.sendMail({
        from: `"Rosario Resorts and Hotel" <${process.env.EMAIL_USER}>`,
        to,
        subject: "Your OTP Code",
        text: `Your verification code is: ${otp}`,
        html: `<h2> Your verification code is: ${otp} </h2>`,
    })
} 