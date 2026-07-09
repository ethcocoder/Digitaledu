import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import InstructorLayout from '@/components/InstructorLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useUser } from '@/contexts/UserContext';
import {
  Plus, Trash2, ChevronLeft, ChevronRight, Save, Send,
  Lightbulb, BookOpen, Volume2, HelpCircle, GripVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { courseService } from '@/lib/courseService';
import {
  CourseModule, ContentBlock, ContentBlockType,
  ConceptBlock, ExampleBlock, AudioBlock, QuizBlock
} from '../../../../shared/types';

const CATEGORIES = ['Kids', 'School', 'University', 'Professional', 'Technology', 'Business', 'Design'];
const BLOCK_TYPES: { type: ContentBlockType; icon: typeof Lightbulb; label: string }[] = [
  { type: 'concept', icon: Lightbulb, label: 'Concept' },
  { type: 'example', icon: BookOpen, label: 'Example' },
  { type: 'audio', icon: Volume2, label: 'Audio' },
  { type: 'quiz', icon: HelpCircle, label: 'Quiz' },
];

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
  const [expandedModule, setExpandedModule] = useState<string | null>(null);

  useEffect(() => {
    if (!isEdit || !courseId) return;
    courseService.getCourseById(courseId).then(({ course }) => {
      if (!course) { toast.error('Course not found'); setLocation('/instructor/courses'); return; }
      if (course.instructorId !== user?.uid) { toast.error('Unauthorized'); setLocation('/instructor/courses'); return; }
      setTitle(course.title);
      setDescription(course.description);
      setCategory(course.category);
      setPrice(course.price);
      setModules((course.modules || []).map((m) => ({ ...m, blocks: m.blocks || [] })));
    });
  }, [isEdit, courseId, user?.uid, setLocation]);

  const addModule = () => {
    const newMod: CourseModule = {
      id: `mod_${Date.now()}`,
      title: `Module ${modules.length + 1}`,
      videoUrl: '',
      durationMinutes: 15,
      order: modules.length,
      blocks: [],
    };
    setModules([...modules, newMod]);
    setExpandedModule(newMod.id);
  };

  const updateModule = (id: string, field: keyof CourseModule, value: string | number | ContentBlock[]) => {
    setModules(modules.map((m) => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeModule = (id: string) => {
    setModules(modules.filter((m) => m.id !== id).map((m, i) => ({ ...m, order: i })));
    if (expandedModule === id) setExpandedModule(null);
  };

  const moveModule = (id: string, dir: 'up' | 'down') => {
    const idx = modules.findIndex((m) => m.id === id);
    if (dir === 'up' && idx === 0) return;
    if (dir === 'down' && idx === modules.length - 1) return;
    const next = [...modules];
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    setModules(next.map((m, i) => ({ ...m, order: i })));
  };

  const addBlock = (moduleId: string, type: ContentBlockType) => {
    const id = `blk_${Date.now()}`;
    let block: ContentBlock;
    const bilingual = { en: '', am: '' };

    switch (type) {
      case 'concept':
        block = { type: 'concept', id, title: { ...bilingual }, content: { ...bilingual } } as ConceptBlock;
        break;
      case 'example':
        block = { type: 'example', id, source: { ...bilingual }, translation: { ...bilingual } } as ExampleBlock;
        break;
      case 'audio':
        block = { type: 'audio', id, term: { ...bilingual }, audioUrl: '', transcript: { ...bilingual } } as AudioBlock;
        break;
      case 'quiz':
        block = {
          type: 'quiz', id, question: { ...bilingual },
          options: [
            { id: `opt_${Date.now()}_1`, content: { ...bilingual }, isCorrect: false },
            { id: `opt_${Date.now()}_2`, content: { ...bilingual }, isCorrect: false },
          ],
          explanation: { ...bilingual },
          questionType: 'mcq',
        } as QuizBlock;
        break;
    }

    setModules(modules.map((m) =>
      m.id === moduleId ? { ...m, blocks: [...(m.blocks || []), block] } : m
    ));
  };

  const updateBlock = (moduleId: string, blockId: string, updates: Record<string, unknown>) => {
    setModules(modules.map((m) =>
      m.id === moduleId
        ? {
            ...m,
            blocks: (m.blocks || []).map((b) =>
              b.id === blockId ? { ...b, ...updates } as ContentBlock : b
            ),
          }
        : m
    ));
  };

  const removeBlock = (moduleId: string, blockId: string) => {
    setModules(modules.map((m) =>
      m.id === moduleId
        ? { ...m, blocks: (m.blocks || []).filter((b) => b.id !== blockId) }
        : m
    ));
  };

  const handleSave = async (submitForReview = false) => {
    if (!user?.uid || !profile) return;
    if (!title.trim()) { toast.error('Title is required'); return; }
    setSaving(true);

    if (isEdit && courseId) {
      const { error } = await courseService.updateCourse(courseId, { title, description, category, price, modules });
      if (error) { toast.error(error); setSaving(false); return; }
      if (submitForReview) {
        const { error: subError } = await courseService.submitForReview(courseId);
        if (subError) { toast.error(subError); setSaving(false); return; }
        toast.success('Course submitted for review!');
      } else {
        toast.success('Course saved!');
      }
    } else {
      const { courseId: newId, error } = await courseService.createCourse({
        instructorId: user.uid,
        instructorName: profile.fullName,
        title, description, category, price, modules,
      });
      if (error || !newId) { toast.error(error || 'Failed to create'); setSaving(false); return; }
      if (submitForReview) {
        const { error: subError } = await courseService.submitForReview(newId);
        if (subError) { toast.error(subError); setSaving(false); return; }
        toast.success('Course created and submitted for review!');
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
      <div className="max-w-4xl mx-auto space-y-6">
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
              <div key={mod.id} className={`rounded-xl border overflow-hidden ${isDark ? 'bg-slate-900/40 border-teal-500/10' : 'bg-white border-teal-100'}`}>
                {/* Module header */}
                <div className={`p-4 flex items-center gap-3 ${isDark ? 'border-b border-slate-800' : 'border-b border-gray-100'}`}>
                  <span className="text-xs font-bold text-teal-500 shrink-0">Module {i + 1}</span>
                  <input value={mod.title} onChange={(e) => updateModule(mod.id, 'title', e.target.value)}
                    placeholder="Module title"
                    className={`flex-1 px-3 py-1.5 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`}
                  />
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => moveModule(mod.id, 'up')} disabled={i === 0}
                      className={`p-1 rounded ${i === 0 ? 'opacity-20 cursor-not-allowed' : isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                      <ChevronLeft className="w-4 h-4 rotate-90" />
                    </button>
                    <button onClick={() => moveModule(mod.id, 'down')} disabled={i === modules.length - 1}
                      className={`p-1 rounded ${i === modules.length - 1 ? 'opacity-20 cursor-not-allowed' : isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                      <ChevronRight className="w-4 h-4 rotate-90" />
                    </button>
                    <button onClick={() => removeModule(mod.id)}
                      className="p-1 rounded text-red-400 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                      className={`p-1 rounded ${isDark ? 'hover:bg-slate-800 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
                      <ChevronRight className={`w-4 h-4 transition-transform ${expandedModule === mod.id ? 'rotate-90' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Module details */}
                {expandedModule === mod.id && (
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <input value={mod.videoUrl} onChange={(e) => updateModule(mod.id, 'videoUrl', e.target.value)}
                        placeholder="Video embed URL" className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`}
                      />
                      <input type="number" min={1} value={mod.durationMinutes} onChange={(e) => updateModule(mod.id, 'durationMinutes', Number(e.target.value))}
                        placeholder="Duration (min)" className={`w-full px-3 py-2 rounded-lg border outline-none text-sm ${isDark ? 'bg-slate-950 border-teal-500/20' : 'bg-gray-50 border-teal-200'}`}
                      />
                    </div>

                    {/* Content Blocks */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-teal-500">Content Blocks</span>
                        <div className="flex gap-1">
                          {BLOCK_TYPES.map((bt) => (
                            <button key={bt.type} onClick={() => addBlock(mod.id, bt.type)}
                              className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold transition-all ${
                                isDark ? 'bg-slate-800 text-gray-300 hover:bg-slate-700' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              <bt.icon className="w-3 h-3" /> {bt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {(mod.blocks || []).length === 0 ? (
                        <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>No blocks yet. Add a block above.</p>
                      ) : (
                        <div className="space-y-3">
                          {(mod.blocks || []).map((block, bi) => (
                            <div key={block.id} className={`rounded-lg border p-3 ${isDark ? 'border-slate-700 bg-slate-800/60' : 'border-gray-200 bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                                  isDark ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-700'
                                }`}>
                                  {block.type}
                                </span>
                                <button onClick={() => removeBlock(mod.id, block.id)} className="text-red-400 hover:text-red-500">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <BlockEditor
                                block={block}
                                isDark={isDark}
                                onChange={(updates) => updateBlock(mod.id, block.id, updates)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <button onClick={addModule}
              className={`w-full py-3 rounded-xl border border-dashed font-bold flex items-center justify-center gap-2 ${isDark ? 'border-teal-500/30 text-teal-400 hover:bg-teal-500/5' : 'border-teal-300 text-teal-600 hover:bg-teal-50'}`}
            >
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
              <span>{modules.reduce((s, m) => s + (m.blocks || []).length, 0)} blocks</span>
            </div>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setStep(2)} className="flex-1 py-3 rounded-xl border font-bold text-gray-500">Back</button>
              <button onClick={() => handleSave(false)} disabled={saving}
                className="flex-1 py-3 rounded-xl border border-teal-500/30 text-teal-500 font-bold flex items-center justify-center gap-2 hover:bg-teal-500/10">
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button onClick={() => handleSave(true)} disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-teal-400 to-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2">
                <Send className="w-4 h-4" /> Submit for Review
              </button>
            </div>
          </div>
        )}
      </div>
    </InstructorLayout>
  );
}

interface BlockEditorProps {
  block: ContentBlock;
  isDark: boolean;
  onChange: (updates: Record<string, unknown>) => void;
}

function BlockEditor({ block, isDark, onChange }: BlockEditorProps) {
  const inputCls = `w-full px-2.5 py-1.5 rounded-lg border outline-none text-xs ${isDark ? 'bg-slate-950 border-slate-700 text-gray-200' : 'bg-white border-gray-200 text-gray-800'}`;
  const labelCls = 'text-xs font-medium block mb-0.5';

  const updateBilingual = (field: string, lang: 'en' | 'am', value: string) => {
    const current = (block as any)[field] || { en: '', am: '' };
    onChange({ [field]: { ...current, [lang]: value } });
  };

  switch (block.type) {
    case 'concept': {
      const b = block as ConceptBlock;
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Title</label>
            <div className="flex gap-2">
              <input value={b.title?.en || ''} onChange={(e) => updateBilingual('title', 'en', e.target.value)} placeholder="English" className={inputCls} />
              <input value={b.title?.am || ''} onChange={(e) => updateBilingual('title', 'am', e.target.value)} placeholder="አማርኛ" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Content</label>
            <div className="flex gap-2">
              <textarea value={b.content?.en || ''} onChange={(e) => updateBilingual('content', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.content?.am || ''} onChange={(e) => updateBilingual('content', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>
      );
    }
    case 'example': {
      const b = block as ExampleBlock;
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Source Text</label>
            <div className="flex gap-2">
              <textarea value={b.source?.en || ''} onChange={(e) => updateBilingual('source', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.source?.am || ''} onChange={(e) => updateBilingual('source', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Translation</label>
            <div className="flex gap-2">
              <textarea value={b.translation?.en || ''} onChange={(e) => updateBilingual('translation', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.translation?.am || ''} onChange={(e) => updateBilingual('translation', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>
      );
    }
    case 'audio': {
      const b = block as AudioBlock;
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Term</label>
            <div className="flex gap-2">
              <input value={b.term?.en || ''} onChange={(e) => updateBilingual('term', 'en', e.target.value)} placeholder="English" className={inputCls} />
              <input value={b.term?.am || ''} onChange={(e) => updateBilingual('term', 'am', e.target.value)} placeholder="አማርኛ" className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Audio URL</label>
            <input value={b.audioUrl || ''} onChange={(e) => onChange({ audioUrl: e.target.value })} placeholder="https://..." className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Transcript</label>
            <div className="flex gap-2">
              <textarea value={b.transcript?.en || ''} onChange={(e) => updateBilingual('transcript', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.transcript?.am || ''} onChange={(e) => updateBilingual('transcript', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>
      );
    }
    case 'quiz': {
      const b = block as QuizBlock;
      const addOption = () => {
        const newOpt = { id: `opt_${Date.now()}`, content: { en: '', am: '' }, isCorrect: false };
        onChange({ options: [...(b.options || []), newOpt] });
      };
      const updateOpt = (oid: string, field: string, value: unknown) => {
        onChange({
          options: (b.options || []).map((o) => o.id === oid ? { ...o, [field]: value } : o),
        });
      };
      const removeOpt = (oid: string) => {
        onChange({ options: (b.options || []).filter((o) => o.id !== oid) });
      };
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Question</label>
            <div className="flex gap-2">
              <textarea value={b.question?.en || ''} onChange={(e) => updateBilingual('question', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.question?.am || ''} onChange={(e) => updateBilingual('question', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Answer Options</label>
            <div className="space-y-1.5">
              {(b.options || []).map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={opt.isCorrect}
                    onChange={(e) => updateOpt(opt.id, 'isCorrect', e.target.checked)}
                    className="shrink-0 accent-teal-500"
                  />
                  <input value={opt.content?.en || ''} onChange={(e) => updateOpt(opt.id, 'content', { ...opt.content, en: e.target.value })}
                    placeholder="English" className={inputCls} />
                  <input value={opt.content?.am || ''} onChange={(e) => updateOpt(opt.id, 'content', { ...opt.content, am: e.target.value })}
                    placeholder="አማርኛ" className={inputCls} />
                  <button onClick={() => removeOpt(opt.id)} className="text-red-400 hover:text-red-500 shrink-0">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            <button onClick={addOption} className="mt-1 text-xs text-teal-500 hover:text-teal-400">+ Add option</button>
          </div>
          <div>
            <label className={labelCls}>Explanation</label>
            <div className="flex gap-2">
              <textarea value={b.explanation?.en || ''} onChange={(e) => updateBilingual('explanation', 'en', e.target.value)} placeholder="English" rows={2} className={`${inputCls} resize-none`} />
              <textarea value={b.explanation?.am || ''} onChange={(e) => updateBilingual('explanation', 'am', e.target.value)} placeholder="አማርኛ" rows={2} className={`${inputCls} resize-none`} />
            </div>
          </div>
        </div>
      );
    }
    default:
      return null;
  }
}
