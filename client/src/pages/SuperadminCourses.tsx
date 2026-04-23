import { useState } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { Search, Plus, Filter, PlayCircle, Clock, BookOpen, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const MOCK_COURSES = [
  { id: 1, title: 'Advanced React Patterns', category: 'Professional', instructor: 'Evan Wright', status: 'published', students: 1250, rating: 4.8 },
  { id: 2, title: 'Grade 8 Mathematics', category: 'School', instructor: 'Alice Johnson', status: 'published', students: 3420, rating: 4.5 },
  { id: 3, title: 'Introduction to Physics', category: 'University', instructor: 'Dr. Smith', status: 'draft', students: 0, rating: 0 },
  { id: 4, title: 'Creative Storytelling', category: 'Kids', instructor: 'Sarah Lee', status: 'published', students: 890, rating: 4.9 },
  { id: 5, title: 'Data Science Fundamentals', category: 'Professional', instructor: 'Alan Turing', status: 'archived', students: 5600, rating: 4.7 },
];

export default function SuperadminCourses() {
  const { theme } = useLanguage();
  const isDark = theme === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredCourses = MOCK_COURSES.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <AdminLayout title="Course Lifecycle Management">
      <div className="space-y-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Courses', value: '14,205', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-500/10' },
            { label: 'Active Drafts', value: '842', icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
            { label: 'Published This Month', value: '156', icon: PlayCircle, color: 'text-green-500', bg: 'bg-green-500/10' },
            { label: 'Avg. Course Rating', value: '4.6/5', icon: Star, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 ${
              isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
            }`}>
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-xs font-bold ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Header Actions */}
        <div className={`p-4 md:p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className={`relative flex items-center px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-950 border-cyan-400/20 focus-within:border-cyan-400' : 'bg-gray-50 border-blue-100 focus-within:border-blue-500'
            }`}>
              <Search className="w-4 h-4 text-gray-500 mr-2" />
              <input 
                type="text" 
                placeholder="Search courses..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent border-none outline-none text-sm w-full sm:w-64"
              />
            </div>

            {/* Filter */}
            <div className={`relative flex items-center px-4 py-2 rounded-lg border transition-all ${
              isDark ? 'bg-slate-950 border-cyan-400/20' : 'bg-gray-50 border-blue-100'
            }`}>
              <Filter className="w-4 h-4 text-gray-500 mr-2" />
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-transparent border-none outline-none text-sm cursor-pointer"
              >
                <option value="all">All Categories</option>
                <option value="Kids">Kids</option>
                <option value="School">School</option>
                <option value="University">University</option>
                <option value="Professional">Professional</option>
              </select>
            </div>
          </div>

          <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-transform hover:scale-105 ${
            isDark ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
          }`}>
            <Plus className="w-4 h-4" />
            Create Course
          </button>
        </div>

        {/* Courses Table */}
        <div className={`rounded-2xl border overflow-hidden ${
          isDark ? 'bg-slate-900/40 border-cyan-400/10' : 'bg-white border-blue-100'
        }`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className={`uppercase text-xs font-bold ${
                isDark ? 'bg-slate-950/50 text-gray-400' : 'bg-gray-50 text-gray-600'
              }`}>
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
                {filteredCourses.map((course, index) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    key={course.id} 
                    className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-blue-50/50'}`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold">{course.title}</div>
                      <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>By {course.instructor}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        isDark ? 'bg-slate-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                        course.status === 'published' ? 'bg-green-500/10 text-green-500' :
                        course.status === 'draft' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-gray-500/10 text-gray-500'
                      }`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{course.students.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold">{course.rating > 0 ? course.rating : 'N/A'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-colors ${
                        isDark ? 'border-cyan-400/20 text-cyan-400 hover:bg-cyan-400/10' : 'border-blue-200 text-blue-600 hover:bg-blue-50'
                      }`}>
                        Manage
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
            
            {filteredCourses.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                No courses found matching your criteria.
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
