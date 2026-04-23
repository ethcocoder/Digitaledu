import { useState, useEffect } from 'react';
import StudentLayout from '@/components/StudentLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Filter, Star, Clock, Users, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { courseService } from '@/lib/courseService';
import { Course } from '../../../shared/types';

export default function StudentCatalog() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      // For the catalog, we ideally only want 'published' courses
      const { courses, error } = await courseService.getAllCourses();
      if (!error) {
        setCourses(courses.filter(c => c.status === 'published'));
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StudentLayout title="Course Catalog">
      <div className="space-y-8">
        
        {/* Search Bar & Filters */}
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
                  ? 'bg-slate-900/50 border border-yellow-500/20 focus:border-yellow-500 focus:shadow-[0_0_15px_rgba(234,179,8,0.1)]' 
                  : 'bg-white border border-yellow-200 focus:border-yellow-400 focus:shadow-sm'
              }`}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border transition-colors ${
              isDark ? 'bg-slate-900/50 border-yellow-500/20 hover:bg-yellow-500/10' : 'bg-white border-yellow-200 hover:bg-yellow-50'
            }`}>
              <Filter className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">Categories</span>
            </button>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-yellow-500/20 border-t-yellow-500 rounded-full animate-spin" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-bold mb-2">No courses found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCourses.map((course, i) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                key={course.id}
                className={`flex flex-col rounded-3xl border overflow-hidden transition-all duration-300 hover:scale-[1.02] ${
                  isDark ? 'bg-slate-900/40 border-yellow-500/10 hover:border-yellow-500/30 hover:shadow-[0_0_30px_rgba(234,179,8,0.1)]' : 'bg-white border-yellow-100 hover:border-yellow-300 hover:shadow-xl'
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
                    {course.description || "Learn the fundamentals and advanced techniques in this comprehensive course."}
                  </p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span>{course.rating || 'New'}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Users className="w-4 h-4" />
                        <span>{course.studentsCount}</span>
                      </div>
                      <div className={`flex items-center gap-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Clock className="w-4 h-4" />
                        <span>12h 30m</span>
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
