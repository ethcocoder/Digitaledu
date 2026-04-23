import { useLanguage } from '@/contexts/LanguageContext';
import { Moon, Sun, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function LanguageThemeSwitcher() {
  const { language, setLanguage, theme, setTheme } = useLanguage();

  return (
    <div className="flex items-center gap-3">
      {/* Language Toggle */}
      <div className="relative flex items-center bg-white/10 dark:bg-slate-800/40 light-mode:bg-white/80 rounded-full p-1 backdrop-blur-md border border-white/20 dark:border-cyan-400/20 light-mode:border-blue-200/50 shadow-lg group">
        <div className="flex items-center px-2 py-1 text-gray-400 dark:text-cyan-400/60 light-mode:text-blue-600/60">
          <Globe className="w-4 h-4" />
        </div>
        
        <button
          onClick={() => setLanguage('en')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 relative z-10 ${
            language === 'en'
              ? 'text-white dark:text-cyan-400 light-mode:text-blue-600 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 light-mode:text-gray-500 light-mode:hover:text-gray-700'
          }`}
        >
          {language === 'en' && (
            <motion.div
              layoutId="activeLang"
              className="absolute inset-0 bg-cyan-500/40 dark:bg-cyan-500/20 light-mode:bg-blue-500/10 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          EN
        </button>
        
        <button
          onClick={() => setLanguage('am')}
          className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 relative z-10 ${
            language === 'am'
              ? 'text-white dark:text-cyan-400 light-mode:text-blue-600 shadow-sm'
              : 'text-gray-400 hover:text-gray-200 light-mode:text-gray-500 light-mode:hover:text-gray-700'
          }`}
        >
          {language === 'am' && (
            <motion.div
              layoutId="activeLang"
              className="absolute inset-0 bg-cyan-500/40 dark:bg-cyan-500/20 light-mode:bg-blue-500/10 rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          አማርኛ
        </button>
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        className="relative p-2 rounded-full bg-white/10 dark:bg-slate-800/40 light-mode:bg-white/80 backdrop-blur-md border border-white/20 dark:border-cyan-400/20 light-mode:border-blue-200/50 shadow-lg transition-all duration-300 hover:scale-110 active:scale-95 group overflow-hidden"
        title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <div className="relative z-10 flex items-center justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {theme === 'dark' ? (
              <motion.div
                key="sun"
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Sun className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
              </motion.div>
            ) : (
              <motion.div
                key="moon"
                initial={{ y: 20, opacity: 0, rotate: -90 }}
                animate={{ y: 0, opacity: 1, rotate: 0 }}
                exit={{ y: -20, opacity: 0, rotate: 90 }}
                transition={{ type: "spring", stiffness: 200, damping: 10 }}
              >
                <Moon className="w-5 h-5 text-blue-600 drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/0 via-cyan-400/5 to-yellow-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </button>
    </div>
  );
}


