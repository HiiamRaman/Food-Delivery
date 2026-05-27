import mongoose from "mongoose";


 const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true,
        default:()=>Date.now()+5*60*1000  //5min
    }
 },{timestamps:true})

 export const OTP = mongoose.model("OTP",otpSchema)