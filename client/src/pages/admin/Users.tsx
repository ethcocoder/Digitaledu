import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, CheckCircle, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { userService } from '@/lib/userService';
import { UserProfile } from '../../../../shared/types';
import { toast } from 'sonner';

export default function AdminUsers() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const { users, error } = await userService.getAllUsers();
    if (!error) {
      // Admins should not see superadmins
      setUsers(users.filter(u => u.role !== 'superadmin'));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleApprove = async (uid: string) => {
    const { error } = await userService.updateUserStatus(uid, 'active');
    if (!error) {
      toast.success('User approved successfully!');
      fetchUsers();
    } else {
      toast.error('Failed to approve user: ' + error);
    }
  };

  const handleSuspend = async (uid: string) => {
    const { error } = await userService.updateUserStatus(uid, 'suspended');
    if (!error) {
      toast.success('User suspended successfully!');
      fetchUsers();
    } else {
      toast.error('Failed to suspend user: ' + error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <AdminLayout title="User Management (Admin)">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative w-full sm:w-96">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input 
              type="text" 
              placeholder="Search users..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-xl outline-none transition-all ${
                isDark 
                  ? 'bg-slate-900/50 border border-cyan-400/20 focus:border-cyan-400 focus:shadow-[0_0_15px_rgba(0,217,255,0.1)]' 
                  : 'bg-white border border-blue-200 focus:border-blue-400 focus:shadow-sm'
              }`}
            />
          </div>
          
          <div className="flex gap-4 w-full sm:w-auto">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              isDark ? 'bg-slate-900/50 border-cyan-400/20' : 'bg-white border-blue-200'
            }`}>
              <Filter className="w-4 h-4 text-cyan-500" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admins</option>
                <option value="instructor">Instructors</option>
                <option value="student">Students</option>
              </select>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${
              isDark ? 'bg-slate-900/50 border-cyan-400/20' : 'bg-white border-blue-200'
            }`}>
              <ShieldAlert className="w-4 h-4 text-cyan-500" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-sm font-medium"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`border-b text-sm ${isDark ? 'border-cyan-400/10 text-gray-400' : 'border-blue-100 text-gray-500'}`}>
                  <th className="px-6 py-4 font-bold">User</th>
                  <th className="px-6 py-4 font-bold">Role</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Joined</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={user.uid} 
                      className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}`}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                            user.role === 'admin' ? 'bg-purple-500' :
                            user.role === 'instructor' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {user.fullName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold">{user.fullName}</div>
                            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                          user.role === 'admin' ? 'bg-purple-500/10 text-purple-500' :
                          user.role === 'instructor' ? 'bg-orange-500/10 text-orange-500' :
                          'bg-blue-500/10 text-blue-500'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.status === 'active' ? (
                          <span className="flex items-center gap-1 text-green-500 text-xs font-bold">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : user.status === 'pending' ? (
                          <span className="flex items-center gap-1 text-yellow-500 text-xs font-bold">
                            <Clock className="w-3 h-3" /> Pending
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                            <XCircle className="w-3 h-3" /> Suspended
                          </span>
                        )}
                      </td>
                      <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {user.status === 'pending' && (
                          <button 
                            onClick={() => handleApprove(user.uid)}
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-xs font-bold transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {user.status === 'active' && user.role !== 'admin' && (
                          <button 
                            onClick={() => handleSuspend(user.uid)}
                            className="px-3 py-1 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded text-xs font-bold transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            
            {!loading && filteredUsers.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No users found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
