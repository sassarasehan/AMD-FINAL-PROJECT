// screens/NotesScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/context/AuthContext';
import { Note } from '@/types/note';
import { 
  createNote, 
  updateNote, 
  deleteNote, 
  getNotesRealtime 
} from '@/services/noteService';

const NotesScreen: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { user } = useAuth();

  // Real-time listener
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = getNotesRealtime(
      user.uid,
      (notesData) => {
        setNotes(notesData);
        setFilteredNotes(notesData);
        setLoading(false);
      },
      (error) => {
        Alert.alert('Error', error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user]);

  // Filter notes
  useEffect(() => {
    if (searchQuery) {
      const filtered = notes.filter(
        note =>
          note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNotes(filtered);
    } else {
      setFilteredNotes(notes);
    }
  }, [searchQuery, notes]);

  const handleSaveNote = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Error', 'Please add both title and content to your note.');
      return;
    }
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save notes.');
      return;
    }

    setSaving(true);
    try {
      if (currentNote) {
        await updateNote(currentNote.id, { title, content });
      } else {
        const newNote = {
          title,
          content,
          userId: user.uid,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        await createNote(newNote);
      }
      setTitle('');
      setContent('');
      setCurrentNote(null);
      setIsModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save note. Please try again.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setCurrentNote(note);
    setTitle(note.title);
    setContent(note.content);
    setIsModalVisible(true);
  };

  const handleDeleteNote = (noteId: string) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNote(noteId);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete note.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleNewNote = () => {
    setCurrentNote(null);
    setTitle('');
    setContent('');
    setIsModalVisible(true);
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const renderNoteItem = ({ item }: { item: Note }) => (
    <TouchableOpacity
      style={styles.noteCard}
      onPress={() => handleEditNote(item)}
      onLongPress={() => handleDeleteNote(item.id)}
    >
      <Text style={styles.noteTitle} numberOfLines={1}>{item.title}</Text>
      <Text style={styles.noteContent} numberOfLines={3}>{item.content}</Text>
      <Text style={styles.noteDate}>{formatDate(item.updatedAt)}</Text>
    </TouchableOpacity>
  );

  if (loading) return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#667eea" />
      <Text style={styles.loadingText}>Loading your notes...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.header}>
        <Text style={styles.headerTitle}>My Notes</Text>
        <Text style={styles.headerSubtitle}>Keep your thoughts organized</Text>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search notes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9ca3af"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <MaterialIcons name="close" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ) : null}
      </View>

      {filteredNotes.length > 0 ? (
        <FlatList
          data={filteredNotes}
          renderItem={renderNoteItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.notesList}
          numColumns={2}
          columnWrapperStyle={styles.notesRow}
        />
      ) : (
        <View style={styles.emptyState}>
          <MaterialIcons name="note-add" size={64} color="#d1d5db" />
          <Text style={styles.emptyStateText}>
            {searchQuery ? 'No notes found' : 'No notes yet'}
          </Text>
          <Text style={styles.emptyStateSubtext}>
            {searchQuery ? 'Try a different search term' : 'Tap the + button to create your first note'}
          </Text>
        </View>
      )}

      <TouchableOpacity style={styles.addButton} onPress={handleNewNote}>
        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.addButtonGradient}>
          <Feather name="plus" size={28} color="white" />
        </LinearGradient>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        onRequestClose={() => !saving && setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => !saving && setIsModalVisible(false)}
              style={styles.modalCloseButton}
              disabled={saving}
            >
              <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {currentNote ? 'Edit Note' : 'New Note'}
            </Text>
            <TouchableOpacity
              onPress={handleSaveNote}
              style={styles.modalSaveButton}
              disabled={saving}
            >
              {saving ? <ActivityIndicator size="small" color="#667eea" /> : <Text style={styles.modalSaveText}>Save</Text>}
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <TextInput
              style={styles.titleInput}
              placeholder="Note title"
              value={title}
              onChangeText={setTitle}
              placeholderTextColor="#9ca3af"
              editable={!saving}
            />
            <TextInput
              style={styles.contentInput}
              placeholder="Start typing..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              placeholderTextColor="#9ca3af"
              editable={!saving}
            />
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default NotesScreen;

// ---- Styles remain the same ----
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  loadingText: { marginTop: 16, fontSize: 16, color: '#6b7280' },
  header: { padding: 24, paddingTop: 60, paddingBottom: 30 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255, 255, 255, 0.8)' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', margin: 16, paddingHorizontal: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16, color: '#374151' },
  notesList: { padding: 8, paddingBottom: 100 },
  notesRow: { justifyContent: 'space-between', marginBottom: 16 },
  noteCard: { width: '48%', backgroundColor: 'white', borderRadius: 12, padding: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2 },
  noteTitle: { fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 8 },
  noteContent: { fontSize: 14, color: '#6b7280', marginBottom: 12, lineHeight: 20 },
  noteDate: { fontSize: 12, color: '#9ca3af' },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, marginTop: 60 },
  emptyStateText: { fontSize: 18, fontWeight: '600', color: '#6b7280', marginTop: 16, marginBottom: 8 },
  emptyStateSubtext: { fontSize: 14, color: '#9ca3af', textAlign: 'center' },
  addButton: { position: 'absolute', right: 20, bottom: 20, borderRadius: 30, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4 },
  addButtonGradient: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center' },
  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  modalCloseButton: { padding: 8 },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#374151' },
  modalSaveButton: { padding: 8, minWidth: 50, alignItems: 'center' },
  modalSaveText: { fontSize: 16, fontWeight: '600', color: '#667eea' },
  modalContent: { flex: 1, padding: 16 },
  titleInput: { fontSize: 20, fontWeight: '600', color: '#111827', marginBottom: 16, padding: 8, borderBottomWidth: 1, borderBottomColor: '#e5e7eb' },
  contentInput: { fontSize: 16, color: '#374151', lineHeight: 24, minHeight: 200, padding: 8 },
});
