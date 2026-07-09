import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlusCircle, BookOpen, Users, Star, Send, RefreshCw, MessageSquare } from 'lucide-react';
import { useLocation } from 'wouter';
import { courseService } from '@/lib/courseService';
import { Course } from '../../../../shared/types';
import { toast } from 'sonner';

export default function InstructorCourses() {
  const { theme, t } = useLanguage();
  const { user } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    if (!user?.uid) return;
    const { courses } = await courseService.getInstructorCourses(user.uid);
    setCourses(courses);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, [user?.uid]);

  const handleSubmitForReview = async (courseId: string) => {
    const { error } = await courseService.submitForReview(courseId);
    if (error) toast.error(error);
    else { toast.success('Submitted for admin review!'); fetchCourses(); }
  };

  const handleArchive = async (courseId: string) => {
    const { error } = await courseService.updateCourseStatus(courseId, 'archived');
    if (error) toast.error(error);
    else { toast.success('Course archived.'); fetchCourses(); }
  };

  const statusBadge = (course: Course) => {
    const status = course.status;
    const base = 'px-2 py-1 rounded-md text-xs font-bold uppercase';
    if (status === 'approved') return <span className={`${base} bg-green-500/10 text-green-500`}>Approved</span>;
    if (status === 'pending_review') return <span className={`${base} bg-blue-500/10 text-blue-500`}>Under Review</span>;
    if (status === 'rejected') return <span className={`${base} bg-red-500/10 text-red-500`}>Rejected</span>;
    if (status === 'draft') return <span className={`${base} bg-yellow-500/10 text-yellow-500`}>Draft</span>;
    if (status === 'archived') return <span className={`${base} bg-gray-500/10 text-gray-500`}>Archived</span>;
    return <span className={`${base} bg-gray-500/10 text-gray-500`}>{status}</span>;
  };

  const actionButtons = (course: Course) => {
    const btns: { label: string; onClick: () => void; className: string }[] = [];

    btns.push({
      label: 'Edit',
      onClick: () => setLocation(`/instructor/courses/${course.id}/edit`),
      className: `border ${isDark ? 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10' : 'border-teal-300 text-teal-600 hover:bg-teal-50'}`,
    });

    if (course.status === 'draft') {
      btns.push({
        label: 'Submit for Review',
        onClick: () => handleSubmitForReview(course.id),
        className: 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20',
      });
    }

    if (course.status === 'rejected') {
      btns.push({
        label: 'Resubmit',
        onClick: () => handleSubmitForReview(course.id),
        className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
      });
    }

    if (course.status === 'approved') {
      btns.push({
        label: 'Archive',
        onClick: () => handleArchive(course.id),
        className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20',
      });
    }

    return btns;
  };

  return (
    <InstructorLayout title={t('instructor.myCourses')}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            {courses.length} course{courses.length !== 1 ? 's' : ''} total
          </p>
          <button
            onClick={() => setLocation('/instructor/courses/new')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-5 h-5" />
            {t('instructor.createCourse')}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className={`p-12 rounded-3xl border border-dashed text-center ${isDark ? 'border-teal-500/20' : 'border-teal-200'}`}>
            <BookOpen className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-teal-300'}`} />
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No courses yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-xs font-bold text-teal-500 uppercase">{course.category}</span>
                    <h3 className="font-bold text-lg mt-1">{course.title}</h3>
                  </div>
                  {statusBadge(course)}
                </div>
                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{course.description}</p>

                {/* Review feedback */}
                {course.status === 'rejected' && course.review && (
                  <div className={`mb-4 p-3 rounded-lg border border-red-500/20 bg-red-500/5`}>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-bold text-red-400">
                          Review from {course.review.reviewerName}
                        </p>
                        <p className="text-sm mt-1">{course.review.comment}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentsCount}</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {course.rating || 'N/A'}</span>
                  <span className="font-bold text-teal-500">${course.price}</span>
                </div>
                <div className="flex gap-2">
                  {actionButtons(course).map((btn) => (
                    <button
                      key={btn.label}
                      onClick={btn.onClick}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold ${btn.className}`}
                    >
                      {btn.label === 'Submit for Review' && <Send className="w-4 h-4 inline mr-1" />}
                      {btn.label === 'Resubmit' && <RefreshCw className="w-4 h-4 inline mr-1" />}
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
