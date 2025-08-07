import React, { useState, useEffect } from 'react';

interface NoteModalProps {
  mode: 'add' | 'edit';
  initialData?: {
    title: string;
    description: string;
    type: 'personal' | 'home' | 'business';
  };
  onClose: () => void;
  onSubmit: (note: { title: string; description: string; type: 'personal' | 'home' | 'business' }) => void;
}

const NoteModal: React.FC<NoteModalProps> = ({ mode, initialData, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<'personal' | 'home' | 'business'>('personal');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setType(initialData.type);
    } else {
      setTitle('');
      setDescription('');
      setType('personal');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, type });
    onClose();
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6">
      <h2 className="text-lg font-semibold mb-4">
        {mode === 'add' ? 'Add New Note' : 'Edit Note'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <div className="flex space-x-2">
            {(['personal', 'home', 'business'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`px-4 py-2 rounded-md text-sm border 
                  ${type === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'} 
                  hover:bg-blue-100 transition`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {mode === 'add' ? 'Add' : 'Update'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NoteModal;
