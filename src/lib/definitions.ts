import type { generateMedicalSummary } from "@/ai/flows/generate-medical-summary";

export type Role = 'Doctor' | 'Patient';

export type Language = {
  code: string;
  name: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderRole: Role;
  originalText: string;
  translatedText?: string;
  audioUrl?: string;
  createdAt: Date;
  isSummary?: boolean;
  summaryContent?: Awaited<ReturnType<typeof generateMedicalSummary>>;
};

export const supportedLanguages: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
];
