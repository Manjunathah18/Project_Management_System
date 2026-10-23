import { Menu, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          <div className="flex items-center gap-x-4">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium leading-6 text-gray-900">
                {user?.fullName || user?.username}
              </span>
              <span className="text-xs leading-5 text-gray-500">
                @{user?.username}
              </span>
            </div>
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <User size={20} />
            </div>
          </div>
          
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />
          
          <button
            onClick={logout}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
