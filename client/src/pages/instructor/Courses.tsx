import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { PlusCircle, BookOpen, Users, Star } from 'lucide-react';
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

  const handlePublish = async (courseId: string) => {
    const { error } = await courseService.updateCourseStatus(courseId, 'published');
    if (error) toast.error(error);
    else { toast.success('Course published!'); fetchCourses(); }
  };

  const handleArchive = async (courseId: string) => {
    const { error } = await courseService.updateCourseStatus(courseId, 'archived');
    if (error) toast.error(error);
    else { toast.success('Course archived.'); fetchCourses(); }
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
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                    course.status === 'published' ? 'bg-green-500/10 text-green-500' :
                    course.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>{course.status}</span>
                </div>
                <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{course.description}</p>
                <div className="flex items-center gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {course.studentsCount}</span>
                  <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500" /> {course.rating || 'N/A'}</span>
                  <span className="font-bold text-teal-500">${course.price}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLocation(`/instructor/courses/${course.id}/edit`)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border ${isDark ? 'border-teal-500/30 text-teal-400 hover:bg-teal-500/10' : 'border-teal-300 text-teal-600 hover:bg-teal-50'}`}
                  >
                    Edit
                  </button>
                  {course.status === 'draft' && (
                    <button onClick={() => handlePublish(course.id)} className="flex-1 py-2 rounded-lg text-sm font-bold bg-green-500/10 text-green-500 hover:bg-green-500/20">
                      Publish
                    </button>
                  )}
                  {course.status === 'published' && (
                    <button onClick={() => handleArchive(course.id)} className="flex-1 py-2 rounded-lg text-sm font-bold bg-gray-500/10 text-gray-500 hover:bg-gray-500/20">
                      Archive
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
