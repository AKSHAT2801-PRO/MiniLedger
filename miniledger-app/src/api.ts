/**
 * All backend calls live here. If your backend uses different routes or field
 * names, this is the only file you need to change.
 *
 * Assumed REST routes (no JWT — the logged-in phone number is sent as the
 * `x-phone-number` header on every request after login):
 *
 *   POST   /auth/request-otp     body: { phone }
 *   POST   /auth/verify-otp   body: { phone, otp }
 *   GET    /loans/:phone      -> Loan[]            (or { loans: Loan[] })
 *   POST   /loans             JSON { friendName, phone, amount, dueDate }
 *                             or multipart (+ `receipt` file) when a photo is attached
 *   PATCH  /loans/:phone/:friend/repay -> marks the loan as repaid
 *   GET    /summary/:phone    -> { totalLent, totalRepaid, overdueAmount }
 */
import { Loan, NewLoanInput, Summary } from "./types";

export const API_URL = (process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000").replace(
  /\/+$/,
  ""
);

/** Header used to tell the backend who is logged in. Change if yours differs. */
const PHONE_HEADER = "x-phone-number";

let currentPhone: string | null = null;
export function setApiPhone(phone: string | null) {
  currentPhone = phone;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...((options.headers as Record<string, string>) ?? {}),
  };
  if (currentPhone) headers[PHONE_HEADER] = currentPhone;

  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError(
      `Can't reach the server at ${API_URL}. Check EXPO_PUBLIC_API_URL and that the backend is running.`,
      0
    );
  }

  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw new ApiError(
      data?.message || data?.error || `Request failed (${res.status})`,
      res.status
    );
  }
  return data as T;
}

/* ----------------------------- normalizers ----------------------------- */
// Tolerate camelCase or snake_case and Postgres numerics arriving as strings.

function normalizeLoan(raw: any): Loan {
  const status = raw.status ? String(raw.status).toLowerCase() : "";
  const friendName = raw.friendName ?? raw.friend ?? raw.friend_name ?? "";
  const amount = Number(raw.amount ?? 0);
  const isRepaidValue = raw.isRepaid ?? raw.is_repaid;
  const repaidAmount = raw.repaid_amount ?? raw.repaid;
  const isRepaid =
    typeof isRepaidValue === "boolean"
      ? isRepaidValue
      : isRepaidValue != null
        ? ["true", "1"].includes(String(isRepaidValue).toLowerCase())
        : typeof repaidAmount === "boolean"
          ? repaidAmount
          : status === "repaid" ||
            (amount > 0 && Number(repaidAmount ?? 0) >= amount);
  return {
    id: String(raw.id ?? `${raw.lender ?? ""}:${friendName}`),
    friendName,
    amount,
    dueDate: String(raw.duedate ?? raw.due_date ?? "").slice(0, 10),
    isRepaid,
    receiptUrl: raw.receiptUrl ?? raw.receipt_url ?? null,
  };
}

function normalizeSummary(raw: any): Summary {
  return {
    totalLent: Number(raw?.totalLent ?? raw?.total_lent ?? 0),
    totalRepaid: Number(raw?.totalRepaid ?? raw?.total_repaid ?? 0),
    overdueAmount: Number(raw?.overdueAmount ?? raw?.overdue_amount ?? 0),
  };
}

/* --------------------------------- auth --------------------------------- */

export async function sendOtp(phone: string): Promise<void> {
  await request("/auth/request-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(phone: string, otp: string): Promise<void> {
  await request("/auth/verify-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone, otp }),
  });
}

/* -------------------------------- loans --------------------------------- */

export async function getLoans(): Promise<Loan[]> {
  if (!currentPhone) {
    throw new ApiError("A phone number is required to fetch loans.", 400);
  }
  const data = await request<any>(`/loans/${encodeURIComponent(currentPhone)}`);
  const list = Array.isArray(data) ? data : data?.loans ?? data?.data ?? [];
  return list.map(normalizeLoan);
}

export async function addLoan(input: NewLoanInput): Promise<void> {
  if (input.receipt) {
    const form = new FormData();
    form.append("friendName", input.friendName);
    form.append("amount", String(input.amount));
    form.append("dueDate", input.dueDate);
    form.append("phone", currentPhone ?? "");
    form.append("receipt", input.receipt as any);
    // Don't set Content-Type: fetch adds the multipart boundary itself.
    await request("/loans", { method: "POST", body: form });
    return;
  }
  await request("/loans", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      friendName: input.friendName,
      phone: currentPhone ?? "",
      amount: input.amount,
      dueDate: input.dueDate,
    }),
  });
}

export async function markRepaid(friend: string): Promise<void> {
  if (!currentPhone) {
    throw new ApiError("A phone number is required to mark a loan as repaid.", 400);
  }
  await request(
    `/loans/${encodeURIComponent(currentPhone)}/${encodeURIComponent(friend)}/repay`,
    { method: "PATCH" }
  );
}

/* ------------------------------- summary -------------------------------- */

export async function getSummary(): Promise<Summary> {
  if (!currentPhone) {
    throw new ApiError("A phone number is required to fetch the loan summary.", 400);
  }
  return normalizeSummary(
    await request<any>(`/summary/${encodeURIComponent(currentPhone)}`)
  );
}

/** Receipt URLs may be relative paths like /uploads/abc.jpg. */
export function resolveFileUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
