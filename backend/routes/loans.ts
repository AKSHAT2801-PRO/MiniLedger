import express from "express"
import { Router } from "express"
import {addLoanController,getLoanController, markRepaidController} from "../controller/loans"

export const loanRouter = Router()

loanRouter.post('/',addLoanController)
loanRouter.get('/:phone',getLoanController)
loanRouter.patch("/:phone/:friend/repay",markRepaidController)