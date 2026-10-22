import { addLoanToDB, getLoanFromDB ,getLoanSummaryFromDB, markRepaidInDB} from "../repository/loans";

interface LoanBody {
    friendName: string;
    phone: string;
    amount: number;
    dueDate: string;
}

export const addLoan = async (body: LoanBody) => {
    try {
        const result = await addLoanToDB(body);
        return result;
    } catch (error) {
        console.error("Error in addLoan service:", error);

        throw error;
    }
};

export const getLoan = async (lender: string) => {
    try {
        const result = await getLoanFromDB(lender);
        return result;
    } catch (error) {
        console.error("Error in getLoan service:", error);
        throw error;
    }
};

export const getLoanSummary = async (phone: string) => {
    try {
        const summary = await getLoanSummaryFromDB(phone);
        return summary;
    } catch (error) {
        console.error("Error in getLoanSummary service:", error);
        throw error;
    }
};

export const markRepaid = async (phone: string, friend: string) => {
    return await markRepaidInDB(phone, friend);
};