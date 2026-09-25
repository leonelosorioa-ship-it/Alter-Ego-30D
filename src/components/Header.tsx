import React from 'react';
import {
  Volume2,
  VolumeX,
  ShieldAlert,
  Compass,
  Sparkles,
  UserCheck,
  RotateCcw,
  Zap,
  Bot,
  Award,
} from 'lucide-react';
import { AppMode, MentorProfile } from '../types.ts';

interface HeaderProps {
  mentor: MentorProfile | null;
  appMode: AppMode;
  onSetAppMode: (mode: AppMode) => void;
  hasMasterSheet: boolean;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenRoadmap: () => void;
  onOpenDisclaimer: () => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  mentor,
  appMode,
  onSetAppMode,
  hasMasterSheet,
  soundEnabled,
  onToggleSound,
  onOpenRoadmap,
  onOpenDisclaimer,
  onReset,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500/20 via-stone-800 to-stone-900 border border-amber-500/30 text-amber-400 shadow-inner shadow-amber-500/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif-luxury text-sm font-bold tracking-wider text-amber-300 uppercase">
                Tu Poder Mental IA™
              </span>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 border border-stone-800 rounded px-1.5 py-0.2">
                Alter Ego 30D™
              </span>
            </div>
            <p className="text-xs text-stone-400 font-light hidden sm:block">
              Comprende tu mente · Abraza tu bienestar · Transforma tu vida
            </p>
          </div>
        </div>

        {/* Central Segmented Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-900 border border-stone-800 rounded-xl overflow-x-auto">
          <button
            onClick={() => onSetAppMode('mentor_diagnostic')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              appMode === 'mentor_diagnostic'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Diagnóstico</span>
          </button>

          <button
            onClick={() => onSetAppMode('alter_ego_simulator')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all relative ${
              appMode === 'alter_ego_simulator'
                ? 'bg-amber-500 text-stone-950 shadow-sm font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Simulador</span>
            <span className="sm:hidden">24/7</span>
            {hasMasterSheet && appMode !== 'alter_ego_simulator' && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
              </span>
            )}
          </button>

          <button
            onClick={() => onSetAppMode('daily_missions')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              appMode === 'daily_missions'
                ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Misiones Diarias y Diario de Reflexión (Días 1 a 30)"
          >
            <Compass className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Misiones 30D</span>
            <span className="sm:hidden">Diario</span>
          </button>

          <button
            onClick={() => onSetAppMode('mentorship_audit')}
            className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              appMode === 'mentorship_audit'
                ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 shadow-sm font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
            title="Sesión Privada de Mentoría 1-a-1 (Premio de Fin de Mundo)"
          >
            <Award className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Auditoría 1-a-1</span>
            <span className="sm:hidden">Auditoría</span>
          </button>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2">
          {mentor && appMode === 'mentor_diagnostic' && (
            <div className="hidden lg:flex items-center gap-2 border border-stone-800 bg-stone-900/60 rounded-lg px-2.5 py-1 text-xs">
              <UserCheck className="h-3.5 w-3.5 text-amber-400" />
              <span className="text-stone-300 font-medium">{mentor.name}</span>
            </div>
          )}

          <button
            onClick={onOpenRoadmap}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900/80 px-3 py-1.5 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/40 hover:text-amber-200"
            title="Ver Programa de 30 Días (4 Mundos)"
          >
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Programa 30D</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`rounded-lg border border-stone-800 p-2 text-xs transition-colors ${
              soundEnabled ? 'text-amber-400 hover:bg-stone-850' : 'text-stone-500 hover:text-stone-400'
            }`}
            title={soundEnabled ? 'Silenciar sonidos de coaching' : 'Activar sonidos de coaching'}
            aria-label="Toggle sound"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          <button
            onClick={onOpenDisclaimer}
            className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900/40 px-2.5 py-1.5 text-xs text-stone-400 transition-colors hover:border-stone-700 hover:text-stone-200"
            title="Descargo Ético y Límites de la Aplicación"
          >
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500/80" />
            <span className="hidden sm:inline">Ética</span>
          </button>

          {mentor && appMode === 'mentor_diagnostic' && (
            <button
              onClick={onReset}
              className="rounded-lg border border-stone-800 p-2 text-stone-400 transition-colors hover:border-red-900/40 hover:text-red-300 hover:bg-red-950/20"
              title="Reiniciar diagnóstico con nuevo mentor"
              aria-label="Reiniciar diagnóstico"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
