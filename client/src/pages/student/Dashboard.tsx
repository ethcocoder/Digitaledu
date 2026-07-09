import { useEffect, useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlayCircle, Award, BookOpen, Clock, Search, Star, Zap, Flame, BadgeCheck, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { enrollmentService } from '@/lib/enrollmentService';
import { courseService } from '@/lib/courseService';
import { progressService } from '@/lib/progressService';
import { Enrollment, Course, UserProgress } from '../../../../shared/types';
import { RadialBarChart, RadialBar, ResponsiveContainer, LineChart, Line, XAxis, Tooltip } from 'recharts';

interface EnrolledCourse extends Enrollment {
  course?: Course;
}

function SkeletonCard({ className }: { className?: string }) {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  return (
    <div className={`animate-pulse rounded-2xl ${isDark ? 'bg-slate-800/50' : 'bg-gray-100'} ${className || 'h-32'}`} />
  );
}

const weeklyData = [
  { day: 'Mon', hours: 2 }, { day: 'Tue', hours: 1.5 }, { day: 'Wed', hours: 3 },
  { day: 'Thu', hours: 2.5 }, { day: 'Fri', hours: 1 }, { day: 'Sat', hours: 4 }, { day: 'Sun', hours: 0.5 },
];

export default function StudentDashboard() {
  const { theme, t } = useLanguage();
  const { profile, user } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = enrollmentService.subscribeToStudentEnrollments(user.uid, async (data) => {
      const withCourses = await Promise.all(
        data.map(async (enrollment) => {
          const { course } = await courseService.getCourseById(enrollment.courseId);
          return { ...enrollment, course: course || undefined };
        })
      );
      setEnrollments(withCourses);
      
      const { courses } = await courseService.getPublishedCourses();
      const enrolledIds = new Set(data.map(e => e.courseId));
      const recommended = courses
        .filter(c => !enrolledIds.has(c.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      setRecommendedCourses(recommended);

      const { progress: p } = await progressService.getProgress(user.uid);
      setProgress(p);

      setLoading(false);
    });

    return unsubscribe;
  }, [user?.uid]);

  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100);
  const completed = enrollments.filter((e) => e.progress >= 100);
  const totalHours = enrollments.reduce((acc, e) => {
    const moduleMinutes = e.course?.modules?.reduce((sum, m) => sum + m.durationMinutes, 0) || 0;
    return acc + Math.round((moduleMinutes * e.progress) / 100 / 60);
  }, 0);

  const resumeCourse = inProgress[0] || enrollments[0];
  const badgeCount = progress?.badges?.length || 0;

  const overallProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((sum, e) => sum + e.progress, 0) / enrollments.length)
    : 0;

  const radialData = [
    { name: 'Progress', value: overallProgress, fill: '#eab308' },
    { name: 'Remaining', value: 100 - overallProgress, fill: 'transparent' },
  ];

  const chartColors = isDark ? '#475569' : '#e5e7eb';

  return (
    <StudentLayout title="My Learning">
      <div className="space-y-8">
        {/* Hero Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          <div className={`lg:col-span-2 p-8 rounded-3xl border relative overflow-hidden ${
            isDark ? 'bg-gradient-to-br from-slate-900/80 to-slate-950/80 border-yellow-500/20' : 'bg-gradient-to-br from-white to-yellow-50/50 border-yellow-200'
          }`}>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-yellow-500/20">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">
                    {t('student.welcome')} {profile?.fullName?.split(' ')[0] || ''}
                  </h2>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {t('student.learningMomentum')}
                  </p>
                </div>
              </div>
              {resumeCourse && (
                <button
                  onClick={() => setLocation(`/student/learn/${resumeCourse.courseId}`)}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition-transform inline-flex items-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> {t('student.resume')}
                </button>
              )}
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />
          </div>

          {/* Overall Progress Ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15 }}
            className={`p-6 rounded-3xl border flex items-center gap-6 ${
              isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
            }`}
          >
            <div className="w-28 h-28 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="75%" outerRadius="100%" barSize={12} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar dataKey="value" cornerRadius={6} background={{ fill: chartColors }} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-2xl font-bold" fill={isDark ? '#fff' : '#0f172a'}>
                    {overallProgress}%
                  </text>
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-yellow-500 uppercase tracking-wider">Overall Progress</p>
              <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {completed.length} of {enrollments.length} courses completed
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {loading ? (
            [1,2,3,4,5].map(i => <SkeletonCard key={i} className="h-24" />)
          ) : (
            [
              { label: t('student.inProgress'), value: String(inProgress.length), icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { label: t('student.completed'), value: String(completed.length), icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
              { label: 'Certificates', value: String(completed.length), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
              { label: t('student.hours'), value: `${totalHours}h`, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              { label: 'XP Earned', value: String(progress?.totalXP || 0), icon: TrendingUp, color: 'text-orange-500', bg: 'bg-orange-500/10' },
            ].map((stat, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                key={stat.label}
                className={`p-4 md:p-5 rounded-2xl border flex items-center gap-3 md:gap-4 ${
                  isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
                }`}
              >
                <div className={`p-3 md:p-3.5 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <div className="min-w-0">
                  <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                  <p className={`text-[10px] md:text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                    {stat.label}
                  </p>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Achievement & Streak Row */}
        {!loading && progress && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`p-5 rounded-2xl border flex items-center gap-6 ${
              isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
            }`}
          >
            {badgeCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <BadgeCheck className="w-6 h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-sm">{badgeCount} Badge{badgeCount > 1 ? 's' : ''}</p>
                  <div className="flex gap-1 mt-1">
                    {progress.badges.slice(0, 5).map((b) => (
                      <span key={b.id} className="text-lg" title={b.name?.en || ''}>{b.icon}</span>
                    ))}
                    {badgeCount > 5 && <span className="text-xs text-gray-500 ml-1">+{badgeCount - 5}</span>}
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-6 ml-auto">
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-bold text-lg">{progress.streakCount}</p>
                  <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Day Streak</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="font-bold text-lg">{progress.totalXP}</p>
                  <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Total XP</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-bold text-lg">{progress.totalQuizzesTaken}</p>
                  <p className={`text-[10px] uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Quizzes</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Weekly Activity Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className={`p-6 rounded-2xl border ${
            isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold flex items-center gap-2">
              <ActivityIcon className="w-5 h-5 text-yellow-500" />
              Weekly Activity
            </h3>
            <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Hours studied</span>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyData}>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#6b7280' : '#9ca3af', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: isDark ? '#1e293b' : '#fff',
                    border: `1px solid ${isDark ? '#334155' : '#e5e7eb'}`,
                    borderRadius: '8px',
                    color: isDark ? '#fff' : '#0f172a',
                  }}
                />
                <Line type="monotone" dataKey="hours" stroke="#eab308" strokeWidth={2} dot={{ fill: '#eab308', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Continue Learning */}
          <div className="xl:col-span-2">
            <h3 className="text-xl font-bold mb-6">{t('student.continueLearning')}</h3>
            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SkeletonCard className="h-44" />
                <SkeletonCard className="h-44" />
              </div>
            ) : enrollments.length === 0 ? (
              <div className={`p-12 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${
                isDark ? 'border-yellow-500/20' : 'border-yellow-200'
              }`}>
                <Search className={`w-12 h-12 mb-4 ${isDark ? 'text-gray-500' : 'text-yellow-500'}`} />
                <h4 className="font-bold text-lg mb-2">{t('student.lookingForMore')}</h4>
                <p className={`text-sm mb-4 max-w-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Browse the course catalog to discover new skills and enroll in more classes.
                </p>
                <button
                  onClick={() => setLocation('/student/catalog')}
                  className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
                    isDark ? 'border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/10' : 'border-yellow-400 text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  {t('student.exploreCatalog')}
                </button>
              </div>
            ) : (
              <>
                {inProgress.length > 0 && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {inProgress.slice(0, 4).map((enrollment) => (
                      <motion.div
                        key={enrollment.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setLocation(`/student/learn/${enrollment.courseId}`)}
                        className={`p-5 rounded-2xl border flex flex-col cursor-pointer transition-all group ${
                          isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-200 hover:border-yellow-400'
                        }`}
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-inner shrink-0">
                            <PlayCircle className="w-7 h-7 text-white/60" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                              {enrollment.course?.category || 'Course'}
                            </span>
                            <h4 className="font-bold truncate mt-0.5">{enrollment.courseTitle}</h4>
                          </div>
                          <ChevronRight className={`w-5 h-5 mt-1 shrink-0 transition-transform group-hover:translate-x-1 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
                        </div>

                        <div className="mt-auto space-y-2">
                          <div className="flex justify-between text-xs font-medium">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                              {enrollment.completedModules.length} / {enrollment.course?.modules?.length || 0} modules
                            </span>
                            <span className="text-yellow-500 font-bold">{Math.round(enrollment.progress)}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-700 relative overflow-hidden"
                              style={{ width: `${enrollment.progress}%` }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {completed.length > 0 && (
                  <div>
                    <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-green-500" />
                      Recently Completed
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {completed.slice(0, 2).map((enrollment) => (
                        <motion.div
                          key={enrollment.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          onClick={() => setLocation(`/student/certificates`)}
                          className={`p-4 rounded-2xl border flex items-center gap-4 cursor-pointer ${
                            isDark ? 'bg-green-950/20 border-green-500/20 hover:border-green-500/40' : 'bg-green-50/50 border-green-200 hover:border-green-400'
                          } transition-all`}
                        >
                          <div className="p-3 rounded-xl bg-green-500/10">
                            <Award className="w-6 h-6 text-green-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm truncate">{enrollment.courseTitle}</h5>
                            <p className="text-xs text-gray-500">Certificate available</p>
                          </div>
                          <span className="text-[10px] font-bold text-green-500 uppercase">Done</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Recommended */}
            <div>
              <h3 className="text-xl font-bold mb-4">{t('student.recommendedForYou')}</h3>
              <div className="space-y-4">
                {loading ? (
                  [1, 2, 3].map(i => <SkeletonCard key={i} className="h-28" />)
                ) : recommendedCourses.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No new recommendations right now.</p>
                ) : (
                  recommendedCourses.map((course, i) => (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => setLocation('/student/catalog')}
                      className={`p-4 rounded-2xl border flex gap-4 cursor-pointer transition-all group ${
                        isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-100 hover:border-yellow-300'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                        <Star className="w-8 h-8 text-white/30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm mb-1 truncate group-hover:text-yellow-500 transition-colors">{course.title}</h4>
                        <p className="text-xs text-gray-500 mb-2 truncate">{course.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-yellow-500">${course.price}</span>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {course.rating || 'New'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <button 
                  onClick={() => setLocation('/student/catalog')}
                  className={`w-full py-3 rounded-xl text-xs font-bold border border-dashed transition-colors ${
                    isDark ? 'border-yellow-500/20 text-yellow-500/60 hover:bg-yellow-500/5' : 'border-yellow-200 text-yellow-600/60 hover:bg-yellow-50'
                  }`}
                >
                  View Full Catalog
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  );
}
