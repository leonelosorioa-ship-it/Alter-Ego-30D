import React from 'react';
import { X, ShieldAlert, HeartPulse, Stethoscope, Sparkles } from 'lucide-react';

interface EthicalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EthicalDisclaimerModal: React.FC<EthicalDisclaimerModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-950 p-6 sm:p-8 shadow-2xl text-stone-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 rounded-full border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
              Tu Poder Mental IA™
            </span>
            <h3 className="font-serif-luxury text-xl font-bold text-stone-100">
              Postura y Descargo Ético
            </h3>
          </div>
        </div>

        <div className="space-y-4 text-sm text-stone-300 leading-relaxed">
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
            <p className="font-medium text-stone-200">
              Alter Ego 30D™ es una herramienta de psicología del rendimiento, entrenamiento de hábitos, cognición investida y desarrollo de liderazgo personal.
            </p>
          </div>

          <div className="flex items-start gap-3 text-xs text-stone-400">
            <Stethoscope className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-stone-300">No sustituye atención médica ni psicoterapia:</strong> La aplicación no diagnostica, trata ni interviene en desórdenes psiquiátricos, traumas clínicos, depresión severa o ideación autolítica.
            </p>
          </div>

          <div className="flex items-start gap-3 text-xs text-stone-400">
            <HeartPulse className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-stone-300">Asistencia profesional prioritaria:</strong> Si estás experimentando una crisis emocional grave o sufrimiento psíquico incapacitante, te recomendamos acudir con un psicólogo o médico psiquiatra certificado de inmediato.
            </p>
          </div>

          <div className="flex items-start gap-3 text-xs text-stone-400">
            <Sparkles className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-stone-300">Soberanía y compromiso:</strong> La construcción del Alter Ego se fundamenta en el principio de autosoberanía y práctica deliberada guiada por los principios del método.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-stone-800 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-stone-800 hover:bg-stone-700 px-5 py-2.5 text-xs font-semibold text-stone-100 transition-colors"
          >
            Entendido y Aceptado
          </button>
        </div>
      </div>
    </div>
  );
};
