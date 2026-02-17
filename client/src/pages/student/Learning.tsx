import { useEffect, useState, useMemo, useCallback } from 'react';
import { useRoute, useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  ChevronLeft, ChevronRight, CheckCircle, PlayCircle,
  BookOpen, Menu, Layout, X
} from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { progressService } from '@/lib/progressService';
import { Course, Enrollment, ContentBlock, Badge } from '../../../../shared/types';
import RichContentRenderer from '@/components/RichContentRenderer';
import BilingualToggle from '@/components/BilingualToggle';
import { getYoutubeEmbedUrl } from '@/lib/youtube';

interface Step {
  type: 'video' | 'block';
  moduleIndex: number;
  moduleId: string;
  moduleTitle: string;
  blockIndex?: number;
  block?: ContentBlock;
  videoUrl?: string;
}

export default function StudentLearning() {
  const [, params] = useRoute('/student/learn/:courseId');
  const [, setLocation] = useLocation();
  const { theme } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const courseId = params?.courseId || '';

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAmharic, setShowAmharic] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});
  const [recentBadges, setRecentBadges] = useState<Badge[]>([]);

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
      const firstIncompleteIdx = modules.findIndex((m) => !enrollment.completedModules.includes(m.id));
      const targetModIdx = firstIncompleteIdx >= 0 ? firstIncompleteIdx : 0;
      const steps = buildSteps(modules);
      const stepIdx = steps.findIndex((s) => s.moduleIndex === targetModIdx && s.type === 'video');
      setCurrentStep(stepIdx >= 0 ? stepIdx : 0);
      setLoading(false);
    };

    load();
  }, [courseId, user?.uid, setLocation]);

  const modules = useMemo(
    () => [...(course?.modules || [])].sort((a, b) => a.order - b.order),
    [course?.modules]
  );

  const steps = useMemo(() => buildSteps(modules), [modules]);

  const currentStepData = steps[currentStep];
  const totalSteps = steps.length;

  const completedCount = enrollment?.completedModules.length ?? 0;
  const progress = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;

  const navigateTo = useCallback((idx: number) => {
    setAnimDir(idx > currentStep ? 'right' : 'left');
    setCurrentStep(idx);
  }, [currentStep]);

  const markModuleComplete = useCallback(async (moduleId: string) => {
    if (!enrollment || !course) return;

    const completed = enrollment.completedModules.includes(moduleId)
      ? enrollment.completedModules
      : [...enrollment.completedModules, moduleId];

    const totalModules = modules.length || 1;
    const pct = Math.round((completed.length / totalModules) * 100);

    const { error } = await enrollmentService.updateProgress(enrollment.id, pct, completed);
    if (error) { toast.error(error); return; }

    setEnrollment({ ...enrollment, completedModules: completed, progress: pct });
    toast.success('Module completed!');
    if (user?.uid) {
      progressService.recordModuleComplete(user.uid).then(({ newBadges }) => {
        if (newBadges.length > 0) setRecentBadges((prev) => [...prev, ...newBadges]);
      });
    }
  }, [enrollment, course, modules, user?.uid]);

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) navigateTo(currentStep + 1);
  }, [currentStep, totalSteps, navigateTo]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) navigateTo(currentStep - 1);
  }, [currentStep, navigateTo]);

  const handleQuizComplete = useCallback((blockId: string, correct: boolean) => {
    setQuizResults((prev) => ({ ...prev, [blockId]: correct }));
    if (user?.uid) {
      progressService.recordQuiz(user.uid, correct).then(({ newBadges }) => {
        if (newBadges.length > 0) setRecentBadges((prev) => [...prev, ...newBadges]);
      });
    }
  }, [user?.uid]);

  const handleFinishModule = useCallback(async () => {
    if (!currentStepData) return;
    await markModuleComplete(currentStepData.moduleId);

    const nextModStart = steps.findIndex(
      (s, i) => i > currentStep && s.type === 'video'
    );
    if (nextModStart >= 0) navigateTo(nextModStart);
  }, [currentStepData, markModuleComplete, steps, currentStep, navigateTo]);

  useEffect(() => {
    if (recentBadges.length > 0) {
      const timer = setTimeout(() => setRecentBadges([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [recentBadges]);

  if (loading || !course || !enrollment) {
    return (
      <StudentLayout title="Loading...">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  if (totalSteps === 0) {
    return (
      <StudentLayout title={course.title}>
        <div className="text-center py-20">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No content in this course yet.</p>
        </div>
      </StudentLayout>
    );
  }

  const isModuleVideo = currentStepData?.type === 'video';
  const isModuleComplete = enrollment.completedModules.includes(currentStepData?.moduleId ?? '');

  return (
    <StudentLayout title={course.title}>
      {/* ── Top Bar ─────────────────────────────────────── */}
      <div className={`sticky top-0 z-30 -mx-4 lg:-mx-6 px-4 lg:px-6 py-2.5 lg:py-3 border-b backdrop-blur-xl ${
        isDark ? 'bg-slate-950/80 border-yellow-500/10' : 'bg-white/80 border-yellow-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 lg:gap-3 min-w-0">
            <button
              onClick={() => setLocation('/student')}
              className={`flex items-center gap-1 text-xs lg:text-sm font-medium shrink-0 ${
                isDark ? 'text-gray-400 hover:text-yellow-500' : 'text-gray-600 hover:text-yellow-600'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Dashboard</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold px-2 py-1 rounded bg-yellow-500/10 text-yellow-500">
              {progress}% complete
            </span>
            <BilingualToggle showAmharic={showAmharic} onToggle={() => setShowAmharic(!showAmharic)} isDark={isDark} />
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-2 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 lg:gap-8 mt-4 lg:mt-6">
        {/* ── Mobile sidebar toggle ─────────────────────── */}
        <button
          onClick={() => setSidebarOpen(true)}
          className={`lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold ${
            isDark ? 'bg-slate-900/40 border-yellow-500/10 text-yellow-500' : 'bg-white border-yellow-200 text-yellow-600'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Course Content
        </button>

        {/* ── Sidebar ──────────────────────────────────── */}
        <div className={`shrink-0 w-full lg:w-72 ${
          sidebarOpen
            ? 'fixed inset-0 z-50 p-4 lg:relative lg:inset-auto lg:p-0'
            : 'hidden lg:block'
        }`}>
          {sidebarOpen && (
            <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          )}
          <div className={`relative h-full lg:h-auto rounded-2xl border p-4 ${
            isDark ? 'bg-slate-900/90 border-yellow-500/10' : 'bg-white border-yellow-200'
          } ${sidebarOpen ? 'max-w-sm w-full z-50 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-yellow-500" />
                Course Content
              </h3>
              {sidebarOpen && (
                <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-gray-400">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="space-y-1 max-h-[50vh] lg:max-h-[60vh] overflow-y-auto">
              {modules.map((mod, mi) => {
                const modCompleted = enrollment.completedModules.includes(mod.id);
                const isActiveMod = currentStepData?.moduleIndex === mi;
                return (
                  <div key={mod.id}>
                    <button
                      onClick={() => {
                        const stepIdx = steps.findIndex((s) => s.moduleIndex === mi && s.type === 'video');
                        if (stepIdx >= 0) { navigateTo(stepIdx); setSidebarOpen(false); }
                      }}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs transition-all ${
                        isActiveMod
                          ? isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-700'
                          : isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-50 text-gray-600'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        modCompleted ? 'bg-green-500/20 text-green-500' : isDark ? 'bg-slate-800 text-gray-500' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {modCompleted ? <CheckCircle className="w-3 h-3" /> : mi + 1}
                      </div>
                      <span className="truncate flex-1">{mod.title}</span>
                    </button>
                    {isActiveMod && steps.filter((s) => s.moduleIndex === mi).map((s, si) => (
                      <button
                        key={`${mi}-${si}`}
                        onClick={() => { navigateTo(steps.indexOf(s)); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-2 pl-8 pr-2 py-1.5 rounded-lg text-left text-xs transition-all ${
                          steps.indexOf(s) === currentStep
                            ? isDark ? 'bg-yellow-500/10 text-yellow-500' : 'bg-yellow-50 text-yellow-700'
                            : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {s.type === 'video' ? 'Video' : s.block?.type ?? 'Content'}
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Main Content Area ─────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'
          }`}>
            {/* Step indicator */}
            <div className={`px-6 pt-4 pb-2 border-b ${isDark ? 'border-slate-800' : 'border-gray-100'}`}>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-bold ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>
                  Step {currentStep + 1} of {totalSteps}
                </span>
                <span className={isDark ? 'text-gray-600' : 'text-gray-300'}>|</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  Module {currentStepData ? currentStepData.moduleIndex + 1 : '-'}: {currentStepData?.moduleTitle ?? ''}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="relative overflow-hidden">
              <div
                key={currentStep}
                className={`transition-all duration-300 ${
                  animDir === 'right' ? 'animate-fade-in-up' : 'animate-fade-in-up'
                }`}
              >
                {isModuleVideo ? (
                  <div>
                    {currentStepData?.videoUrl ? (
                      <div className="aspect-video bg-black">
                        <iframe
                          src={getYoutubeEmbedUrl(currentStepData.videoUrl)}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={currentStepData.moduleTitle}
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-indigo-600 to-purple-700 flex flex-col items-center justify-center">
                        <PlayCircle className="w-20 h-20 text-white/40 mb-4" />
                        <p className="text-white/60">No video for this module</p>
                      </div>
                    )}
                    <div className={`p-6 flex items-center justify-between ${isDark ? 'bg-slate-900/60' : 'bg-gray-50'}`}>
                      <div>
                        <h2 className="text-lg font-bold">{currentStepData?.moduleTitle}</h2>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          Watch the video then proceed to the exercises.
                        </p>
                      </div>
                      {isModuleComplete ? (
                        <span className="flex items-center gap-1 text-sm font-bold text-green-500">
                          <CheckCircle className="w-4 h-4" /> Completed
                        </span>
                      ) : null}
                    </div>
                  </div>
                ) : currentStepData?.block ? (
                  <div className="p-6">
                    <RichContentRenderer
                      block={currentStepData.block}
                      showAmharic={showAmharic}
                      isDark={isDark}
                      onQuizComplete={(correct) => handleQuizComplete(currentStepData!.block!.id, correct)}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            {/* ── Navigation Footer ──────────────────────── */}
            <div className={`px-4 lg:px-6 py-3 lg:py-4 border-t flex items-center justify-between gap-2 ${
              isDark ? 'border-slate-800' : 'border-gray-100'
            }`}>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold transition-all ${
                  currentStep === 0
                    ? 'opacity-30 cursor-not-allowed'
                    : isDark
                      ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Previous</span>
              </button>

              <div className="flex gap-1 lg:gap-2">
                {isModuleVideo && !isModuleComplete && (
                  <button
                    onClick={() => markModuleComplete(currentStepData!.moduleId)}
                    className={`flex items-center gap-1 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold transition-all bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105`}
                  >
                    <CheckCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Mark Done</span>
                  </button>
                )}

                {currentStep === totalSteps - 1 && isModuleVideo ? (
                  <button
                    onClick={handleFinishModule}
                    className={`flex items-center gap-1 lg:gap-2 px-2.5 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-500 text-white hover:scale-105`}
                  >
                    <Layout className="w-3.5 h-3.5 lg:w-4 lg:h-4" /> <span className="hidden xs:inline">Finish</span>
                  </button>
                ) : null}
              </div>

              <button
                onClick={handleNext}
                disabled={currentStep >= totalSteps - 1}
                className={`flex items-center gap-1 lg:gap-2 px-3 lg:px-4 py-2 rounded-lg text-xs lg:text-sm font-bold transition-all ${
                  currentStep >= totalSteps - 1
                    ? 'opacity-30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105'
                }`}
              >
                <span className="hidden xs:inline">Next</span> <ChevronRight className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badge notifications */}
      {recentBadges.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 space-y-2">
          {recentBadges.map((badge) => (
            <div
              key={badge.id}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl animate-fade-in-up ${
                isDark ? 'bg-slate-900 border-yellow-500/30' : 'bg-white border-yellow-300'
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <div>
                <p className="text-sm font-bold">{badge.name.en}</p>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{badge.description.en}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </StudentLayout>
  );
}

function buildSteps(modules: Course['modules']): Step[] {
  const result: Step[] = [];
  modules.forEach((mod, mi) => {
    result.push({
      type: 'video',
      moduleIndex: mi,
      moduleId: mod.id,
      moduleTitle: mod.title,
      videoUrl: mod.videoUrl,
    });
    (mod.blocks || []).forEach((block, bi) => {
      result.push({
        type: 'block',
        moduleIndex: mi,
        moduleId: mod.id,
        moduleTitle: mod.title,
        blockIndex: bi,
        block,
      });
    });
  });
  return result;
}
