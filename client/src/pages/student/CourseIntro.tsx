import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { ChevronLeft, ChevronRight, Target, GraduationCap, Zap, Briefcase, School, Plane } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { BilingualText } from '@/components/BilingualToggle';
import {
  Course, LearningGoal, Difficulty, PlacementQuestion,
  QuizOption, AssessmentResult
} from '../../../../shared/types';

const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'pq_1',
    question: { en: 'How would you rate your current knowledge of this subject?', am: 'በዚህ ርዕሰ ጉዳይ ላይ ያለዎትን የአሁኑን እውቀት እንዴት ይገመግማሉ?' },
    options: [
      { id: 'pq1_a', content: { en: 'I\'m a complete beginner', am: 'ሙሉ ጀማሪ ነኝ' }, isCorrect: false },
      { id: 'pq1_b', content: { en: 'I know some basics', am: 'መሰረታዊ ነገሮችን አውቃለሁ' }, isCorrect: false },
      { id: 'pq1_c', content: { en: 'I\'m fairly comfortable', am: 'በቂ እውቀት አለኝ' }, isCorrect: false },
      { id: 'pq1_d', content: { en: 'I\'m advanced in this area', am: 'በዚህ ዘርፍ የላቀ ነኝ' }, isCorrect: false },
    ],
    difficulty: 'beginner',
  },
  {
    id: 'pq_2',
    question: { en: 'How often do you practice or study?', am: 'ምን ያህል ጊዜ ያጠናሉ ወይም ይለማመዳሉ?' },
    options: [
      { id: 'pq2_a', content: { en: 'Rarely', am: 'አልፎ አልፎ' }, isCorrect: false },
      { id: 'pq2_b', content: { en: 'Once a week', am: 'በሳምንት አንድ ጊዜ' }, isCorrect: false },
      { id: 'pq2_c', content: { en: 'A few times a week', am: 'በሳምንት ጥቂት ጊዜ' }, isCorrect: false },
      { id: 'pq2_d', content: { en: 'Daily', am: 'በየቀኑ' }, isCorrect: false },
    ],
    difficulty: 'beginner',
  },
  {
    id: 'pq_3',
    question: { en: 'What is your primary learning style?', am: 'ዋና የመማሪያ ዘይቤዎ ምንድን ነው?' },
    options: [
      { id: 'pq3_a', content: { en: 'Watching and listening', am: 'መመልከት እና ማዳመጥ' }, isCorrect: false },
      { id: 'pq3_b', content: { en: 'Reading and writing', am: 'ማንበብ እና መጻፍ' }, isCorrect: false },
      { id: 'pq3_c', content: { en: 'Hands-on practice', am: 'በተግባር መለማመድ' }, isCorrect: false },
      { id: 'pq3_d', content: { en: 'Group discussion', am: 'በቡድን ውይይት' }, isCorrect: false },
    ],
    difficulty: 'beginner',
  },
];

const GOALS: { value: LearningGoal; icon: typeof Target; labelEn: string; labelAm: string; descEn: string; descAm: string }[] = [
  { value: 'travel', icon: Plane, labelEn: 'Travel', labelAm: 'ጉዞ', descEn: 'Learn for travel and daily conversations', descAm: 'ለጉዞ እና ለዕለታዊ ውይይቶች ይማሩ' },
  { value: 'work', icon: Briefcase, labelEn: 'Work / Career', labelAm: 'ሥራ / ሙያ', descEn: 'Advance your professional skills', descAm: 'ሙያዊ ክህሎቶችዎን ያሳድጉ' },
  { value: 'school', icon: School, labelEn: 'School / Academic', labelAm: 'ትምህርት ቤት', descEn: 'Support your academic studies', descAm: 'የትምህርት ጥናቶችዎን ይደግፉ' },
];

