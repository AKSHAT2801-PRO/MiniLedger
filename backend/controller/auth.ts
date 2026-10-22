import { log } from "node:console";
import {generateOtp,getValidOtp} from "../services/otp"

export const handleAuth = async (req:any,res:any)=>{
    const phone = req.body.phone
    const otp = generateOtp(phone);
    return res.status(200).json({status: "success"})
}


export const verifyOtp = async (req:any,res:any)=>{
    const phone = req.body.phone
    const otp = req.body.otp
    if(otp == getValidOtp(phone))
        return res.status(200).json({token: "saevfw1234ewasdf"})
    else
        return res.status(300).json({message : "Incorrect Otp"})
}
