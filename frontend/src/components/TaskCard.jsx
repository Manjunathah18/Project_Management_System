import { MessageSquare, Paperclip, CheckSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusColors = {
  todo: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  done: 'bg-green-100 text-green-800'
};

const TaskCard = ({ task, projectId }) => {
  const completedSubtasks = task.subTasks?.filter(st => st.isCompleted).length || 0;
  const totalSubtasks = task.subTasks?.length || 0;

  return (
    <Link to={`/projects/${projectId}/tasks/${task._id}`} className="block">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-indigo-300 transition-colors cursor-pointer mb-3">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
        </div>
        
        {task.description && (
          <p className="text-xs text-gray-500 mb-4 line-clamp-2">{task.description}</p>
        )}

        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-3 text-gray-400">
            {totalSubtasks > 0 && (
              <div className="flex items-center text-xs">
                <CheckSquare size={14} className="mr-1" />
                <span>{completedSubtasks}/{totalSubtasks}</span>
              </div>
            )}
            {task.files?.length > 0 && (
              <div className="flex items-center text-xs">
                <Paperclip size={14} className="mr-1" />
                <span>{task.files.length}</span>
              </div>
            )}
          </div>
          
          {task.assignedTo && (
            <div className="flex items-center">
              <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xs font-medium" title={task.assignedTo.username}>
                {task.assignedTo.fullName?.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default TaskCard;
