import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Shield, User, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

export const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleToggle = async (userId, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;

    setUpdatingId(userId);
    setMsg({ type: '', text: '' });

    try {
      await API.put(`/admin/users/${userId}/role`, { role: newRole });
      setMsg({ type: 'success', text: `User role updated to ${newRole}` });
      fetchUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
      setMsg({ type: 'error', text: err.response?.data?.message || 'Could not update user role' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">Registered Users Directory</h2>
          <p className="text-xs text-slate-400 mt-0.5">Manage user access rights and assign administrative privileges</p>
        </div>

        <button
          onClick={fetchUsers}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh List
        </button>
      </div>

      {msg.text && (
        <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
          msg.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
        }`}>
          {msg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{msg.text}</span>
        </div>
      )}

      {loading ? (
        <div className="h-48 glass-panel rounded-2xl animate-pulse" />
      ) : (
        <div className="p-6 rounded-3xl glass-panel border border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">User Profile</th>
                <th className="p-3">Email Address</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Current Role</th>
                <th className="p-3 text-right">Role Management</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-900/40">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full object-cover bg-slate-800" />
                      <div>
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-[10px] text-slate-500">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-slate-300">{u.email}</td>
                  <td className="p-3 text-slate-400">{u.phone || 'N/A'}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'admin'
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => handleRoleToggle(u._id, u.role)}
                      disabled={updatingId === u._id}
                      className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                    >
                      Toggle to {u.role === 'admin' ? 'User' : 'Admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
