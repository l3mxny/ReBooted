'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ProgressState } from '@/lib/types';

interface ProgressContextType {
  progress: ProgressState;
  completeModule: (moduleId: string) => void;
  updateCurrentStep: (moduleId: string, step: number) => void;
  resumeModule: (moduleId: string) => number;
  generateAccessCode: () => string;
  syncToFirebase: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Generate a 6-digit access code
function generateSixDigitCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
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
    // Load saved progress from localStorage on mount
    try {
      const saved = localStorage.getItem('rebooted_progress');
      if (saved) {
        const parsedProgress = JSON.parse(saved) as ProgressState;
        if (!parsedProgress.unlockedWeeks) {
          parsedProgress.unlockedWeeks = [1];
        }
        if (parsedProgress.streak === undefined) parsedProgress.streak = 0;
        if (parsedProgress.lastActiveDate === undefined) parsedProgress.lastActiveDate = null;

        // Update streak based on today's date
        const today = new Date().toISOString().split('T')[0];
        const last = parsedProgress.lastActiveDate;
        if (last !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
          parsedProgress.streak = last === yesterday ? parsedProgress.streak + 1 : 1;
          parsedProgress.lastActiveDate = today;
          localStorage.setItem('rebooted_progress', JSON.stringify(parsedProgress));
        }

        setProgress(parsedProgress);
      } else {
        const newAccessCode = generateSixDigitCode();
        const today = new Date().toISOString().split('T')[0];
        const initialProgress: ProgressState = {
          completedModules: [],
          currentModule: null,
          currentStep: 0,
          accessCode: newAccessCode,
          unlockedWeeks: [1],
          streak: 1,
          lastActiveDate: today,
        };
        setProgress(initialProgress);
        localStorage.setItem('rebooted_progress', JSON.stringify(initialProgress));
      }
    } catch (error) {
      // localStorage might not be available (SSR, private browsing, etc.)
      console.warn('Failed to load progress from localStorage:', error);
      // Generate access code even if localStorage fails
      const newAccessCode = generateSixDigitCode();
      setProgress({
        completedModules: [],
        currentModule: null,
        currentStep: 0,
        accessCode: newAccessCode,
        unlockedWeeks: [1],
        streak: 0,
        lastActiveDate: null,
      });
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
  }, []);

  const completeModule = useCallback((moduleId: string) => {
    setProgress(prev => {
      const newCompletedModules = [...prev.completedModules, moduleId];
      
      // Check if we should unlock next week
      const week1Modules = ['video-calls', 'send-photos', 'maps', 'stay-safe'];
      const week2Modules = ['using-transit', 'ordering-ride', 'saving-locations', 'finding-bus-schedules'];
      const week3Modules = ['tracking-package', 'finding-post-office', 'paying-bills', 'filling-forms'];
      
      let newUnlockedWeeks = [...prev.unlockedWeeks];
      
      // Check Week 2 unlock
      if (!newUnlockedWeeks.includes(2) && week1Modules.every(m => newCompletedModules.includes(m))) {
        newUnlockedWeeks.push(2);
      }
      
      // Check Week 3 unlock
      if (!newUnlockedWeeks.includes(3) && week2Modules.every(m => newCompletedModules.includes(m))) {
        newUnlockedWeeks.push(3);
      }
      
      // Check Week 4 unlock
      if (!newUnlockedWeeks.includes(4) && week3Modules.every(m => newCompletedModules.includes(m))) {
        newUnlockedWeeks.push(4);
      }
      
      const newProgress = {
        ...prev,
        completedModules: newCompletedModules,
        currentModule: null,
        currentStep: 0,
        unlockedWeeks: newUnlockedWeeks,
      };
      try {
        localStorage.setItem('rebooted_progress', JSON.stringify(newProgress));
      } catch (error) {
        console.warn('Failed to save progress to localStorage:', error);
      }
      return newProgress;
    });
  }, []);

  const updateCurrentStep = useCallback((moduleId: string, step: number) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        currentModule: moduleId,
        currentStep: step,
      };
      try {
        localStorage.setItem('rebooted_progress', JSON.stringify(newProgress));
      } catch (error) {
        console.warn('Failed to save progress to localStorage:', error);
      }
      return newProgress;
    });
  }, []);

  const resumeModule = useCallback((moduleId: string): number => {
    // Access progress via functional update to avoid stale closure
    let result = 0;
    setProgress(prev => {
      // If this is the current module, return the saved step
      if (prev.currentModule === moduleId) {
        result = prev.currentStep;
      }
      return prev; // Don't update state, just read it
    });
    return result;
  }, []);

  const generateAccessCode = useCallback((): string => {
    return progress.accessCode;
  }, [progress.accessCode]);

  const syncToFirebase = useCallback(async (): Promise<void> => {
    // TODO: Implement Firebase sync in Task 14
    // For now, this is a placeholder
    console.log('Firebase sync not yet implemented');
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        progress,
        completeModule,
        updateCurrentStep,
        resumeModule,
        generateAccessCode,
        syncToFirebase,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
