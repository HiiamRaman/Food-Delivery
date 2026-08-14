import nodemailer from "nodemailer";
import { ApiError } from "./API/apiError.js";
//create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
//send email function
// This function can be used anywhere in your backend:
//  * - OTP email
//  * - password reset
//  * - order confirmation
//  * - notifications

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Food Delivery App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Email sent successfully:", info.messageId);

    return info;
  } catch (error) {
    console.error("Failed to send email:", error);

    throw error;
  }
};
