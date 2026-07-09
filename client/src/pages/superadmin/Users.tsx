import { useState, useEffect, useRef } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Plus, Edit3, Trash2, X, User, Mail, Lock, CheckCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { userService } from '@/lib/userService';
import { UserProfile, UserRole } from '../../../../shared/types';

type ModalMode = 'add' | 'edit' | null;

interface ModalUser {
  uid?: string;
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  status: string;
}

const ROLES: { id: UserRole; label: string; color: string }[] = [
  { id: 'superadmin', label: 'Superadmin', color: 'text-red-500 bg-red-500/10' },
  { id: 'admin', label: 'Admin', color: 'text-purple-500 bg-purple-500/10' },
  { id: 'instructor', label: 'Instructor', color: 'text-orange-500 bg-orange-500/10' },
  { id: 'student', label: 'Student', color: 'text-blue-500 bg-blue-500/10' },
];

function RoleBadge({ role }: { role: UserRole }) {
  const cfg = ROLES.find(r => r.id === role);
  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${cfg?.color || 'text-gray-500 bg-gray-500/10'}`}>
      {role}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  if (status === 'active') return <span className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-green-400' : 'text-green-600'}`}><CheckCircle className="w-3 h-3" /> Active</span>;
  if (status === 'suspended') return <span className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-red-400' : 'text-red-600'}`}><X className="w-3 h-3" /> Suspended</span>;
  return <span className={`text-xs font-bold flex items-center gap-1 ${isDark ? 'text-yellow-400' : 'text-yellow-600'}`}><Loader className="w-3 h-3" /> Pending</span>;
}

