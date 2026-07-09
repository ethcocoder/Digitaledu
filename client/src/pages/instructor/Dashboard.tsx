import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlayCircle, Users, BookOpen, FileEdit, ClipboardCheck, Clock, MessageSquare, PlusCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Course } from '../../../../shared/types';

function StatSkeleton() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  return (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-xl animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
        <div className="space-y-2">
          <div className={`w-16 h-8 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
          <div className={`w-24 h-3 rounded animate-pulse ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  return (
    <div className={`p-4 rounded-xl border animate-pulse ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
      <div className="flex items-center justify-between">
        <div className="space-y-2 flex-1">
          <div className={`w-48 h-5 rounded ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
          <div className={`w-32 h-4 rounded ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
        </div>
        <div className={`w-20 h-6 rounded ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`} />
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';

  const config: Record<string, { label: string; style: string }> = {
    draft: {
      label: 'Draft',
      style: isDark ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-yellow-50 text-yellow-600 border-yellow-200',
    },
    pending_review: {
      label: 'Under Review',
      style: isDark ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-200',
    },
    approved: {
      label: 'Approved',
      style: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200',
    },
    rejected: {
      label: 'Rejected',
      style: isDark ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-200',
    },
    published: {
      label: 'Published',
      style: isDark ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-green-50 text-green-600 border-green-200',
    },
  };

  const c = config[status] || { label: status, style: '' };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase border ${c.style}`}>
      {c.label}
    </span>
  );
}

export default function InstructorDashboard() {
  const { theme, t } = useLanguage();
  const { profile, user } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
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
      setLoading(false);
    };
    load();
  }, [user?.uid]);

  const publishedCourses = courses.filter((c) => c.status === 'approved');
  const draftCourses = courses.filter((c) => c.status === 'draft');
  const pendingReviewCourses = courses.filter((c) => c.status === 'pending_review');
  const rejectedCourses = courses.filter((c) => c.status === 'rejected');

  return (
    <InstructorLayout title={t('instructor.title')}>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 rounded-3xl border relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-6 ${
            isDark ? 'bg-slate-900/40 border-teal-500/20' : 'bg-white border-teal-200'
          }`}
        >
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Welcome back, {profile?.fullName?.split(' ')[0] || 'Instructor'}!</h2>
            <p className={`max-w-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('instructor.welcomeBack')}
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
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              {[
                { label: t('instructor.activeCourses'), value: String(publishedCourses.length), icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
                { label: t('instructor.draftCourses'), value: String(draftCourses.length), icon: FileEdit, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
                { label: t('instructor.pendingReviews'), value: String(pendingReviewCourses.length), icon: ClipboardCheck, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: t('instructor.totalStudents'), value: String(totalStudents), icon: Users, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 md:p-6 rounded-2xl border flex items-center gap-3 md:gap-4 ${
                    isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'
                  }`}
                >
                  <div className={`p-3 md:p-4 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl md:text-3xl font-bold truncate">{stat.value}</p>
                    <p className={`text-[10px] md:text-xs font-medium uppercase tracking-wider text-gray-500`}>{stat.label}</p>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>

        {/* Course Activity */}
        {loading ? (
          <div className="space-y-3">
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </div>
        ) : courses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-12 rounded-3xl border border-dashed flex flex-col items-center justify-center text-center ${
              isDark ? 'bg-slate-900/20 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'
            }`}
          >
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
          </motion.div>
        ) : (
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5 text-teal-500" />
              {t('instructor.recentActivity')}
            </h3>
            <div className="space-y-3">
              {courses.slice(0, 6).map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLocation(`/instructor/courses/${course.id}/edit`)}
                  className={`p-4 md:p-5 rounded-xl border cursor-pointer transition-all ${
                    isDark ? 'bg-slate-900/40 border-teal-500/10 hover:border-teal-500/30' : 'bg-white border-teal-100 hover:border-teal-300'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <StatusBadge status={course.status} />
                        <h4 className="font-bold truncate">{course.title}</h4>
                      </div>
                      <p className={`text-xs md:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {course.studentsCount} student{course.studentsCount !== 1 ? 's' : ''} &middot; {course.category}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 shrink-0">
                      <span>{course.modules?.length || 0} modules</span>
                      <span>${course.price}</span>
                    </div>
                  </div>

                  {/* Review feedback */}
                  {course.review && (
                    <div className={`mt-3 pt-3 border-t flex items-start gap-2 text-xs ${
                      isDark ? 'border-teal-500/10' : 'border-teal-100'
                    }`}>
                      <MessageSquare className="w-3.5 h-3.5 mt-0.5 shrink-0 text-gray-500" />
                      <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                        <span className="font-bold">{course.review.reviewerName}</span>:
                        {' "'}{course.review.comment}{'"'}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}

              {courses.length > 6 && (
                <button
                  onClick={() => setLocation('/instructor/courses')}
                  className={`w-full py-3 rounded-xl text-xs font-bold border border-dashed transition-colors ${
                    isDark ? 'border-teal-500/20 text-teal-500/60 hover:bg-teal-500/5' : 'border-teal-200 text-teal-600/60 hover:bg-teal-50'
                  }`}
                >
                  View All Courses ({courses.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Rejected Alert */}
        {rejectedCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border flex items-center gap-4 ${
              isDark ? 'bg-red-950/20 border-red-500/20' : 'bg-red-50/50 border-red-200'
            }`}
          >
            <div className="p-3 rounded-xl bg-red-500/10">
              <MessageSquare className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">
                {rejectedCourses.length} course{rejectedCourses.length > 1 ? 's' : ''} need{rejectedCourses.length === 1 ? 's' : ''} attention
              </p>
              <p className="text-xs text-gray-500">Review feedback and resubmit for approval.</p>
            </div>
            <button
              onClick={() => setLocation('/instructor/courses')}
              className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors"
            >
              View Feedback
            </button>
          </motion.div>
        )}
      </div>
    </InstructorLayout>
  );
}
