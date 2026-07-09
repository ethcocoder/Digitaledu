import { ReactNode } from 'react';
import StudentSidebar from './StudentSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Bell, Search, User } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface StudentLayoutProps {
  children: ReactNode;
  title: string;
}

export default function StudentLayout({ children, title }: StudentLayoutProps) {
  const { theme } = useLanguage();
  const { mode } = useSidebar();
  const { profile } = useUser();
  const isDark = theme === 'dark';
  const collapsed = mode === 'collapsed';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <StudentSidebar />
      
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'ml-0' : 'ml-72'} flex flex-col`}>
        {/* Top Header */}
        <header className={`h-20 flex items-center justify-between px-8 border-b sticky top-0 z-40 backdrop-blur-md ${
          isDark ? 'bg-slate-950/50 border-yellow-500/10' : 'bg-white/50 border-yellow-200/50'
        }`}>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Welcome back, ready to learn?</p>
          </div>

          <div className="flex items-center gap-6">
            {/* Search */}
            <div className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-900 border-yellow-500/10 focus-within:border-yellow-500/50' : 'bg-gray-100 border-yellow-100 focus-within:border-yellow-300'
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
              isDark ? 'hover:bg-yellow-500/10 text-gray-400' : 'hover:bg-yellow-50 text-gray-600'
            }`}>
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-500 rounded-full border-2 border-slate-950 shadow-[0_0_5px_rgba(234,179,8,0.5)]" />
            </button>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-6 border-l border-yellow-500/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{profile?.fullName || 'Student'}</p>
                <p className="text-[10px] uppercase tracking-tighter text-yellow-500 font-bold">
                   Learner
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-tr from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
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
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#eab308_1px,transparent_1px),linear-gradient(to_bottom,#eab308_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
      )}
    </div>
  );
}
