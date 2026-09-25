import React, { useState, useRef, useEffect } from 'react';
import { AuditSessionData, Message } from '../types.ts';
import { soundManager } from '../utils/audio.ts';
import {
  Award,
  Crown,
  Shield,
  Sparkles,
  Send,
  BookOpen,
  Star,
  Heart,
  Key,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Calendar,
  Lock,
  Unlock,
  Coins,
  ArrowRight,
  Flame,
  CheckCircle2,
  User,
  Sliders,
  Download,
} from 'lucide-react';

interface MentorshipAuditViewProps {
  auditData: AuditSessionData;
  onUpdateAuditData: (updated: AuditSessionData) => void;
  onSwitchToDiagnostic: () => void;
  onSwitchToSimulator: () => void;
}

const DEFAULT_DIARY_ENTRIES: Record<number, { mujer: string; hombre: string }> = {
  1: {
    mujer:
      'Día 6: En la reunión ejecutiva me pidieron quedarme a trabajar el fin de semana sin aviso. Sentí el viejo nudo en la garganta, pero toqué mi anillo, erguí la columna y dije: "No estoy disponible este fin de semana". No pedí perdón ni di explicaciones. Al salir sentí una pequeña punzada de culpa, pero mi voz no tembló.',
    hombre:
      'Día 6: Un cliente intentó presionarme por teléfono diciendo que cancelaría el contrato si no le regalaba servicios extra. Antes de responder, respiré 3 segundos y ajusté el reloj. Le respondí con voz grave: "El alcance contratado es el pactado; si deseas ampliarlo, con gusto te envío la adenda económica". Hubo silencio incómodo, pero aceptó.',
  },
  2: {
    mujer:
      'Día 13: Me puse mi blazer sastre y mi tótem para la negociación con proveedores. Cuando intentaron descalificar mi propuesta, los miré a los ojos fijamente sin pestañear ansiosa. Por primera vez en meses sentí que el magnetismo de mi Alter Ego operaba antes de que yo hablara.',
    hombre:
      'Día 13: Fricción fuerte con un socio en el directorio. Sentí el calor subir para discutir impulsivo, pero recordé la directriz de Leo: "quien no se mueve bajo presión, manda". Me quedé en silencio absoluto 4 segundos, anoté en mi libreta y dicté los términos con calma de acero.',
  },
  3: {
    mujer:
      'Día 20: Puse un límite definitivo a un familiar que siempre me manipulaba con el chantaje emocional. Le dije: "Te amo, pero esa no es mi responsabilidad". Esta vez la culpa ya no tuvo poder sobre mí. Mi soberanía es intocable.',
    hombre:
      'Día 20: Presentación de resultados ante inversores agresivos. Dos preguntas intentaron hacerme dudar de mi capacidad. Respondí con datos puros, sin disculpas y sin titubear. Neutralicé el ataque de inmediato.',
  },
  4: {
    mujer:
      'Día 29: Ya no tengo que "hacer el esfuerzo" de actuar como mi Alter Ego; la máscara y yo somos una misma. Me miro al espejo y veo a una mujer que no pide disculpas por brillar ni por mandar en su vida.',
    hombre:
      'Día 29: Cumplí los 30 días de disciplina implacable. El miedo a la hostilidad desapareció. Las decisiones difíciles ahora se toman con la serenidad de quien conoce su propio calibre.',
  },
};

