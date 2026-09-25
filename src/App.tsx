import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header.tsx';
import { DiagnosticProgressBar } from './components/DiagnosticProgressBar.tsx';
import { MentorSelector } from './components/MentorSelector.tsx';
import { ChatMessage } from './components/ChatMessage.tsx';
import { MasterSheetCard } from './components/MasterSheetCard.tsx';
import { SuggestionsBar } from './components/SuggestionsBar.tsx';
import { RoadmapModal } from './components/RoadmapModal.tsx';
import { EthicalDisclaimerModal } from './components/EthicalDisclaimerModal.tsx';
import { AlterEgoSimulator } from './components/AlterEgoSimulator.tsx';
import { MentorshipAuditView } from './components/MentorshipAuditView.tsx';
import { DailyMissionsView } from './components/DailyMissionsView.tsx';
import { MENTORS } from './data/diagnosticData.ts';
import {
  Message,
  MentorGender,
  MasterSheetData,
  AppMode,
  AlterEgoProfile,
  AuditSessionData,
} from './types.ts';
import { soundManager } from './utils/audio.ts';
import { Send, Sparkles, Loader2 } from 'lucide-react';

const INITIAL_GREETING: Message = {
  id: 'msg-initial-0',
  role: 'assistant',
  text: `Saludos a nombre de Tu Poder Mental IA™. "Comprende tu mente · Abraza tu bienestar · Transforma tu vida".

Estás a punto de iniciar Alter Ego 30D™, el protocolo guiado para construir tu identidad de alto rendimiento y emitir tu Ficha Maestra para arrancar tu programa de 30 días.

Para asignarte al mentor o mentora especializado para tu proceso, por favor indícame tu género:
1. MUJER (se te asignará a la Mentora Clara Luz)
2. HOMBRE (se te asignará al Mentor Leo)`,
  timestamp: Date.now(),
  step: 0,
};

const DEFAULT_ALTER_EGO: AlterEgoProfile = {
  nombre: 'Aurelio Soberano',
  arquetipo: 'El Estratega Silencioso',
  terreno: 'Negociaciones de alta presión y límites inquebrantables',
  totem: 'Reloj mecánico táctico / Anillo de acero',
  enemigo: 'La voz complaciente de la culpa y el síndrome del impostor',
  fisiologia: 'Columna en bloque sólido, barbilla neutra, mirada fija sin parpadeo y voz grave pausada',
  frase: 'Bajo fuego mantengo la calma; en silencio ejecuto la victoria.',
};