export default function StudentCourseIntro() {
  const [, params] = useRoute('/student/course-intro/:courseId');
  const [, setLocation] = useLocation();
  const { theme, t } = useLanguage();
  const { user, profile } = useUser();
  const isDark = theme === 'dark';
  const courseId = params?.courseId || '';

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'welcome' | 'assessment' | 'goal' | 'complete'>('welcome');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedGoal, setSelectedGoal] = useState<LearningGoal | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId || !user?.uid) return;
    courseService.getCourseById(courseId).then(({ course }) => {
      if (!course) { toast.error('Course not found'); setLocation('/student/catalog'); return; }
      setCourse(course);
      setLoading(false);
    });
  }, [courseId, user?.uid, setLocation]);

  const handleAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    if (currentQuestion < PLACEMENT_QUESTIONS.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const calculateLevel = (): Difficulty => {
    const answered = Object.keys(answers).length;
    if (answered <= 1) return 'beginner';
    return 'intermediate';
  };

  const handleAssessmentComplete = () => {
    if (Object.keys(answers).length < PLACEMENT_QUESTIONS.length) {
      toast.error('Please answer all questions');
      return;
    }
    setStep('goal');
  };

  const handleFinish = async () => {
    if (!user?.uid || !course || !selectedGoal) return;
    setSaving(true);

    const { enrollment } = await enrollmentService.getEnrollment(user.uid, courseId);
    if (enrollment) {
      const result: AssessmentResult = {
        level: calculateLevel(),
        score: Math.round((Object.keys(answers).length / PLACEMENT_QUESTIONS.length) * 100),
        completedAt: Date.now(),
      };
      const { error } = await enrollmentService.updateEnrollment(enrollment.id, {
        assessmentResults: result,
        goal: selectedGoal,
      });
      if (error) { toast.error(error); setSaving(false); return; }
    }

    setSaving(false);
    setStep('complete');
  };

  if (loading || !course) {
    return (
      <StudentLayout title="Loading...">
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout title={`Getting Started: ${course.title}`}>
      <div className="max-w-2xl mx-auto">
        {/* Progress steps */}
        <div className="flex gap-2 mb-8">
          {['Welcome', 'Assessment', 'Goal', 'Ready'].map((label, i) => {
            const states = ['welcome', 'assessment', 'goal', 'complete'];
            const currentIdx = states.indexOf(step);
            const isActive = i <= currentIdx;
            return (
              <div key={label} className="flex-1">
                <div className={`h-1.5 rounded-full transition-all ${isActive ? 'bg-yellow-500' : isDark ? 'bg-slate-800' : 'bg-gray-200'}`} />
                <p className={`text-xs font-bold mt-1 ${isActive ? 'text-yellow-500' : isDark ? 'text-gray-600' : 'text-gray-400'}`}>{label}</p>
              </div>
            );
          })}
        </div>

        {step === 'welcome' && (
          <div className={`p-8 rounded-2xl border text-center space-y-6 ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
            <GraduationCap className="w-16 h-16 mx-auto text-yellow-500" />
            <h2 className="text-2xl font-bold">Welcome to {course.title}</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Before you begin, we'll help set you up for success. Take a quick assessment and tell us your goals so we can personalize your learning experience.
            </p>
            <div className="flex justify-center gap-4 text-sm">
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <p className="font-bold">{course.modules?.length || 0} Modules</p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-slate-800' : 'bg-gray-100'}`}>
                <p className="font-bold">~2 min assessment</p>
              </div>
            </div>
            <button
              onClick={() => setStep('assessment')}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              Start Assessment
            </button>
          </div>
        )}

        {step === 'assessment' && (
          <div className={`p-8 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-bold">Level Assessment</h3>
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Question {currentQuestion + 1} of {PLACEMENT_QUESTIONS.length}
              </span>
            </div>

            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full transition-all"
                style={{ width: `${((currentQuestion + 1) / PLACEMENT_QUESTIONS.length) * 100}%` }}
              />
            </div>

            <div className="space-y-4">
              <p className="font-bold text-lg">
                {PLACEMENT_QUESTIONS[currentQuestion].question.en}
              </p>
              <p className={`text-sm ${isDark ? 'text-yellow-400/70' : 'text-yellow-700'}`}>
                {PLACEMENT_QUESTIONS[currentQuestion].question.am}
              </p>

              <div className="space-y-2">
                {PLACEMENT_QUESTIONS[currentQuestion].options.map((opt) => {
                  const isSelected = answers[PLACEMENT_QUESTIONS[currentQuestion].id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleAnswer(PLACEMENT_QUESTIONS[currentQuestion].id, opt.id)}
                      className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all ${
                        isSelected
                          ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500'
                          : isDark
                            ? 'border-slate-700 text-gray-300 hover:border-slate-600'
                            : 'border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {opt.content.en}
                      <span className={`block text-xs mt-0.5 ${isDark ? 'text-yellow-400/50' : 'text-yellow-600'}`}>
                        {opt.content.am}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {currentQuestion === PLACEMENT_QUESTIONS.length - 1 && (
              <button
                onClick={handleAssessmentComplete}
                className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
              >
                Continue
              </button>
            )}
          </div>
        )}

        {step === 'goal' && (
          <div className={`p-8 rounded-2xl border space-y-6 ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
            <h3 className="font-bold text-lg">What's your goal?</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Select your primary motivation for taking this course. This helps us tailor your learning path.
            </p>

            <div className="space-y-3">
              {GOALS.map((g) => {
                const isSelected = selectedGoal === g.value;
                const Icon = g.icon;
                return (
                  <button
                    key={g.value}
                    onClick={() => setSelectedGoal(g.value)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : isDark
                          ? 'border-slate-700 hover:border-slate-600'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-yellow-500/20 text-yellow-500' : isDark ? 'bg-slate-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold">{g.labelEn} — {g.labelAm}</p>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{g.descEn}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleFinish}
              disabled={!selectedGoal || saving}
              className={`w-full py-3 rounded-xl font-bold transition-all ${
                selectedGoal && !saving
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:scale-105'
                  : isDark ? 'bg-slate-800 text-gray-500 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {saving ? 'Setting up...' : 'Start Learning'}
            </button>
          </div>
        )}

        {step === 'complete' && (
          <div className={`p-8 rounded-2xl border text-center space-y-6 ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-200'}`}>
            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto">
              <Zap className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold">You're all set!</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Your learning path has been personalized. Ready to begin your journey?
            </p>
            <button
              onClick={() => setLocation(`/student/learn/${courseId}`)}
              className="px-8 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
            >
              <span className="flex items-center gap-2 justify-center">
                Start Learning Now <ChevronRight className="w-5 h-5" />
              </span>
            </button>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
