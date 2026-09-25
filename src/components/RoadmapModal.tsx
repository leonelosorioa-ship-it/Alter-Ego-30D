import React from 'react';
import { X, Compass, Flame, Shield, CheckCircle2, Trophy, Clock } from 'lucide-react';
import { WORLDS_ROADMAP } from '../data/diagnosticData.ts';

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasMasterSheet: boolean;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({
  isOpen,
  onClose,
  hasMasterSheet,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-2xl text-stone-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-semibold text-amber-300 mb-2">
            <Compass className="h-3.5 w-3.5" />
            <span>Arquitectura Alter Ego 30D™</span>
          </div>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-stone-100">
            Los 4 Mundos de tu Transformación
          </h2>
          <p className="mt-1 text-sm text-stone-400">
            Tu Ficha Maestra es la llave de entrada. Aquí está el mapa táctico de los 30 días para consolidar tu identidad de alto rendimiento.
          </p>
        </div>

        {/* Status indicator */}
        <div className="mb-6 rounded-2xl border border-stone-800 bg-stone-900/60 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${hasMasterSheet ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'}`}>
              {hasMasterSheet ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
            </div>
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
                Estado Actual
              </span>
              <span className="text-sm font-bold text-stone-200">
                {hasMasterSheet ? 'Día 1 / 30: Ficha Maestra Consagrada' : 'Fase 0: Diagnóstico de 5 Pasos en curso'}
              </span>
            </div>
          </div>
          <span className="text-xs text-amber-400 font-medium">
            {hasMasterSheet ? 'Mundo 1 Activo' : 'Completando Bautizo'}
          </span>
        </div>

        {/* Worlds Grid */}
        <div className="space-y-4">
          {WORLDS_ROADMAP.map((w) => {
            const isWorld1 = w.world === 1;

            return (
              <div
                key={w.world}
                className={`rounded-2xl border p-5 transition-all ${
                  isWorld1
                    ? 'border-amber-500/40 bg-gradient-to-r from-stone-900 via-stone-900/90 to-amber-950/20'
                    : 'border-stone-800/80 bg-stone-900/40 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs">
                      M{w.world}
                    </span>
                    <h3 className="font-serif-luxury text-lg font-bold text-stone-100">
                      Mundo {w.world}: {w.title}
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-stone-400 border border-stone-800 rounded-md px-2.5 py-1">
                    {w.days}
                  </span>
                </div>

                <p className="text-xs text-amber-400/90 font-medium mb-3">
                  ✦ {w.tagline}
                </p>

                <div className="space-y-1.5 border-t border-stone-800/80 pt-3">
                  {w.milestones.map((m, mIdx) => (
                    <div key={mIdx} className="flex items-start gap-2 text-xs text-stone-300">
                      <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors"
          >
            Volver a la Conversación
          </button>
        </div>
      </div>
    </div>
  );
};
