import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Paperclip } from 'lucide-react';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';
import SubtaskItem from '../../components/SubtaskItem';
import toast from 'react-hot-toast';

const TaskDetailPage = () => {
  const { projectId, taskId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [task, setTask] = useState(null);
  const [projectMembers, setProjectMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const [updatingTask, setUpdatingTask] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchTaskDetails = async () => {
    try {
      const [taskRes, membersRes] = await Promise.all([
        api.get(`/tasks/${projectId}/t/${taskId}`),
        api.get(`/projects/${projectId}/members`)
      ]);
      
      setTask(taskRes.data.data);
      const members = membersRes.data.data;
      setProjectMembers(members);
      
      const currentUserMember = members.find(m => m.user?._id === user?._id);
      const role = currentUserMember?.role;
      setIsAdmin(role === 'admin' || role === 'project_admin');
      
    } catch (error) {
      toast.error('Failed to load task details');
      navigate(`/projects/${projectId}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaskDetails();
  }, [projectId, taskId]);

  const handleUpdateStatus = async (status) => {
    if (!isAdmin) return;
    setUpdatingTask(true);
    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { status });
      setTask(prev => ({ ...prev, status }));
      toast.success('Status updated');
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleUpdateAssignment = async (userId) => {
    if (!isAdmin) return;
    setUpdatingTask(true);
    try {
      await api.put(`/tasks/${projectId}/t/${taskId}`, { assignedTo: userId || undefined });
      fetchTaskDetails();
      toast.success('Assignment updated');
    } catch (error) {
      toast.error('Failed to update assignment');
    } finally {
      setUpdatingTask(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/${projectId}/t/${taskId}`);
      toast.success('Task deleted');
      navigate(`/projects/${projectId}`);
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleAddSubtask = async (e) => {
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setAddingSubtask(true);
    try {
      await api.post(`/tasks/${projectId}/t/${taskId}/subtasks`, { title: newSubtask });
      setNewSubtask('');
      fetchTaskDetails();
    } catch (error) {
      toast.error('Failed to add subtask');
    } finally {
      setAddingSubtask(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-12" />;
  if (!task) return <div>Task not found</div>;

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    done: 'bg-green-100 text-green-800',
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6">
        <Link to={`/projects/${projectId}`} className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
          <ArrowLeft size={16} className="mr-1" /> Back to Project
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          {isAdmin && (
            <button onClick={handleDeleteTask} className="text-gray-400 hover:text-red-500">
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <p className="text-gray-600 mb-8 whitespace-pre-wrap">{task.description || "No description provided."}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Status</h3>
            <select
              value={task.status}
              onChange={(e) => handleUpdateStatus(e.target.value)}
              disabled={!isAdmin || updatingTask}
              className={`block w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 ${!isAdmin ? 'bg-gray-50' : ''}`}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Assignee</h3>
            <select
              value={task.assignedTo?._id || ''}
              onChange={(e) => handleUpdateAssignment(e.target.value)}
              disabled={!isAdmin || updatingTask}
              className={`block w-full text-sm border border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500 ${!isAdmin ? 'bg-gray-50' : ''}`}
            >
              <option value="">Unassigned</option>
              {projectMembers.map(m => (
                <option key={m.user?._id} value={m.user?._id}>
                  {m.user?.fullName || m.user?.username} ({m.user?.email})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Attachments */}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-500 mb-3">
              <Paperclip size={14} className="inline mr-1" />
              Attachments ({task.attachments.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {task.attachments.map((att, index) => (
                <a
                  key={index}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded-md border border-gray-200 text-sm text-indigo-600 hover:bg-indigo-50"
                >
                  <Paperclip size={14} className="mr-1.5" />
                  File {index + 1} ({(att.size / 1024).toFixed(1)} KB)
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Subtasks {task.subtasks?.length > 0 && `(${task.subtasks.length})`}
        </h2>
        
        <div className="mb-6 space-y-2">
          {task.subtasks?.map(subtask => (
            <SubtaskItem 
              key={subtask._id} 
              subtask={subtask} 
              projectId={projectId} 
              isAdmin={isAdmin}
              onUpdate={fetchTaskDetails}
            />
          ))}
          {(!task.subtasks || task.subtasks.length === 0) && <p className="text-sm text-gray-500">No subtasks yet.</p>}
        </div>

        {isAdmin && (
          <form onSubmit={handleAddSubtask} className="flex space-x-3">
            <input
              type="text"
              value={newSubtask}
              onChange={(e) => setNewSubtask(e.target.value)}
              placeholder="Add a new subtask..."
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 text-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              disabled={addingSubtask || !newSubtask.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
            >
              <Plus size={16} className="mr-2" /> Add
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default TaskDetailPage;
