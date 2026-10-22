import postgres, { Error } from 'postgres'
const sql = postgres("postgresql://postgres:root@localhost:5432/MiniLedger")
export default sql

export const checkDBConnection = async () => {
  try {
    await sql`SELECT 1`;
    console.log("PostgreSQL connected successfully!");
    return true;
  } catch (error:any) {
    console.error("PostgreSQL connection failed:", error.message);
    return false;
  }
};