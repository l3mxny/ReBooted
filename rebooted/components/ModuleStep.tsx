'use client';

import { ModuleStep as ModuleStepType } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfetti } from '@/lib/useConfetti';
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
  moduleId?: string;
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
  moduleId,
}: ModuleStepProps) {
  const { language, t } = useLanguage();
  const { fireStepConfetti } = useConfetti();
  const progressPercent = (currentStepNumber / totalSteps) * 100;

  const handleNext = () => {
    if (!isLastStep) fireStepConfetti();
    onNext();
  };

  return (
    <div className="max-w-3xl mx-auto p-8 pb-40">
      {/* Top Progress Bar */}
      <div className="w-full h-1 bg-gray-200 rounded-full mb-8">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%`, backgroundColor: '#7B5EA7' }}
        />
      </div>

      {/* Progress Indicator */}
      <div className="text-center mb-6">
        <p className="font-bold" style={{ fontSize: '20px', color: '#7F8C8D', fontFamily: 'Nunito' }}>
          Step {currentStepNumber} of {totalSteps}
        </p>
      </div>

      {/* Visual Placeholder Card */}
      <div className="mb-8">
        <VisualPlaceholder visual={step.visual} moduleId={moduleId} />
      </div>

      {/* Step Title */}
      <h2 className="font-bold text-center mb-6" style={{ fontSize: '28px', color: '#2C3E50', fontFamily: 'Nunito' }}>
        {step.title[language]}
      </h2>

      {/* Step Content */}
      <p className="text-center mb-8" style={{ fontSize: '20px', color: '#2C3E50', lineHeight: '1.8', fontFamily: 'Nunito' }}>
        {step.content[language]}
      </p>

      {/* Question Button */}
      <button
        onClick={onQuestion}
        className="w-full text-white rounded-2xl font-bold mb-8 hover:scale-105 transition-all duration-300"
        style={{
          minHeight: '56px',
          fontSize: '22px',
          backgroundColor: '#7B5EA7',
          boxShadow: '0 4px 12px rgba(123, 94, 167, 0.3)',
          fontFamily: 'Nunito',
        }}
      >
        {t('buttons.question')}
      </button>

      {/* Navigation Buttons */}
      <div className="flex gap-4 justify-center">
        {!isFirstStep && (
          <button
            onClick={onBack}
            className="rounded-2xl font-bold hover:scale-105 transition-all duration-300 bg-white"
            style={{
              minWidth: '140px',
              minHeight: '56px',
              fontSize: '20px',
              border: '2px solid #7B5EA7',
              color: '#7B5EA7',
              fontFamily: 'Nunito',
            }}
          >
            {t('buttons.back')}
          </button>
        )}
        <button
          onClick={handleNext}
          className="text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300"
          style={{
            minWidth: '140px',
            minHeight: '56px',
            fontSize: '20px',
            backgroundColor: '#7B5EA7',
            boxShadow: '0 4px 12px rgba(123, 94, 167, 0.3)',
            fontFamily: 'Nunito',
          }}
        >
          {isLastStep ? t('celebration.nextLesson') : t('buttons.next')}
        </button>
      </div>
    </div>
  );
}
