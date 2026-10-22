import { log } from "node:console"
import { addLoan,getLoan ,getLoanSummary,markRepaid } from "../services/loans"

export const addLoanController = async (req:any,res:any)=>{
    try{
        const body = req.body
        const result = await addLoan(body)
        return res.status(200).json(result)
    }
    catch(error){
        console.log(error);
        res.status(500)
    }
}

export const getLoanController = async (req:any, res:any)=>{
    try {
        const phone = req.params.phone;
        const loans = await getLoan(phone);
        res.status(200).json({loans});
    } catch (error) {
        console.error("Error fetching loans:", error);
        res.status(500).json({
            message: "Failed to fetch loans"
        });
    }
}

export const getSummaryController = async (req:any,res:any)=>{
    try {
        const phone = req.params.phone;
        if (!phone) {
            res.status(400).json({
                success: false,
                message: "Phone number is required"
            });
            return;
        }

        const summary = await getLoanSummary(phone);

        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching loan summary:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch loan summary"
        });
    }
}

export const markRepaidController = async (req:any,res:any)=>{
    try {
        const { phone, friend } = req.params;

        if (!phone || !friend) {
            res.status(400).json({
                success: false,
                message: "Phone number and friend name are required"
            });
            return;
        }

        const result = await markRepaid(phone, friend);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error marking loan as repaid:", error);

        res.status(500).json({
            success: false,
            message: "Failed to mark loan as repaid"
        });
    }
}