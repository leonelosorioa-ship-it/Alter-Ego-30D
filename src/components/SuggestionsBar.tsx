import React from 'react';
import { DIAGNOSTIC_STEPS } from '../data/diagnosticData.ts';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MentorGender } from '../types.ts';

interface SuggestionsBarProps {
  step: number;
  gender: MentorGender;
  onSelectSuggestion: (text: string) => void;
  disabled?: boolean;
}

export const SuggestionsBar: React.FC<SuggestionsBarProps> = ({
  step,
  gender,
  onSelectSuggestion,
  disabled,
}) => {
  const currentStepInfo = DIAGNOSTIC_STEPS.find((s) => s.number === step);
  if (!currentStepInfo) return null;

  const suggestions = currentStepInfo.suggestions[gender] || [];

  return (
    <div className="w-full border-t border-stone-850 bg-stone-950/60 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center gap-2 mb-2 text-xs text-stone-400">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span className="font-medium text-stone-300">
            Sugerencias de respuesta rápida para {currentStepInfo.title}:
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((sug, idx) => (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => onSelectSuggestion(sug)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/90 px-3 py-1.5 text-xs text-stone-300 transition-all hover:border-amber-500/50 hover:bg-stone-850 hover:text-amber-200 disabled:opacity-50 text-left cursor-pointer active:scale-98"
            >
              <span>{sug}</span>
              <ArrowRight className="h-3 w-3 text-stone-500 flex-shrink-0" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
