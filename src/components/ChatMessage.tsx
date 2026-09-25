import React, { useState } from 'react';
import { Volume2, VolumeX, Copy, Check, Sparkles, User, Shield } from 'lucide-react';
import { Message } from '../types.ts';
import { soundManager } from '../utils/audio.ts';

interface ChatMessageProps {
  message: Message;
  mentorGender?: 'mujer' | 'hombre' | null;
  onSelectSuggestion?: (text: string) => void;
  onSelectGender?: (gender: 'mujer' | 'hombre') => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  mentorGender,
  onSelectSuggestion,
  onSelectGender,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';

  const handleSpeak = () => {
    if (isPlaying) {
      soundManager.stopSpeaking();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      soundManager.speak(message.text, mentorGender || 'mujer', () => {
        setIsPlaying(false);
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render markdown text cleanly
  const renderFormattedText = (content: string) => {
    // Split into paragraphs
    const paragraphs = content.split('\n\n');

    return paragraphs.map((p, idx) => {
      // Check for code/master sheet separator blocks
      if (p.includes('============================================================')) {
        return (
          <div
            key={idx}
            className="my-3 rounded-xl border border-amber-500/40 bg-stone-950/80 p-4 font-mono text-xs text-amber-200/90 shadow-inner whitespace-pre-wrap leading-relaxed"
          >
            {p}
          </div>
        );
      }

      // Check if it's a bold header like **Paso 1: ...**
      const formattedLines = p.split('\n').map((line, lIdx) => {
        // Parse bold **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g);
        return (
          <div key={lIdx} className={lIdx > 0 ? 'mt-1' : ''}>
            {parts.map((part, pIdx) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return (
                  <strong key={pIdx} className="font-semibold text-amber-300">
                    {part.slice(2, -2)}
                  </strong>
                );
              }
              if (part.startsWith('*') && part.endsWith('*')) {
                return (
                  <em key={pIdx} className="italic text-stone-300">
                    {part.slice(1, -1)}
                  </em>
                );
              }
              return <span key={pIdx}>{part}</span>;
            })}
          </div>
        );
      });

      return (
        <div key={idx} className={idx > 0 ? 'mt-3' : ''}>
          {formattedLines}
        </div>
      );
    });
  };

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} my-3`}>
      <div
        className={`flex max-w-[90%] sm:max-w-[80%] gap-3 ${
          isUser ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          {isUser ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-800 border border-stone-700 text-stone-300 shadow-sm">
              <User className="h-4 w-4" />
            </div>
          ) : (
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-xl border shadow-md text-base ${
                mentorGender === 'hombre'
                  ? 'border-emerald-500/50 bg-emerald-950 text-emerald-300'
                  : 'border-amber-500/50 bg-amber-950 text-amber-300'
              }`}
            >
              {mentorGender === 'hombre' ? <Shield className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>
          )}
        </div>

        {/* Message bubble */}
        <div
          className={`relative rounded-2xl px-4 py-3 text-sm leading-relaxed transition-all shadow-sm ${
            isUser
              ? 'bg-amber-600/90 text-stone-100 rounded-tr-sm border border-amber-500/40 selection:bg-stone-900 selection:text-white'
              : 'bg-stone-900/90 text-stone-200 rounded-tl-sm border border-stone-800 selection:bg-amber-500/30'
          }`}
        >
          {/* Header info if assistant */}
          {!isUser && (
            <div className="mb-2 flex items-center justify-between border-b border-stone-800/80 pb-1.5 text-xs text-stone-400">
              <span className="font-semibold text-amber-300/90 tracking-wide font-serif-luxury">
                {message.mentor || (mentorGender === 'hombre' ? 'Mentor Leo' : 'Mentora Clara Luz')}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleSpeak}
                  className={`rounded p-1 transition-colors ${
                    isPlaying ? 'text-amber-400 bg-amber-500/20' : 'hover:text-stone-300 text-stone-500'
                  }`}
                  title={isPlaying ? 'Detener voz' : 'Escuchar en voz alta'}
                  aria-label="Voz del mentor"
                >
                  {isPlaying ? <VolumeX className="h-3.5 w-3.5 animate-pulse" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
                <button
                  onClick={handleCopy}
                  className="rounded p-1 text-stone-500 transition-colors hover:text-stone-300"
                  title="Copiar texto"
                  aria-label="Copiar mensaje"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="prose prose-invert prose-stone max-w-none text-stone-200 text-sm">
            {renderFormattedText(message.text)}
          </div>

          {/* Interactive Didactic Gender Buttons if asking for gender */}
          {!mentorGender && !isUser && message.text.includes('indícame tu género') && onSelectGender && (
            <div className="mt-4 pt-3 border-t border-stone-800/90 space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300 block mb-2">
                👇 Pulsa o haz clic en tu opción para comenzar:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Button Mujer */}
                <button
                  type="button"
                  onClick={() => onSelectGender('mujer')}
                  className="flex items-center gap-3 rounded-2xl border-2 border-rose-500/50 bg-gradient-to-r from-rose-950/80 via-stone-900 to-stone-900 p-3 text-left transition-all hover:border-rose-400 hover:bg-rose-950/90 hover:scale-[1.02] shadow-md cursor-pointer group active:scale-98"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-400/50 text-rose-300 text-xl font-bold">
                    ♀
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-rose-200 group-hover:text-rose-100">
                      1. SOY MUJER
                    </strong>
                    <span className="text-[11px] text-stone-400 block">
                      Mentora Clara Luz (Soberanía & Magnetismo)
                    </span>
                  </div>
                </button>

                {/* Button Hombre */}
                <button
                  type="button"
                  onClick={() => onSelectGender('hombre')}
                  className="flex items-center gap-3 rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 via-stone-900 to-stone-900 p-3 text-left transition-all hover:border-emerald-400 hover:bg-emerald-950/90 hover:scale-[1.02] shadow-md cursor-pointer group active:scale-98"
                >
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xl font-bold">
                    ♂
                  </div>
                  <div>
                    <strong className="block text-xs font-bold text-emerald-200 group-hover:text-emerald-100">
                      2. SOY HOMBRE
                    </strong>
                    <span className="text-[11px] text-stone-400 block">
                      Mentor Leo (Temple & Frialdad Estratégica)
                    </span>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
