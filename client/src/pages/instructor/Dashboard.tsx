import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlayCircle, Users, BookOpen, DollarSign, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Course } from '../../../../shared/types';

export default function InstructorDashboard() {
  const { theme, t } = useLanguage();
  const { profile, user } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      const [{ courses }, { enrollments }] = await Promise.all([
        courseService.getInstructorCourses(user.uid),
        enrollmentService.getInstructorEnrollments(user.uid),
      ]);
      setCourses(courses);
      setTotalStudents(enrollments.length);
      const earnings = courses.reduce((acc, c) => acc + c.price * c.studentsCount, 0);
      setTotalEarnings(earnings);
      setLoading(false);
    };
    load();
  }, [user?.uid]);

  const publishedCourses = courses.filter((c) => c.status === 'published');

  return (
    <InstructorLayout title={t('instructor.title')}>
      <div className="space-y-8">
        <div className={`p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 ${
          isDark ? 'bg-slate-900/40 border-teal-500/20' : 'bg-white border-teal-200'
        }`}>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.fullName || 'Instructor'}!</h2>
            <p className={`max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Ready to share your knowledge? Manage your courses or create a new one to reach more students.
            </p>
          </div>
          <button
            onClick={() => setLocation('/instructor/courses/new')}
            className="relative z-10 px-6 py-4 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 hover:scale-105 transition-transform flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-5 h-5" />
            {t('instructor.createCourse')}
          </button>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: t('instructor.activeCourses'), value: loading ? '...' : String(publishedCourses.length), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
            { label: t('instructor.totalStudents'), value: loading ? '...' : String(totalStudents), icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { label: t('instructor.totalEarnings'), value: loading ? '...' : `$${totalEarnings.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
          ].map((stat, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={stat.label}
              className={`p-6 rounded-2xl border flex items-center gap-4 ${
                isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'
              }`}
            >
              <div className={`p-4 rounded-xl ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-3xl font-bold">{stat.value}</p>
                <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className={`p-12 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${
            isDark ? 'bg-slate-900/20 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'
          }`}>
            <PlayCircle className={`w-12 h-12 mb-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} />
            <h3 className="text-2xl font-bold mb-4">No Courses Yet</h3>
            <p className={`max-w-md mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Start building your curriculum and launch your first course today!
            </p>
            <button
              onClick={() => setLocation('/instructor/courses/new')}
              className={`px-6 py-3 font-bold rounded-lg border-2 ${
                isDark ? 'border-teal-500 text-teal-400 hover:bg-teal-500/10' : 'border-teal-600 text-teal-600 hover:bg-teal-50'
              }`}
            >
              {t('instructor.createCourse')}
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-4">{t('instructor.recentActivity')}</h3>
            <div className="space-y-3">
              {courses.slice(0, 5).map((course) => (
                <div
                  key={course.id}
                  onClick={() => setLocation(`/instructor/courses/${course.id}/edit`)}
                  className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                    isDark ? 'bg-slate-900/40 border-teal-500/10 hover:border-teal-500/30' : 'bg-white border-teal-100 hover:border-teal-300'
                  }`}
                >
                  <div>
                    <h4 className="font-bold">{course.title}</h4>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {course.studentsCount} students · {course.category}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                    course.status === 'published' ? 'bg-green-500/10 text-green-500' :
                    course.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {course.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
