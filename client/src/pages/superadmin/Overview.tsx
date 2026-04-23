import AdminLayout from '@/components/AdminLayout';
import { 
  Users, 
  TrendingUp, 
  Globe, 
  ShieldCheck, 
  AlertTriangle, 
  Activity,
  ArrowUpRight,
  ArrowDownRight
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
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  const [stats, setStats] = useState({ users: 0, courses: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const { users } = await userService.getAllUsers();
      const { courses } = await courseService.getAllCourses();
      
      const totalRevenue = courses.reduce((acc, course) => acc + (course.price * course.studentsCount || 0), 0);

      setStats({
        users: users.length,
        courses: courses.length,
        revenue: totalRevenue
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout title="Global Enterprise Overview">
      <div className="space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Registered Users" 
            value={loading ? "..." : stats.users.toLocaleString()} 
            change={stats.users === 0 ? "0%" : "+100%"} 
            trend="up" 
            icon={Users} 
            color="bg-cyan-500" 
          />
          <StatCard 
            title="Total Active Courses" 
            value={loading ? "..." : stats.courses.toLocaleString()} 
            change={stats.courses === 0 ? "0%" : "+100%"} 
            trend="up" 
            icon={Activity} 
            color="bg-purple-500" 
          />
          <StatCard 
            title="Global Revenue" 
            value={loading ? "..." : `$${stats.revenue.toLocaleString()}`} 
            change="0%" 
            trend="up" 
            icon={TrendingUp} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Platform Security Score" 
            value="100%" 
            change="Stable" 
            trend="up" 
            icon={ShieldCheck} 
            color="bg-blue-500" 
          />
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
            <div className="h-[300px] w-full flex items-center justify-center border-t border-dashed border-cyan-400/20 mt-4">
              <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Insufficient data to generate growth projections.</p>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <h3 className="font-bold text-lg mb-8">Regional Hub Activity</h3>
            <div className="h-[300px] w-full flex items-center justify-center border-t border-dashed border-cyan-400/20 mt-4">
              <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>No regional activity detected yet.</p>
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
              {[
                { time: 'Just now', msg: 'System initialized and connected to Firebase.', type: 'success' },
              ].map((log, i) => (
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
