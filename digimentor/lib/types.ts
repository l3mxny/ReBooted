// Core type definitions for ReBooted

export type Language = 'en' | 'zh';

export type ModuleId = 'video-calls' | 'send-photos' | 'maps' | 'stay-safe';

export interface ProgressState {
  completedModules: string[];
  currentModule: string | null;
  currentStep: number;
  accessCode: string;
}

export interface VisualPlaceholder {
  description: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export interface ModuleStep {
  id: string;
  title: { en: string; zh: string };
  content: { en: string; zh: string };
  visual: VisualPlaceholder;
  suggestedQuestions: {
    en: string[];
    zh: string[];
  };
}

export interface ModuleContent {
  id: ModuleId;
  title: { en: string; zh: string };
  icon: string;
  steps: ModuleStep[];
}

export interface ModulesData {
  [key: string]: ModuleContent;
}
