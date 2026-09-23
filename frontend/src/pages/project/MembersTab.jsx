import { useState } from 'react';
import { Plus } from 'lucide-react';
import api from '../../api/axios';
import MemberRow from '../../components/MemberRow';
import toast from 'react-hot-toast';

const MembersTab = ({ projectId, members, currentUserRole, onUpdate }) => {
  const isSuperAdmin = currentUserRole === 'admin';
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [loading, setLoading] = useState(false);

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    setLoading(true);
    try {
      await api.post(`/projects/${projectId}/members`, {
        email: newMemberEmail,
        role: newMemberRole
      });
      toast.success('Member added successfully');
      setNewMemberEmail('');
      setNewMemberRole('member');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/projects/${projectId}/members/${userId}`, { newRole });
      toast.success('Role updated');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      toast.success('Member removed');
      onUpdate();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove member');
    }
  };

  return (
    <div className="max-w-3xl">
      {isSuperAdmin && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Member</h3>
          <form onSubmit={handleAddMember} className="flex items-end space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm py-2 px-3 border"
              >
                <option value="member">Member</option>
                <option value="project_admin">Project Admin</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none disabled:opacity-50 h-[38px]"
            >
              <Plus size={16} className="mr-2" />
              Add
            </button>
          </form>
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Project Members ({members?.length || 0})</h3>
        <div className="space-y-3">
          {members?.map(member => (
            <MemberRow
              key={member.user?._id}
              member={member}
              currentUserRole={currentUserRole}
              onUpdateRole={handleUpdateRole}
              onRemove={handleRemoveMember}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MembersTab;
