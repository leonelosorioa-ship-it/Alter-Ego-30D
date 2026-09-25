import React from 'react';
import { Check, Shield, Skull, Crown, Activity, Key, Sparkles } from 'lucide-react';
import { DIAGNOSTIC_STEPS } from '../data/diagnosticData.ts';

interface ProgressBarProps {
  currentStep: number;
  hasMasterSheet: boolean;
  onStepClick?: (stepNumber: number) => void;
}

export const DiagnosticProgressBar: React.FC<ProgressBarProps> = ({
  currentStep,
  hasMasterSheet,
}) => {
  const getIcon = (num: number) => {
    switch (num) {
      case 1:
        return <Shield className="h-3.5 w-3.5" />;
      case 2:
        return <Skull className="h-3.5 w-3.5" />;
      case 3:
        return <Crown className="h-3.5 w-3.5" />;
      case 4:
        return <Activity className="h-3.5 w-3.5" />;
      case 5:
        return <Key className="h-3.5 w-3.5" />;
      default:
        return <Sparkles className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="w-full border-b border-stone-800/60 bg-stone-900/40 px-4 py-2.5 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {DIAGNOSTIC_STEPS.map((step) => {
            const isCompleted = currentStep > step.number || hasMasterSheet;
            const isCurrent = currentStep === step.number && !hasMasterSheet;

            return (
              <div key={step.number} className="flex-1 flex flex-col items-center group relative">
                <div className="flex items-center w-full">
                  <div
                    className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition-all duration-300 mx-auto ${
                      isCompleted
                        ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-400 shadow-sm shadow-emerald-900/30'
                        : isCurrent
                        ? 'border-amber-400 bg-amber-500/20 text-amber-300 ring-2 ring-amber-400/30 ring-offset-2 ring-offset-stone-950 scale-105'
                        : 'border-stone-800 bg-stone-900/80 text-stone-500'
                    }`}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : getIcon(step.number)}
                  </div>
                </div>

                <div className="mt-1 text-center hidden sm:block">
                  <span
                    className={`block text-[11px] font-medium tracking-tight truncate max-w-[90px] md:max-w-[120px] ${
                      isCompleted
                        ? 'text-stone-300'
                        : isCurrent
                        ? 'text-amber-300 font-semibold'
                        : 'text-stone-500'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[9px] text-stone-600 block">{step.variable}</span>
                </div>
              </div>
            );
          })}

          {/* Master sheet milestone */}
          <div className="flex-1 flex flex-col items-center">
            <div
              className={`relative flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border transition-all duration-300 mx-auto ${
                hasMasterSheet
                  ? 'border-amber-400 bg-amber-500 text-stone-950 font-bold shadow-lg shadow-amber-500/30 scale-110 animate-pulse'
                  : 'border-stone-800 bg-stone-900/80 text-stone-500'
              }`}
            >
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="mt-1 text-center hidden sm:block">
              <span
                className={`block text-[11px] font-medium tracking-tight ${
                  hasMasterSheet ? 'text-amber-300 font-semibold' : 'text-stone-500'
                }`}
              >
                Ficha Maestra
              </span>
              <span className="text-[9px] text-stone-600 block">Día 1 / 30</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
