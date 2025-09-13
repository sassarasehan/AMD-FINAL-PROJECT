// types/transaction.ts
export type TransactionType = "income" | "expense";

export interface Transaction {
  id?: string;           // Firestore doc ID
  amount: number;
  category: string;
  note?: string;
  type: TransactionType; // income | expense
  createdAt: Date;
}
