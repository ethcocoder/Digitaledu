import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { PlayCircle, Award, BookOpen, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { theme, t } = useLanguage();
  const isDark = theme === 'dark';

  return (
    <StudentLayout title="My Learning">
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <div className={`p-8 rounded-3xl border relative overflow-hidden ${
          isDark ? 'bg-slate-900/40 border-yellow-500/20' : 'bg-white border-yellow-200'
        }`}>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">{t('student.welcome')}</h2>
            <p className={`mb-6 max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('student.learningMomentum')}
            </p>
            <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition-transform">
              {t('student.resume')}
            </button>
          </div>
          
          {/* Decorative Background Elements */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: t('student.inProgress'), value: '2', icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t('student.completed'), value: '5', icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: t('dashboard.certificates'), value: '3', icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: t('student.hours'), value: '42h', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className={`p-6 rounded-2xl border flex items-center gap-4 ${
                isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
              }`}
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* In Progress Courses */}
        <div>
          <h3 className="text-xl font-bold mb-6">{t('student.continueLearning')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 ${
              isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-200 hover:border-yellow-400'
            } transition-all`}>
              <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner">
                <PlayCircle className="w-12 h-12 text-white/50" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">Web Development</span>
                <h4 className="font-bold text-lg mb-2">Advanced React Patterns</h4>
                <div className="mt-auto space-y-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Module 4 of 12</span>
                    <span className="text-yellow-500">32% Complete</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-[32%] bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State for second slot */}
            <div className={`p-6 rounded-2xl border border-dashed flex flex-col items-center justify-center text-center ${
              isDark ? 'border-yellow-500/20' : 'border-yellow-200'
            }`}>
              <div className={`p-4 rounded-full mb-4 ${isDark ? 'bg-slate-800' : 'bg-yellow-50'}`}>
                <Search className={`w-6 h-6 ${isDark ? 'text-gray-500' : 'text-yellow-500'}`} />
              </div>
              <h4 className="font-bold text-lg mb-2">{t('student.lookingForMore')}</h4>
              <p className={`text-sm mb-4 max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Browse the course catalog to discover new skills and enroll in more classes.
              </p>
              <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                isDark ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
              }`}>
                {t('student.exploreCatalog')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
