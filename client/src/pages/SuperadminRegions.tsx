import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, MapPin } from 'lucide-react';

export default function SuperadminRegions() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  const regions = [
    { name: 'North America', users: '450K', status: 'Optimal', servers: 12 },
    { name: 'Europe', users: '320K', status: 'Optimal', servers: 8 },
    { name: 'Africa', users: '280K', status: 'High Load', servers: 5 },
    { name: 'Asia Pacific', users: '150K', status: 'Optimal', servers: 6 },
  ];

  return (
    <AdminLayout title="Regional Hubs">
      <div className="space-y-6">
        
        <div className={`p-8 rounded-2xl border flex flex-col items-center justify-center text-center ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <Globe className={`w-16 h-16 mb-4 ${isDark ? 'text-cyan-400' : 'text-blue-500'}`} />
          <h2 className="text-2xl font-bold mb-2">Global Infrastructure Map</h2>
          <p className={`max-w-xl ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
            Monitor and manage your distributed global server nodes. This module is connected directly to our geo-routing load balancers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {regions.map((region, i) => (
             <div key={i} className={`p-6 rounded-2xl border ${
               isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
             }`}>
               <div className="flex items-center gap-3 mb-4">
                 <div className={`p-2 rounded-lg ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-50 text-blue-600'}`}>
                   <MapPin className="w-5 h-5" />
                 </div>
                 <h3 className="font-bold">{region.name}</h3>
               </div>
               <div className="space-y-2 text-sm">
                 <div className="flex justify-between">
                   <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Active Users</span>
                   <span className="font-bold">{region.users}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Active Servers</span>
                   <span className="font-bold">{region.servers}</span>
                 </div>
                 <div className="flex justify-between">
                   <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Status</span>
                   <span className={`font-bold ${region.status === 'Optimal' ? 'text-green-500' : 'text-yellow-500'}`}>
                     {region.status}
                   </span>
                 </div>
               </div>
               <button className={`mt-6 w-full py-2 rounded-lg text-xs font-bold border transition-colors ${
                 isDark ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'
               }`}>
                 Manage Hub
               </button>
             </div>
          ))}
        </div>

      </div>
    </AdminLayout>
  );
}
