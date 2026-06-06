import { useEffect, useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Enrollment } from '../../../../shared/types';

export default function SuperadminFinancials() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      courseService.getAllCourses(),
      enrollmentService.getAllEnrollments(),
    ]).then(([{ courses }, { enrollments: allEnrollments }]) => {
      const revenue = courses.reduce((acc, c) => acc + c.price * c.studentsCount, 0);
      setTotalRevenue(revenue);
      setEnrollments(allEnrollments.slice(0, 20));
      setLoading(false);
    });
  }, []);

  return (
    <AdminLayout title="Financial Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Total Revenue', val: loading ? '...' : `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
            { title: 'Total Enrollments', val: loading ? '...' : String(enrollments.length), icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { title: 'Avg. per Enrollment', val: loading ? '...' : enrollments.length ? `$${(totalRevenue / enrollments.length).toFixed(2)}` : '$0', icon: CreditCard, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat, i) => (
            <div key={i} className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
              <div className={`p-3 rounded-xl ${stat.bg} w-fit mb-4`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <p className={`text-sm font-medium mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.title}</p>
              <h3 className="text-3xl font-bold">{stat.val}</h3>
            </div>
          ))}
        </div>

        <div className={`rounded-2xl border ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
          <div className="p-6 border-b border-cyan-400/10">
            <h3 className="font-bold text-lg">Recent Enrollments</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : enrollments.length === 0 ? (
            <div className="p-12 text-center">
              <CreditCard className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-300'}`} />
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>No enrollments yet.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`uppercase text-xs font-bold ${isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {enrollments.map((e) => (
                  <tr key={e.id} className={isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}>
                    <td className="px-6 py-4 font-bold">{e.studentName}</td>
                    <td className="px-6 py-4">{e.courseTitle}</td>
                    <td className={`px-6 py-4 text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(e.enrolledAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-bold text-green-500">{e.progress}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
