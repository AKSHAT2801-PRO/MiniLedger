import express from "express"
import { Router } from "express"
import {handleAuth,verifyOtp} from "../controller/auth"

export const authRouter = Router()

authRouter.post("/request-otp",handleAuth)
authRouter.post("/verify-otp",verifyOtp)