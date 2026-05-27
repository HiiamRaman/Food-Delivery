
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { ApiError } from "../utils/apiError.js";

import { OTP } from "../models/otp.model.js";
import { generateOTP } from "../Service/otp.service.js";
import {sendEmail} from '../Service/email.service.js'

export const sendOtpEmail = asyncHandler(async (req, res) => {
  /*
  FLOW:
  1. Get email
  2. Validate email
  3. Generate OTP
  4. Save OTP in DB
  5. Send OTP email
  6. Return response
  */

  const { email } = req.body;

  // 1. Validate input
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  // 2. Generate OTP
  const otp = generateOTP();

  console.log("Generated OTP:", otp);

  // 3. Save OTP in DB
  await OTP.create({
    email,
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
  });

  // 4. Send Email
  await sendEmail({
    to: email,
    subject: "Verify Your Account - OTP",

    html: `
      <table width="100%" cellspacing="0" cellpadding="0" style="background:#f4f4f4;padding:20px;font-family:Arial;">
        <tr>
          <td align="center">

            <table width="500" cellspacing="0" cellpadding="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">

              <!-- HEADER -->
              <tr>
                <td style="background:#ff4d2d;color:#ffffff;text-align:center;padding:20px;font-size:20px;font-weight:bold;">
                  Food Delivery App
                </td>
              </tr>

              <!-- BODY -->
              <tr>
                <td style="padding:30px;text-align:center;">

                  <h2 style="margin-bottom:10px;">Verify Your Account</h2>

                  <p style="font-size:14px;color:#555;">
                    Use the OTP below to verify your account
                  </p>

                  <div style="
                    font-size:28px;
                    font-weight:bold;
                    letter-spacing:6px;
                    margin:20px 0;
                  ">
                    ${otp}
                  </div>

                  <p style="font-size:12px;color:#888;">
                    This OTP is valid for 5 minutes
                  </p>

                </td>
              </tr>

              <!-- FOOTER -->
              <tr>
                <td style="text-align:center;padding:15px;font-size:11px;color:#999;">
                  Do not share this OTP with anyone
                </td>
              </tr>

            </table>

          </td>
        </tr>
      </table>
    `,
  });

  // 5. Response
  return res.status(200).json(
    new ApiResponse(200, {}, "OTP sent successfully")
  );
});