import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { BarChart3, TrendingUp, Users, Clock } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 900 },
];

export default function SuperadminAnalytics() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <AdminLayout title="Platform Analytics">
      <div className="space-y-6">
        
        {/* Top KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: "Engagement Rate", val: "68.4%", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Daily Active Users", val: "124K", icon: Users, color: "text-cyan-500", bg: "bg-cyan-500/10" },
            { title: "Avg. Session", val: "42m", icon: Clock, color: "text-yellow-500", bg: "bg-yellow-500/10" },
            { title: "Completion Rate", val: "84%", icon: BarChart3, color: "text-green-500", bg: "bg-green-500/10" },
          ].map((kpi, i) => (
             <div key={i} className={`p-6 rounded-2xl border transition-all ${
               isDark ? 'bg-slate-900/40 border-cyan-400/10 hover:border-cyan-400/30' : 'bg-white border-blue-100 hover:border-blue-300'
             }`}>
               <div className="flex items-center gap-4 mb-4">
                 <div className={`p-3 rounded-xl ${kpi.bg}`}>
                   <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                 </div>
               </div>
               <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{kpi.title}</p>
               <h3 className="text-2xl font-bold">{kpi.val}</h3>
             </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
            <h3 className="font-bold text-lg mb-6">Traffic Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#1e293b' : '#f1f5f9'} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="value" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
            <h3 className="font-bold text-lg mb-6">Device Breakdown</h3>
             <div className="h-64 flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={[
                       { name: 'Mobile', value: 400 },
                       { name: 'Desktop', value: 300 },
                       { name: 'Tablet', value: 300 }
                     ]}
                     cx="50%"
                     cy="50%"
                     innerRadius={60}
                     outerRadius={80}
                     paddingAngle={5}
                     dataKey="value"
                   >
                     <Cell fill="#0ea5e9" />
                     <Cell fill="#8b5cf6" />
                     <Cell fill="#eab308" />
                   </Pie>
                   <Tooltip contentStyle={{ backgroundColor: isDark ? '#0f172a' : '#fff', borderRadius: '12px' }} />
                 </PieChart>
               </ResponsiveContainer>
             </div>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
