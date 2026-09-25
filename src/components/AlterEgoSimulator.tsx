import React, { useState, useRef, useEffect } from 'react';
import { AlterEgoProfile, Message } from '../types.ts';
import { soundManager } from '../utils/audio.ts';
import {
  ShieldAlert,
  Send,
  Sparkles,
  Zap,
  PhoneCall,
  Flame,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Settings,
  X,
  Target,
  User,
  Key,
  Activity,
  Layers,
  HelpCircle,
} from 'lucide-react';

interface AlterEgoSimulatorProps {
  profile: AlterEgoProfile;
  onUpdateProfile: (updated: AlterEgoProfile) => void;
  onSwitchToDiagnostic: () => void;
}

const TACTICAL_SCENARIOS = [
  {
    title: 'Negociación de Precio',
    icon: '💼',
    prompt: 'Un cliente potencial me dice: "Tu precio es excesivo, otra agencia me lo hace por la mitad. Si no me bajas un 30% no cerramos". ¿Cómo respondo con tu voz?',
  },
  {
    title: 'Límite a Familiar / Pareja',
    icon: '🛑',
    prompt: 'Un familiar me está pidiendo dinero prestado otra vez haciéndome sentir culpable. No quiero prestarle. Dame la frase exacta para decir NO sin justificarme.',
  },
  {
    title: 'Ataque Pasivo-Agresivo',
    icon: '🛡️',
    prompt: 'En plena reunión, un colega dice con ironía: "¿Y estás seguro de que tú puedes encargarte de esto o te queda grande?". ¿Cómo lo desarmo en seco sin perder la calma?',
  },
  {
    title: 'Pedir Aumento / Honorarios',
    icon: '📈',
    prompt: 'Tengo junta directiva mañana para pedir aumento de honorarios por mis resultados. Siento que titubeo al decir la cifra. Entréname en la apertura.',
  },
];

