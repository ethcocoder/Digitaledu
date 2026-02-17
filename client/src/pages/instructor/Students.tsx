import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Users, TrendingUp } from 'lucide-react';
import { enrollmentService } from '@/lib/enrollmentService';
import { Enrollment } from '../../../../shared/types';

export default function InstructorStudents() {
  const { theme, t } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    enrollmentService.getInstructorEnrollments(user.uid).then(({ enrollments }) => {
      setEnrollments(enrollments);
      setLoading(false);
    });
  }, [user?.uid]);

  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <InstructorLayout title={t('instructor.students')}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <div className="p-4 rounded-xl bg-cyan-500/10"><Users className="w-6 h-6 text-cyan-500" /></div>
            <div>
              <p className="text-3xl font-bold">{loading ? '...' : enrollments.length}</p>
              <p className="text-xs font-medium uppercase text-gray-500">Total Enrollments</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <div className="p-4 rounded-xl bg-green-500/10"><TrendingUp className="w-6 h-6 text-green-500" /></div>
            <div>
              <p className="text-3xl font-bold">{loading ? '...' : `${avgProgress}%`}</p>
              <p className="text-xs font-medium uppercase text-gray-500">Avg. Progress</p>
            </div>
          </div>
        </div>

        {/* Desktop table */}
        <div className={`hidden md:block rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className={`uppercase text-xs font-bold ${isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Progress</th>
                  <th className="px-6 py-4">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading...</td></tr>
                ) : enrollments.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">No students enrolled yet.</td></tr>
                ) : (
                  enrollments.map((e) => (
                    <tr key={e.id} className={isDark ? 'hover:bg-white/5' : 'hover:bg-teal-50/50'}>
                      <td className="px-6 py-4 font-bold whitespace-nowrap">{e.studentName}</td>
                      <td className="px-6 py-4 min-w-0">{e.courseTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-20 lg:w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full" style={{ width: `${e.progress}%` }} />
                          </div>
                          <span className="text-xs font-bold">{e.progress}%</span>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-xs whitespace-nowrap ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(e.enrolledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No students enrolled yet.</div>
          ) : (
            enrollments.map((e) => (
              <div key={e.id} className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{e.studentName}</span>
                  <span className="text-xs font-bold text-teal-500">{e.progress}%</span>
                </div>
                <p className={`text-xs mb-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{e.courseTitle}</p>
                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${e.progress}%` }} />
                </div>
                <p className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Enrolled {new Date(e.enrolledAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}
