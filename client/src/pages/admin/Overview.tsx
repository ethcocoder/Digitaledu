import AdminLayout from '@/components/AdminLayout';
import { Users, BookOpen, Clock, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { userService } from '@/lib/userService';
import { courseService } from '@/lib/courseService';

export default function AdminOverview() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({ pendingUsers: 0, activeCourses: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { users } = await userService.getAllUsers();
      const { courses } = await courseService.getAllCourses();
      
      setStats({
        pendingUsers: users.filter(u => u.status === 'pending').length,
        totalUsers: users.length,
        activeCourses: courses.length,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Platform Administration">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-yellow-400/20' : 'bg-white border-yellow-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/10">
                <Clock className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Pending Approvals</p>
            <h3 className="text-3xl font-bold text-yellow-500">{loading ? "..." : stats.pendingUsers}</h3>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/20' : 'bg-white border-blue-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <Users className="w-6 h-6 text-cyan-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Active Users</p>
            <h3 className="text-3xl font-bold">{loading ? "..." : stats.totalUsers}</h3>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-purple-400/20' : 'bg-white border-purple-200'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-xl bg-purple-500/10">
                <BookOpen className="w-6 h-6 text-purple-500" />
              </div>
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Active Courses</p>
            <h3 className="text-3xl font-bold">{loading ? "..." : stats.activeCourses}</h3>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
