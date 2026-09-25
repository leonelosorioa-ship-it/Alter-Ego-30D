import React, { useState } from 'react';
import { MasterSheetData } from '../types.ts';
import {
  Sparkles,
  Copy,
  Check,
  Printer,
  Download,
  Shield,
  Award,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import { soundManager } from '../utils/audio.ts';

interface MasterSheetCardProps {
  data: MasterSheetData;
  mentorGender?: 'mujer' | 'hombre' | null;
  onExploreWorld1?: () => void;
  onLaunchSimulator?: () => void;
}

export const MasterSheetCard: React.FC<MasterSheetCardProps> = ({
  data,
  mentorGender,
  onExploreWorld1,
  onLaunchSimulator,
}) => {
  const [copied, setCopied] = useState(false);
  const [day1Completed, setDay1Completed] = useState(false);

  const handleCopyExact = () => {
    navigator.clipboard.writeText(data.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([data.fullText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `Alter-Ego-Ficha-Maestra-Dia-1.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleDay1Ritual = () => {
    const nextState = !day1Completed;
    setDay1Completed(nextState);
    if (nextState) {
      soundManager.playMasterSheetCeremony();
    }
  };

  return (
    <div className="my-8 w-full max-w-3xl mx-auto">
      {/* Luxury Golden Obsidian Frame */}
      <div className="relative overflow-hidden rounded-3xl border-2 border-amber-500/50 bg-gradient-to-b from-stone-900 via-stone-950 to-black p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
        {/* Decorative corner accents */}
        <div className="absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 border-amber-400/80" />
        <div className="absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 border-amber-400/80" />
        <div className="absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 border-amber-400/80" />
        <div className="absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 border-amber-400/80" />

        {/* Ambient background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

        {/* Header Emblem */}
        <div className="text-center pb-6 border-b border-stone-800 relative z-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-amber-400/90 font-medium mb-1">
            <Award className="h-4 w-4" />
            <span>Tu Poder Mental IA™ · Programa Oficial</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-400 uppercase tracking-tight mt-1">
            🌟 {data.mentor}: TU ALTER EGO HA NACIDO
          </h2>

          <p className="text-xs text-stone-400 font-light mt-1">
            Ficha Maestra de Rendimiento · Umbral del Día 1 / 30
          </p>
        </div>

        {/* Structured Master Sheet Grid */}
        <div className="mt-6 space-y-4 text-stone-200 text-sm sm:text-base relative z-10">
          {/* Nombre & Arquetipo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                • Nombre de tu Alter Ego
              </span>
              <p className="font-serif-luxury text-lg font-bold text-stone-100">
                {data.nombre}
              </p>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
                • Arquetipo Dominante
              </span>
              <p className="font-serif-luxury text-lg font-bold text-amber-200">
                {data.arquetipo}
              </p>
            </div>
          </div>

          {/* Campo de Batalla / Terreno */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              • Campo de Batalla / Terreno
            </span>
            <p className="text-stone-300 font-light leading-relaxed">
              {data.terreno}
            </p>
          </div>

          {/* Tu Enemigo Interno Silenciado */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-red-400/90 block mb-1">
              • Tu Enemigo Interno Silenciado
            </span>
            <p className="text-stone-300 font-light leading-relaxed">
              {data.enemigo}
            </p>
          </div>

          {/* Código Físico y Presencia */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              • Código Físico y Presencia
            </span>
            <p className="text-stone-300 font-light leading-relaxed">
              {data.fisiologia}
            </p>
          </div>

          {/* Tu Tótem Activador */}
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 block mb-1">
              • Tu Tótem Activador (Cognición Investida)
            </span>
            <p className="text-stone-200 font-medium leading-relaxed">
              {data.totem}
            </p>
          </div>

          {/* Frase de Choque (Proclamación) */}
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-stone-900 to-amber-950/40 p-5 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-400 block mb-2">
              • Frase de Choque (Proclamación)
            </span>
            <blockquote className="font-serif-luxury text-lg sm:text-xl font-bold italic text-amber-100">
              "{data.frase}"
            </blockquote>
          </div>
        </div>

        {/* MUNDO 1 (DÍA 1 / 30) BANNER */}
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-5 text-stone-200 relative z-10">
          <div className="flex items-center gap-2 mb-2 text-amber-300 font-serif-luxury font-bold text-base">
            <Flame className="h-5 w-5 text-amber-400 animate-pulse" />
            <span>🎯 MUNDO 1 (DÍA 1 / 30): "El Bautizo del Personaje"</span>
          </div>
          <p className="text-sm text-stone-300 leading-relaxed">
            Escribe esta ficha con tu puño y letra en tu libreta de notas. Coloca tu tótem frente a ti. Mañana en el Día 2 cruzaremos el umbral hacia tu arena de juego.
          </p>

          {/* Interactive ritual confirmation checkbox and Simulator CTA */}
          <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={toggleDay1Ritual}
              className={`flex items-center justify-center gap-2.5 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                day1Completed
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white'
              }`}
            >
              <CheckCircle2 className={`h-4 w-4 ${day1Completed ? 'text-white' : 'text-stone-500'}`} />
              <span>{day1Completed ? '✓ Día 1 Consagrado (Ritual Completado)' : 'Marcar Ritual Día 1 como Completado'}</span>
            </button>

            {onLaunchSimulator && (
              <button
                onClick={onLaunchSimulator}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2.5 text-xs font-bold text-stone-950 shadow-lg shadow-amber-950/40 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer animate-pulse"
              >
                <span>⚡ Ensayar en Simulador Táctico 24/7</span>
              </button>
            )}
          </div>
        </div>

        {/* Action buttons (Copy, Download, Print) */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-stone-800 pt-5 no-print relative z-10">
          <div className="text-xs text-stone-500">
            Documento Oficial Alter Ego 30D™
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyExact}
              className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/40 hover:text-amber-200"
              title="Copiar texto exacto de la Ficha Maestra"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copiado al Portapapeles' : 'Copiar Ficha'}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/40 hover:text-amber-200"
              title="Descargar Ficha en archivo de texto"
            >
              <Download className="h-4 w-4" />
              <span>Descargar .txt</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-stone-800 bg-stone-900 px-3.5 py-2 text-xs font-medium text-stone-300 transition-colors hover:border-amber-500/40 hover:text-amber-200"
              title="Imprimir o guardar como PDF"
            >
              <Printer className="h-4 w-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
