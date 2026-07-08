import { useEffect, useState } from 'react';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { DollarSign, TrendingUp, BookOpen, BarChart3, PieChart, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Course } from '../../../../shared/types';

export default function InstructorEarnings() {
  const { theme, t } = useLanguage();
  const { user } = useUser();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollmentCount, setEnrollmentCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    Promise.all([
      courseService.getInstructorCourses(user.uid),
      enrollmentService.getInstructorEnrollments(user.uid),
    ]).then(([{ courses }, { enrollments }]) => {
      setCourses(courses);
      setEnrollmentCount(enrollments.length);
      setLoading(false);
    });
  }, [user?.uid]);

  const totalRevenue = courses.reduce((acc, c) => acc + c.price * c.studentsCount, 0);
  const publishedCount = courses.filter((c) => c.status === 'published').length;

  return (
    <InstructorLayout title={t('instructor.earnings')}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Revenue', value: `$${totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Total Enrollments', value: String(enrollmentCount), icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-500/10' },
            { label: 'Published Courses', value: String(publishedCount), icon: BookOpen, color: 'text-purple-500', bg: 'bg-purple-500/10' },
          ].map((stat) => (
            <div key={stat.label} className={`p-6 rounded-2xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
              <div className={`p-4 rounded-xl ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div>
                <p className="text-3xl font-bold">{loading ? '...' : stat.value}</p>
                <p className="text-xs font-medium uppercase text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-teal-500" />
                Monthly Revenue
              </h3>
              <span className="text-xs font-bold text-green-500 flex items-center gap-1">
                <ArrowUpRight className="w-3 h-3" /> +12.5%
              </span>
            </div>
            <div className="h-48 flex items-end gap-2 px-2">
              {[40, 60, 45, 90, 65, 80, 100].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex-1 bg-gradient-to-t from-teal-500 to-emerald-400 rounded-t-sm"
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
            </div>
          </div>

          <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5 text-purple-500" />
              Category Distribution
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Technology', value: 45, color: 'bg-blue-500' },
                { label: 'Business', value: 30, color: 'bg-purple-500' },
                { label: 'Design', value: 25, color: 'bg-teal-500' },
              ].map((cat) => (
                <div key={cat.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>{cat.label}</span>
                    <span>{cat.value}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full ${cat.color}`} style={{ width: `${cat.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={`rounded-2xl border ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
          <div className="p-6 border-b border-teal-500/10">
            <h3 className="font-bold text-lg">Revenue by Course</h3>
          </div>
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : courses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No courses yet.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className={`uppercase text-xs font-bold ${isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
                <tr>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4 text-right">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-500/10">
                {courses.map((c) => (
                  <tr key={c.id} className={isDark ? 'hover:bg-white/5' : 'hover:bg-teal-50/50'}>
                    <td className="px-6 py-4 font-bold">{c.title}</td>
                    <td className="px-6 py-4">${c.price}</td>
                    <td className="px-6 py-4">{c.studentsCount}</td>
                    <td className="px-6 py-4 text-right font-bold text-green-500">${(c.price * c.studentsCount).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </InstructorLayout>
  );
}
