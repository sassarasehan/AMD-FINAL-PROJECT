// import { db } from "../firebase";
// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   DocumentData,
//   Timestamp,
// } from "firebase/firestore";
// import { Transaction } from "../types/transaction";

// // Collection reference
// const transactionCollection = collection(db, "transactions");

// // Add a transaction
// export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
//   const docRef = await addDoc(transactionCollection, {
//     ...transaction,
//     createdAt: new Date(), // Firestore will store as Timestamp
//   });
//   return docRef.id;
// };

// // Real-time listener
// export const getTransactionsRealtime = (
//   callback: (transactions: Transaction[]) => void
// ) => {
//   const q = query(transactionCollection, orderBy("createdAt", "desc"));

//   const unsubscribe = onSnapshot(q, (snapshot) => {
//     const list: Transaction[] = snapshot.docs.map((doc) => {
//       const data = doc.data() as DocumentData;
//       return {
//         id: doc.id,
//         amount: data.amount,
//         category: data.category,
//         note: data.note,
//         type: data.type,
//         createdAt:
//           data.createdAt instanceof Timestamp
//             ? data.createdAt.toDate()
//             : new Date(),
//       } as Transaction;
//     });

//     callback(list);
//   });

//   return unsubscribe;
// };
// services/transactionService.ts
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/firebase";
import { Transaction } from "@/types/transaction";
import { auth } from "@/firebase";

// Collection reference
export const transactionsRef = collection(db, "transactions");

// Get all transactions for current user
export const getAllTransactionsByUserId = async (userId: string) => {
  const q = query(transactionsRef, where("userId", "==", userId), orderBy("createdAt", "desc"));

  const querySnapshot = await getDocs(q);
  const transactionList = querySnapshot.docs.map((transactionRef) => ({
    id: transactionRef.id,
    ...transactionRef.data()
  })) as Transaction[];
  return transactionList;
}

// Get all transactions (admin only)
export const getAllTransactions = async () => {
  const snapshot = await getDocs(transactionsRef);
  return snapshot.docs.map((transaction) => ({
    id: transaction.id,
    ...transaction.data()
  })) as Transaction[];
}

// Get transaction by ID
export const getTransactionById = async (id: string) => {
  const transactionDocRef = doc(db, "transactions", id);
  const snapshot = await getDoc(transactionDocRef);
  return snapshot.exists()
    ? ({
        id: snapshot.id,
        ...snapshot.data()
      } as Transaction)
    : null;
}

// Create transaction
export const createTransaction = async (transaction: Omit<Transaction, "id">) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("User must be logged in to create transactions");
  }

  const transactionWithUser = {
    ...transaction,
    userId: user.uid,
  };

  const docRef = await addDoc(transactionsRef, transactionWithUser);
  return docRef.id;
}

// Delete transaction
export const deleteTransaction = async (id: string) => {
  const transactionDocRef = doc(db, "transactions", id);
  return deleteDoc(transactionDocRef);
}

// Update transaction
export const updateTransaction = async (id: string, transaction: Partial<Transaction>) => {
  const transactionDocRef = doc(db, "transactions", id);
  const { id: _id, ...transactionData } = transaction; // remove id
  return updateDoc(transactionDocRef, transactionData);
}

// Real-time listener for current user's transactions
export const getTransactionsRealtime = (
  callback: (transactions: Transaction[]) => void
) => {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user logged in");
    callback([]);
    return () => {};
  }

  const q = query(
    transactionsRef,
    where("userId", "==", user.uid),
    orderBy("createdAt", "desc")
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list: Transaction[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        amount: data.amount,
        category: data.category,
        note: data.note,
        type: data.type,
        userId: data.userId,
        createdAt: data.createdAt instanceof Timestamp
          ? data.createdAt.toDate()
          : new Date(data.createdAt),
      } as Transaction;
    });
    callback(list);
  });

  return unsubscribe;
};