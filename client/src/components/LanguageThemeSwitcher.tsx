import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Sun, Globe } from 'lucide-react';

export function LanguageThemeSwitcher() {
  const { language, setLanguage, theme, setTheme } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* Language Switcher */}
      <div className="flex items-center gap-1 bg-slate-800/50 dark:bg-slate-800/50 light-mode:bg-slate-100/50 rounded-lg p-1 backdrop-blur-sm border border-cyan-400/20 light-mode:border-blue-200/30">
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
            language === 'en'
              ? 'bg-cyan-500/30 text-cyan-400 light-mode:bg-blue-500/30 light-mode:text-blue-600'
              : 'text-slate-400 hover:text-slate-300 light-mode:text-slate-600 light-mode:hover:text-slate-700'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage('am')}
          className={`px-3 py-1 rounded text-xs font-semibold transition-all duration-300 ${
            language === 'am'
              ? 'bg-cyan-500/30 text-cyan-400 light-mode:bg-blue-500/30 light-mode:text-blue-600'
              : 'text-slate-400 hover:text-slate-300 light-mode:text-slate-600 light-mode:hover:text-slate-700'
          }`}
        >
          ኦ
        </button>
      </div>

      {/* Theme Switcher */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="p-2 rounded-lg bg-slate-800/50 dark:bg-slate-800/50 light-mode:bg-slate-100/50 hover:bg-slate-700/50 dark:hover:bg-slate-700/50 light-mode:hover:bg-slate-200/50 border border-cyan-400/20 light-mode:border-blue-200/30 transition-all duration-300"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        {theme === 'dark' ? (
          <Sun className="w-4 h-4 text-yellow-400" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600" />
        )}
      </button>
    </div>
  );
}
