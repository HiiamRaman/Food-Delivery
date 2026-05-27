import nodemailer from 'nodemailer';
import {ApiError} from '../utils/apiError.js'
//create transporter
const transporter  = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASSWORD
    }

});
//send email function
// This function can be used anywhere in your backend:
//  * - OTP email
//  * - password reset
//  * - order confirmation
//  * - notifications


export const sendEmail = async({ to, subject, html })=>{

    try {
        //sending email via  transporter
        const info = await transporter.sendMail({
            from:`"Food Delivery App" <${process.env.EMAIL_USER}>`, //sender name
            to,//receiver email,
            subject,//email subject line
            html //email content

        })
        // 5. SUCCESS LOG
        console.log("Email sent successfully ",info.messageId);
        return info;

    } catch (error) {
        console.log("Failed to Send Email",error);
        throw new ApiError(500,"Email couldnot be  sent");
    }

}