import { useLocation } from 'wouter';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Settings, 
  ShieldAlert, 
  BarChart3, 
  Globe, 
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Cpu,
  ClipboardCheck
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
          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-400/20 shadow-[0_0_15px_rgba(0,217,255,0.1)]' 
          : 'text-gray-400 hover:text-cyan-400 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
      {!collapsed && <span className="font-medium whitespace-nowrap">{label}</span>}
      
      {active && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-cyan-400 rounded-r-full shadow-[0_0_10px_#00D9FF]" />
      )}
    </button>
  );
}

export default function AdminSidebar() {
  const [location, setLocation] = useLocation();
  const { mode, toggle } = useSidebar();
  const collapsed = mode === 'collapsed';
  const { logout, role } = useUser();
  const { theme, t } = useLanguage();
  const isDark = theme === 'dark';

  const isSuperadmin = role === 'superadmin';

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard.overview'), path: isSuperadmin ? '/superadmin' : '/admin' },
    { icon: Users, label: t('dashboard.users'), path: isSuperadmin ? '/superadmin/users' : '/admin/users' },
    { icon: BookOpen, label: t('dashboard.courses'), path: isSuperadmin ? '/superadmin/courses' : '/admin/courses' },
    { icon: ClipboardCheck, label: 'Course Review', path: isSuperadmin ? '/superadmin/course-review' : '/admin/course-review' },
    { icon: BarChart3, label: t('dashboard.analytics'), path: isSuperadmin ? '/superadmin/analytics' : '/admin/analytics' },
    { icon: CreditCard, label: t('dashboard.financials'), path: isSuperadmin ? '/superadmin/financials' : '/admin/financials' },
    { icon: Globe, label: 'Regional Hubs', path: '/superadmin/regions', hidden: !isSuperadmin },
    { icon: ShieldAlert, label: 'System Health', path: '/superadmin/health', hidden: !isSuperadmin },
    { icon: Settings, label: t('dashboard.settings'), path: isSuperadmin ? '/superadmin/settings' : '/admin/settings' },
  ].filter(item => !item.hidden);

  return (
    <aside 
      className={`fixed top-0 left-0 h-screen transition-all duration-300 z-50 flex flex-col border-r ${
        collapsed ? 'w-0 overflow-hidden border-transparent' : 'w-72'
      } ${
        isDark 
          ? 'bg-slate-950/80 backdrop-blur-xl border-cyan-400/10' 
          : 'bg-white/90 backdrop-blur-xl border-blue-200/50'
      }`}
    >
      {/* Toggle Button (always visible, positioned outside when collapsed) */}
      <button
        onClick={toggle}
        className={`fixed top-20 z-[60] w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 ${
          collapsed ? 'left-2' : 'left-[270px]'
        } ${
          isDark 
            ? 'bg-slate-900 border-cyan-400/20 text-cyan-400 hover:border-cyan-400' 
            : 'bg-white border-blue-200 text-blue-600 hover:border-blue-400'
        }`}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Header */}
      <div className="p-6 flex items-center justify-between overflow-hidden shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 shrink-0">
            <Cpu className="text-white w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h2 className={`font-bold text-lg tracking-tight truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Digital<span className="text-cyan-400">Edu</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-500/60 truncate">
              {isSuperadmin ? 'Superadmin Node' : 'Admin Node'}
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
      <div className="p-4 border-t border-cyan-400/10 shrink-0">
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

      {/* System Status */}
      <div className={`px-6 py-4 space-y-3 shrink-0 ${collapsed ? 'hidden' : ''}`}>
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase">
          <span>Core Sync</span>
          <span className="text-green-500">Online</span>
        </div>
        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full w-2/3 bg-cyan-400 animate-pulse" />
        </div>
      </div>
    </aside>
  );
}
