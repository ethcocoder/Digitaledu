import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import { Plus, Trash2, ChevronLeft, Save, Send } from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import { CourseModule } from '../../../../shared/types';

const CATEGORIES = ['Kids', 'School', 'University', 'Professional', 'Technology', 'Business', 'Design'];

export default function CourseStudio() {
  const [, params] = useRoute('/instructor/courses/:courseId/edit');
  const [, newParams] = useRoute('/instructor/courses/new');
  const [, setLocation] = useLocation();
  const { theme, t } = useLanguage();
  const { user, profile } = useUser();
  const isDark = theme === 'dark';
  const isEdit = !!params?.courseId;
  const courseId = params?.courseId;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [price, setPrice] = useState(0);
  const [modules, setModules] = useState<CourseModule[]>([]);

  useEffect(() => {
    if (!isEdit || !courseId) return;
    courseService.getCourseById(courseId).then(({ course }) => {
      if (!course) { toast.error('Course not found'); setLocation('/instructor/courses'); return; }
      if (course.instructorId !== user?.uid) { toast.error('Unauthorized'); setLocation('/instructor/courses'); return; }
      setTitle(course.title);
      setDescription(course.description);
      setCategory(course.category);
      setPrice(course.price);
      setModules(course.modules || []);
    });
  }, [isEdit, courseId, user?.uid, setLocation]);

  const addModule = () => {
    setModules([...modules, {
      id: `mod_${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      videoUrl: '',
      durationMinutes: 15,
      order: modules.length,
    }]);
  };

  const updateModule = (id: string, field: keyof CourseModule, value: string | number) => {
    setModules(modules.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id).map((m, i) => ({ ...m, order: i })));
  };

  const handleSave = async (publish = false) => {
    if (!user?.uid || !profile) return;
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);

    if (isEdit && courseId) {
      const { error } = await courseService.updateCourse(courseId, { title, description, category, price, modules });
      if (error) { toast.error(error); setSaving(false); return; }
      if (publish) {
        const { error: pubError } = await courseService.updateCourseStatus(courseId, 'published');
        if (pubError) { toast.error(pubError); setSaving(false); return; }
        toast.success('Course published!');
      } else {
        toast.success('Course saved!');
      }
    } else {
      const { courseId: newId, error } = await courseService.createCourse({
        instructorId: user.uid,
        instructorName: profile.fullName,
        title,
        description,
        category,
        price,
        modules,
      });
      if (error || !newId) { toast.error(error || 'Failed to create'); setSaving(false); return; }
      if (publish) {
        await courseService.updateCourseStatus(newId, 'published');
        toast.success('Course created and published!');
      } else {
        toast.success('Course created as draft!');
      }
    }

    setSaving(false);
    setLocation('/instructor/courses');
  };

  if (!isEdit && !newParams) return null;

  return (
    <InstructorLayout title={isEdit ? 'Edit Course' : t('instructor.createCourse')}>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => setLocation('/instructor/courses')}
          className={`flex items-center gap-2 text-sm font-medium ${isDark ? 'text-gray-400 hover:text-teal-400' : 'text-gray-600 hover:text-teal-600'}`}
        >
          <ChevronLeft className="w-4 h-4" /> Back to Courses
        </button>

        <div className="flex gap-2 mb-8">
          {['Details', 'Modules', 'Review'].map((label, i) => (
            <button
              key={label}
              onClick={() => setStep(i + 1)}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                step === i + 1
                  ? 'bg-teal-500/20 text-teal-500 border border-teal-500/30'
                  : isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {i + 1}. {label}
            </button>
          ))}
        </div>

        {step === 1 && (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <div>
              <label className="text-sm font-bold mb-1 block">Course Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} placeholder="e.g. Advanced React Patterns" />
            </div>
            <div>
              <label className="text-sm font-bold mb-1 block">Description</label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={`w-full px-4 py-3 rounded-xl border outline-none resize-none ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} placeholder="What will students learn?" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-bold mb-1 block">Category</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)} className={`w-full px-4 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`}>
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold mb-1 block">Price ($)</label>
                <input type="number" min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className={`w-full px-4 py-3 rounded-xl border outline-none ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} />
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full py-3 bg-teal-500/20 text-teal-500 font-bold rounded-xl hover:bg-teal-500/30">Next: Modules</button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            {modules.map((mod, i) => (
              <div key={mod.id} className={`p-4 rounded-xl border space-y-3 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-teal-500">Module {i + 1}</span>
                  <button onClick={() => removeModule(mod.id)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
                <input value={mod.title} onChange={(e) => updateModule(mod.id, 'title', e.target.value)} placeholder="Module title" className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} />
                <input value={mod.videoUrl} onChange={(e) => updateModule(mod.id, 'videoUrl', e.target.value)} placeholder="Video embed URL (YouTube, Vimeo, etc.)" className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} />
                <input type="number" min={1} value={mod.durationMinutes} onChange={(e) => updateModule(mod.id, 'durationMinutes', Number(e.target.value))} placeholder="Duration (minutes)" className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`} />
              </div>
            ))}
            <button onClick={addModule} className={`w-full py-3 rounded-xl border border-dashed font-bold flex items-center justify-center gap-2 ${isDark ? 'border-teal-500/30 text-teal-400 hover:bg-teal-500/5' : 'border-teal-300 text-teal-600 hover:bg-teal-50'}`}>
              <Plus className="w-5 h-5" /> Add Module
            </button>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 py-3 rounded-xl border font-bold text-gray-500">Back</button>
              <button onClick={() => setStep(3)} className="flex-1 py-3 bg-teal-500/20 text-teal-500 font-bold rounded-xl">Next: Review</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
            <h3 className="font-bold text-lg">{title || 'Untitled Course'}</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{description || 'No description'}</p>
            <div className="flex gap-4 text-sm">
              <span className="font-bold text-teal-500">{category}</span>
              <span className="font-bold">${price}</span>
              <span>{modules.length} module{modules.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border font-bold text-gray-500">Back</button>
              <button onClick={() => handleSave(false)} disabled={saving} className="flex-1 py-3 rounded-xl border border-teal-500/30 text-teal-500 font-bold flex items-center justify-center gap-2 hover:bg-teal-500/10">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving} className="flex-1 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Publish
              </button>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}
