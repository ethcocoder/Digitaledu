import { Volume2, Lightbulb, BookOpen } from 'lucide-react';
import { ContentBlock, ConceptBlock, ExampleBlock, AudioBlock } from '../../../shared/types';
import { BilingualText } from './BilingualToggle';
import InteractiveQuiz from './InteractiveQuiz';

interface RichContentRendererProps {
  block: ContentBlock;
  showAmharic: boolean;
  isDark: boolean;
  onQuizComplete: (correct: boolean) => void;
}

export default function RichContentRenderer({ block, showAmharic, isDark, onQuizComplete }: RichContentRendererProps) {
  switch (block.type) {
    case 'concept':
      return <ConceptRenderer block={block} showAmharic={showAmharic} isDark={isDark} />;
    case 'example':
      return <ExampleRenderer block={block} showAmharic={showAmharic} isDark={isDark} />;
    case 'audio':
      return <AudioRenderer block={block} showAmharic={showAmharic} isDark={isDark} />;
    case 'quiz':
      return (
        <InteractiveQuiz
          block={block}
          showAmharic={showAmharic}
          isDark={isDark}
          onComplete={onQuizComplete}
        />
      );
    default:
      return null;
  }
}

function ConceptRenderer({ block, showAmharic, isDark }: { block: ConceptBlock; showAmharic: boolean; isDark: boolean }) {
  return (
    <div className={`rounded-xl border p-5 space-y-3 ${
      isDark ? 'border-blue-500/20 bg-slate-800/40' : 'border-blue-200 bg-blue-50/50'
    }`}>
      <div className="flex items-center gap-2">
        <Lightbulb className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
        }`}>
          Concept
        </span>
      </div>
      <h4 className="font-bold">
        <BilingualText en={block.title.en} am={block.title.am} showAmharic={showAmharic} isDark={isDark} />
      </h4>
      <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        <BilingualText en={block.content.en} am={block.content.am} showAmharic={showAmharic} isDark={isDark} />
      </div>
    </div>
  );
}

function ExampleRenderer({ block, showAmharic, isDark }: { block: ExampleBlock; showAmharic: boolean; isDark: boolean }) {
  return (
    <div className={`rounded-xl border p-5 space-y-3 ${
      isDark ? 'border-emerald-500/20 bg-slate-800/40' : 'border-emerald-200 bg-emerald-50/50'
    }`}>
      <div className="flex items-center gap-2">
        <BookOpen className={`w-4 h-4 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          isDark ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
        }`}>
          Example
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/60' : 'bg-white'}`}>
          <p className={`text-xs font-bold mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>English</p>
          <p className="text-sm">{block.source.en}</p>
        </div>
        {showAmharic && (
          <div className={`p-3 rounded-lg ${isDark ? 'bg-slate-900/60 border border-yellow-500/20' : 'bg-white border border-yellow-200'}`}>
            <p className="text-xs font-bold mb-1 text-yellow-500">አማርኛ</p>
            <p className="text-sm">{block.source.am}</p>
          </div>
        )}
      </div>
      {block.notes && (
        <div className={`text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <BilingualText en={block.notes.en} am={block.notes.am} showAmharic={showAmharic} isDark={isDark} />
        </div>
      )}
    </div>
  );
}

function AudioRenderer({ block, showAmharic, isDark }: { block: AudioBlock; showAmharic: boolean; isDark: boolean }) {
  const handlePlay = () => {
    if (block.audioUrl) {
      const audio = new Audio(block.audioUrl);
      audio.play();
    }
  };

  return (
    <div className={`rounded-xl border p-5 space-y-3 ${
      isDark ? 'border-orange-500/20 bg-slate-800/40' : 'border-orange-200 bg-orange-50/50'
    }`}>
      <div className="flex items-center gap-2">
        <Volume2 className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          isDark ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
        }`}>
          Pronunciation
        </span>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={handlePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isDark
              ? 'bg-orange-500/20 text-orange-400 hover:bg-orange-500/30'
              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
          }`}
        >
          <Volume2 className="w-6 h-6" />
        </button>
        <div>
          <p className="font-bold">
            <BilingualText en={block.term.en} am={block.term.am} showAmharic={showAmharic} isDark={isDark} />
          </p>
          <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            <BilingualText en={block.transcript.en} am={block.transcript.am} showAmharic={showAmharic} isDark={isDark} />
          </p>
        </div>
      </div>
    </div>
  );
}
