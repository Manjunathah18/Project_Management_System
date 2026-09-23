import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import TaskCard from '../../components/TaskCard';
import Modal from '../../components/Modal';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';

const TasksTab = ({ projectId, isAdmin, members }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', assignedTo: '', status: 'todo' });
  const [creating, setCreating] = useState(false);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get(`/tasks/${projectId}`);
      setTasks(data.data);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const formData = new FormData();
      formData.append('title', newTask.title);
      formData.append('description', newTask.description);
      formData.append('status', newTask.status);
      if (newTask.assignedTo) formData.append('assignedTo', newTask.assignedTo);
      
      await api.post(`/tasks/${projectId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Task created');
      setIsModalOpen(false);
      setNewTask({ title: '', description: '', assignedTo: '', status: 'todo' });
      fetchTasks();
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setCreating(false);
    }
  };

  if (loading) return <LoadingSpinner className="py-12" />;

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div>
      {isAdmin && (
        <div className="mb-6 flex justify-end">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus size={20} className="mr-2" /> New Task
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Todo Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
            <span>To Do</span>
            <span className="bg-gray-200 text-gray-700 py-1 px-2 rounded-full text-xs">{todoTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {todoTasks.map(task => <TaskCard key={task._id} task={task} projectId={projectId} />)}
          </div>
        </div>

        {/* In Progress Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
            <span>In Progress</span>
            <span className="bg-blue-100 text-blue-700 py-1 px-2 rounded-full text-xs">{inProgressTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {inProgressTasks.map(task => <TaskCard key={task._id} task={task} projectId={projectId} />)}
          </div>
        </div>

        {/* Done Column */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
            <span>Done</span>
            <span className="bg-green-100 text-green-700 py-1 px-2 rounded-full text-xs">{doneTasks.length}</span>
          </h3>
          <div className="space-y-3">
            {doneTasks.map(task => <TaskCard key={task._id} task={task} projectId={projectId} />)}
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              required
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Assign To</label>
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
              className="mt-1 block w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Unassigned</option>
              {members?.map(m => (
                <option key={m.user?._id} value={m.user?._id}>{m.user?.fullName || m.user?.username}</option>
              ))}
            </select>
          </div>
          <div className="mt-5 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
            <button
              type="submit"
              disabled={creating}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Create Task'}
            </button>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TasksTab;
