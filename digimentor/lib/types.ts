// Core type definitions for ReBooted

export type Language = 'en' | 'zh';

export type ModuleId = 
  // Week 1
  | 'video-calls' | 'send-photos' | 'maps' | 'stay-safe'
  // Week 2
  | 'using-transit' | 'ordering-ride' | 'saving-locations' | 'finding-bus-schedules'
  // Week 3
  | 'tracking-package' | 'finding-post-office' | 'paying-bills' | 'filling-forms'
  // Week 4
  | 'finding-restaurants' | 'reading-reviews' | 'making-reservation' | 'ordering-delivery';

export interface ProgressState {
  completedModules: string[];
  currentModule: string | null;
  currentStep: number;
  accessCode: string;
  unlockedWeeks: number[];
  streak: number;
  lastActiveDate: string | null; // ISO date string YYYY-MM-DD
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
