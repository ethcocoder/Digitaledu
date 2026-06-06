import { useEffect, useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Trophy, Star, Zap, Target } from 'lucide-react';
import { enrollmentService } from '@/lib/enrollmentService';

export default function StudentAchievements() {
  const { theme } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    if (!user?.uid) return;
    enrollmentService.getStudentEnrollments(user.uid).then(({ enrollments }) => {
      setStats({
        enrolled: enrollments.length,
        completed: enrollments.filter((e) => e.progress >= 100).length,
        inProgress: enrollments.filter((e) => e.progress > 0 && e.progress < 100).length,
      });
    });
  }, [user?.uid]);

  const badges = [
    { icon: Trophy, title: 'First Enrollment', earned: stats.enrolled >= 1, desc: 'Enroll in your first course' },
    { icon: Star, title: 'Course Completer', earned: stats.completed >= 1, desc: 'Complete a full course' },
    { icon: Zap, title: 'Fast Learner', earned: stats.inProgress >= 2, desc: 'Have 2+ courses in progress' },
    { icon: Target, title: 'Dedicated Student', earned: stats.completed >= 3, desc: 'Complete 3 courses' },
  ];

  return (
    <StudentLayout title="Achievements">
      <div className="space-y-8">
        <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
          Track your learning milestones and unlock badges as you progress.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className={`p-6 rounded-2xl border flex items-center gap-4 ${
                badge.earned
                  ? isDark
                    ? 'bg-yellow-500/5 border-yellow-500/30'
                    : 'bg-yellow-50 border-yellow-300'
                  : isDark
                  ? 'bg-slate-900/40 border-yellow-500/10 opacity-50'
                  : 'bg-white border-yellow-100 opacity-50'
              }`}
            >
              <div className={`p-4 rounded-xl ${badge.earned ? 'bg-yellow-500/20' : 'bg-gray-500/10'}`}>
                <badge.icon className={`w-8 h-8 ${badge.earned ? 'text-yellow-500' : 'text-gray-500'}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg">{badge.title}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{badge.desc}</p>
                {badge.earned && <span className="text-xs font-bold text-green-500">Unlocked</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </StudentLayout>
  );
}
