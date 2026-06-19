import { useState, useEffect } from 'react';
import useAuthStore from '../../store/useAuthStore';
import api from '../../lib/axios';
import { FiAlertCircle, FiTrash2 } from 'react-icons/fi';

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user: currentUser } = useAuthStore();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      setUsers(res.data);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError(err.response?.data?.message || err.message || 'Failed to load users data.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      await api.put(`/users/${id}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role', err);
      alert('Failed to update user role');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/users/${id}`);
        fetchUsers();
      } catch (err) {
        console.error('Failed to delete user', err);
        alert(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-display-xl text-[32px] md:text-[40px] font-bold text-gray-900 tracking-tight mb-2 leading-tight">
            User <span className="text-[#0052cc] italic font-normal">Manager</span>
          </h1>
          <p className="text-gray-500 text-[14px]">Manage administrative access and author privileges.</p>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-xl mb-6 flex items-center gap-2 font-bold shadow-sm">
          <FiAlertCircle className="text-[20px]" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 pl-6 font-bold text-[11px] text-gray-500 uppercase tracking-widest">User</th>
                <th className="p-4 font-bold text-[11px] text-gray-500 uppercase tracking-widest">Email</th>
                <th className="p-4 font-bold text-[11px] text-gray-500 uppercase tracking-widest">Role</th>
                <th className="p-4 font-bold text-[11px] text-gray-500 uppercase tracking-widest">Joined</th>
                <th className="p-4 pr-6 font-bold text-[11px] text-gray-500 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td className="p-4 pl-6"><div className="h-12 bg-gray-100 rounded-xl animate-pulse w-3/4"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded animate-pulse w-1/2"></div></td>
                    <td className="p-4"><div className="h-8 bg-gray-100 rounded-lg animate-pulse w-1/4"></div></td>
                    <td className="p-4"><div className="h-5 bg-gray-100 rounded animate-pulse w-1/3"></div></td>
                    <td className="p-4 pr-6"><div className="h-8 bg-gray-100 rounded-lg animate-pulse w-1/4 ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-16 text-center text-gray-500 font-bold">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200 flex-shrink-0 shadow-sm">
                          {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[16px] font-bold text-gray-500">{user.name.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-[15px] text-gray-900 mb-0.5">{user.name}</p>
                          {user.id === currentUser?.id && (
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#0052cc] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">You</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-gray-500 font-medium">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.id === currentUser?.id}
                        className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-[12px] font-bold text-gray-700 focus:border-[#0052cc] focus:bg-white focus:ring-0 disabled:opacity-50 outline-none cursor-pointer shadow-sm"
                      >
                        <option value="USER">User</option>
                        <option value="AUTHOR">Author</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="p-4 text-[13px] text-gray-500 font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => handleDelete(user.id)}
                        disabled={user.id === currentUser?.id}
                        className="w-8 h-8 inline-flex items-center justify-center text-gray-500 bg-white border border-gray-200 shadow-sm rounded-lg hover:text-red-600 hover:border-red-600 hover:bg-red-50 disabled:opacity-50 transition-all"
                        title="Delete User"
                      >
                        <FiTrash2 className="text-[18px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersManager;
