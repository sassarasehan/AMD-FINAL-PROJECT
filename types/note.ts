export type Note = {
  id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type NoteCreate = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>;
export type NoteUpdate = Partial<Omit<Note, 'id' | 'userId' | 'createdAt'>>;
