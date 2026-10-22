import sql from '../dbconfig';

interface LoanBody {
    friendName: string;
    phone: string;
    amount: number;
    dueDate: string;
}

export const addLoanToDB = async (body: LoanBody) => {
    try {
        const friendName = body.friendName;
        const lender = body.phone;

        const user = await sql`
            SELECT * FROM loan
            WHERE friend = ${friendName}
            AND lender = ${lender}
        `;

        if (user.length === 0) {
            // Insert a new loan
            const data = await sql`
                INSERT INTO loan (lender, friend, amount, duedate)
                VALUES (
                    ${lender},
                    ${friendName},
                    ${body.amount},
                    ${body.dueDate}
                )
                RETURNING lender, friend, amount, duedate
            `;

            return {
                success: true,
                message: "Loan added successfully",
                data: data[0]
            };
        } else {
            // Update the existing loan
            const data = await sql`
                UPDATE loan
                SET amount = amount + ${body.amount},
                    duedate = ${body.dueDate}
                WHERE friend = ${friendName}
                  AND lender = ${lender}
                RETURNING lender, friend, amount, duedate
            `;

            return {
                success: true,
                message: "Loan updated successfully",
                data: data[0]
            };
        }
    } catch (error) {
        console.error("Error adding/updating loan:", error);

        return {
            success: false,
            message: "Failed to add/update loan"
        };
    }
};

export const getLoanFromDB = async (lender:string)=>{
    try {
        const loans = await sql`
            SELECT lender, friend, amount, repaid, duedate
            FROM loan
            WHERE lender = ${lender}
        `;

        return loans;
    } catch (error) {
        console.error("Error fetching loans:", error);

        return {
            success: false,
            message: "Failed to fetch loans"
        };
    }
}

export const getLoanSummaryFromDB = async (phone: string) => {
    try {
        const result = await sql`
            SELECT
                COALESCE(SUM(amount), 0) AS total_lent,
                COALESCE(SUM(repaid), 0) AS total_repaid,
                COALESCE(
                    SUM(
                        CASE
                            WHEN duedate < CURRENT_DATE
                            THEN GREATEST(amount - repaid, 0)
                            ELSE 0
                        END
                    ),
                    0
                ) AS overdue_amount
            FROM loan
            WHERE lender = ${phone}
        `;

        return {
            totalLent: Number(result[0].total_lent),
            totalRepaid: Number(result[0].total_repaid),
            overdueAmount: Number(result[0].overdue_amount)
        };
    } catch (error) {
        console.error("Error fetching loan summary:", error);
        throw error;
    }
};

export const markRepaidInDB = async (phone: string, friend: string) => {
    try {
        const result = await sql`
            UPDATE loan
            SET repaid = amount
            WHERE lender = ${phone}
              AND friend = ${friend}
            RETURNING lender, friend, amount, repaid, duedate
        `;

        if (result.length === 0) {
            return {
                success: false,
                message: "Loan not found"
            };
        }

        return {
            success: true,
            message: "Loan marked as repaid successfully",
            data: result[0]
        };
    } catch (error) {
        console.error("Error marking loan as repaid:", error);
        throw error;
    }
};