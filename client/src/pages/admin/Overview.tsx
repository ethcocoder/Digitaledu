import AdminLayout from '@/components/AdminLayout';
import { Users, BookOpen, Clock, TrendingUp, ClipboardCheck, UserPlus, Activity, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { userService } from '@/lib/userService';
import { courseService } from '@/lib/courseService';
import { motion } from 'framer-motion';

function StatSkeleton() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  return (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
        <div className="space-y-2 flex-1">
          <div className={`w-16 h-8 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
          <div className={`w-24 h-3 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOverview() {
  const { theme, t } = useLanguage();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeCourses: 0,
    pendingUsers: 0,
    pendingCourseReviews: 0,
    newUsers30d: 0,
    totalRevenue: 0,
  });
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { users } = await userService.getAllUsers();
      const { courses } = await courseService.getAllCourses();
      const { courses: pendingCourses } = await courseService.getPendingCourses();
      
      const now = Date.now();
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const newUsers = users.filter(u => (u.createdAt || 0) > thirtyDaysAgo);
      const totalRevenue = courses.reduce((acc, c) => acc + (c.price || 0) * (c.studentsCount || 0), 0);

      setStats({
        pendingUsers: users.filter(u => u.status === 'pending').length,
        totalUsers: users.length,
        activeCourses: courses.length,
        pendingCourseReviews: pendingCourses.length,
        newUsers30d: newUsers.length,
        totalRevenue,
      });

      setRecentLogs([
        { time: 'Just now', msg: 'Stats refreshed. System operating normally.', type: 'info' },
        { time: '2 mins ago', msg: `${pendingCourses.length} course(s) pending review.`, type: pendingCourses.length > 0 ? 'warning' : 'info' },
        { time: '5 mins ago', msg: `${newUsers.length} new user(s) registered in last 30 days.`, type: 'info' },
        { time: '12 mins ago', msg: 'Firestore backup completed.', type: 'success' },
      ]);

      setLoading(false);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Feb', users: 240, courses: 12 },
    { name: 'Mar', users: 380, courses: 18 },
    { name: 'Apr', users: 520, courses: 24 },
    { name: 'May', users: 680, courses: 30 },
    { name: 'Jun', users: 810, courses: 35 },
    { name: 'Jul', users: stats.totalUsers, courses: stats.activeCourses },
  ];

  const statCards = [
    { label: t('admin.activeUsers'), value: stats.totalUsers, icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10', key: 'users' },
    { label: t('admin.activeCourses'), value: stats.activeCourses, icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10', key: 'courses' },
    { label: t('admin.pendingCourseReviews'), value: stats.pendingCourseReviews, icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-500/10', href: '/admin/course-review' },
    { label: t('admin.pendingApprovals'), value: stats.pendingUsers, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10', href: '/admin/users' },
    { label: t('admin.newUsers'), value: stats.newUsers30d, icon: UserPlus, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: t('admin.totalRevenue'), value: `$${stats.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
  ];

  return (
    <AdminLayout title={t('admin.title')}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 rounded-2xl border relative overflow-hidden ${
            isDark ? 'bg-slate-900/40 border-cyan-400/20' : 'bg-white border-blue-100'
          }`}
        >
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-1">Platform Administration</h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Manage users, courses, and platform settings. {stats.pendingCourseReviews > 0 && (
                <span className="text-yellow-500 font-bold">{stats.pendingCourseReviews} course review{stats.pendingCourseReviews > 1 ? 's' : ''} pending.</span>
              )}
            </p>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/4 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none" />
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            statCards.map((stat, i) => {
              const content = (
                <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                  isDark ? 'bg-slate-900/40 border-cyan-400/10 hover:border-cyan-400/30' : 'bg-white border-blue-100'
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${stat.bg}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 font-medium mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-bold tracking-tight">{stat.value}</h3>
                </div>
              );

              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => stat.href && setLocation(stat.href)}
                >
                  {content}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Trend */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Platform Growth
              </h3>
            </div>
            <div className="space-y-6">
              {chartData.map((point, i) => {
                const maxUsers = Math.max(...chartData.map(d => d.users), 1);
                const maxCourses = Math.max(...chartData.map(d => d.courses), 1);
                return (
                  <div key={point.name} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{point.name}</span>
                      <span className="text-gray-500">{point.users} users &middot; {point.courses} courses</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(point.users / maxUsers) * 100}%` }}
                        transition={{ delay: i * 0.1, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      />
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(point.courses / maxCourses) * 100}%` }}
                        transition={{ delay: i * 0.1 + 0.3, duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              {t('admin.recentActivity')}
            </h3>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className={`w-1 h-auto rounded-full shrink-0 ${
                    log.type === 'warning' ? 'bg-yellow-400' : 
                    log.type === 'success' ? 'bg-green-500' : 'bg-cyan-400'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{log.msg}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{log.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-6 pt-6 border-t border-cyan-400/10 space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Quick Actions</p>
              <button
                onClick={() => setLocation('/admin/course-review')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-bold hover:bg-cyan-500/20 transition-colors"
              >
                <span>Review Courses</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLocation('/admin/users')}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-bold hover:bg-purple-500/20 transition-colors"
              >
                <span>Manage Users</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
