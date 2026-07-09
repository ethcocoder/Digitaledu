import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight, MessageSquare, BookOpen, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { Course } from '../../../../shared/types';

interface Props {
  layout: React.ComponentType<{ title: string; children: React.ReactNode }>;
}

export default function AdminCourseReview({ layout: Layout }: Props) {
  const { theme } = useLanguage();
  const { user, profile } = useUser();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Course | null>(null);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);
  const [actionTab, setActionTab] = useState<'pending' | 'history'>('pending');

  const fetchPending = async () => {
    const { courses } = await courseService.getPendingCourses();
    setCourses(courses);
    setLoading(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const handleReview = async (courseId: string, decision: 'approved' | 'rejected') => {
    if (!user?.uid || !profile) return;
    setProcessing(courseId);
    const { error } = await courseService.reviewCourse(
      courseId, decision, profile.fullName, comment, user.uid
    );
    setProcessing(null);
    if (error) { toast.error(error); return; }
    toast.success(`Course ${decision === 'approved' ? 'approved' : 'rejected'}!`);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    setSelected(null);
    setComment('');
  };

  if (loading) {
    return (
      <Layout title="Course Review">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  const renderCourseDetail = (course: Course) => (
    <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <span className="text-xs font-bold text-yellow-500 uppercase">{course.category}</span>
          <h2 className="text-2xl font-bold mt-1">{course.title}</h2>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>by {course.instructorName}</p>
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-500`}>
          Pending Review
        </span>
      </div>
      <p className={`mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{course.description}</p>

      <div className="flex gap-4 text-sm mb-4">
        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="w-4 h-4" /> {course.modules?.length || 0} modules
        </span>
        <span className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          <Clock className="w-4 h-4" /> {course.modules?.reduce((s, m) => s + (m.durationMinutes || 0), 0) || 0} min
        </span>
        <span className="font-bold text-yellow-500">${course.price}</span>
      </div>

      {/* Modules preview */}
      <div className="space-y-2 mb-4">
        <p className="text-sm font-bold">Modules:</p>
        {(course.modules || []).map((mod, i) => (
          <div key={mod.id} className={`p-3 rounded-lg border text-sm ${isDark ? 'border-slate-700 bg-slate-800/40' : 'border-gray-200 bg-gray-50'}`}>
            <p className="font-medium">Module {i + 1}: {mod.title}</p>
            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {mod.blocks?.length || 0} blocks &middot; {mod.durationMinutes} min
            </p>
          </div>
        ))}
      </div>

      {course.review && (
        <div className={`mb-4 p-4 rounded-lg border ${
          course.review.decision === 'approved'
            ? 'border-green-500/20 bg-green-500/5'
            : 'border-red-500/20 bg-red-500/5'
        }`}>
          <div className="flex items-start gap-2">
            <MessageSquare className={`w-4 h-4 mt-0.5 shrink-0 ${
              course.review.decision === 'approved' ? 'text-green-400' : 'text-red-400'
            }`} />
            <div>
              <p className={`text-xs font-bold ${course.review.decision === 'approved' ? 'text-green-400' : 'text-red-400'}`}>
                Previous review by {course.review.reviewerName}
              </p>
              <p className="text-sm mt-1">{course.review.comment}</p>
            </div>
          </div>
        </div>
      )}

      {/* Review form */}
      <div className="space-y-3">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add feedback for the instructor (optional for approval, recommended for rejection)..."
          rows={3}
          className={`w-full px-4 py-3 rounded-xl border outline-none resize-none text-sm ${
            isDark ? 'bg-slate-950 border-yellow-500/20' : 'bg-gray-50 border-yellow-200'
          }`}
        />
        <div className="flex gap-3">
          <button
            onClick={() => handleReview(course.id, 'approved')}
            disabled={processing === course.id}
            className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <CheckCircle className="w-5 h-5" /> {processing === course.id ? 'Processing...' : 'Approve'}
          </button>
          <button
            onClick={() => handleReview(course.id, 'rejected')}
            disabled={processing === course.id}
            className="flex-1 py-3 bg-gradient-to-r from-red-400 to-rose-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:scale-105 transition-all"
          >
            <XCircle className="w-5 h-5" /> {processing === course.id ? 'Processing...' : 'Reject'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderCourseCard = (course: Course) => (
    <button
      key={course.id}
      onClick={() => { setSelected(course); setComment(''); }}
      className={`w-full text-left p-4 rounded-xl border transition-all ${
        selected?.id === course.id
          ? 'border-yellow-500 bg-yellow-500/5'
          : isDark
            ? 'border-slate-700 hover:border-slate-600 bg-slate-900/40'
            : 'border-gray-200 hover:border-gray-300 bg-white'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm">{course.title}</h3>
        <span className="text-xs font-bold text-yellow-500">${course.price}</span>
      </div>
      <p className={`text-xs line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{course.description}</p>
      <div className="flex gap-3 mt-2 text-xs text-gray-500">
        <span>{course.instructorName}</span>
        <span>{course.modules?.length || 0} modules</span>
      </div>
    </button>
  );

  return (
    <Layout title="Course Review">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActionTab('pending')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                actionTab === 'pending'
                  ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              Pending ({courses.length})
            </button>
            <button
              onClick={() => setActionTab('history')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                actionTab === 'history'
                  ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
                  : isDark ? 'text-gray-500' : 'text-gray-400'
              }`}
            >
              History
            </button>
          </div>

          {actionTab === 'pending' && (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto">
              {courses.length === 0 ? (
                <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'}`}>
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm font-bold">All caught up!</p>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No courses pending review.</p>
                </div>
              ) : (
                courses.map(renderCourseCard)
              )}
            </div>
          )}

          {actionTab === 'history' && (
            <div className={`p-8 text-center rounded-xl border border-dashed ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'}`}>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Review history coming soon.
              </p>
            </div>
          )}
        </div>

        {/* Detail pane */}
        <div className="flex-1 min-w-0">
          {selected ? renderCourseDetail(selected) : (
            <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-yellow-500/20' : 'border-yellow-200'}`}>
              <BookOpen className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>Select a course to review</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
