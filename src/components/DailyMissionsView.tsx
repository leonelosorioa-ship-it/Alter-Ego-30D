import React, { useState, useEffect } from 'react';
import { DailyMission, MentorGender } from '../types.ts';
import { soundManager } from '../utils/audio.ts';
import {
  Calendar,
  Flame,
  Star,
  Heart,
  CheckCircle2,
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Send,
  ArrowRight,
  Clock,
  Award,
  ChevronLeft,
  ChevronRight,
  Shield,
  Layers,
  History,
} from 'lucide-react';

interface DailyMissionsViewProps {
  gender: MentorGender;
  mentorName: 'Clara Luz' | 'Leo';
  currentDay: number;
  onSetCurrentDay: (day: number) => void;
  stars: number;
  hearts: number;
  onUpdateMetrics: (newStars: number, newHearts: number) => void;
  onOpenAudit: () => void;
}

export const DailyMissionsView: React.FC<DailyMissionsViewProps> = ({
  gender,
  mentorName,
  currentDay,
  onSetCurrentDay,
  stars,
  hearts,
  onUpdateMetrics,
  onOpenAudit,
}) => {
  const isClara = mentorName === 'Clara Luz';

  const [activeDay, setActiveDay] = useState<number>(currentDay || 1);
  const [missionsMap, setMissionsMap] = useState<Record<number, DailyMission>>({});
  const [journalInput, setJournalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Fetch or load mission for activeDay
  useEffect(() => {
    const fetchMission = async () => {
      // If already loaded and has fullText, don't refetch
      if (missionsMap[activeDay]?.fullText) return;

      setIsLoading(true);
      try {
        const response = await fetch('/api/daily-mission', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'get_mission',
            day: activeDay,
            gender,
            mentor: mentorName,
          }),
        });

        if (!response.ok) throw new Error('Error al cargar la misión diaria.');

        const data = await response.json();
        setMissionsMap((prev) => ({
          ...prev,
          [activeDay]: {
            day: activeDay,
            worldNum: data.worldNum,
            worldName: data.worldName,
            title: data.title,
            fullText: data.fullText,
            question: data.question,
            completed: prev[activeDay]?.completed || false,
            journalEntry: prev[activeDay]?.journalEntry || '',
            feedback: prev[activeDay]?.feedback || '',
          },
        }));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMission();
  }, [activeDay, gender, mentorName]);

  const currentMission = missionsMap[activeDay] || {
    day: activeDay,
    worldNum: activeDay <= 7 ? 1 : activeDay <= 15 ? 2 : activeDay <= 23 ? 3 : 4,
    worldName: activeDay <= 7 ? 'El Bautizo del Personaje y el Código Físico' : 'El Umbral y la Máscara',
    title: `Micro-Misión · Día ${activeDay}`,
    fullText: 'Cargando protocolo diario...',
    question: '¿Qué observaste en tu cuerpo y en tu entorno al ejecutar esta acción?',
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      soundManager.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundManager.speak(currentMission.fullText, gender, () => {
        setIsSpeaking(false);
      });
    }
  };

  const handleSubmitJournal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalInput.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/daily-mission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'submit_journal',
          day: activeDay,
          gender,
          mentor: mentorName,
          journalEntry: journalInput,
          currentStars: stars,
          currentHearts: hearts,
        }),
      });

      if (!response.ok) throw new Error('Error al registrar la entrada del diario.');

      const data = await response.json();

      // Update mission record
      setMissionsMap((prev) => ({
        ...prev,
        [activeDay]: {
          ...currentMission,
          completed: true,
          journalEntry: journalInput,
          feedback: data.feedback,
          completedAt: Date.now(),
        },
      }));

      // Update global metrics
      onUpdateMetrics(data.newStars || stars + 1, data.hearts || hearts);
      if (activeDay >= currentDay && activeDay < 30) {
        onSetCurrentDay(activeDay + 1);
      }

      setJournalInput('');
      soundManager.playMasterSheetCeremony();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWorldForDay = (d: number) => {
    if (d <= 7) return 1;
    if (d <= 15) return 2;
    if (d <= 23) return 3;
    return 4;
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-130px)] bg-stone-950">
      {/* Top Protocol HUD */}
      <div className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-4xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border text-xl shadow-md ${
                isClara
                  ? 'border-amber-500/50 bg-amber-950 text-amber-300'
                  : 'border-emerald-500/50 bg-emerald-950 text-emerald-300'
              }`}
            >
              <Calendar className="h-5 w-5" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-0.5">
                  Despacho de Misiones 30D
                </span>
                <span className="text-xs text-stone-400 font-light">
                  5 a 10 min diarios
                </span>
              </div>
              <h2 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-100">
                Mundo {getWorldForDay(activeDay)} · Día {activeDay} de 30
              </h2>
            </div>
          </div>

          {/* Metrics & History Switcher */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 rounded-xl px-3 py-1.5 text-xs">
              <span className="flex items-center gap-1 text-yellow-400 font-bold">
                <Star className="h-3.5 w-3.5 fill-yellow-400" />
                <span>{stars} ⭐</span>
              </span>
              <span aria-hidden="true" className="text-stone-700">·</span>
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="h-3.5 w-3.5 fill-rose-500" />
                <span>{hearts} ❤️</span>
              </span>
            </div>

            <button
              onClick={() => setShowHistory(!showHistory)}
              className={`flex items-center gap-1 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                showHistory
                  ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold'
                  : 'border-stone-800 bg-stone-900 text-stone-300 hover:text-white'
              }`}
            >
              <History className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Diario ({Object.values(missionsMap).filter((m) => m.completed).length})</span>
            </button>

            {[7, 14, 21, 30].includes(activeDay) && (
              <button
                onClick={onOpenAudit}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-950/40 hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer animate-pulse"
              >
                <Award className="h-3.5 w-3.5" />
                <span>Auditoría 1-a-1</span>
              </button>
            )}
          </div>
        </div>

        {/* Days Selector Carousel (1-30) */}
        <div className="mx-auto max-w-4xl mt-3 pt-3 border-t border-stone-850">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
              const isSelected = activeDay === d;
              const isCompleted = missionsMap[d]?.completed;
              const isAuditDay = [7, 14, 21, 30].includes(d);

              return (
                <button
                  key={d}
                  onClick={() => setActiveDay(d)}
                  className={`flex-shrink-0 flex flex-col items-center justify-center h-10 w-10 sm:h-11 sm:w-11 rounded-xl border text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-400 bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-500/20 scale-105'
                      : isCompleted
                      ? 'border-emerald-500/50 bg-emerald-950/80 text-emerald-300'
                      : isAuditDay
                      ? 'border-amber-500/40 bg-stone-900 text-amber-300'
                      : 'border-stone-800/80 bg-stone-900/60 text-stone-400 hover:border-stone-700 hover:text-stone-200'
                  }`}
                  title={`Día ${d}${isAuditDay ? ' · Fin de Mundo (Auditoría)' : ''}`}
                >
                  <span className="text-[10px] opacity-75">D</span>
                  <span className="font-bold">{d}</span>
                  {isCompleted && (
                    <span className="h-1 w-1 rounded-full bg-emerald-400 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-6">
          {showHistory ? (
            /* Journal History View */
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div className="flex items-center gap-2 text-stone-100 font-serif-luxury text-xl font-bold">
                  <BookOpen className="h-5 w-5 text-amber-400" />
                  <span>Bitácora y Diario de Rendimiento (30 Días)</span>
                </div>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-xs text-amber-400 hover:underline"
                >
                  Volver a Misión del Día
                </button>
              </div>

              {Object.values(missionsMap).filter((m) => m.completed).length === 0 ? (
                <div className="rounded-2xl border border-stone-800 bg-stone-900/50 p-8 text-center text-stone-400">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-stone-600" />
                  <p className="text-sm">Aún no has registrado reflexiones en tu diario.</p>
                  <p className="text-xs text-stone-500 mt-1">Completa la misión de hoy para inaugurar tu bitácora.</p>
                </div>
              ) : (
                Object.values(missionsMap)
                  .filter((m) => m.completed)
                  .sort((a, b) => b.day - a.day)
                  .map((entry) => (
                    <div
                      key={entry.day}
                      className="rounded-2xl border border-stone-800 bg-stone-900/70 p-5 space-y-3"
                    >
                      <div className="flex items-center justify-between text-xs border-b border-stone-800 pb-2">
                        <span className="font-serif-luxury font-bold text-amber-300">
                          DÍA {entry.day}: {entry.title}
                        </span>
                        <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Completada (+1 ⭐)</span>
                        </span>
                      </div>

                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                          Tu Reflexión Somática:
                        </span>
                        <p className="text-sm text-stone-200 italic bg-stone-950/80 p-3 rounded-xl border border-stone-850">
                          "{entry.journalEntry}"
                        </p>
                      </div>

                      {entry.feedback && (
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                            Retroalimentación de {mentorName}:
                          </span>
                          <div className="text-xs text-stone-300 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20 whitespace-pre-wrap leading-relaxed">
                            {entry.feedback}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          ) : (
            /* Single Day Mission & Journal Flow */
            <>
              {/* Daily Mission Card */}
              <div className="relative overflow-hidden rounded-3xl border border-amber-500/40 bg-gradient-to-b from-stone-900 via-stone-900/90 to-stone-950 p-6 sm:p-8 shadow-xl">
                {/* Header tag */}
                <div className="flex items-center justify-between gap-2 border-b border-stone-800 pb-4 mb-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                    <span className="font-serif-luxury text-xs sm:text-sm font-bold text-amber-300 uppercase tracking-wider">
                      Mundo {currentMission.worldNum}: {currentMission.worldName} · DÍA {activeDay}
                    </span>
                  </div>

                  <button
                    onClick={handleSpeak}
                    className={`rounded-lg border border-stone-800 p-2 text-xs transition-colors ${
                      isSpeaking ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Escuchar la misión en voz alta"
                  >
                    {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </button>
                </div>

                {/* Title & Consignatoria */}
                <div className="space-y-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                      TÍTULO DE LA ACCIÓN:
                    </span>
                    <h3 className="font-serif-luxury text-xl sm:text-2xl font-extrabold text-stone-100">
                      {currentMission.title}
                    </h3>
                  </div>

                  <div className="rounded-2xl border border-stone-800 bg-stone-950/70 p-5">
                    <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-2">
                      <Clock className="h-4 w-4" />
                      <span>Consignatoria Práctica (5 a 10 min):</span>
                    </div>
                    <div className="text-sm text-stone-200 leading-relaxed whitespace-pre-wrap">
                      {currentMission.fullText.includes('**CONSIGNATORIA')
                        ? currentMission.fullText
                            .split('**CONSIGNATORIA')[1]
                            ?.split('**PREGUNTA')[0]
                            ?.replace(/[:(5\-10 min)]/g, '')
                            ?.trim()
                        : currentMission.fullText}
                    </div>
                  </div>

                  {/* Question */}
                  <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-300 block mb-1">
                      PREGUNTA DE CIERRE PARA EL DIARIO:
                    </span>
                    <p className="text-sm font-serif-luxury italic text-stone-200">
                      "{currentMission.question}"
                    </p>
                  </div>
                </div>

                {/* If already completed, show status & feedback */}
                {currentMission.completed && (
                  <div className="mt-6 pt-5 border-t border-stone-800 space-y-4 animate-in fade-in">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Misión Consolidada · +1 ⭐ Acreditada</span>
                    </div>

                    <div className="rounded-xl border border-stone-800 bg-stone-950 p-4">
                      <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold block mb-1">
                        Tu Entrada de Diario:
                      </span>
                      <p className="text-xs text-stone-200 italic">
                        "{currentMission.journalEntry}"
                      </p>
                    </div>

                    {currentMission.feedback && (
                      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                        <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold block mb-1">
                          Validación Oficial de {mentorName}:
                        </span>
                        <div className="text-xs text-stone-200 whitespace-pre-wrap leading-relaxed">
                          {currentMission.feedback}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Journal Reflection Box (if not completed or editing) */}
              {!currentMission.completed && (
                <div className="rounded-3xl border border-stone-800 bg-stone-900/80 p-6 sm:p-8 space-y-4 shadow-lg">
                  <div className="flex items-center gap-2 text-stone-100 font-serif-luxury text-lg font-bold">
                    <BookOpen className="h-5 w-5 text-amber-400" />
                    <span>Registrar Reflexión en tu Diario Diario</span>
                  </div>
                  <p className="text-xs text-stone-400">
                    Escribe qué sensaciones experimentaste en tu postura, barbilla, respiración o tono de voz, y cómo reaccionó tu entorno.
                  </p>

                  <form onSubmit={handleSubmitJournal} className="space-y-4">
                    <textarea
                      value={journalInput}
                      onChange={(e) => setJournalInput(e.target.value)}
                      rows={4}
                      disabled={isSubmitting}
                      className="w-full rounded-2xl border border-stone-800 bg-stone-950 p-4 text-sm text-stone-100 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none leading-relaxed"
                      placeholder="Ej: Toqué mi tótem antes de hablar. Sentí cómo la columna se enderezaba de inmediato y pude sostener la mirada sin pestañeo ansioso..."
                      required
                    />

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <span className="text-[11px] text-stone-500">
                        Al enviar tu nota, recibirás retroalimentación automática y +1 ⭐.
                      </span>

                      <button
                        type="submit"
                        disabled={isSubmitting || !journalInput.trim()}
                        className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 px-5 py-3 text-xs font-bold text-stone-950 shadow-md shadow-amber-950/40 hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{isSubmitting ? 'Validando con tu Mentor...' : 'Registrar Diario y Ganar ⭐'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
