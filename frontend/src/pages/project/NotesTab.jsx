import { useState, useEffect } from 'react';
import api from '../../api/axios';
import NoteCard from '../../components/NoteCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const NotesTab = ({ projectId, isAdmin }) => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get(`/notes/${projectId}`);
      setNotes(data.data);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [projectId]);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!newNoteContent.trim()) return;
    
    setCreating(true);
    try {
      await api.post(`/notes/${projectId}`, { content: newNoteContent });
      toast.success('Note added');
      setNewNoteContent('');
      fetchNotes();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create note');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-12" />;

  return (
    <div className="max-w-4xl">
      {isAdmin && (
        <form onSubmit={handleCreateNote} className="mb-8">
          <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <textarea
              rows={3}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              className="block w-full border-0 py-3 px-4 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm resize-none"
              placeholder="Write a new note..."
            />
            <div className="bg-gray-50 px-4 py-2 flex justify-end">
              <button
                type="submit"
                disabled={creating || !newNoteContent.trim()}
                className="inline-flex items-center px-4 py-1.5 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                {creating ? 'Saving...' : 'Add Note'}
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.length === 0 ? (
          <p className="text-gray-500 text-sm col-span-full">No notes yet.</p>
        ) : (
          notes.map(note => (
            <NoteCard 
              key={note._id} 
              note={note} 
              projectId={projectId} 
              isAdmin={isAdmin} 
              onUpdate={fetchNotes} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotesTab;
