import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Search, 
  BookOpen, 
  Settings,
  Trophy,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useState } from 'react';
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
          ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
          : 'text-gray-400 hover:text-yellow-500 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-yellow-500 rounded-r-full shadow-[0_0_10px_#eab308]" />
      )}
    </button>
  );
}

export default function StudentSidebar() {
  const [location, setLocation] = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useUser();
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  const menuItems = [
    { icon: LayoutDashboard, label: 'My Learning', path: '/student' },
    { icon: Search, label: 'Course Catalog', path: '/student/catalog' },
    { icon: Trophy, label: 'Achievements', path: '/student/achievements' },
    { icon: BookOpen, label: 'Certificates', path: '/student/certificates' },
    { icon: Settings, label: 'Preferences', path: '/student/settings' },
  ];

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-50 flex flex-col border-r ${
        collapsed ? 'w-20' : 'w-72'
      } ${
        isDark 
          ? 'bg-slate-950/80 backdrop-blur-xl border-yellow-500/10' 
          : 'bg-white/90 backdrop-blur-xl border-yellow-200/50'
      }`}
    >
      {/* Header */}
      <div className="p-6 flex items-center justify-between overflow-hidden">
        {!collapsed && (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <GraduationCap className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Digital<span className="text-yellow-500">Edu</span>
              </h2>
              <p className="text-[10px] font-bold uppercase tracking-widest text-yellow-500/80">
                Student Portal
              </p>
            </div>
          </div>
        )}
        {collapsed && (
           <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 mx-auto">
             <GraduationCap className="text-white w-6 h-6" />
           </div>
        )}
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`absolute -right-3 top-20 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
          isDark 
            ? 'bg-slate-900 border-yellow-500/20 text-yellow-500 hover:border-yellow-400' 
            : 'bg-white border-yellow-200 text-yellow-600 hover:border-yellow-400'
        }`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

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
      <div className="p-4 border-t border-yellow-500/10">
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
