'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

const modules = [
  { id: 'video-calls', icon: '📱', key: 'videoCalls', bgColor: 'bg-soft-blue' },
  { id: 'send-photos', icon: '📸', key: 'sendPhotos', bgColor: 'bg-sage-green' },
  { id: 'maps', icon: '🗺️', key: 'maps', bgColor: 'bg-soft-blue' },
  { id: 'stay-safe', icon: '🛡️', key: 'staySafe', bgColor: 'bg-sage-green' },
];

export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-warm-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-senior-xl font-bold text-dark-text mb-2">
              {t('appName')}
            </h1>
            <p className="text-senior-base text-medium-gray">
              {t('tagline')}
            </p>
          </div>
          <LanguageToggle />
        </div>

        {/* Title */}
        <h2 className="text-senior-lg font-semibold text-dark-text mb-8 text-center">
          {t('home.title')}
        </h2>

        {/* Module Grid */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl mx-auto mb-24">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => router.push(`/modules/${module.id}`)}
              className={`${module.bgColor} rounded-2xl p-8 shadow-md hover:shadow-xl hover:scale-105 transition-gentle flex flex-col items-center justify-center gap-4 min-h-[160px] border-2 border-transparent hover:border-dark-text`}
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
