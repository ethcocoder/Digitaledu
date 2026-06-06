import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { userService } from '@/lib/userService';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';

export default function SuperadminAnalytics() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({ users: 0, courses: 0, enrollments: 0, completionRate: 0, avgProgress: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      userService.getAllUsers(),
      courseService.getAllCourses(),
      enrollmentService.getAllEnrollments(),
    ]).then(([{ users }, { courses }, { enrollments }]) => {
      const completed = enrollments.filter((e) => e.progress >= 100).length;
      const avgProgress = enrollments.length
        ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
        : 0;
      setStats({
        users: users.length,
        courses: courses.length,
        enrollments: enrollments.length,
        completionRate: enrollments.length ? Math.round((completed / enrollments.length) * 100) : 0,
        avgProgress,
      });
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout title="Platform Analytics">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Total Users', val: loading ? '...' : String(stats.users), icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { title: 'Total Enrollments', val: loading ? '...' : String(stats.enrollments), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Avg. Progress', val: loading ? '...' : `${stats.avgProgress}%`, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { title: 'Completion Rate', val: loading ? '...' : `${stats.completionRate}%`, icon: BarChart3, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((kpi, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
              <div className={`p-3 rounded-xl ${kpi.bg} w-fit mb-4`}><kpi.icon className={`w-6 h-6 ${kpi.color}`} /></div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.title}</p>
              <h3 className="text-2xl font-bold">{kpi.val}</h3>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
            <h3 className="font-bold text-lg mb-4">Platform Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Published Courses</span><span className="font-bold">{loading ? '...' : stats.courses}</span></div>
              <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Active Enrollments</span><span className="font-bold">{loading ? '...' : stats.enrollments}</span></div>
              <div className="flex justify-between"><span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Registered Users</span><span className="font-bold">{loading ? '...' : stats.users}</span></div>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
            <h3 className="font-bold text-lg mb-4">Learning Engagement</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Avg. Progress</span><span className="font-bold text-cyan-500">{stats.avgProgress}%</span></div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${stats.avgProgress}%` }} /></div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1"><span>Completion Rate</span><span className="font-bold text-green-500">{stats.completionRate}%</span></div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-green-400 rounded-full transition-all" style={{ width: `${stats.completionRate}%` }} /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
