import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/LoadingSpinner';
import TasksTab from './TasksTab';
import MembersTab from './MembersTab';
import NotesTab from './NotesTab';
import toast from 'react-hot-toast';
import { CheckSquare, Users, StickyNote } from 'lucide-react';

const ProjectPage = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [currentUserRole, setCurrentUserRole] = useState(null);

  const fetchProject = async () => {
    try {
      const [projectRes, membersRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/projects/${projectId}/members`),
      ]);
      setProject(projectRes.data.data);
      const membersList = membersRes.data.data;
      setMembers(membersList);

      const currentMember = membersList.find(m => m.user?._id === user?._id);
      setCurrentUserRole(currentMember?.role || null);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  if (loading) return <LoadingSpinner className="h-64" />;
  if (!project) return <div className="text-center py-12 text-gray-500">Project not found</div>;

  const isAdmin = currentUserRole === 'admin' || currentUserRole === 'project_admin';

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.name}</h1>
        <p className="text-gray-600">{project.description}</p>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tasks')}
            className={`${activeTab === 'tasks' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <CheckSquare className="mr-2" size={18} /> Tasks
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`${activeTab === 'members' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <Users className="mr-2" size={18} /> Members
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`${activeTab === 'notes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
          >
            <StickyNote className="mr-2" size={18} /> Notes
          </button>
        </nav>
      </div>

      <div>
        {activeTab === 'tasks' && <TasksTab projectId={projectId} isAdmin={isAdmin} members={members} />}
        {activeTab === 'members' && <MembersTab projectId={projectId} members={members} currentUserRole={currentUserRole} onUpdate={fetchProject} />}
        {activeTab === 'notes' && <NotesTab projectId={projectId} isAdmin={currentUserRole === 'admin'} />}
      </div>
    </div>
  );
};

export default ProjectPage;
