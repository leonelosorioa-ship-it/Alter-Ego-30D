export type MentorGender = 'mujer' | 'hombre';

export interface MentorProfile {
  id: MentorGender;
  name: string;
  title: string;
  avatar: string;
  tone: string;
  specialty: string[];
  themeColor: string;
  accentColor: string;
  quote: string;
}

export interface Message {
  id: string;
  role: 'assistant' | 'user';
  text: string;
  timestamp: number;
  mentor?: string;
  step?: number;
  masterSheet?: MasterSheetData | null;
}

export interface MasterSheetData {
  mentor: string;
  nombre: string;
  arquetipo: string;
  terreno: string;
  enemigo: string;
  fisiologia: string;
  totem: string;
  frase: string;
  fullText: string;
}

export interface AlterEgoProfile {
  nombre: string;
  arquetipo: string;
  terreno: string;
  totem: string;
  enemigo: string;
  fisiologia: string;
  frase?: string;
}

export type AppMode = 'mentor_diagnostic' | 'alter_ego_simulator' | 'mentorship_audit' | 'daily_missions';

export interface DailyMission {
  day: number;
  worldNum: number;
  worldName: string;
  title: string;
  fullText: string;
  question: string;
  completed?: boolean;
  journalEntry?: string;
  feedback?: string;
  completedAt?: number;
}

export interface AuditSessionData {
  mentor: 'Clara Luz' | 'Leo';
  worldCompleted: number; // 1, 2, 3, 4
  userName: string;
  alterEgoName: string;
  totem: string;
  enemigo: string;
  stars: number;
  hearts: number;
  diaryNotes: string;
}

export interface DiagnosticStepInfo {
  number: number;
  variable: string;
  title: string;
  description: string;
  suggestions: {
    mujer: string[];
    hombre: string[];
  };
}
