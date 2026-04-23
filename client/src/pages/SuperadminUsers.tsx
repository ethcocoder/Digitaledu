import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Plus, Filter, MoreVertical, Edit2, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_USERS = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', status: 'active', joinDate: '2025-10-12' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'instructor', status: 'active', joinDate: '2025-11-05' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@example.com', role: 'student', status: 'inactive', joinDate: '2026-01-20' },
  { id: 4, name: 'Diana Prince', email: 'diana@example.com', role: 'student', status: 'active', joinDate: '2026-02-15' },
  { id: 5, name: 'Evan Wright', email: 'evan@example.com', role: 'instructor', status: 'active', joinDate: '2026-03-10' },
];

export default function SuperadminUsers() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = MOCK_USERS.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        
        {/* Header Actions */}
        <div className={`p-4 md:p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className={`relative flex items-center px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-950 border-cyan-400/20 focus-within:border-cyan-400' : 'bg-gray-50 border-blue-100 focus-within:border-blue-500'
            }`}>
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <div className={`relative flex items-center px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
              <select 
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="superadmin">Superadmin</option>
                <option value="admin">Admin</option>
                <option value="instructor">Instructor</option>
                <option value="student">Student</option>
              </select>
            </div>
          </div>

          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-transform hover:scale-105 ${
            isDark ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          }`}>
            <Plus className="w-4 h-4" />
            Add New User
          </button>
        </div>

        {/* Users Table */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className={`uppercase text-xs font-bold ${
                isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'
              }`}>
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {filteredUsers.map((user, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={user.id} 
                    className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          user.role === 'admin' ? 'bg-purple-500' :
                          user.role === 'instructor' ? 'bg-orange-500' : 'bg-blue-500'
                        }`}>
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
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
                      ) : (
                        <span className="flex items-center gap-1 text-red-500 text-xs font-bold">
                          <XCircle className="w-3 h-3" /> Inactive
                        </span>
                      )}
                    </td>
                    <td className={`px-6 py-4 text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {user.joinDate}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className={`p-2 rounded-lg transition-colors inline-flex mr-2 ${
                        isDark ? 'hover:bg-white/10 text-cyan-400' : 'hover:bg-gray-100 text-blue-600'
                      }`}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className={`p-2 rounded-lg transition-colors inline-flex ${
                        isDark ? 'hover:bg-white/10 text-red-400' : 'hover:bg-gray-100 text-red-600'
                      }`}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredUsers.length === 0 && (
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
