import random from 'random'
var otpTable: Record<string, number> = {};
export const generateOtp = (phone:string)=>{
    const otp = random.int(100000,999999)
    console.log("OTP: ",otp)
    otpTable[phone] = otp;
    return otp
}

export const getValidOtp = (phone:string)=>{
    return otpTable[phone]
}
