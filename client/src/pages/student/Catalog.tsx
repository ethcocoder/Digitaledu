import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Search, Filter, Star, Clock, Users, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { enrollmentService } from '@/lib/enrollmentService';
import { Course } from '../../../../shared/types';

const CATEGORIES = ['all', 'Kids', 'School', 'University', 'Professional', 'Technology', 'Business', 'Design'];

export default function StudentCatalog() {
  const { theme } = useLanguage();
  const { user, profile } = useUser();
  const [, setLocation] = useLocation();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      const { courses } = await courseService.getPublishedCourses();
      setCourses(courses);

      if (user?.uid) {
        const { enrollments } = await enrollmentService.getStudentEnrollments(user.uid);
        setEnrolledIds(new Set(enrollments.map((e) => e.courseId)));
      }
      setLoading(false);
    };
    fetchData();
  }, [user?.uid]);

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEnroll = async (course: Course) => {
    if (!user?.uid || !profile) return;
    if (enrolledIds.has(course.id)) {
      setLocation(`/student/learn/${course.id}`);
      return;
    }

    setEnrolling(course.id);
    const { enrollmentId, error } = await enrollmentService.enrollStudent(
      user.uid,
      profile.fullName,
      course.id
    );
    setEnrolling(null);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(`Enrolled in ${course.title}!`);
    setEnrolledIds((prev) => new Set([...Array.from(prev), course.id]));
    setLocation(`/student/course-intro/${course.id}`);
  };

  const getDuration = (course: Course) => {
    const minutes = course.modules?.reduce((sum, m) => sum + m.durationMinutes, 0) || 0;
    if (minutes === 0) return 'Self-paced';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <StudentLayout title="Course Catalog">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search for courses, skills, or instructors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl outline-none transition-all ${
                isDark
                  ? 'bg-slate-900/50 border border-yellow-500/20 focus:border-yellow-500'
                  : 'bg-white border border-yellow-200 focus:border-yellow-400'
              }`}
            />
          </div>
          <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border ${
            isDark ? 'bg-slate-900/50 border-yellow-500/20' : 'bg-white border-yellow-200'
          }`}>
            <Filter className="w-4 h-4 text-yellow-500" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                key={course.id}
                className={`flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30' : 'bg-white border-yellow-100 hover:border-yellow-300'
                }`}
              >
                <div className="h-48 bg-gradient-to-br from-indigo-500 to-purple-600 relative group">
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <PlayCircle className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/50 backdrop-blur-md text-white text-xs font-bold uppercase tracking-widest rounded-full">
                      {course.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl mb-2 line-clamp-2">{course.title}</h3>
                  <p className={`text-sm mb-4 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {course.description || 'Learn the fundamentals and advanced techniques in this comprehensive course.'}
                  </p>

                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{course.rating > 0 ? course.rating : 'New'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Users className="w-4 h-4" />
                        <span>{course.studentsCount}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-4 h-4" />
                        <span>{getDuration(course)}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-dashed border-gray-500/20">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                          {course.instructorName.charAt(0)}
                        </div>
                        <span className="text-sm font-medium">{course.instructorName}</span>
                      </div>
                      <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                        ${course.price}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEnroll(course)}
                      disabled={enrolling === course.id}
                      className={`w-full py-3 rounded-xl font-bold transition-all ${
                        enrolledIds.has(course.id)
                          ? isDark
                            ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                            : 'bg-yellow-50 text-yellow-600 border border-yellow-300'
                          : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg shadow-yellow-500/20 hover:scale-[1.02]'
                      }`}
                    >
                      {enrolling === course.id
                        ? 'Enrolling...'
                        : enrolledIds.has(course.id)
                        ? 'Continue Learning'
                        : course.price > 0
                        ? `Enroll — $${course.price}`
                        : 'Enroll Free'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
