import { useEffect, useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Trophy, Star, Zap, Target, Flame, Brain } from 'lucide-react';
import { enrollmentService } from '@/lib/enrollmentService';
import { progressService } from '@/lib/progressService';
import { UserProgress, Badge } from '../../../../shared/types';

export default function StudentAchievements() {
  const { theme } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [stats, setStats] = useState({ enrolled: 0, completed: 0, inProgress: 0 });

  useEffect(() => {
    if (!user?.uid) return;
    const load = async () => {
      const [{ progress }, { enrollments }] = await Promise.all([
        progressService.getProgress(user.uid),
        enrollmentService.getStudentEnrollments(user.uid),
      ]);
      if (!progress) {
        await progressService.initProgress(user.uid);
      }
      setProgress(progress);
      setStats({
        enrolled: enrollments.length,
        completed: enrollments.filter((e) => e.progress >= 100).length,
        inProgress: enrollments.filter((e) => e.progress > 0 && e.progress < 100).length,
      });
    };
    load();
  }, [user?.uid]);

  const earnedIds = new Set(progress?.badges.map((b) => b.id) || []);
  const accuracy = progress && progress.totalQuizzesTaken > 0
    ? Math.round((progress.quizzesCorrect / progress.totalQuizzesTaken) * 100)
    : 0;

  return (
    <StudentLayout title="Achievements">
      <div className="space-y-8">
        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={Zap} label="Total XP" value={`${progress?.totalXP ?? 0}`} isDark={isDark} />
          <StatCard icon={Flame} label="Day Streak" value={`${progress?.streakCount ?? 0}`} isDark={isDark} />
          <StatCard icon={Brain} label="Quiz Accuracy" value={`${accuracy}%`} isDark={isDark} />
          <StatCard icon={Trophy} label="Badges" value={`${progress?.badges.length ?? 0}`} isDark={isDark} />
        </div>

        {/* Badges */}
        <div>
          <h2 className="text-xl font-bold mb-4">Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(progressService.getDefaultBadges() || []).map((badgeDef) => {
              const earned = progress?.badges.find((b) => b.id === badgeDef.id);
              return (
                <div
                  key={badgeDef.id}
                  className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                    earned
                      ? isDark
                        ? 'bg-yellow-500/5 border-yellow-500/30'
                        : 'bg-yellow-50 border-yellow-300'
                      : isDark
                        ? 'bg-slate-900/40 border-yellow-500/5 opacity-50'
                        : 'bg-white border-yellow-100 opacity-50'
                  }`}
                >
                  <span className="text-3xl">{badgeDef.icon}</span>
                  <div>
                    <h3 className="font-bold">{badgeDef.name.en}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{badgeDef.description.en}</p>
                    {earned ? (
                      <span className="text-xs font-bold text-green-500">
                        Unlocked {new Date(earned.earnedAt).toLocaleDateString()}
                      </span>
                    ) : (
                      <span className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>Locked</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Course stats */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'}`}>
          <h2 className="font-bold text-lg mb-4">Learning Overview</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-yellow-500">{stats.enrolled}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Enrolled</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-500">{stats.inProgress}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>In Progress</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{stats.completed}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Completed</p>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

function StatCard({ icon: Icon, label, value, isDark }: { icon: typeof Zap; label: string; value: string; isDark: boolean }) {
  return (
    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-yellow-500/10' : 'bg-white border-yellow-100'}`}>
      <Icon className={`w-5 h-5 mb-2 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`} />
      <p className="text-2xl font-bold">{value}</p>
      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
    </div>
  );
}
