'use client';

import { ModuleStep as ModuleStepType } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import VisualPlaceholder from './VisualPlaceholder';

interface ModuleStepProps {
  step: ModuleStepType;
  currentStepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  onQuestion: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function ModuleStep({
  step,
  currentStepNumber,
  totalSteps,
  onNext,
  onBack,
  onQuestion,
  isFirstStep,
  isLastStep,
}: ModuleStepProps) {
  const { language, t } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto p-8">
      {/* Progress Indicator */}
      <div className="text-center mb-6">
        <p className="text-senior-base text-medium-gray font-medium">
          Step {currentStepNumber} of {totalSteps}
        </p>
      </div>

      {/* Visual Placeholder */}
      <div className="mb-8">
        <VisualPlaceholder visual={step.visual} />
      </div>

      {/* Step Title */}
      <h2 className="text-senior-lg font-bold text-dark-text mb-6 text-center">
        {step.title[language]}
      </h2>

      {/* Step Content */}
      <p className="text-senior-base text-dark-text leading-relaxed mb-8 text-center">
        {step.content[language]}
      </p>

      {/* Question Button */}
      <button
        onClick={onQuestion}
        className="w-full bg-gentle-coral text-white rounded-xl font-semibold mb-8 hover:scale-105 transition-all duration-300"
        style={{ minHeight: '56px', fontSize: '22px' }}
      >
        {t('buttons.question')}
      </button>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center">
        {!isFirstStep && (
          <button
            onClick={onBack}
            className="bg-light-gray text-dark-text rounded-xl font-semibold hover:scale-105 transition-all duration-300"
            style={{ minWidth: '140px', minHeight: '56px', fontSize: '20px' }}
          >
            {t('buttons.back')}
          </button>
        )}
        <button
          onClick={onNext}
          className="bg-soft-blue text-dark-text rounded-xl font-semibold hover:scale-105 transition-all duration-300"
          style={{ minWidth: '140px', minHeight: '56px', fontSize: '20px' }}
        >
          {isLastStep ? t('celebration.nextLesson') : t('buttons.next')}
        </button>
      </div>
    </div>
  );
}
