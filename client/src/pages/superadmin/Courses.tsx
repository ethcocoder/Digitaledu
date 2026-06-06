import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, PlayCircle, Clock, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { Course } from '../../../../shared/types';

export default function SuperadminCourses() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    const { courses, error } = await courseService.getAllCourses();
    if (!error) setCourses(courses);
    setLoading(false);
  };

  useEffect(() => { fetchCourses(); }, []);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const drafts = courses.filter((c) => c.status === 'draft').length;
  const published = courses.filter((c) => c.status === 'published').length;
  const avgRating = courses.filter((c) => c.rating > 0).length
    ? (courses.reduce((acc, c) => acc + c.rating, 0) / courses.filter((c) => c.rating > 0).length).toFixed(1)
    : 'N/A';

  const handleStatusChange = async (courseId: string, status: 'published' | 'archived' | 'draft') => {
    const { error } = await courseService.updateCourseStatus(courseId, status);
    if (error) toast.error(error);
    else { toast.success(`Course ${status}`); fetchCourses(); }
  };

  return (
    <AdminLayout title="Course Lifecycle Management">
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Courses', value: loading ? '...' : String(courses.length), icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Drafts', value: loading ? '...' : String(drafts), icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'Published', value: loading ? '...' : String(published), icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Avg. Rating', value: loading ? '...' : avgRating, icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
              <div className={`p-3 rounded-lg ${stat.bg}`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`p-4 md:p-6 rounded-2xl border flex flex-col md:flex-row gap-4 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className={`relative flex items-center px-4 py-2 rounded-lg border flex-1 ${isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'}`}>
            <Search className="w-4 h-4 text-gray-500 mr-2" />
            <input type="text" placeholder="Search courses..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-transparent border-none outline-none text-sm w-full" />
          </div>
          <div className={`relative flex items-center px-4 py-2 rounded-lg border ${isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'}`}>
            <Filter className="w-4 h-4 text-gray-500 mr-2" />
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="bg-transparent border-none outline-none text-sm cursor-pointer">
              <option value="all">All Categories</option>
              <option value="Kids">Kids</option>
              <option value="School">School</option>
              <option value="University">University</option>
              <option value="Professional">Professional</option>
              <option value="Technology">Technology</option>
            </select>
          </div>
        </div>

        <div className={`rounded-2xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'}`}>
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className={`uppercase text-xs font-bold ${isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'}`}>
              <tr>
                <th className="px-6 py-4">Course Info</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500/10">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading courses...</td></tr>
              ) : (
                filteredCourses.map((course, index) => (
                  <motion.tr key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
                    className={isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}>
                    <td className="px-6 py-4">
                      <div className="font-bold">{course.title}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>By {course.instructorName}</div>
                    </td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>{course.category}</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        course.status === 'published' ? 'bg-green-500/10 text-green-500' :
                        course.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>{course.status}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">{course.studentsCount}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{course.rating > 0 ? course.rating : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {course.status !== 'published' && (
                        <button onClick={() => handleStatusChange(course.id, 'published')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-green-500/10 text-green-500">Publish</button>
                      )}
                      {course.status === 'published' && (
                        <button onClick={() => handleStatusChange(course.id, 'archived')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-500/10 text-gray-500">Archive</button>
                      )}
                      {course.status === 'archived' && (
                        <button onClick={() => handleStatusChange(course.id, 'draft')} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-yellow-500/10 text-yellow-500">Restore</button>
                      )}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
          {!loading && filteredCourses.length === 0 && (
            <div className="p-8 text-center text-gray-500">No courses found.</div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