export default function App() {
  const [appMode, setAppMode] = useState<AppMode>('mentor_diagnostic');
  const [messages, setMessages] = useState<Message[]>([INITIAL_GREETING]);
  const [inputText, setInputText] = useState('');
  const [gender, setGender] = useState<MentorGender | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [masterSheet, setMasterSheet] = useState<MasterSheetData | null>(null);
  const [alterEgoProfile, setAlterEgoProfile] = useState<AlterEgoProfile>(DEFAULT_ALTER_EGO);
  const [currentProgramDay, setCurrentProgramDay] = useState<number>(1);
  const [stars, setStars] = useState<number>(7);
  const [hearts, setHearts] = useState<number>(3);
  const [auditData, setAuditData] = useState<AuditSessionData>({
    mentor: 'Clara Luz',
    worldCompleted: 1,
    userName: 'Elena',
    alterEgoName: 'Atenea Soberana',
    totem: 'Anillo dorado de obsidiana',
    enemigo: 'La culpa por decir que no y el miedo a defraudar',
    stars: 7,
    hearts: 3,
    diaryNotes:
      'Día 6: En la reunión ejecutiva me pidieron quedarme a trabajar el fin de semana sin aviso. Sentí el viejo nudo en la garganta, pero toqué mi anillo, erguí la columna y dije: "No estoy disponible este fin de semana". No pedí perdón ni di explicaciones. Al salir sentí una pequeña punzada de culpa, pero mi voz no tembló.',
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isRoadmapOpen, setIsRoadmapOpen] = useState<boolean>(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (appMode === 'mentor_diagnostic') {
      scrollToBottom();
    }
  }, [messages, isLoading, masterSheet, appMode]);

  const handleToggleSound = () => {
    const updated = soundManager.toggleSound();
    setSoundEnabled(updated);
  };

  // Helper to detect current step based on text
  const detectStepFromResponse = (text: string, current: number): number => {
    if (text.includes('TU ALTER EGO HA NACIDO') || text.includes('MUNDO 1 (DÍA 1 / 30)')) {
      return 6;
    }
    if (text.includes('Paso 5') || text.includes('Tótem') || text.includes('Cognición Investida')) {
      return 5;
    }
    if (text.includes('Paso 4') || text.includes('Fisiología') || text.includes('Código Físico') || text.includes('Código Corporal')) {
      return 4;
    }
    if (text.includes('Paso 3') || text.includes('Arquetipo de Referencia') || text.includes('figura histórica')) {
      return 3;
    }
    if (text.includes('Paso 2') || text.includes('Enemigo Interior') || text.includes('voz interna')) {
      return 2;
    }
    if (text.includes('Paso 1') || text.includes('Terreno de Bloqueo') || text.includes('haces pequeña') || text.includes('haces pequeño')) {
      return 1;
    }
    return current;
  };

  const sendMessage = async (textToSend: string, overrideGender?: MentorGender) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const activeGender = overrideGender || gender;

    // Check if user is answering gender in text
    let newlyDetectedGender: MentorGender | null = null;
    if (!activeGender) {
      const lower = text.toLowerCase();
      if (lower.includes('mujer') || lower.includes('1') || lower.includes('femenin') || lower.includes('clara')) {
        newlyDetectedGender = 'mujer';
        setGender('mujer');
      } else if (lower.includes('hombre') || lower.includes('2') || lower.includes('masculin') || lower.includes('leo')) {
        newlyDetectedGender = 'hombre';
        setGender('hombre');
      }
    }

    const effectiveGender = overrideGender || newlyDetectedGender || activeGender;

    const userMessage: Message = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
          gender: effectiveGender,
          currentStep,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al conectar con el servidor.');
      }

      const data = await response.json();
      const botText: string = data.text || '';
      const receivedMasterSheet = data.masterSheet || null;

      // Update gender if server returned it
      if (data.gender && !gender) {
        setGender(data.gender);
      }

      const nextStep = data.step !== undefined ? data.step : detectStepFromResponse(botText, currentStep + 1);
      setCurrentStep(nextStep);

      const assistantMessage: Message = {
        id: `msg-bot-${Date.now()}`,
        role: 'assistant',
        text: botText,
        timestamp: Date.now(),
        mentor: effectiveGender === 'hombre' ? 'Mentor Leo' : effectiveGender === 'mujer' ? 'Mentora Clara Luz' : 'Tu Poder Mental IA™',
        step: nextStep,
        masterSheet: receivedMasterSheet,
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (receivedMasterSheet) {
        setMasterSheet(receivedMasterSheet);
        const resolvedName = receivedMasterSheet.nombre.split('/')[0].trim();
        // Sync into tactical roleplay profile
        setAlterEgoProfile({
          nombre: resolvedName,
          arquetipo: receivedMasterSheet.arquetipo,
          terreno: receivedMasterSheet.terreno,
          totem: receivedMasterSheet.totem,
          enemigo: receivedMasterSheet.enemigo,
          fisiologia: receivedMasterSheet.fisiologia,
          frase: receivedMasterSheet.frase,
        });
        // Sync into 1-on-1 audit session
        setAuditData((prev) => ({
          ...prev,
          mentor: effectiveGender === 'hombre' ? 'Leo' : 'Clara Luz',
          alterEgoName: resolvedName,
          totem: receivedMasterSheet.totem,
          enemigo: receivedMasterSheet.enemigo,
        }));
        soundManager.playMasterSheetCeremony();
      } else {
        soundManager.playMessageChime();
      }
    } catch (err) {
      console.error(err);
      const errorMsg: Message = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        text: 'Hubo una pausa en la sincronización. Por favor, repite tu respuesta para que tu mentor pueda continuar con el diagnóstico.',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGenderFromCard = (selectedGender: MentorGender) => {
    setGender(selectedGender);
    const label = selectedGender === 'mujer' ? '1. MUJER (Mentora Clara Luz)' : '2. HOMBRE (Mentor Leo)';
    sendMessage(label, selectedGender);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleReset = () => {
    setMessages([INITIAL_GREETING]);
    setGender(null);
    setCurrentStep(0);
    setMasterSheet(null);
    soundManager.stopSpeaking();
  };

  const currentMentorProfile = gender ? MENTORS[gender] : null;

  return (
    <div className="flex min-h-screen flex-col bg-stone-950 text-stone-100">
      {/* App Header */}
      <Header
        mentor={currentMentorProfile}
        appMode={appMode}
        onSetAppMode={setAppMode}
        hasMasterSheet={Boolean(masterSheet)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenRoadmap={() => setIsRoadmapOpen(true)}
        onOpenDisclaimer={() => setIsDisclaimerOpen(true)}
        onReset={handleReset}
      />

      {/* Render based on appMode */}
      {appMode === 'alter_ego_simulator' ? (
        <AlterEgoSimulator
          profile={alterEgoProfile}
          onUpdateProfile={setAlterEgoProfile}
          onSwitchToDiagnostic={() => setAppMode('mentor_diagnostic')}
        />
      ) : appMode === 'daily_missions' ? (
        <DailyMissionsView
          gender={gender || 'mujer'}
          mentorName={gender === 'hombre' ? 'Leo' : 'Clara Luz'}
          currentDay={currentProgramDay}
          onSetCurrentDay={setCurrentProgramDay}
          stars={stars}
          hearts={hearts}
          onUpdateMetrics={(newStars, newHearts) => {
            setStars(newStars);
            setHearts(newHearts);
            setAuditData((prev) => ({
              ...prev,
              stars: newStars,
              hearts: newHearts,
            }));
          }}
          onOpenAudit={() => setAppMode('mentorship_audit')}
        />
      ) : appMode === 'mentorship_audit' ? (
        <MentorshipAuditView
          auditData={auditData}
          onUpdateAuditData={setAuditData}
          onSwitchToDiagnostic={() => setAppMode('mentor_diagnostic')}
          onSwitchToSimulator={() => setAppMode('alter_ego_simulator')}
        />
      ) : (
        <>
          {/* Diagnostic Progress Tracker */}
          <DiagnosticProgressBar
            currentStep={currentStep}
            hasMasterSheet={Boolean(masterSheet)}
          />

          {/* Main Conversation Container */}
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
            <div className="mx-auto max-w-4xl">
              {/* Welcome & Mentor Selection Banner if at Step 0 */}
              {!gender && currentStep === 0 && (
                <MentorSelector
                  onSelectGender={handleSelectGenderFromCard}
                  isLoading={isLoading}
                />
              )}

              {/* Messages Feed */}
              <div className="space-y-4">
                {messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg}
                    mentorGender={gender}
                    onSelectGender={handleSelectGenderFromCard}
                  />
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3 text-stone-400 text-sm my-4 pl-12 animate-pulse">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    <span>
                      {gender === 'mujer'
                        ? 'Mentora Clara Luz está analizando tu código interior...'
                        : gender === 'hombre'
                        ? 'Mentor Leo está formulando tu estrategia...'
                        : 'Sincronizando con Tu Poder Mental IA™...'}
                    </span>
                  </div>
                )}

                {/* Display Master Sheet Card prominently if generated */}
                {masterSheet && (
                  <MasterSheetCard
                    data={masterSheet}
                    mentorGender={gender}
                    onExploreWorld1={() => setAppMode('daily_missions')}
                    onLaunchSimulator={() => setAppMode('alter_ego_simulator')}
                  />
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>
          </main>

          {/* Quick 1-Click Gender Selector bar if gender not selected yet */}
          {!gender && (
            <div className="w-full border-t border-amber-500/30 bg-stone-950/95 px-4 py-3 backdrop-blur-md">
              <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                  <span>Pulsa o haz un clic para seleccionar tu rama:</span>
                </span>
                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => handleSelectGenderFromCard('mujer')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border-2 border-rose-500/60 bg-gradient-to-r from-rose-950 via-stone-900 to-stone-900 px-4 py-2.5 text-xs font-extrabold text-rose-200 hover:border-rose-400 hover:bg-rose-950 hover:scale-[1.02] transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span className="text-base">👩 ♀</span>
                    <span>1. SOY MUJER (Clara Luz)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectGenderFromCard('hombre')}
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-500/60 bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 px-4 py-2.5 text-xs font-extrabold text-emerald-200 hover:border-emerald-400 hover:bg-emerald-950 hover:scale-[1.02] transition-all shadow-md active:scale-98 cursor-pointer"
                  >
                    <span className="text-base">👨 ♂</span>
                    <span>2. SOY HOMBRE (Leo)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Dynamic Suggestions Bar for Steps 1-5 */}
          {gender && currentStep >= 1 && currentStep <= 5 && !masterSheet && (
            <SuggestionsBar
              step={currentStep}
              gender={gender}
              onSelectSuggestion={handleSelectSuggestion}
              disabled={isLoading}
            />
          )}

          {/* Input controls footer */}
          <footer className="sticky bottom-0 z-20 border-t border-stone-800/80 bg-stone-950/95 p-3 sm:p-4 backdrop-blur-md no-print">
            <div className="mx-auto max-w-4xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(inputText);
                }}
                className="flex items-center gap-2"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      !gender
                        ? 'Indica tu género: "1. Mujer" o "2. Hombre"...'
                        : currentStep === 1
                        ? 'Describe tu terreno de bloqueo cotidiano o profesional...'
                        : currentStep === 2
                        ? '¿Qué frases destructivas te susurra tu enemigo interior?...'
                        : currentStep === 3
                        ? 'Nombra a tu figura histórica o arquetipo de referencia...'
                        : currentStep === 4
                        ? 'Describe tu código físico (postura, barbilla, mirada, voz)...'
                        : currentStep === 5
                        ? '¿Cuál será tu tótem o ritual físico de activación?...'
                        : 'Escribe tu mensaje a tu mentor...'
                    }
                    disabled={isLoading}
                    className="w-full rounded-2xl border border-stone-800 bg-stone-900/90 py-3.5 pl-4 pr-12 text-sm text-stone-100 placeholder-stone-500 shadow-inner focus:border-amber-500/60 focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500/40 disabled:opacity-50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                    <Sparkles className="h-4 w-4 text-amber-500/40" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold transition-all hover:from-amber-500 hover:to-amber-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-amber-950/50 cursor-pointer"
                  aria-label="Enviar respuesta"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              {/* Micro-footer copyright and ethics */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
                <span>Tu Poder Mental IA™ · Alter Ego 30D™</span>
                <span>Un turno a la vez · Protocolo de 5 Pasos</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Modals */}
      <RoadmapModal
        isOpen={isRoadmapOpen}
        onClose={() => setIsRoadmapOpen(false)}
        hasMasterSheet={Boolean(masterSheet)}
      />

      <EthicalDisclaimerModal
        isOpen={isDisclaimerOpen}
        onClose={() => setIsDisclaimerOpen(false)}
      />
    </div>
  );
}
