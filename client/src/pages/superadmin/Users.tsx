import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { userService } from '@/lib/userService';
import { UserProfile, UserRole } from '../../../../shared/types';

export default function SuperadminUsers() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUid, setEditingUid] = useState<string | null>(null);

  const fetchUsers = async () => {
    const { users, error } = await userService.getAllUsers();
    if (!error) setUsers(users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (uid: string, newRole: UserRole) => {
    const { error } = await userService.updateUserRole(uid, newRole);
    if (error) toast.error(error);
    else {
      toast.success('Role updated!');
      setEditingUid(null);
      fetchUsers();
    }
  };

  const handleStatusChange = async (uid: string, status: string) => {
    const { error } = await userService.updateUserStatus(uid, status);
    if (error) toast.error(error);
    else {
      toast.success(`User ${status}`);
      fetchUsers();
    }
  };

  const statusBadge = (status: string) => {
    if (status === 'active') return <span className="flex items-center gap-1 text-green-500 text-xs font-bold"><CheckCircle className="w-3 h-3" /> Active</span>;
    if (status === 'suspended') return <span className="flex items-center gap-1 text-red-500 text-xs font-bold"><XCircle className="w-3 h-3" /> Suspended</span>;
    return <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold"><Clock className="w-3 h-3" /> Pending</span>;
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        <div className={`p-4 md:p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className={`relative flex items-center px-4 py-2 rounded-lg border ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input type="text" placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full sm:w-64" />
            </div>
            <div className={`relative flex items-center px-4 py-2 rounded-lg border ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
              <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-transparent border-none outline-none text-sm cursor-pointer">
                <option value="all">All Roles</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className={`uppercase text-xs font-bold ${isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">Loading users...</td></tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr key={user.uid} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                      className={isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-500' :
                            user.role === 'instructor' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>{user.fullName.charAt(0)}</div>
                          <div>
                            <div className="font-bold">{user.fullName}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {editingUid === user.uid ? (
                          <select
                            defaultValue={user.role}
                            onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                            onBlur={() => setEditingUid(null)}
                            autoFocus
                            className={`px-2 py-1 rounded-md text-xs font-bold border outline-none ${isDark ? 'bg-slate-950 border-cyan-400/30' : 'bg-white border-blue-200'}`}
                          >
                            <option value="student">student</option>
                            <option value="instructor">instructor</option>
                            <option value="admin">admin</option>
                            <option value="superadmin">superadmin</option>
                          </select>
                        ) : (
                          <button onClick={() => setEditingUid(user.uid)} className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                            user.role === 'superadmin' ? 'bg-red-500/10 text-red-500' :
                            user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                            user.role === 'instructor' ? 'bg-orange-500/10 text-orange-500' :
                            'bg-blue-500/10 text-blue-500'
                          }`}>{user.role}</button>
                        )}
                      </td>
                      <td className="px-6 py-4">{statusBadge(user.status)}</td>
                      <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {user.status !== 'active' && (
                          <button onClick={() => handleStatusChange(user.uid, 'active')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500">Approve</button>
                        )}
                        {user.status !== 'suspended' && user.role !== 'superadmin' && (
                          <button onClick={() => handleStatusChange(user.uid, 'suspended')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-red-500/10 text-red-500">Suspend</button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            {!loading && filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">No users found.</div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
