import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldAlert, Cpu, HardDrive, Network, RefreshCw } from 'lucide-react';

export default function SuperadminHealth() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <AdminLayout title="System Health & Monitoring">
      <div className="space-y-6">
        
        <div className={`p-6 rounded-2xl border flex items-center justify-between ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
               <ShieldAlert className="w-6 h-6" />
             </div>
             <div>
               <h2 className="text-xl font-bold">All Systems Operational</h2>
               <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Last checked: Just now</p>
             </div>
           </div>
           <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
             isDark ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'
           }`}>
             <RefreshCw className="w-4 h-4" /> Run Diagnostics
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "CPU Utilization", val: "32%", icon: Cpu, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Memory Usage", val: "48%", icon: HardDrive, color: "text-purple-500", bg: "bg-purple-500/10" },
            { title: "Network I/O", val: "842 MB/s", icon: Network, color: "text-cyan-500", bg: "bg-cyan-500/10" },
          ].map((stat, i) => (
             <div key={i} className={`p-6 rounded-2xl border ${
               isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
             }`}>
               <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-lg ${stat.bg}`}>
                   <stat.icon className={`w-5 h-5 ${stat.color}`} />
                 </div>
                 <h3 className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.title}</h3>
               </div>
               <h3 className="text-3xl font-bold mb-4">{stat.val}</h3>
               <div className="h-2 w-full rounded-full overflow-hidden bg-slate-800/20 dark:bg-slate-800">
                 <div className={`h-full ${stat.color.replace('text-', 'bg-')}`} style={{ width: stat.val.includes('%') ? stat.val : '60%' }} />
               </div>
             </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
