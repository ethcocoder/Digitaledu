import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { CheckCircle, ChevronLeft, PlayCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Course, CourseModule, Enrollment } from '../../../../shared/types';

export default function StudentLearning() {
  const [, params] = useRoute('/student/learn/:courseId');
  const [, setLocation] = useLocation();
  const { theme } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const courseId = params?.courseId || '';

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId || !user?.uid) return;

    const load = async () => {
      const [{ course }, { enrollment }] = await Promise.all([
        courseService.getCourseById(courseId),
        enrollmentService.getEnrollment(user.uid, courseId),
      ]);

      if (!course) {
        toast.error('Course not found');
        setLocation('/student/catalog');
        return;
      }
      if (!enrollment) {
        toast.error('You are not enrolled in this course');
        setLocation('/student/catalog');
        return;
      }

      setCourse(course);
      setEnrollment(enrollment);
      const modules = [...(course.modules || [])].sort((a, b) => a.order - b.order);
      const firstIncomplete = modules.find((m) => !enrollment.completedModules.includes(m.id));
      setActiveModule(firstIncomplete || modules[0] || null);
      setLoading(false);
    };

    load();
  }, [courseId, user?.uid, setLocation]);

  const modules = [...(course?.modules || [])].sort((a, b) => a.order - b.order);

  const markComplete = async (moduleId: string) => {
    if (!enrollment || !course) return;

    const completed = enrollment.completedModules.includes(moduleId)
      ? enrollment.completedModules
      : [...enrollment.completedModules, moduleId];

    const totalModules = modules.length || 1;
    const progress = Math.round((completed.length / totalModules) * 100);

    const { error } = await enrollmentService.updateProgress(enrollment.id, progress, completed);
    if (error) {
      toast.error(error);
      return;
    }

    const updated = { ...enrollment, completedModules: completed, progress };
    setEnrollment(updated);
    toast.success('Module completed!');

    const nextModule = modules.find((m) => !completed.includes(m.id));
    if (nextModule) setActiveModule(nextModule);
  };

  if (loading) {
    return (
      <StudentLayout title="Loading...">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title={course?.title || 'Learning'}>
      <div className="space-y-6">
        <button
          onClick={() => setLocation('/student')}
          className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-600'}`}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
              {activeModule?.videoUrl ? (
                <div className="aspect-video bg-black">
                  <iframe
                    src={activeModule.videoUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeModule.title}
                  />
                </div>
              ) : (
                <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center">
                  <PlayCircle className="w-20 h-20 text-white/40 mb-4" />
                  <p className="text-white/60">Select a module to begin</p>
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{activeModule?.title || 'No modules yet'}</h2>
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {course?.description}
                </p>
                {activeModule && (
                  <button
                    onClick={() => markComplete(activeModule.id)}
                    disabled={enrollment?.completedModules.includes(activeModule.id)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all ${
                      enrollment?.completedModules.includes(activeModule.id)
                        ? 'bg-green-500/10 text-green-500 cursor-default'
                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105'
                    }`}
                  >
                    {enrollment?.completedModules.includes(activeModule.id) ? (
                      <span className="flex items-center gap-2"><CheckCircle className="w-5 h-5" /> Completed</span>
                    ) : (
                      'Mark as Complete'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`rounded-2xl border p-6 ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Course Content</h3>
              <span className="text-sm font-bold text-yellow-500">{enrollment?.progress || 0}%</span>
            </div>
            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${enrollment?.progress || 0}%` }}
              />
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {modules.length === 0 ? (
                <p className={`text-sm ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No modules added yet.</p>
              ) : (
                modules.map((module, i) => {
                  const isComplete = enrollment?.completedModules.includes(module.id);
                  const isActive = activeModule?.id === module.id;
                  return (
                    <button
                      key={module.id}
                      onClick={() => setActiveModule(module)}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                        isActive
                          ? isDark
                            ? 'bg-yellow-500/10 border border-yellow-500/30'
                            : 'bg-yellow-50 border border-yellow-300'
                          : isDark
                          ? 'hover:bg-white/5'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                        isComplete ? 'bg-green-500/20 text-green-500' : isDark ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {isComplete ? <CheckCircle className="w-4 h-4" /> : i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{module.title}</p>
                        <p className={`text-xs flex items-center gap-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                          <Clock className="w-3 h-3" /> {module.durationMinutes} min
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
