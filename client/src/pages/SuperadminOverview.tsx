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

const growthData = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 1200, revenue: 3600 },
  { name: 'Mar', users: 900, revenue: 3200 },
  { name: 'Apr', users: 2100, revenue: 5400 },
  { name: 'May', users: 1800, revenue: 4800 },
  { name: 'Jun', users: 2800, revenue: 7200 },
  { name: 'Jul', users: 3500, revenue: 9100 },
];

const regionalData = [
  { name: 'Africa', value: 45 },
  { name: 'Europe', value: 25 },
  { name: 'Asia', value: 20 },
  { name: 'Americas', value: 10 },
];

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

  return (
    <AdminLayout title="Global Enterprise Overview">
      <div className="space-y-8">
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Active Learners" 
            value="1,284,930" 
            change="+12.5%" 
            trend="up" 
            icon={Users} 
            color="bg-cyan-500" 
          />
          <StatCard 
            title="Global Monthly Revenue" 
            value="$428,290.00" 
            change="+8.2%" 
            trend="up" 
            icon={TrendingUp} 
            color="bg-green-500" 
          />
          <StatCard 
            title="Active Regions" 
            value="152 Countries" 
            change="+3" 
            trend="up" 
            icon={Globe} 
            color="bg-blue-500" 
          />
          <StatCard 
            title="Platform Security Score" 
            value="98.2%" 
            change="-0.1%" 
            trend="down" 
            icon={ShieldCheck} 
            color="bg-purple-500" 
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
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderColor: isDark ? '#22d3ee' : '#e2e8f0',
                      borderRadius: '12px',
                      color: isDark ? '#fff' : '#000'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="users" 
                    stroke="#00D9FF" 
                    fillOpacity={1} 
                    fill="url(#colorUsers)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Regional Distribution */}
          <div className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
          }`}>
            <h3 className="font-bold text-lg mb-8">Regional Hub Activity</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'transparent'}}
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0f172a' : '#fff', 
                      borderColor: isDark ? '#22d3ee' : '#e2e8f0',
                      borderRadius: '12px'
                    }} 
                  />
                  <Bar dataKey="value" radius={[0, 10, 10, 0]} barSize={20}>
                    {regionalData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? '#00D9FF' : '#FFD700'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
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
                { time: '2 mins ago', msg: 'New Admin (Sarah J.) assigned to Europe Hub', type: 'info' },
                { time: '14 mins ago', msg: 'Suspicious login attempt detected from IP: 192.168.1.1', type: 'warning' },
                { time: '1 hour ago', msg: 'Financial audit for June 2026 completed successfully', type: 'success' },
                { time: '3 hours ago', msg: 'Cloud Firestore quota reached 85% of tier limit', type: 'warning' },
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
