import { db } from "../../firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  DocumentData,
  Timestamp,
} from "firebase/firestore";
import { Transaction } from "../../types/transaction";

// Collection reference
const transactionCollection = collection(db, "transactions");

// Add a transaction
export const addTransaction = async (transaction: Omit<Transaction, "id">) => {
  const docRef = await addDoc(transactionCollection, {
    ...transaction,
    createdAt: new Date(), // Firestore will store as Timestamp
  });
  return docRef.id;
};

// Real-time listener
export const getTransactionsRealtime = (
  callback: (transactions: Transaction[]) => void
) => {
  const q = query(transactionCollection, orderBy("createdAt", "desc"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const list: Transaction[] = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      return {
        id: doc.id,
        amount: data.amount,
        category: data.category,
        note: data.note,
        type: data.type,
        createdAt:
          data.createdAt instanceof Timestamp
            ? data.createdAt.toDate()
            : new Date(),
      } as Transaction;
    });

    callback(list);
  });

  return unsubscribe;
};
