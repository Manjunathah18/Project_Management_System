import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const SubtaskItem = ({ subtask, projectId, isAdmin, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const toggleComplete = async () => {
    setLoading(true);
    try {
      await api.put(`/tasks/${projectId}/st/${subtask._id}`, {
        title: subtask.title,
        isCompleted: !subtask.isCompleted
      });
      onUpdate();
    } catch (error) {
      toast.error('Failed to update subtask');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubtask = async () => {
    if (!window.confirm('Delete subtask?')) return;
    setLoading(true);
    try {
      await api.delete(`/tasks/${projectId}/st/${subtask._id}`);
      onUpdate();
      toast.success('Subtask deleted');
    } catch (error) {
      toast.error('Failed to delete subtask');
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <div className="flex items-center flex-1">
        <input
          type="checkbox"
          checked={subtask.isCompleted}
          onChange={toggleComplete}
          disabled={loading}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded disabled:opacity-50"
        />
        <span className={`ml-3 text-sm ${subtask.isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
          {subtask.title}
        </span>
      </div>
      {isAdmin && (
        <button
          onClick={deleteSubtask}
          disabled={loading}
          className="text-gray-400 hover:text-red-500 disabled:opacity-50"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default SubtaskItem;
