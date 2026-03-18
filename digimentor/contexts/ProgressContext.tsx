'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ProgressState } from '@/lib/types';
import { db } from '@/lib/firebase';
import { ref, set } from 'firebase/database';

interface ProgressContextType {
  progress: ProgressState;
  completeModule: (moduleId: string) => void;
  updateCurrentStep: (moduleId: string, step: number) => void;
  resumeModule: (moduleId: string) => number;
  generateAccessCode: () => string;
  syncToFirebase: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Standalone sync — safe to call from useEffect and setState callbacks
function syncProgressToFirebase(p: ProgressState) {
  if (!p.accessCode) return;
  console.log('Syncing to Firebase:', p.accessCode);
  set(ref(db, `users/${p.accessCode}`), {
    completedModules: p.completedModules,
    currentModule: p.currentModule,
    currentStep: p.currentStep,
    streak: p.streak,
    lastActiveDate: p.lastActiveDate,
    unlockedWeeks: p.unlockedWeeks,
  }).catch(err => console.warn('Firebase sync failed:', err));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<ProgressState>({
    completedModules: [],
    currentModule: null,
    currentStep: 0,
    accessCode: '',
    unlockedWeeks: [1],
    streak: 0,
    lastActiveDate: null,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('rebooted_progress');
      if (saved) {
        const p = JSON.parse(saved) as ProgressState;
        if (!p.unlockedWeeks) p.unlockedWeeks = [1];
        if (p.streak === undefined) p.streak = 0;
        if (p.lastActiveDate === undefined) p.lastActiveDate = null;

        const today = new Date().toISOString().split('T')[0];
        if (p.lastActiveDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          p.streak = p.lastActiveDate === yesterday ? p.streak + 1 : 1;
          p.lastActiveDate = today;
          localStorage.setItem('rebooted_progress', JSON.stringify(p));
        }

        setProgress(p);
        syncProgressToFirebase(p); // sync on load
      } else {
        const today = new Date().toISOString().split('T')[0];
        const initial: ProgressState = {
          completedModules: [],
          currentModule: null,
          currentStep: 0,
          accessCode: generateSixDigitCode(),
          unlockedWeeks: [1],
          streak: 1,
          lastActiveDate: today,
        };
        setProgress(initial);
        localStorage.setItem('rebooted_progress', JSON.stringify(initial));
        syncProgressToFirebase(initial); // sync new user immediately
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
      setProgress(prev => ({ ...prev, accessCode: generateSixDigitCode() }));
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = useCallback((newProgress: ProgressState) => {
    setProgress(newProgress);
    try {
      localStorage.setItem('rebooted_progress', JSON.stringify(newProgress));
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
    syncProgressToFirebase(newProgress);
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setProgress(prev => {
      const newCompletedModules = [...prev.completedModules, moduleId];
      const week1 = ['video-calls', 'send-photos', 'maps', 'stay-safe'];
      const week2 = ['using-transit', 'ordering-ride', 'saving-locations', 'finding-bus-schedules'];
      const week3 = ['tracking-package', 'finding-post-office', 'paying-bills', 'filling-forms'];
      const newUnlockedWeeks = [...prev.unlockedWeeks];
      if (!newUnlockedWeeks.includes(2) && week1.every(m => newCompletedModules.includes(m))) newUnlockedWeeks.push(2);
      if (!newUnlockedWeeks.includes(3) && week2.every(m => newCompletedModules.includes(m))) newUnlockedWeeks.push(3);
      if (!newUnlockedWeeks.includes(4) && week3.every(m => newCompletedModules.includes(m))) newUnlockedWeeks.push(4);

      const next = { ...prev, completedModules: newCompletedModules, currentModule: null, currentStep: 0, unlockedWeeks: newUnlockedWeeks };
      try { localStorage.setItem('rebooted_progress', JSON.stringify(next)); } catch {}
      syncProgressToFirebase(next);
      return next;
    });
  }, []);

  const updateCurrentStep = useCallback((moduleId: string, step: number) => {
    setProgress(prev => {
      const next = { ...prev, currentModule: moduleId, currentStep: step };
      try { localStorage.setItem('rebooted_progress', JSON.stringify(next)); } catch {}
      syncProgressToFirebase(next);
      return next;
    });
  }, []);

  const resumeModule = useCallback((moduleId: string): number => {
    let result = 0;
    setProgress(prev => {
      if (prev.currentModule === moduleId) result = prev.currentStep;
      return prev;
    });
    return result;
  }, []);

  const generateAccessCode = useCallback((): string => {
    return progress.accessCode;
  }, [progress.accessCode]);

  const syncToFirebase = useCallback(async (): Promise<void> => {
    syncProgressToFirebase(progress);
  }, [progress]);

  void isLoaded; // suppress unused warning

  return (
    <ProgressContext.Provider value={{ progress, completeModule, updateCurrentStep, resumeModule, generateAccessCode, syncToFirebase }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}
