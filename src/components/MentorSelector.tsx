import React from 'react';
import { MENTORS } from '../data/diagnosticData.ts';
import { Sparkles, Shield, ArrowRight, HeartHandshake, Zap, CheckCircle2, User } from 'lucide-react';
import { MentorGender } from '../types.ts';
import { soundManager } from '../utils/audio.ts';

interface MentorSelectorProps {
  onSelectGender: (gender: MentorGender) => void;
  isLoading?: boolean;
}

export const MentorSelector: React.FC<MentorSelectorProps> = ({ onSelectGender, isLoading }) => {
  const handleSelect = (gender: MentorGender) => {
    if (isLoading) return;
    soundManager.playMessageChime();
    onSelectGender(gender);
  };

  return (
    <div className="mx-auto max-w-4xl py-6 px-4">
      {/* Introduction banner */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 mb-3 shadow-inner">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" />
          <span>Regla 1 · Enrutamiento Diagnóstico Didáctico</span>
        </div>
        <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-stone-100">
          Selecciona tu Género con un Clic
        </h2>
        <p className="mt-2 text-sm sm:text-base text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Pulsa o haz clic en tu opción para asignar a tu mentor especializado. Esta elección calibra la frecuencia somática, el tono de combate y tu plan de 30 días.
        </p>
      </div>

      {/* High-Impact Graphic Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ================= CARD 1: MUJER (Mentora Clara Luz) ================= */}
        <div
          onClick={() => handleSelect('mujer')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-rose-500/40 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-6 sm:p-7 transition-all duration-300 hover:border-rose-400 hover:shadow-2xl hover:shadow-rose-950/70 hover:-translate-y-1 flex flex-col justify-between"
        >
          {/* Glowing Aura Effect */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl group-hover:bg-rose-500/25 transition-all pointer-events-none" />

          <div>
            {/* Didactic Header with Big Graphic Symbol */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-rose-500/20">
              <div className="flex items-center gap-3">
                {/* Visual Venus Symbol (♀) */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500/30 via-pink-950/50 to-stone-900 border-2 border-rose-400/60 text-rose-300 shadow-lg shadow-rose-950/50 group-hover:scale-105 transition-transform">
                  <span className="text-3xl font-black">♀</span>
                  <span className="absolute -bottom-1 -right-1 text-base">✨</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/20 border border-rose-400/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-rose-300">
                    Opción 1 · Femenino
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-black text-stone-100 mt-1">
                    MUJER
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-serif-luxury text-amber-300 block font-semibold">
                  Mentora Asignada
                </span>
                <span className="text-sm font-bold text-stone-200">
                  {MENTORS.mujer.name}
                </span>
              </div>
            </div>

            {/* Didactic Illustration & Philosophy */}
            <div className="rounded-2xl border border-rose-500/20 bg-rose-950/20 p-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-rose-300 uppercase tracking-wider mb-1.5">
                <HeartHandshake className="h-4 w-4 text-rose-400" />
                <span>Enfoque: Soberanía, Magnetismo & Amor Propio</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed italic border-l-2 border-rose-400 pl-2.5">
                "{MENTORS.mujer.quote}"
              </p>
            </div>

            {/* What you'll master */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Lo que calibrarás en tus 30 días:
              </span>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Disolver la culpa aprendida</strong> al marcar límites y decir "NO".</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Eliminar la disculpa refleja</strong> al hablar o solicitar algo.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span><strong>Presencia magnética</strong> y postura somática de máxima dignidad.</span>
              </div>
            </div>
          </div>

          {/* Big Tactile Click Button */}
          <button
            type="button"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-600 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-rose-950/60 transition-all group-hover:from-rose-500 group-hover:to-amber-500 group-hover:shadow-rose-900/80 active:scale-98 cursor-pointer"
          >
            <span className="text-lg">👩 ♀</span>
            <span>PULSAR: SOY MUJER (Elegir a Clara Luz)</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        {/* ================= CARD 2: HOMBRE (Mentor Leo) ================= */}
        <div
          onClick={() => handleSelect('hombre')}
          className="group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-6 sm:p-7 transition-all duration-300 hover:border-emerald-400 hover:shadow-2xl hover:shadow-emerald-950/70 hover:-translate-y-1 flex flex-col justify-between"
        >
          {/* Glowing Aura Effect */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 h-56 w-56 rounded-full bg-emerald-500/15 blur-3xl group-hover:bg-emerald-500/25 transition-all pointer-events-none" />

          <div>
            {/* Didactic Header with Big Graphic Symbol */}
            <div className="flex items-center justify-between gap-4 mb-5 pb-4 border-b border-emerald-500/20">
              <div className="flex items-center gap-3">
                {/* Visual Mars Symbol (♂) */}
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/30 via-cyan-950/50 to-stone-900 border-2 border-emerald-400/60 text-emerald-300 shadow-lg shadow-emerald-950/50 group-hover:scale-105 transition-transform">
                  <span className="text-3xl font-black">♂</span>
                  <span className="absolute -bottom-1 -right-1 text-base">⚔️</span>
                </div>
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                    Opción 2 · Masculino
                  </span>
                  <h3 className="font-serif-luxury text-2xl font-black text-stone-100 mt-1">
                    HOMBRE
                  </h3>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-serif-luxury text-emerald-300 block font-semibold">
                  Mentor Asignado
                </span>
                <span className="text-sm font-bold text-stone-200">
                  {MENTORS.hombre.name}
                </span>
              </div>
            </div>

            {/* Didactic Illustration & Philosophy */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-4 mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-1.5">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span>Enfoque: Temple, Frialdad Estratégica & Disciplina</span>
              </div>
              <p className="text-xs text-stone-200 leading-relaxed italic border-l-2 border-emerald-400 pl-2.5">
                "{MENTORS.hombre.quote}"
              </p>
            </div>

            {/* What you'll master */}
            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block">
                Lo que calibrarás en tus 30 días:
              </span>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Dominio del pulso reactivo</strong> ante la hostilidad o provocación.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Frialdad y pausa de 3 segundos</strong> en mesas de negociación.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Foco implacable</strong> y ejecución de acuerdos sin ceder terreno.</span>
              </div>
            </div>
          </div>

          {/* Big Tactile Click Button */}
          <button
            type="button"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-4 text-sm font-bold text-white shadow-xl shadow-emerald-950/60 transition-all group-hover:from-emerald-500 group-hover:to-cyan-500 group-hover:shadow-emerald-900/80 active:scale-98 cursor-pointer"
          >
            <span className="text-lg">👨 ♂</span>
            <span>PULSAR: SOY HOMBRE (Elegir a Leo)</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>

      {/* Interactive Helper Indicator */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-xl bg-stone-900/90 border border-stone-800 px-4 py-2 text-xs text-stone-400">
          <Zap className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>Haz clic sobre cualquiera de las tarjetas de arriba para ingresar de inmediato.</span>
        </div>
      </div>
    </div>
  );
};
