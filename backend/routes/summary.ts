import { Router } from "express"
import {getSummaryController} from "../controller/loans"

export const summaryRouter = Router()

summaryRouter.get('/:phone',getSummaryController)