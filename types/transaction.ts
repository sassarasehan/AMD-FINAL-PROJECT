export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;
  amount: number;
  category: string;
  note?: string;
  type: TransactionType;
  createdAt: Date;
  userId: string;
}