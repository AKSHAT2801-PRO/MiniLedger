export type Loan = {
  id: string;
  friendName: string;
  amount: number;
  /** YYYY-MM-DD */
  dueDate: string;
  isRepaid: boolean;
  receiptUrl?: string | null;
};

export type Summary = {
  totalLent: number;
  totalRepaid: number;
  overdueAmount: number;
};

export type NewLoanInput = {
  friendName: string;
  amount: number;
  /** YYYY-MM-DD */
  dueDate: string;
  receipt?: { uri: string; name: string; type: string } | null;
};
