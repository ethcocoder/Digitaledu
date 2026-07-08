import { useEffect, useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlayCircle, Award, BookOpen, Clock, Search, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { enrollmentService } from '@/lib/enrollmentService';
import { courseService } from '@/lib/courseService';
import { Enrollment, Course } from '../../../../shared/types';

interface EnrolledCourse extends Enrollment {
  course?: Course;
}

export default function StudentDashboard() {
  const { theme, t } = useLanguage();
  const { profile, user } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [enrollments, setEnrollments] = useState<EnrolledCourse[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
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
      
      // Fetch recommended courses
      const { courses } = await courseService.getPublishedCourses();
      const enrolledIds = new Set(data.map(e => e.courseId));
      const recommended = courses
        .filter(c => !enrolledIds.has(c.id))
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
        .slice(0, 3);
      setRecommendedCourses(recommended);
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

  return (
    <StudentLayout title="My Learning">
      <div className="space-y-8">
        <div className={`p-8 rounded-3xl border relative overflow-hidden ${
          isDark ? 'bg-slate-900/40 border-yellow-500/20' : 'bg-white border-yellow-200'
        }`}>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">
              {t('student.welcome')} {profile?.fullName?.split(' ')[0] || ''}
            </h2>
            <p className={`mb-6 max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('student.learningMomentum')}
            </p>
            {resumeCourse && (
              <button
                onClick={() => setLocation(`/student/learn/${resumeCourse.courseId}`)}
                className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-500/30 hover:scale-105 transition-transform"
              >
                {t('student.resume')}
              </button>
            )}
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-yellow-500/10 to-transparent pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-yellow-500/20 blur-3xl rounded-full pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: t('student.inProgress'), value: String(inProgress.length), icon: PlayCircle, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: t('student.completed'), value: String(completed.length), icon: Award, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: t('dashboard.certificates'), value: String(completed.length), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: t('student.hours'), value: `${totalHours}h`, icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className={`p-6 rounded-2xl border flex items-center gap-4 ${
                isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'
              }`}
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
                <p className={`text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <h3 className="text-xl font-bold mb-6">{t('student.continueLearning')}</h3>
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {enrollments.slice(0, 4).map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => setLocation(`/student/learn/${enrollment.courseId}`)}
                  className={`p-6 rounded-2xl border flex flex-col md:flex-row gap-6 cursor-pointer ${
                    isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-200 hover:border-yellow-400'
                  } transition-all`}
                >
                  <div className="w-full md:w-48 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-inner">
                    <PlayCircle className="w-12 h-12 text-white/50" />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">
                      {enrollment.course?.category || 'Course'}
                    </span>
                    <h4 className="font-bold text-lg mb-2">{enrollment.courseTitle}</h4>
                    <div className="mt-auto space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                          {enrollment.completedModules.length} / {enrollment.course?.modules?.length || 0} modules
                        </span>
                        <span className="text-yellow-500">{enrollment.progress}% Complete</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                          style={{ width: `${enrollment.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-bold">{t('student.recommendedForYou')}</h3>
            <div className="space-y-4">
              {loading ? (
                [1, 2].map(i => (
                  <div key={i} className={`h-32 rounded-2xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
                ))
              ) : recommendedCourses.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No new recommendations right now.</p>
              ) : (
                recommendedCourses.map((course) => (
                  <div
                    key={course.id}
                    onClick={() => setLocation('/student/catalog')}
                    className={`p-4 rounded-2xl border flex gap-4 cursor-pointer transition-all group ${
                      isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-100 hover:border-yellow-300'
                    }`}
                  >
                    <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex-shrink-0 flex items-center justify-center">
                      <Star className="w-8 h-8 text-white/30" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm mb-1 truncate group-hover:text-yellow-500 transition-colors">{course.title}</h4>
                      <p className="text-xs text-gray-500 mb-2 line-clamp-1">{course.category}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-yellow-500">${course.price}</span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                          {course.rating || 'New'}
                        </div>
                      </div>
                    </div>
                  </div>
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
    </StudentLayout>
  );
}
