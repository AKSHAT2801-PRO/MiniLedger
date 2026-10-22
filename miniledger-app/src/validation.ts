/** Each validator returns an error message, or null when the value is valid. */

export function sanitizePhone(input: string): string {
  return input.replace(/\D/g, "");
}

export function validatePhone(input: string): string | null {
  const digits = sanitizePhone(input);
  if (!digits) return "Enter your mobile number";
  if (digits.length !== 10) return "Mobile number must be 10 digits";
  return null;
}

export function validateOtp(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  if (!digits) return "Enter the OTP";
  if (digits.length < 4 || digits.length > 6) return "OTP must be 4 to 6 digits";
  return null;
}

export function validateFriendName(input: string): string | null {
  const name = input.trim();
  if (!name) return "Enter your friend's name";
  if (name.length < 2) return "Name is too short";
  if (name.length > 60) return "Name is too long (max 60 characters)";
  return null;
}

export function validateAmount(input: string): string | null {
  const value = input.trim();
  if (!value) return "Enter an amount";
  if (!/^\d+(\.\d{1,2})?$/.test(value)) return "Enter a valid amount (up to 2 decimals)";
  const n = Number(value);
  if (n <= 0) return "Amount must be greater than 0";
  if (n > 100000000) return "Amount is too large";
  return null;
}

/* ------------------------------ date helpers ----------------------------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Date -> YYYY-MM-DD using the device's local calendar day. */
export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** YYYY-MM-DD -> "30 Oct 2026" */
export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** A loan is overdue when it's unpaid and its due date is before today. */
export function isOverdue(dueDate: string, isRepaid: boolean): boolean {
  if (isRepaid || !dueDate) return false;
  return dueDate < toISODate(new Date());
}

export function formatMoney(n: number): string {
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}
