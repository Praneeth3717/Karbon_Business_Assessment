import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Notes from '../components/Notes';
import NoteModal from '../components/NoteModal';
import api from '../utils/api';
import { useCallback } from 'react';

interface Note {
  _id: string;
  title: string;
  description: string;
  type: 'personal' | 'home' | 'business';
  createdAt: string;
}

const Home: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [initialData, setInitialData] = useState<Note | undefined>(undefined);
  const [notes, setNotes] = useState<Note[]>([]);
  const [editNoteId, setEditNoteId] = useState<string | null>(null);

const fetchNotes = useCallback(async () => {
  try {
    const res = await api.get('/notes/get');
    setNotes(res.data);
  } catch (error) {
    console.error('Failed to fetch notes:', error);
  }
}, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = () => {
    setInitialData(undefined);
    setModalMode('add');
    setShowModal(true);
  };

  const handleEditNote = (note: Note) => {
    setInitialData(note);
    setModalMode('edit');
    setEditNoteId(note._id);
    setShowModal(true);
  };

  const handleDeleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      fetchNotes();
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleSubmitNote = async (note: Omit<Note, '_id' | 'createdAt'>) => {
    try {
      if (modalMode === 'add') {
        await api.post('/notes/add', note);
      } else if (editNoteId) {
        await api.put(`/notes/${editNoteId}`, note);
      }
      fetchNotes();
      setShowModal(false);
    } catch (error) {
      console.error('Failed to submit note:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Notes
          notes={notes.map((note) => ({
            id: note._id,
            title: note.title,
            description: note.description,
            type: note.type,
            createdAt: note.createdAt,
          }))}
          onAddNote={handleAddNote}
          onEditNote={(note) => {
            const fullNote = notes.find((n) => n._id === note.id);
            if (fullNote) handleEditNote(fullNote);
          }}
          onDeleteNote={(id) => handleDeleteNote(id)}
        />
      </div>

      {showModal && (
        <div className="w-screen fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50 z-40"></div>
          <div className="relative z-50 w-full max-w-xs md:max-w-xl px-2 md:px-3">
            <NoteModal
              mode={modalMode}
              initialData={initialData}
              onClose={() => setShowModal(false)}
              onSubmit={handleSubmitNote}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;