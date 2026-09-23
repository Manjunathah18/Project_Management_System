import { useState } from 'react';
import { Pencil, Trash2, X, Check } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const NoteCard = ({ note, projectId, isAdmin, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!content.trim()) return;
    setLoading(true);
    try {
      await api.put(`/notes/${projectId}/n/${note._id}`, { content });
      toast.success('Note updated');
      setIsEditing(false);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete note?')) return;
    setLoading(true);
    try {
      await api.delete(`/notes/${projectId}/n/${note._id}`);
      toast.success('Note deleted');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete note');
      setLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 rounded-lg p-4 shadow-sm border border-yellow-100 relative group">
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-32 p-2 text-sm border-yellow-200 bg-yellow-50 focus:ring-yellow-400 focus:border-yellow-400 rounded-md"
          />
          <div className="flex justify-end space-x-2">
            <button onClick={() => setIsEditing(false)} className="p-1 text-gray-500 hover:text-gray-700">
              <X size={16} />
            </button>
            <button onClick={handleUpdate} disabled={loading} className="p-1 text-green-600 hover:text-green-800">
              <Check size={16} />
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.content}</p>
          <div className="mt-4 text-xs text-gray-400 flex justify-between items-center">
            <span>By {note.createdBy?.fullName || 'Unknown'}</span>
            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
          </div>
          
          {isAdmin && (
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button onClick={() => setIsEditing(true)} className="p-1.5 text-gray-400 hover:text-indigo-600 bg-white rounded shadow-sm">
                <Pencil size={14} />
              </button>
              <button onClick={handleDelete} className="p-1.5 text-gray-400 hover:text-red-600 bg-white rounded shadow-sm">
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default NoteCard;
