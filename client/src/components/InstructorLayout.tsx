import { ReactNode } from 'react';
import InstructorSidebar from './InstructorSidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSidebar } from '@/contexts/SidebarContext';
import { Bell, Search, User, Menu } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

interface InstructorLayoutProps {
  children: ReactNode;
  title: string;
}

export default function InstructorLayout({ children, title }: InstructorLayoutProps) {
  const { theme } = useLanguage();
  const { mode, toggleMobile } = useSidebar();
  const { profile } = useUser();
  const isDark = theme === 'dark';
  const collapsed = mode === 'collapsed';

  return (
    <div className={`min-h-screen flex ${isDark ? 'bg-slate-950 text-white' : 'bg-gray-50 text-slate-900'}`}>
      <InstructorSidebar />
      
      <main className={`flex-1 transition-all duration-300 ${collapsed ? 'lg:ml-0' : 'lg:ml-72'} ml-0 flex flex-col min-w-0`}>
        {/* Top Header */}
        <header className={`h-16 lg:h-20 flex items-center justify-between px-4 lg:px-8 border-b sticky top-0 z-30 backdrop-blur-md ${
          isDark ? 'bg-slate-950/50 border-teal-400/10' : 'bg-white/50 border-teal-200/50'
        }`}>
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={toggleMobile} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-white/10 text-gray-400">
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <h1 className="text-base lg:text-xl font-bold tracking-tight truncate">{title}</h1>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>Instructor Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-6 shrink-0">
            <div className={`hidden md:flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-900 border-teal-400/10 focus-within:border-teal-400/50' : 'bg-gray-100 border-teal-100 focus-within:border-teal-300'
            }`}>
              <Search className="w-4 h-4 text-gray-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-24 lg:w-48"
              />
            </div>

            <button className={`relative p-1.5 lg:p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-teal-500/10 text-gray-400' : 'hover:bg-teal-50 text-gray-600'
            }`}>
              <Bell className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 lg:w-2 lg:h-2 bg-teal-500 rounded-full border-2 border-slate-950 shadow-[0_0_5px_rgba(20,184,166,0.5)]" />
            </button>

            <div className="flex items-center gap-2 lg:gap-3 pl-3 lg:pl-6 border-l border-teal-400/10">
              <div className="text-right hidden sm:block">
                <p className="text-xs lg:text-sm font-bold truncate max-w-[120px]">{profile?.fullName || 'Instructor'}</p>
                <p className="text-[10px] uppercase tracking-tighter text-teal-500 font-bold truncate">
                  Instructor
                </p>
              </div>
              <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
                <User className="w-4 h-4 lg:w-6 lg:h-6" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>

      {isDark && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#14b8a6_1px,transparent_1px),linear-gradient(to_bottom,#14b8a6_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        </div>
      )}
    </div>
  );
}
