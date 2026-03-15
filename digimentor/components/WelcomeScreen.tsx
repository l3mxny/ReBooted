'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const handleGetStarted = () => {
    // Mark onboarding as started
    localStorage.setItem('rebooted_onboarding_complete', 'true');
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-white to-soft-gold flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        {/* Language Toggle */}
        <div className="flex justify-end mb-8">
          <LanguageToggle />
        </div>

        {/* Welcome Content */}
        <div className="mb-12">
          <h1 className="text-6xl font-bold text-dark-text mb-6">
            {t('appName')}
          </h1>
          <p className="text-senior-xl text-gentle-coral font-semibold mb-8">
            {t('tagline')}
          </p>
          <p className="text-senior-lg text-dark-text mb-12">
            {t('onboarding.welcome')}
          </p>
        </div>

        {/* Get Started Button */}
        <button
          onClick={handleGetStarted}
          className="bg-soft-blue text-dark-text rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
          style={{ minWidth: '240px', minHeight: '80px', fontSize: '28px' }}
        >
          {t('onboarding.getStarted')}
        </button>
      </div>
    </div>
  );
}
