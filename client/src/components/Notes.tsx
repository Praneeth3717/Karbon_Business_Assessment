import React, { useState } from 'react';
import { IoPencilOutline, IoTrashOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';

interface Note {
  id: string;
  title: string;
  description: string;
  type: 'personal' | 'home' | 'business';
  createdAt: string;
}

interface NotesProps {
  notes: Note[];
  onAddNote: () => void;
  onEditNote: (note: Note) => void;
  onDeleteNote: (id: string) => void;
}

const getColorClasses = (color: string) => {
  switch (color) {
    case 'purple':
      return 'bg-purple-100 border-purple-200';
    case 'green':
      return 'bg-green-100 border-green-200';
    case 'orange':
      return 'bg-orange-100 border-orange-200';
    default:
      return 'bg-gray-100 border-gray-200';
  }
};

const typeToColorMap: Record<Note['type'], string> = {
  personal: 'purple',
  home: 'green',
  business: 'orange',
};

const noteTypes = ['all', 'personal', 'home', 'business'] as const;

const Notes: React.FC<NotesProps> = ({ notes, onAddNote, onEditNote, onDeleteNote }) => {
  const [selectedType, setSelectedType] = useState<'all' | 'personal' | 'home' | 'business'>('all');

  const filteredNotes =
    selectedType === 'all' ? notes : notes.filter(note => note.type === selectedType);

  return (
    <div className="bg-gray-300 p-6 min-h-full h-fit">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex justify-between">
          <div className="flex space-x-1 mb-6">
            {noteTypes.map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedType === type
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setSelectedType(type)}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>
          <div>
            <button
              onClick={onAddNote}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors duration-200"
            >
              <FaPlus className="w-4 h-4" />
              Add Note
            </button>
          </div>
        </div>
        {filteredNotes.length === 0 ? (
  <div className="text-center text-gray-600 text-sm py-10">
    No notes found. Add notes to view.
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {filteredNotes.map((note) => (
      <div
        key={note.id}
        className={`border rounded-lg p-4 hover:shadow-md transition-shadow duration-200 ${getColorClasses(
          typeToColorMap[note.type]
        )}`}
      >
        <div className="flex justify-end mb-3 space-x-2">
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => onEditNote(note)}
          >
            <IoPencilOutline size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-gray-600 transition-colors"
            onClick={() => onDeleteNote(note.id)}
          >
            <IoTrashOutline size={16} />
          </button>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">{note.title}</h3>
          <p className="text-gray-700 text-xs leading-relaxed">{note.description}</p>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-500">
            {new Date(note.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </span>
        </div>
      </div>
    ))}
  </div>
)}

      </div>
    </div>
  );
};

export default Notes;

