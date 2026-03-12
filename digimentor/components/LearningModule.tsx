'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleContent, ModuleId } from '@/lib/types';
import { useProgress } from '@/contexts/ProgressContext';
import { useLanguage } from '@/contexts/LanguageContext';
import ModuleStep from './ModuleStep';
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

  // Load module content
  const moduleContent = (modulesData as any)[moduleId] as ModuleContent;

  useEffect(() => {
    // Resume from last step if returning to this module
    const lastStep = resumeModule(moduleId);
    setCurrentStepIndex(lastStep);
  }, [moduleId, resumeModule]);

  useEffect(() => {
    // Auto-save progress on step change
    if (moduleContent) {
      updateCurrentStep(moduleId, currentStepIndex);
    }
  }, [currentStepIndex, moduleId, updateCurrentStep, moduleContent]);

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

  if (showCelebration) {
    return (
      <PageContainer>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-warm-white to-[#FFF9E6]">
          <div className="text-center max-w-2xl mx-auto p-8">
            {/* Celebration Emoji with pulse animation */}
            <div className="text-9xl mb-6 animate-pulse">🎉</div>
            
            {/* Bilingual celebration text */}
            <h1 className="text-senior-xl font-bold text-gentle-coral mb-4">
              Great job!
            </h1>
            <h2 className="text-senior-lg font-bold text-gentle-coral mb-8">
              做得好！
            </h2>
            
            {/* Module name */}
            <p className="text-senior-base text-dark-text mb-12">
              You completed: {moduleContent.title[language]}
            </p>
            
            {/* Navigation buttons */}
            <div className="flex flex-col gap-4 max-w-md mx-auto">
              <button
                onClick={() => router.push('/')}
                className="bg-soft-blue text-dark-text rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                style={{ minWidth: '180px', minHeight: '64px', fontSize: '22px' }}
              >
                Back to Home / 回到主页
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-sage-green text-dark-text rounded-xl font-semibold hover:scale-105 transition-all duration-300"
                style={{ minWidth: '180px', minHeight: '64px', fontSize: '22px' }}
              >
                Try Next Lesson / 下一课
              </button>
            </div>
          </div>
        </div>
      </PageContainer>
    );
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
      />
      
      {/* AI Tutor Panel - TODO: Implement in Task 11 */}
      {showAITutor && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
            <p className="text-senior-base text-dark-text mb-4">
              AI Tutor coming soon!
            </p>
            <button
              onClick={() => setShowAITutor(false)}
              className="bg-soft-blue text-dark-text rounded-xl px-6 py-3 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