export default function SuperadminUsers() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const emptyUser: ModalUser = { fullName: '', email: '', password: '', role: 'student', status: 'active' };
  const [modalUser, setModalUser] = useState<ModalUser>(emptyUser);

  const fetchUsers = async () => {
    const { users, error } = await userService.getAllUsers();
    if (!error) setUsers(users);
    setLoading(false);
  };

  useEffect(() => { fetchUsers(); }, []);

  const filteredUsers = users.filter((user) => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = user.fullName.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const openAdd = () => {
    setModalUser({ ...emptyUser });
    setModalMode('add');
  };

  const openEdit = (user: UserProfile) => {
    setModalUser({ uid: user.uid, fullName: user.fullName, email: user.email, role: user.role, status: user.status });
    setModalMode('edit');
  };

  const handleSave = async () => {
    if (!modalUser.fullName.trim() || !modalUser.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    if (modalMode === 'add' && (!modalUser.password || modalUser.password.length < 6)) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setSaving(true);
    if (modalMode === 'add') {
      const { error } = await userService.createUser(
        modalUser.email,
        modalUser.password!,
        modalUser.fullName,
        modalUser.role
      );
      if (error) {
        toast.error(error);
      } else {
        toast.success('User created in Auth + Firestore');
        setModalMode(null);
        fetchUsers();
      }
    } else if (modalMode === 'edit' && modalUser.uid) {
      const { error } = await userService.updateUserProfile(modalUser.uid, {
        fullName: modalUser.fullName,
        email: modalUser.email,
        role: modalUser.role,
        status: modalUser.status,
      });
      if (error) {
        toast.error(error);
      } else {
        toast.success('User updated');
        setModalMode(null);
        fetchUsers();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (uid: string) => {
    const { error } = await userService.deleteUser(uid);
    if (error) {
      toast.error(error);
    } else {
      toast.success('User deleted from Auth + Firestore');
      setConfirmDelete(null);
      fetchUsers();
    }
  };

  return (
    <AdminLayout title="User Management">
      <div className="space-y-6">
        {/* Toolbar */}
        <div className={`p-4 md:p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className={`relative flex items-center px-4 py-2 rounded-lg border ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Search className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-64"
              />
            </div>
            <div className={`relative flex items-center px-4 py-2 rounded-lg border ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Filter className="w-4 h-4 text-gray-500 mr-2 shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm cursor-pointer w-full"
              >
                <option value="all">All Roles</option>
                {ROLES.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
              </select>
            </div>
          </div>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-xl hover:scale-105 transition-transform whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            Add User
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
                  <th className="px-6 py-4 hidden md:table-cell">Join Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading users...</td></tr>
                ) : (
                  filteredUsers.map((user, index) => (
                    <motion.tr
                      key={user.uid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shrink-0 ${
                            user.role === 'admin' || user.role === 'superadmin' ? 'bg-purple-600' :
                            user.role === 'instructor' ? 'bg-orange-500' : 'bg-blue-500'
                          }`}>
                            {user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold truncate max-w-[180px]">{user.fullName}</div>
                            <div className={`text-xs truncate max-w-[180px] ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><RoleBadge role={user.role} /></td>
                      <td className="px-6 py-4"><StatusBadge status={user.status} /></td>
                      <td className={`px-6 py-4 text-xs font-medium hidden md:table-cell ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEdit(user)}
                            className="p-2 rounded-lg hover:bg-cyan-500/10 text-cyan-500 transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setConfirmDelete(user.uid)}
                            className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
            {!loading && filteredUsers.length === 0 && (
              <div className="p-12 text-center text-gray-500">No users found.</div>
            )}
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AnimatePresence>
        {modalMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setModalMode(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-lg rounded-3xl border shadow-2xl ${
                isDark ? 'bg-slate-900 border-cyan-400/20' : 'bg-white border-blue-100'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between px-6 py-5 border-b ${
                isDark ? 'border-cyan-400/10' : 'border-blue-100'
              }`}>
                <h2 className="text-lg font-bold">{modalMode === 'add' ? 'Add New User' : 'Edit User'}</h2>
                <button
                  onClick={() => setModalMode(null)}
                  className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="px-6 py-6 space-y-5">
                {/* Full Name */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                    <input
                      type="text"
                      value={modalUser.fullName}
                      onChange={(e) => setModalUser(p => ({ ...p, fullName: e.target.value }))}
                      placeholder="John Doe"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border transition ${
                        isDark
                          ? 'bg-slate-800/50 border-cyan-400/20 focus:border-cyan-400 text-white placeholder-gray-500'
                          : 'bg-gray-50/50 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                    <input
                      type="email"
                      value={modalUser.email}
                      onChange={(e) => setModalUser(p => ({ ...p, email: e.target.value }))}
                      placeholder="user@example.com"
                      className={`w-full pl-11 pr-4 py-3 rounded-xl text-sm outline-none border transition ${
                        isDark
                          ? 'bg-slate-800/50 border-cyan-400/20 focus:border-cyan-400 text-white placeholder-gray-500'
                          : 'bg-gray-50/50 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                      }`}
                    />
                  </div>
                </div>

                {/* Password (add mode only) */}
                {modalMode === 'add' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Password
                    </label>
                    <div className="relative">
                      <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={modalUser.password || ''}
                        onChange={(e) => setModalUser(p => ({ ...p, password: e.target.value }))}
                        placeholder="Min. 6 characters"
                        className={`w-full pl-11 pr-11 py-3 rounded-xl text-sm outline-none border transition ${
                          isDark
                            ? 'bg-slate-800/50 border-cyan-400/20 focus:border-cyan-400 text-white placeholder-gray-500'
                            : 'bg-gray-50/50 border-blue-200 focus:border-blue-500 text-gray-900 placeholder-gray-400'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={`absolute right-4 top-1/2 -translate-y-1/2 ${isDark ? 'text-gray-400 hover:text-cyan-400' : 'text-gray-500 hover:text-blue-600'}`}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* Role */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    Role
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setModalUser(p => ({ ...p, role: r.id }))}
                        className={`py-2.5 px-1 rounded-xl text-[10px] font-bold uppercase border transition-all ${
                          modalUser.role === r.id
                            ? r.id === 'superadmin'
                              ? 'bg-red-500 text-white border-red-500'
                              : r.id === 'admin'
                                ? 'bg-purple-500 text-white border-purple-500'
                                : r.id === 'instructor'
                                  ? 'bg-orange-500 text-white border-orange-500'
                                  : 'bg-blue-500 text-white border-blue-500'
                            : isDark
                              ? 'bg-slate-800/50 border-cyan-400/20 text-gray-400 hover:border-cyan-400/50'
                              : 'bg-gray-50/50 border-blue-200 text-gray-600 hover:border-blue-400'
                        }`}
                      >
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status (edit mode only) */}
                {modalMode === 'edit' && (
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Status
                    </label>
                    <div className="flex gap-3">
                      {['active', 'suspended', 'pending'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setModalUser(p => ({ ...p, status: s }))}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold uppercase border transition-all ${
                            modalUser.status === s
                              ? s === 'active'
                                ? 'bg-green-500 text-white border-green-500'
                                : s === 'suspended'
                                  ? 'bg-red-500 text-white border-red-500'
                                  : 'bg-yellow-500 text-white border-yellow-500'
                              : isDark
                                ? 'bg-slate-800/50 border-cyan-400/20 text-gray-400 hover:border-cyan-400/50'
                                : 'bg-gray-50/50 border-blue-200 text-gray-600 hover:border-blue-400'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className={`flex justify-end gap-3 px-6 py-5 border-t ${
                isDark ? 'border-cyan-400/10' : 'border-blue-100'
              }`}>
                <button
                  onClick={() => setModalMode(null)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold border ${
                    isDark ? 'border-cyan-400/20 text-gray-300 hover:bg-white/5' : 'border-blue-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader className="w-4 h-4 animate-spin" />}
                  {modalMode === 'add' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {confirmDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${
                isDark ? 'bg-slate-900 border-red-500/20' : 'bg-white border-red-200'
              }`}
            >
              <div className="text-center">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  isDark ? 'bg-red-500/10' : 'bg-red-50'
                }`}>
                  <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-bold mb-2">Delete User?</h3>
                <p className={`text-sm mb-6 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  This permanently deletes the user from both Firestore and Firebase Authentication.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-bold border ${
                      isDark ? 'border-cyan-400/20 text-gray-300 hover:bg-white/5' : 'border-blue-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(confirmDelete)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
}
