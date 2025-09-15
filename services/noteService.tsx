import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  where, 
  orderBy,
  Timestamp,
  DocumentData,
  QuerySnapshot 
} from 'firebase/firestore';
import { db } from '@/firebase';
import { Note } from '@/types/note';

const noteConverter = {
  toFirestore: (note: Note): DocumentData => {
    return {
      title: note.title,
      content: note.content,
      userId: note.userId,
      createdAt: Timestamp.fromDate(note.createdAt),
      updatedAt: Timestamp.fromDate(note.updatedAt)
    };
  },
  fromFirestore: (snapshot: any, options: any): Note => {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      title: data.title,
      content: data.content,
      userId: data.userId,
      createdAt: data.createdAt.toDate(),
      updatedAt: data.updatedAt.toDate()
    };
  }
};

export const createNote = async (note: Omit<Note, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(
      collection(db, 'notes').withConverter(noteConverter), 
      note
    );
    return docRef.id;
  } catch (error) {
    console.error('Error creating note:', error);
    throw new Error('Failed to create note');
  }
};

export const updateNote = async (id: string, updates: Partial<Note>): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', id).withConverter(noteConverter);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating note:', error);
    throw new Error('Failed to update note');
  }
};

export const deleteNote = async (id: string): Promise<void> => {
  try {
    const noteRef = doc(db, 'notes', id);
    await deleteDoc(noteRef);
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
};

export const getNotesRealtime = (
  userId: string, 
  callback: (notes: Note[]) => void,
  errorCallback?: (error: Error) => void
) => {
  try {
    const q = query(
      collection(db, 'notes').withConverter(noteConverter),
      where('userId', '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, 
      (querySnapshot: QuerySnapshot<Note>) => {
        const notes: Note[] = [];
        querySnapshot.forEach((doc) => {
          notes.push(doc.data());
        });
        callback(notes);
      },
      (error) => {
        console.error('Error fetching notes:', error);
        if (errorCallback) {
          errorCallback(new Error('Failed to fetch notes'));
        }
      }
    );
  } catch (error) {
    console.error('Error setting up notes listener:', error);
    if (errorCallback) {
      errorCallback(new Error('Failed to set up notes listener'));
    }
    // Return a dummy unsubscribe function
    return () => {};
  }
};