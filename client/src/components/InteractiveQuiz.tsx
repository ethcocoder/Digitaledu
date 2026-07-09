import { useState } from 'react';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { QuizBlock } from '../../../shared/types';
import { BilingualText } from './BilingualToggle';

interface InteractiveQuizProps {
  block: QuizBlock;
  showAmharic: boolean;
  isDark: boolean;
  onComplete: (correct: boolean) => void;
}

export default function InteractiveQuiz({ block, showAmharic, isDark, onComplete }: InteractiveQuizProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selectedOption = block.options.find((o) => o.id === selectedId);
  const isCorrect = selectedOption?.isCorrect ?? false;

  const handleSubmit = () => {
    if (!selectedId || submitted) return;
    setSubmitted(true);
    onComplete(isCorrect);
  };

  const handleRetry = () => {
    setSelectedId(null);
    setSubmitted(false);
  };

  return (
    <div className={`rounded-xl border p-5 space-y-4 ${
      submitted
        ? isCorrect
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-red-500/30 bg-red-500/5'
        : isDark
          ? 'border-purple-500/20 bg-slate-800/40'
          : 'border-purple-200 bg-purple-50/50'
    }`}>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
          isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
        }`}>
          Quick Check
        </span>
        {submitted && (
          <span className={`text-xs font-bold flex items-center gap-1 ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
            {isCorrect ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
            {isCorrect ? 'Correct!' : 'Not quite'}
          </span>
        )}
      </div>

      <BilingualText en={block.question.en} am={block.question.am} showAmharic={showAmharic} isDark={isDark} />

      <div className="space-y-2">
        {block.options.map((opt) => {
          const isSelected = selectedId === opt.id;
          const showCorrect = submitted && opt.isCorrect;
          const showWrong = submitted && isSelected && !opt.isCorrect;

          return (
            <button
              key={opt.id}
              onClick={() => !submitted && setSelectedId(opt.id)}
              disabled={submitted}
              className={`w-full text-left p-3 rounded-lg border text-sm transition-all ${
                showCorrect
                  ? 'border-green-500 bg-green-500/10 text-green-500'
                  : showWrong
                    ? 'border-red-500 bg-red-500/10 text-red-500'
                    : isSelected
                      ? isDark
                        ? 'border-purple-500/50 bg-purple-500/10'
                        : 'border-purple-400 bg-purple-100'
                      : isDark
                        ? 'border-slate-700 hover:border-slate-600 text-gray-300'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <BilingualText en={opt.content.en} am={opt.content.am} showAmharic={showAmharic} isDark={isDark} />
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`text-sm p-3 rounded-lg ${isDark ? 'bg-slate-900/60 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
          <BilingualText en={block.explanation.en} am={block.explanation.am} showAmharic={showAmharic} isDark={isDark} />
        </div>
      )}

      <div className="flex gap-2">
        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedId}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              selectedId
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-105'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            Check Answer <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg text-sm font-bold border border-purple-500/30 text-purple-500 hover:bg-purple-500/10"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
