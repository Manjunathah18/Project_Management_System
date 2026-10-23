import { Shield, ShieldAlert, User, Trash2 } from 'lucide-react';

const MemberRow = ({ member, currentUserRole, onUpdateRole, onRemove }) => {
  const isSuperAdmin = currentUserRole === 'admin';
  const roleColors = {
    admin: 'bg-red-100 text-red-800',
    project_admin: 'bg-purple-100 text-purple-800',
    member: 'bg-green-100 text-green-800'
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg mb-3">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <User size={20} />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">{member.user?.fullName || member.user?.username || 'Unknown User'}</p>
          <p className="text-xs text-gray-500">{member.user?.email}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[member.role]}`}>
          {member.role.replace('_', ' ').toUpperCase()}
        </span>
        
        {isSuperAdmin && (
          <div className="flex items-center space-x-2 border-l pl-4">
            <select
              value={member.role}
              onChange={(e) => onUpdateRole(member.user?._id, e.target.value)}
              className="text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="member">Member</option>
              <option value="project_admin">Project Admin</option>
              <option value="admin">Admin</option>
            </select>
            <button
              onClick={() => onRemove(member.user?._id)}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MemberRow;
