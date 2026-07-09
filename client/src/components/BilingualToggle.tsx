import { Globe } from 'lucide-react';

interface BilingualToggleProps {
  showAmharic: boolean;
  onToggle: () => void;
  isDark: boolean;
}

export default function BilingualToggle({ showAmharic, onToggle, isDark }: BilingualToggleProps) {
  return (
    <button
      onClick={onToggle}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
        showAmharic
          ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30'
          : isDark
            ? 'bg-slate-800 text-gray-400 border border-slate-700'
            : 'bg-gray-100 text-gray-500 border border-gray-200'
      }`}
    >
      <Globe className="w-3.5 h-3.5" />
      <span>{showAmharic ? 'EN + አማ' : 'English Only'}</span>
    </button>
  );
}

export function BilingualText({ en, am, showAmharic, isDark }: {
  en: string;
  am: string;
  showAmharic: boolean;
  isDark: boolean;
}) {
  return (
    <div className="space-y-1">
      <p>{en}</p>
      {showAmharic && (
        <p className={`text-sm border-l-2 pl-3 ${isDark ? 'text-yellow-400/70 border-yellow-500/30' : 'text-yellow-700 border-yellow-400'}`}>
          {am}
        </p>
      )}
    </div>
  );
}
