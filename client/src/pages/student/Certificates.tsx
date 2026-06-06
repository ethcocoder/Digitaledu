import { useEffect, useState } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Award, Download } from 'lucide-react';
import { enrollmentService } from '@/lib/enrollmentService';
import { Enrollment } from '../../../../shared/types';

export default function StudentCertificates() {
  const { theme } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const [completed, setCompleted] = useState<Enrollment[]>([]);

  useEffect(() => {
    if (!user?.uid) return;
    enrollmentService.getStudentEnrollments(user.uid).then(({ enrollments }) => {
      setCompleted(enrollments.filter((e) => e.progress >= 100));
    });
  }, [user?.uid]);

  return (
    <StudentLayout title="Certificates">
      <div className="space-y-8">
        {completed.length === 0 ? (
          <div className={`p-12 rounded-3xl border border-dashed text-center ${
            isDark ? 'border-yellow-500/20' : 'border-yellow-200'
          }`}>
            <Award className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className="text-xl font-bold mb-2">No certificates yet</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
              Complete a course to earn your first certificate.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {completed.map((enrollment) => (
              <div
                key={enrollment.id}
                className={`p-6 rounded-2xl border ${
                  isDark ? 'bg-slate-900/40 border-yellow-500/20' : 'bg-white border-yellow-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Award className="w-10 h-10 text-yellow-500 mb-3" />
                    <h3 className="font-bold text-lg">{enrollment.courseTitle}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Completed {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button className={`p-2 rounded-lg ${isDark ? 'hover:bg-white/10 text-yellow-500' : 'hover:bg-yellow-50 text-yellow-600'}`}>
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
