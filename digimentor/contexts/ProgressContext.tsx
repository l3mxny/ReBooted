'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load saved progress from localStorage on mount
    try {
      const saved = localStorage.getItem('rebooted_progress');
      if (saved) {
        const parsedProgress = JSON.parse(saved) as ProgressState;
        setProgress(parsedProgress);
      } else {
        // First time user - generate access code
        const newAccessCode = generateSixDigitCode();
        const initialProgress: ProgressState = {
          completedModules: [],
          currentModule: null,
          currentStep: 0,
          accessCode: newAccessCode,
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
      });
    }
    setIsLoaded(true);
  }, []);

  const saveProgress = (newProgress: ProgressState) => {
    setProgress(newProgress);
    try {
      localStorage.setItem('rebooted_progress', JSON.stringify(newProgress));
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
  };

  const completeModule = (moduleId: string) => {
    const newProgress = {
      ...progress,
      completedModules: [...progress.completedModules, moduleId],
      currentModule: null,
      currentStep: 0,
    };
    saveProgress(newProgress);
  };

  const updateCurrentStep = (moduleId: string, step: number) => {
    const newProgress = {
      ...progress,
      currentModule: moduleId,
      currentStep: step,
    };
    saveProgress(newProgress);
  };

  const resumeModule = (moduleId: string): number => {
    // If this is the current module, return the saved step
    if (progress.currentModule === moduleId) {
      return progress.currentStep;
    }
    // Otherwise, start from the beginning
    return 0;
  };

  const generateAccessCode = (): string => {
    return progress.accessCode;
  };

  const syncToFirebase = async (): Promise<void> => {
    // TODO: Implement Firebase sync in Task 14
    // For now, this is a placeholder
    console.log('Firebase sync not yet implemented');
  };

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
