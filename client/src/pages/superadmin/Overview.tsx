import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BookOpen
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { useLanguage } from '@/contexts/LanguageContext';

import { useState, useEffect } from 'react';
import { userService } from '@/lib/userService';
import { courseService } from '@/lib/courseService';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: any;
  color: string;
}

function StatCard({ title, value, change, trend, icon: Icon, color }: StatCardProps) {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <div className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
      isDark ? 'bg-slate-900/40 border-cyan-400/10 hover:border-cyan-400/30' : 'bg-white border-blue-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-bold ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
          {trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change}
        </div>
      </div>
      <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
    </div>
  );
}

export default function SuperadminOverview() {
  const { theme, t } = useLanguage();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState({ users: 0, courses: 0, revenue: 0, activeNow: 0 });
  const [loading, setLoading] = useState(true);
  const [recentLogs, setRecentLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      const { users } = await userService.getAllUsers();
      const { courses } = await courseService.getAllCourses();
      
      const totalRevenue = courses.reduce((acc, course) => acc + (course.price * course.studentsCount || 0), 0);

      setStats({
        users: users.length,
        courses: courses.length,
        revenue: totalRevenue,
        activeNow: Math.floor(Math.random() * 50) + 10 // Mock real-time activity
      });

      setRecentLogs([
        { time: 'Just now', msg: 'System initialized and connected to Firebase.', type: 'success' },
        { time: '2 mins ago', msg: 'New course "Advanced React" published by Instructor.', type: 'info' },
        { time: '5 mins ago', msg: 'User "John Doe" registered as Student.', type: 'info' },
        { time: '12 mins ago', msg: 'Backup completed successfully.', type: 'success' },
      ]);

      setLoading(false);
    };
    fetchStats();
  }, []);

  const chartData = [
    { name: 'Jan', users: 400, revenue: 2400 },
    { name: 'Feb', users: 600, revenue: 3500 },
    { name: 'Mar', users: 800, revenue: 4200 },
    { name: 'Apr', users: 1200, revenue: 5800 },
    { name: 'May', users: 1500, revenue: 7100 },
    { name: 'Jun', users: 2100, revenue: 9400 },
    { name: 'Jul', users: stats.users, revenue: stats.revenue },
  ];

  const regionalData = [
    { name: 'North America', value: 40, color: '#06b6d4' },
    { name: 'Europe', value: 25, color: '#8b5cf6' },
    { name: 'Africa', value: 20, color: '#f59e0b' },
    { name: 'Asia', value: 15, color: '#10b981' },
  ];

  return (
    <AdminLayout title={t('superadmin.title')}>
      <div className="space-y-8">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: t('superadmin.totalUsers'), val: stats.users, icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10" },
            { title: t('superadmin.totalCourses'), val: stats.courses, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: t('superadmin.revenue'), val: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
            { title: t('superadmin.growth'), val: "+12.4%", icon: Activity, color: "text-yellow-500", bg: "bg-yellow-500/10" },
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${
              isDark ? 'bg-slate-900/40 border-cyan-400/10 hover:border-cyan-400/30' : 'bg-white border-blue-100'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold tracking-tight">{loading ? "..." : stat.val}</h3>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Growth Chart */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-bold text-lg">User Growth & Revenue Projection</h3>
              <select className={`text-xs p-2 rounded-lg outline-none ${
                isDark ? 'bg-slate-800 border-cyan-400/10' : 'bg-gray-50 border-blue-50'
              }`}>
                <option>Last 7 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#e2e8f0'} vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="#06b6d4" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <h3 className="font-bold text-lg mb-8">Regional Hub Activity</h3>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData}>
                  <XAxis dataKey="name" hide />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#ffffff',
                      borderColor: isDark ? '#1e293b' : '#e2e8f0',
                      borderRadius: '12px'
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 10, 10]} barSize={40}>
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-4">
                {regionalData.map((region) => (
                  <div key={region.name} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: region.color }} />
                      <span className="text-gray-500">{region.name}</span>
                    </div>
                    <span className="font-bold">{region.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* System Health & Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                Live Node Status
              </h3>
              <span className="text-xs text-green-500 font-bold flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                All Systems Operational
              </span>
            </div>
            <div className="space-y-4">
               {[
                 { label: 'Cloud Firestore Sync', status: 'Healthy', latency: '24ms', value: 98 },
                 { label: 'CDN Edge Delivery', status: 'Healthy', latency: '42ms', value: 95 },
                 { label: 'Auth Middleware', status: 'Warning', latency: '128ms', value: 45 },
                 { label: 'Blockchain Verifier', status: 'Healthy', latency: '8ms', value: 99 },
               ].map((node, i) => (
                 <div key={i} className="space-y-2">
                   <div className="flex justify-between text-sm">
                     <span className="font-medium">{node.label}</span>
                     <span className={node.status === 'Healthy' ? 'text-green-500' : 'text-yellow-500'}>
                       {node.status} ({node.latency})
                     </span>
                   </div>
                   <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-1000 ${node.status === 'Healthy' ? 'bg-cyan-400' : 'bg-yellow-400'}`}
                       style={{ width: `${node.value}%` }} 
                     />
                   </div>
                 </div>
               ))}
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Critical System Logs
            </h3>
            <div className="space-y-4">
              {recentLogs.map((log, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <div className={`w-1 h-auto rounded-full ${
                    log.type === 'warning' ? 'bg-yellow-400' : 
                    log.type === 'success' ? 'bg-green-500' : 'bg-cyan-400'
                  }`} />
                  <div>
                    <p className="text-sm font-medium">{log.msg}</p>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
