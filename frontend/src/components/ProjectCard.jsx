import { Link } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';

const ProjectCard = ({ project: projectData }) => {
  // getProjects aggregation returns { project: {...}, role: "..." }
  const project = projectData.project || projectData;
  const role = projectData.role;

  return (
    <Link to={`/projects/${project._id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h3>
          {role && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              role === 'admin' ? 'bg-purple-100 text-purple-800' :
              role === 'project_admin' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {role === 'project_admin' ? 'Project Admin' : role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          )}
        </div>
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {project.description || "No description provided."}
        </p>
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Users size={16} className="mr-1.5" />
            <span>{project.members || 0} members</span>
          </div>
          <div className="flex items-center">
            <Calendar size={16} className="mr-1.5" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
