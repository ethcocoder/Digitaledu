import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, TrendingUp, CreditCard, Download } from 'lucide-react';

export default function SuperadminFinancials() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <AdminLayout title="Financial Dashboard">
      <div className="space-y-6">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "Total Revenue (YTD)", val: "$2.4M", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
            { title: "Monthly Recurring", val: "$428K", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-500/10" },
            { title: "Active Subscriptions", val: "84.2K", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-500/10" },
          ].map((stat, i) => (
             <div key={i} className={`p-6 rounded-2xl border ${
               isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
             }`}>
               <div className="flex items-center justify-between mb-4">
                 <div className={`p-3 rounded-xl ${stat.bg}`}>
                   <stat.icon className={`w-6 h-6 ${stat.color}`} />
                 </div>
                 <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full">+12%</span>
               </div>
               <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
               <h3 className="text-3xl font-bold">{stat.val}</h3>
             </div>
          ))}
        </div>

        {/* Recent Transactions */}
        <div className={`rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
          <div className="p-6 border-b flex justify-between items-center border-cyan-400/10">
            <h3 className="font-bold text-lg">Recent Enterprise Transactions</h3>
            <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-transform ${
              isDark ? 'bg-slate-800 text-cyan-400 hover:bg-slate-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}>
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
          <div className="p-6 flex flex-col items-center justify-center text-center py-20">
             <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDark ? 'bg-slate-800 text-gray-500' : 'bg-gray-100 text-gray-400'
             }`}>
                <CreditCard className="w-8 h-8" />
             </div>
             <p className={`font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>No recent transactions found for the selected period.</p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