export const MentorshipAuditView: React.FC<MentorshipAuditViewProps> = ({
  auditData,
  onUpdateAuditData,
  onSwitchToDiagnostic,
  onSwitchToSimulator,
}) => {
  const isClara = auditData.mentor === 'Clara Luz';
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Start the 1-on-1 audit session
  const startAuditSession = async () => {
    setIsSessionStarted(true);
    setIsLoading(true);

    const initUserPrompt = `Iniciando sesión privada de auditoría y mentoría 1-a-1 por la conquista del Mundo ${auditData.worldCompleted}.`;

    try {
      const response = await fetch('/api/mentorship-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: initUserPrompt }],
          auditData,
        }),
      });

      if (!response.ok) throw new Error('Error al conectar con la sesión de mentoría.');

      const data = await response.json();
      const botText = data.text || '';

      const mentorMessage: Message = {
        id: `audit-mentor-${Date.now()}`,
        role: 'assistant',
        text: botText,
        timestamp: Date.now(),
        mentor: isClara ? 'Mentora Clara Luz' : 'Mentor Leo',
      };

      setMessages([mentorMessage]);
      soundManager.playMasterSheetCeremony();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMessage: Message = {
      id: `audit-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/mentorship-audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          auditData,
        }),
      });

      if (!response.ok) throw new Error('Error en auditoría');

      const data = await response.json();
      const botText = data.text || '';

      const mentorMsg: Message = {
        id: `audit-bot-${Date.now()}`,
        role: 'assistant',
        text: botText,
        timestamp: Date.now(),
        mentor: isClara ? 'Mentora Clara Luz' : 'Mentor Leo',
      };

      setMessages((prev) => [...prev, mentorMsg]);
      soundManager.playMessageChime();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      soundManager.stopSpeaking();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      soundManager.speak(text, isClara ? 'mujer' : 'hombre', () => {
        setSpeakingId(null);
      });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSelectWorld = (worldNum: number) => {
    const defaultDiary = isClara
      ? DEFAULT_DIARY_ENTRIES[worldNum]?.mujer
      : DEFAULT_DIARY_ENTRIES[worldNum]?.hombre;

    onUpdateAuditData({
      ...auditData,
      worldCompleted: worldNum,
      diaryNotes: defaultDiary || auditData.diaryNotes,
      stars: worldNum * 7,
    });
    setMessages([]);
    setIsSessionStarted(false);
  };

  const handleDownloadDecree = () => {
    const content = messages.map((m) => `${m.role === 'user' ? auditData.userName : auditData.mentor}:\n${m.text}`).join('\n\n---\n\n');
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Decreto-Auditoria-Mundo-${auditData.worldCompleted}-${auditData.userName}.txt`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-130px)] bg-stone-950">
      {/* Sanctum Header */}
      <div className="sticky top-0 z-20 border-b border-stone-800 bg-stone-950/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-xl shadow-md ${
                isClara
                  ? 'border-amber-500/50 bg-gradient-to-br from-amber-600/30 to-rose-950/50 text-amber-300'
                  : 'border-emerald-500/50 bg-gradient-to-br from-emerald-600/30 to-cyan-950/50 text-emerald-300'
              }`}
            >
              <Award className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded px-2 py-0.5">
                  Premio de Fin de Mundo
                </span>
                <span className="text-xs text-stone-400 font-light">
                  Días 7 · 14 · 21 · 30
                </span>
              </div>
              <h2 className="font-serif-luxury text-lg sm:text-xl font-bold text-stone-100">
                Sesión Privada de Mentoría 1-a-1 con {auditData.mentor}
              </h2>
            </div>
          </div>

          {/* World Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-900 border border-stone-800 rounded-xl">
            {[1, 2, 3, 4].map((w) => {
              const isSelected = auditData.worldCompleted === w;
              const days = w === 1 ? 'D7' : w === 2 ? 'D14' : w === 3 ? 'D21' : 'D30';

              return (
                <button
                  key={w}
                  onClick={() => handleSelectWorld(w)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                  title={`Auditoría de Mundo ${w}`}
                >
                  <span>Mundo {w}</span>
                  <span className="text-[10px] opacity-75">({days})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Memory Dossier Banner */}
        <div className="mx-auto max-w-4xl mt-3 pt-3 border-t border-stone-850 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-stone-300">
            <span className="flex items-center gap-1 text-stone-400">
              <User className="h-3.5 w-3.5 text-stone-500" />
              <span>{auditData.userName}</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="flex items-center gap-1 text-amber-300 font-medium">
              <Crown className="h-3.5 w-3.5" />
              <span>{auditData.alterEgoName}</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="flex items-center gap-1 text-yellow-400 font-semibold">
              <Star className="h-3.5 w-3.5 fill-yellow-400" />
              <span>{auditData.stars} ⭐ Racha</span>
            </span>
            <span aria-hidden="true" className="text-stone-700">·</span>
            <span className="flex items-center gap-1 text-rose-400 font-semibold">
              <Heart className="h-3.5 w-3.5 fill-rose-500" />
              <span>{auditData.hearts} ❤️ Vidas</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDossierOpen(!isDossierOpen)}
              className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs text-stone-300 hover:border-stone-700 hover:text-white"
            >
              <BookOpen className="h-3.5 w-3.5 text-amber-400" />
              <span>{isDossierOpen ? 'Ocultar Diario' : 'Ver Diario Auditado'}</span>
            </button>

            {messages.length > 0 && (
              <button
                onClick={handleDownloadDecree}
                className="flex items-center gap-1 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1 text-xs text-stone-300 hover:border-amber-500/40 hover:text-amber-200"
                title="Descargar Decreto de la Sesión"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Decreto .txt</span>
              </button>
            )}
          </div>
        </div>

        {/* Collapsible Diary Dossier Drawer */}
        {isDossierOpen && (
          <div className="mx-auto max-w-4xl mt-3 rounded-2xl border border-stone-800 bg-stone-900/80 p-4 animate-in fade-in">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Extracto del Diario de {auditData.userName} (Mundo {auditData.worldCompleted})</span>
              </span>
              <span className="text-[11px] text-stone-500">
                Puedes editar estas notas para personalizar la auditoría del mentor:
              </span>
            </div>

            <textarea
              value={auditData.diaryNotes}
              onChange={(e) =>
                onUpdateAuditData({ ...auditData, diaryNotes: e.target.value })
              }
              rows={3}
              className="w-full rounded-xl border border-stone-800 bg-stone-950 p-3 text-xs text-stone-200 placeholder-stone-500 focus:border-amber-500/60 focus:outline-none leading-relaxed"
              placeholder="Escribe o ajusta las notas de tu semana que el mentor auditará en la sesión..."
            />
          </div>
        )}
      </div>

      {/* Main Chamber Conversation */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Welcome Chamber Hero if not started yet */}
          {!isSessionStarted && messages.length === 0 && (
            <div className="my-8 rounded-3xl border border-amber-500/30 bg-gradient-to-b from-stone-900 via-stone-900/80 to-stone-950 p-6 sm:p-10 text-center relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Recompensa Exclusiva Desbloqueada</span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-extrabold text-stone-100 max-w-xl mx-auto">
                Auditoría Estratégica de Fin de Mundo {auditData.worldCompleted}
              </h3>

              <p className="mt-3 text-sm text-stone-300 max-w-xl mx-auto leading-relaxed">
                Has demostrado temple y disciplina para completar los 7 días de este ciclo. Tu mentor ha leído tus notas recientes y está listo para calibrar tu soberanía, validar tus logros y entregarte el mando del siguiente Mundo.
              </p>

              {/* Reward Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6 max-w-2xl mx-auto text-left">
                <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-3.5">
                  <Coins className="h-5 w-5 text-amber-400 mb-1" />
                  <strong className="block text-xs text-stone-200">+50 Tokens de Imagen</strong>
                  <span className="text-[11px] text-stone-500">Acreditados a tu arsenal</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-3.5">
                  <Unlock className="h-5 w-5 text-emerald-400 mb-1" />
                  <strong className="block text-xs text-stone-200">Desbloqueo de Mundo {auditData.worldCompleted < 4 ? auditData.worldCompleted + 1 : 4}</strong>
                  <span className="text-[11px] text-stone-500">Material de entrenamiento</span>
                </div>
                <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-3.5">
                  <Flame className="h-5 w-5 text-rose-400 mb-1" />
                  <strong className="block text-xs text-stone-200">Directriz No Negociable</strong>
                  <span className="text-[11px] text-stone-500">Enfoque para los próximos 7D</span>
                </div>
              </div>

              <button
                onClick={startAuditSession}
                disabled={isLoading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-xl shadow-amber-950/60 hover:from-amber-500 hover:to-amber-400 transition-all cursor-pointer"
              >
                <span>Entrar a la Sesión Privada con {auditData.mentor}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Messages Feed */}
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            const isSpeaking = speakingId === msg.id;
            const isCopied = copiedId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-3`}
              >
                <div
                  className={`flex max-w-[92%] sm:max-w-[85%] gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {isUser ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-stone-300">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border shadow-md text-xl ${
                          isClara
                            ? 'border-amber-500/50 bg-amber-950 text-amber-300'
                            : 'border-emerald-500/50 bg-emerald-950 text-emerald-300'
                        }`}
                      >
                        {isClara ? '✨' : '⚔️'}
                      </div>
                    )}
                  </div>

                  <div
                    className={`relative rounded-2xl px-5 py-4 text-sm leading-relaxed shadow-md ${
                      isUser
                        ? 'bg-amber-600/90 text-stone-100 rounded-tr-sm border border-amber-500/40'
                        : 'bg-stone-900/95 text-stone-200 rounded-tl-sm border border-stone-800'
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-2.5 flex items-center justify-between border-b border-stone-800 pb-2 text-xs text-stone-400">
                        <span className="font-serif-luxury font-bold text-amber-300 tracking-wide">
                          {auditData.mentor} · Sesión Privada 1-a-1
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className={`rounded p-1 transition-colors ${
                              isSpeaking
                                ? 'text-amber-400 bg-amber-500/20'
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                            title="Escuchar al mentor"
                          >
                            {isSpeaking ? (
                              <VolumeX className="h-3.5 w-3.5 animate-pulse" />
                            ) : (
                              <Volume2 className="h-3.5 w-3.5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="rounded p-1 text-stone-500 hover:text-stone-300"
                            title="Copiar texto"
                          >
                            {isCopied ? (
                              <Check className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-stone-400 text-sm my-4 pl-12 animate-pulse">
              <Sparkles className="h-4 w-4 animate-spin text-amber-400" />
              <span>
                {auditData.mentor} está evaluando tus notas y preparando tu calibración...
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input controls footer */}
      {isSessionStarted && (
        <footer className="sticky bottom-0 z-20 border-t border-stone-800/80 bg-stone-950/95 p-3 sm:p-4 backdrop-blur-md">
          <div className="mx-auto max-w-4xl">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputText);
              }}
              className="flex items-center gap-2"
            >
              <div className="relative flex-1">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Responde a ${auditData.mentor}, profundiza en tu calibración o plantea dudas...`}
                  disabled={isLoading}
                  className="w-full rounded-2xl border border-stone-800 bg-stone-900/90 py-3.5 pl-4 pr-12 text-sm text-stone-100 placeholder-stone-500 shadow-inner focus:border-amber-500/60 focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500/40 disabled:opacity-50"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                  <Crown className="h-4 w-4 text-amber-500/40" />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-600 to-amber-500 text-stone-950 font-bold transition-all hover:from-amber-500 hover:to-amber-400 disabled:opacity-30 disabled:cursor-not-allowed shadow-md shadow-amber-950/50 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500 px-1">
              <span>Sesión Privada de Mentoría 1-a-1 · Tu Poder Mental IA™</span>
              <span>Auditoría de Diario · Entrega de Mando de 7 Días</span>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
