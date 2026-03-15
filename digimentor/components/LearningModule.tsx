'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleContent, ModuleId } from '@/lib/types';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ModuleStep from './ModuleStep';
import CelebrationScreen from './CelebrationScreen';
import AITutorPanel from './AITutorPanel';
import PageContainer from './PageContainer';
import modulesData from '@/content/modules.json';

interface LearningModuleProps {
  moduleId: ModuleId;
}

export default function LearningModule({ moduleId }: LearningModuleProps) {
  const router = useRouter();
  const { progress, updateCurrentStep, completeModule, resumeModule } = useProgress();
  const { language } = useLanguage();
  
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showAITutor, setShowAITutor] = useState(false);
  const initialized = useRef(false);

  // Load module content
  const moduleContent = (modulesData as any)[moduleId] as ModuleContent;

  useEffect(() => {
    // Resume from last step if returning to this module - only run once on mount
    if (initialized.current) return;
    initialized.current = true;
    
    const lastStep = resumeModule(moduleId);
    setCurrentStepIndex(lastStep);
  }, []); // Empty dependency array - only runs once

  useEffect(() => {
    // Auto-save progress on step change
    if (moduleContent) {
      updateCurrentStep(moduleId, currentStepIndex);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStepIndex, moduleId]);

  if (!moduleContent) {
    return (
      <PageContainer showBackButton>
        <div className="text-center">
          <p className="text-senior-lg text-dark-text">Module not found</p>
        </div>
      </PageContainer>
    );
  }

  const currentStep = moduleContent.steps[currentStepIndex];
  const totalSteps = moduleContent.steps.length;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  const handleNext = () => {
    if (isLastStep) {
      // Complete the module and show celebration
      completeModule(moduleId);
      setShowCelebration(true);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (!isFirstStep) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleQuestion = () => {
    setShowAITutor(true);
  };

  const handleAskQuestion = async (question: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          language,
          moduleTitle: moduleContent.title[language],
          stepTitle: currentStep.title[language],
          stepContent: currentStep.content[language],
        }),
      });

      const data = await response.json();
      return data.response || data.error || 'Sorry, I could not get a response.';
    } catch (error) {
      console.error('Error asking AI tutor:', error);
      return language === 'zh'
        ? '我现在遇到了一些问题。请稍后再试。'
        : "I'm having trouble right now. Please try again in a moment.";
    }
  };

  if (showCelebration) {
    return <CelebrationScreen moduleName={moduleContent.title[language]} />;
  }

  return (
    <PageContainer showBackButton>
      <ModuleStep
        step={currentStep}
        currentStepNumber={currentStepIndex + 1}
        totalSteps={totalSteps}
        onNext={handleNext}
        onBack={handleBack}
        onQuestion={handleQuestion}
        isFirstStep={isFirstStep}
        isLastStep={isLastStep}
        moduleId={moduleId}
      />
      
      {/* AI Tutor Panel */}
      <AITutorPanel
        isOpen={showAITutor}
        onClose={() => setShowAITutor(false)}
        currentStep={currentStep}
        currentStepNumber={currentStepIndex + 1}
        onAskQuestion={handleAskQuestion}
      />
    </PageContainer>
  );
}
