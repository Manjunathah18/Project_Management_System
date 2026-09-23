import { NavLink } from 'react-router-dom';
import { LayoutDashboard, X, FolderKanban } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  return (
    <>
      {/* Mobile sidebar overlay */}
      <div 
        className={`fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden ${
          sidebarOpen ? 'opacity-100 ease-out duration-300' : 'opacity-0 hidden ease-in duration-200'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-800 text-white transition transform lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:w-64 lg:flex-col ${
          sidebarOpen ? 'translate-x-0 ease-out duration-300' : '-translate-x-full ease-in duration-200'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 bg-indigo-900">
          <span className="text-xl font-bold">Project Camp</span>
          <button 
            className="lg:hidden text-indigo-200 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) => 
                `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                }`
              }
            >
              <LayoutDashboard className="mr-3 h-5 w-5 flex-shrink-0" />
              Dashboard
            </NavLink>
          </nav>

          <div>
            <h3 className="px-3 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Projects
            </h3>
            <div className="mt-2 space-y-1">
              {projects.map((p) => (
                <NavLink
                  key={p.project._id}
                  to={`/projects/${p.project._id}`}
                  className={({ isActive }) => 
                    `group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive ? 'bg-indigo-900 text-white' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'
                    }`
                  }
                >
                  <FolderKanban className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{p.project.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
