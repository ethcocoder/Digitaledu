import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  DollarSign,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MonitorPlay
} from 'lucide-react';
import { useSidebar } from '@/contexts/SidebarContext';
import { useUser } from '@/contexts/UserContext';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarItemProps {
  icon: any;
  label: string;
  path: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

function SidebarItem({ icon: Icon, label, path, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative ${
        active 
          ? 'bg-teal-500/10 text-teal-500 border border-teal-500/20 shadow-[0_0_15px_rgba(20,184,166,0.1)]' 
          : 'text-gray-400 hover:text-teal-500 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-teal-500 rounded-r-full shadow-[0_0_10px_#14b8a6]" />
      )}
    </button>
  );
}

export default function InstructorSidebar() {
  const [location, setLocation] = useLocation();
  const { mode, toggle } = useSidebar();
  const collapsed = mode === 'collapsed';
  const { logout } = useUser();
  const { theme, t } = useLanguage();
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.overview'), path: '/instructor' },
    { icon: BookOpen, label: t('instructor.myCourses'), path: '/instructor/courses' },
    { icon: Users, label: t('instructor.students'), path: '/instructor/students' },
    { icon: DollarSign, label: t('instructor.earnings'), path: '/instructor/earnings' },
    { icon: Settings, label: t('dashboard.settings'), path: '/instructor/settings' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-50 flex flex-col border-r ${
        collapsed ? 'w-0 overflow-hidden border-transparent' : 'w-72'
      } ${
        isDark 
          ? 'bg-slate-950/80 backdrop-blur-xl border-teal-500/10' 
          : 'bg-white/90 backdrop-blur-xl border-teal-200/50'
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggle}
        className={`fixed top-20 z-[60] w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
          collapsed ? 'left-2' : 'left-[270px]'
        } ${
          isDark 
            ? 'bg-slate-900 border-teal-500/20 text-teal-500 hover:border-teal-400' 
            : 'bg-white border-teal-200 text-teal-600 hover:border-teal-400'
        }`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className="p-6 flex items-center justify-between overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
            <MonitorPlay className="text-white w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className={`font-bold text-lg tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Digital<span className="text-teal-500">Edu</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-500/80 truncate">
              Instructor Portal
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto no-scrollbar">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.path}
            {...item}
            active={location === item.path}
            collapsed={collapsed}
            onClick={() => setLocation(item.path)}
          />
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-teal-500/10 shrink-0">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="font-medium truncate">{t('dashboard.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
