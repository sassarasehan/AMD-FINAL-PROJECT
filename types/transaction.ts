// // types/transaction.ts
// export type TransactionType = "income" | "expense";

// export interface Transaction {
//   id?: string;           // Firestore doc ID
//   amount: number;
//   category: string;
//   note?: string;
//   type: TransactionType; // income | expense
//   createdAt: Date;
// }
// types/transaction.ts
// types/transaction.ts
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