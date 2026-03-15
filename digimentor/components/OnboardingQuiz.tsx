'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

const modules = [
  { id: 'video-calls', icon: '📱', key: 'videoCalls', bgColor: 'bg-soft-blue' },
  { id: 'send-photos', icon: '📸', key: 'sendPhotos', bgColor: 'bg-sage-green' },
  { id: 'maps', icon: '🗺️', key: 'maps', bgColor: 'bg-soft-blue' },
  { id: 'stay-safe', icon: '🛡️', key: 'staySafe', bgColor: 'bg-sage-green' },
];

export default function OnboardingQuiz() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleModuleSelect = (moduleId: string) => {
    // Mark onboarding as complete
    localStorage.setItem('rebooted_onboarding_complete', 'true');
    // Navigate to selected module
    router.push(`/modules/${moduleId}`);
  };

  return (
    <div className="min-h-screen bg-warm-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Question */}
        <h1 className="text-senior-xl font-bold text-dark-text mb-12 text-center">
          {t('onboarding.chooseFirst')}
        </h1>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => handleModuleSelect(module.id)}
              className={`${module.bgColor} rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 flex flex-col items-center justify-center gap-4 border-2 border-transparent hover:border-dark-text`}
              style={{ minWidth: '160px', minHeight: '160px' }}
            >
              <span className="text-6xl">{module.icon}</span>
              <span className="text-senior-base font-semibold text-dark-text text-center">
                {t(`home.modules.${module.key}`)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
