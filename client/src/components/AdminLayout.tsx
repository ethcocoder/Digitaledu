import { ReactNode } from 'react';
import AdminSidebar from './AdminSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Bell, Search, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { theme } = useLanguage();
  const { mode } = useSidebar();
  const { profile } = useUser();
  const isDark = theme === 'dark';
  const collapsed = mode === 'collapsed';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <AdminSidebar />
      
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-72'} flex flex-col`}>
        {/* Top Header */}
        <header className={`h-20 flex items-center justify-between px-8 border-b sticky top-0 z-40 backdrop-blur-md ${
          isDark ? 'bg-slate-950/50 border-cyan-400/10' : 'bg-white/50 border-blue-100'
        }`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className="text-xs text-gray-500">System Node: Primary-Alpha-01</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-900 border-cyan-400/10 focus-within:border-cyan-400' : 'bg-gray-100 border-blue-50'
            }`}>
              <Search className="w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="bg-transparent border-none outline-none text-sm w-48"
              />
            </div>

            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-cyan-500/10 text-gray-400' : 'hover:bg-blue-50 text-gray-600'
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-slate-950 shadow-[0_0_5px_rgba(239,68,68,0.5)]" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-cyan-400/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{profile?.fullName || 'Admin User'}</p>
                <p className="text-[10px] uppercase tracking-tighter text-cyan-500 font-bold">
                   {profile?.role || 'Administrator'}
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>

      {/* Decorative Cyber Grid Background */}
      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0891b2_1px,transparent_1px),linear-gradient(to_bottom,#0891b2_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
      )}
    </div>
  );
}