export const AlterEgoSimulator: React.FC<AlterEgoSimulatorProps> = ({
  profile,
  onUpdateProfile,
  onSwitchToDiagnostic,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'ego-init-0',
      role: 'assistant',
      text: `Estoy aquí. Soy ${profile.nombre}, tu ${profile.arquetipo}.

El titubeo y la disculpa se terminaron. Cuando cruzas la puerta con mi presencia, actúas desde la soberanía absoluta en tu ${profile.terreno}.

¿A qué situación o persona nos enfrentamos ahora mismo? Plantea el conflicto: una negociación, un cliente difícil, un límite o una llamada. Vamos a ensayar tu respuesta palabra por palabra.

Ajusta el código corporal ahora: ${profile.fisiologia}. Tu tótem (${profile.totem}) está activo.`,
      timestamp: Date.now(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [tempProfile, setTempProfile] = useState<AlterEgoProfile>({ ...profile });
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [totemActivated, setTotemActivated] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const triggerTotemPulse = () => {
    setTotemActivated(true);
    soundManager.playMasterSheetCeremony();
    setTimeout(() => setTotemActivated(false), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      soundManager.stopSpeaking();
      setSpeakingId(null);
    } else {
      setSpeakingId(id);
      soundManager.speak(text, 'hombre', () => {
        setSpeakingId(null);
      });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: `ego-user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/alter-ego-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, text: m.text })),
          alterEgoProfile: profile,
        }),
      });

      if (!response.ok) throw new Error('Error en el simulador');

      const data = await response.json();
      const botText = data.text || '';

      const assistantMsg: Message = {
        id: `ego-bot-${Date.now()}`,
        role: 'assistant',
        text: botText,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      soundManager.playMessageChime();
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ego-err-${Date.now()}`,
          role: 'assistant',
          text: `Esa respuesta viene de tu viejo yo saboteador. Toca tu ${profile.totem}, ajusta la espalda, respira y reformula tu respuesta con mi voz.\n\nRecuerda tu ancla: ${profile.fisiologia}. Tu valor es innegociable.`,
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(tempProfile);
    setIsConfigOpen(false);

    // Announce identity re-calibration
    setMessages((prev) => [
      ...prev,
      {
        id: `ego-recal-${Date.now()}`,
        role: 'assistant',
        text: `Variables recalibradas. Ahora opero bajo el mando de ${tempProfile.nombre} (${tempProfile.arquetipo}). Tu campo de batalla es ${tempProfile.terreno}. Mantén tu tótem (${tempProfile.totem}) listo.`,
        timestamp: Date.now(),
      },
    ]);
  };

  // Regression trigger test helper
  const handleTestRegression = () => {
    sendMessage(
      'La verdad me da mucha pena cobrarle tan caro al cliente... ¿no será mejor que le dé un descuento para que no se enoje conmigo?'
    );
  };

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-130px)]">
      {/* Tactical HUD Header */}
      <div className="sticky top-0 z-20 border-b border-amber-500/30 bg-stone-950/95 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto max-w-4xl flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              onClick={triggerTotemPulse}
              className={`relative cursor-pointer flex h-11 w-11 items-center justify-center rounded-2xl border transition-all ${
                totemActivated
                  ? 'border-amber-400 bg-amber-400 text-stone-950 scale-110 shadow-lg shadow-amber-400/50'
                  : 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:border-amber-400 hover:bg-amber-500/20'
              }`}
              title="Haz clic para activar tu Tótem (Anclaje somático)"
            >
              <Zap className="h-5 w-5" />
              {totemActivated && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif-luxury text-base sm:text-lg font-bold text-stone-100">
                  {profile.nombre}
                </h1>
                <span className="rounded bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-300">
                  {profile.arquetipo}
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate max-w-xs sm:max-w-md">
                <strong className="text-stone-300">Terreno:</strong> {profile.terreno}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerTotemPulse}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-stone-900 px-3 py-1.5 text-xs text-amber-300 hover:bg-amber-500/10 transition-colors"
              title="Activar Tótem físico"
            >
              <Key className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Tótem:</span>
              <span className="font-semibold truncate max-w-[120px]">{profile.totem}</span>
            </button>

            <button
              onClick={() => {
                setTempProfile({ ...profile });
                setIsConfigOpen(true);
              }}
              className="rounded-xl border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors"
              title="Ajustar variables de identidad del Alter Ego"
            >
              <Settings className="h-4 w-4" />
            </button>

            <button
              onClick={onSwitchToDiagnostic}
              className="flex items-center gap-1 rounded-xl border border-stone-800 bg-stone-900/60 px-3 py-1.5 text-xs text-stone-400 hover:text-stone-200 transition-colors"
              title="Volver a los Mentores (Clara Luz / Leo)"
            >
              <Layers className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ver Mentores</span>
            </button>
          </div>
        </div>

        {/* Fisiología Banner */}
        <div className="mx-auto max-w-4xl mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center gap-2 truncate">
            <Activity className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate">
              <strong className="text-stone-300">Código Físico:</strong> {profile.fisiologia}
            </span>
          </div>
          <button
            onClick={handleTestRegression}
            className="text-[10px] text-rose-400 hover:text-rose-300 underline underline-offset-2 flex-shrink-0 ml-2"
            title="Envía una respuesta sumisa para ver cómo tu Alter Ego te frena de inmediato"
          >
            Probar Detección de Retroceso
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Tactical Scenarios Chips */}
          <div className="rounded-2xl border border-stone-800 bg-stone-900/60 p-4">
            <div className="flex items-center gap-2 mb-3 text-xs text-amber-400 font-semibold uppercase tracking-wider">
              <Target className="h-4 w-4" />
              <span>Simulaciones Tácticas Listas para Ensayar:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {TACTICAL_SCENARIOS.map((sc, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => sendMessage(sc.prompt)}
                  className="flex items-start gap-2.5 rounded-xl border border-stone-800 bg-stone-950/80 p-2.5 text-left text-xs text-stone-300 hover:border-amber-500/50 hover:bg-stone-900 transition-all cursor-pointer group"
                >
                  <span className="text-base">{sc.icon}</span>
                  <div>
                    <strong className="block text-stone-200 group-hover:text-amber-300 transition-colors">
                      {sc.title}
                    </strong>
                    <span className="text-[11px] text-stone-500 line-clamp-1">
                      {sc.prompt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation history */}
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
                  className={`flex max-w-[90%] sm:max-w-[85%] gap-3 ${
                    isUser ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {isUser ? (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-stone-300">
                        <User className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/60 bg-gradient-to-br from-amber-600 to-amber-950 text-amber-200 shadow-md shadow-amber-950/50">
                        <Flame className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-amber-600/90 text-stone-100 rounded-tr-sm border border-amber-500/40'
                        : 'bg-stone-900 text-stone-200 rounded-tl-sm border border-stone-800'
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-2 flex items-center justify-between border-b border-stone-800 pb-1.5 text-xs text-stone-400">
                        <span className="font-serif-luxury font-bold text-amber-300">
                          {profile.nombre} · {profile.arquetipo}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSpeak(msg.id, msg.text)}
                            className={`rounded p-1 transition-colors ${
                              isSpeaking
                                ? 'text-amber-400 bg-amber-500/20'
                                : 'text-stone-500 hover:text-stone-300'
                            }`}
                            title="Escuchar al Alter Ego"
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
                            title="Copiar respuesta"
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
              <Zap className="h-4 w-4 animate-spin text-amber-400" />
              <span>{profile.nombre} está formulando tu respuesta implacable...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <div className="sticky bottom-0 z-20 border-t border-stone-800/80 bg-stone-950/95 p-3 sm:p-4 backdrop-blur-md">
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
                placeholder={`Plantea una llamada, conflicto o respuesta a ensayar con ${profile.nombre}...`}
                disabled={isLoading}
                className="w-full rounded-2xl border border-stone-800 bg-stone-900/90 py-3.5 pl-4 pr-12 text-sm text-stone-100 placeholder-stone-500 shadow-inner focus:border-amber-500/60 focus:bg-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500/40 disabled:opacity-50"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500">
                <Flame className="h-4 w-4 text-amber-500/40" />
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
            <span>Simulador Táctico 24/7 · Ensayos sin disculpas</span>
            <span>Regla: Detección activa de retrocesos</span>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {isConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-950 p-6 shadow-2xl text-stone-100">
            <button
              onClick={() => setIsConfigOpen(false)}
              className="absolute top-5 right-5 rounded-full border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-5 w-5 text-amber-400" />
              <h3 className="font-serif-luxury text-xl font-bold">
                Variables de Identidad del Alter Ego
              </h3>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-stone-400 mb-1">$NOMBRE_ALTER_EGO</label>
                <input
                  type="text"
                  value={tempProfile.nombre}
                  onChange={(e) => setTempProfile({ ...tempProfile, nombre: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">$ARQUETIPO</label>
                <input
                  type="text"
                  value={tempProfile.arquetipo}
                  onChange={(e) => setTempProfile({ ...tempProfile, arquetipo: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">$TERRENO_OPERATIVO</label>
                <input
                  type="text"
                  value={tempProfile.terreno}
                  onChange={(e) => setTempProfile({ ...tempProfile, terreno: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">$TOTEM (Anclaje somático)</label>
                <input
                  type="text"
                  value={tempProfile.totem}
                  onChange={(e) => setTempProfile({ ...tempProfile, totem: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">$ENEMIGO_INTERIOR</label>
                <input
                  type="text"
                  value={tempProfile.enemigo}
                  onChange={(e) => setTempProfile({ ...tempProfile, enemigo: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div>
                <label className="block text-stone-400 mb-1">$CODIGO_FISIOLOGICO</label>
                <input
                  type="text"
                  value={tempProfile.fisiologia}
                  onChange={(e) => setTempProfile({ ...tempProfile, fisiologia: e.target.value })}
                  className="w-full rounded-xl border border-stone-800 bg-stone-900 px-3 py-2 text-stone-100"
                  required
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsConfigOpen(false)}
                  className="rounded-xl border border-stone-800 bg-stone-900 px-4 py-2 text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-amber-600 hover:bg-amber-500 px-5 py-2 font-bold text-white transition-colors"
                >
                  Guardar Variables
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
