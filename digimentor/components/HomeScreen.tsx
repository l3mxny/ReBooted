'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProgress } from '@/contexts/ProgressContext';
import LanguageToggle from './LanguageToggle';
import WeekPathConnector from './WeekPathConnector';

interface WeekDef {
  number: number;
  themeKey: string;
  modules: Array<{ id: string; icon: string }>;
}

const curriculum: WeekDef[] = [
  {
    number: 1,
    themeKey: 'home.weeks.1.theme',
    modules: [
      { id: 'video-calls', icon: '📱' },
      { id: 'send-photos', icon: '📸' },
      { id: 'maps', icon: '🗺️' },
      { id: 'stay-safe', icon: '🛡️' },
    ],
  },
  {
    number: 2,
    themeKey: 'home.weeks.2.theme',
    modules: [
      { id: 'using-transit', icon: '🚌' },
      { id: 'ordering-ride', icon: '🚕' },
      { id: 'saving-locations', icon: '📍' },
      { id: 'finding-bus-schedules', icon: '🔍' },
    ],
  },
  {
    number: 3,
    themeKey: 'home.weeks.3.theme',
    modules: [
      { id: 'tracking-package', icon: '📦' },
      { id: 'finding-post-office', icon: '🏣' },
      { id: 'paying-bills', icon: '💳' },
      { id: 'filling-forms', icon: '📝' },
    ],
  },
  {
    number: 4,
    themeKey: 'home.weeks.4.theme',
    modules: [
      { id: 'finding-restaurants', icon: '🍜' },
      { id: 'reading-reviews', icon: '⭐' },
      { id: 'making-reservation', icon: '📱' },
      { id: 'ordering-delivery', icon: '🥡' },
    ],
  },
];

function streakMessage(streak: number, language: string): string {
  if (streak === 0) {
    return language === 'zh' ? '今天开始您的连续记录！' : 'Start your streak today!';
  }
  if (streak >= 14) return language === 'zh' ? `🔥 ${streak} 天连续！两周了！` : `🔥 ${streak} Day Streak! Two weeks! 两周了！`;
  if (streak >= 7) return language === 'zh' ? `🔥 ${streak} 天连续！一周了！` : `🔥 ${streak} Day Streak! One week! 一周了！`;
  if (streak >= 3) return language === 'zh' ? `🔥 ${streak} 天连续！太棒了！` : `🔥 ${streak} Day Streak! Amazing! 太棒了！`;
  return language === 'zh' ? `🔥 ${streak} 天连续！` : `🔥 ${streak} Day Streak!`;
}

export default function HomeScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { progress } = useProgress();

  const handleReset = () => {
    const confirmed = window.confirm(t('home.startOverConfirm'));
    if (confirmed) {
      localStorage.removeItem('rebooted_progress');
      localStorage.removeItem('rebooted_language');
      localStorage.removeItem('rebooted_onboarding_complete');
      router.push('/');
      router.refresh();
    }
  };

  const getWeekProgress = (week: WeekDef) => {
    const completed = week.modules.filter(m => progress.completedModules.includes(m.id)).length;
    return { completed, total: week.modules.length };
  };

  const isWeekUnlocked = (weekNumber: number) =>
    progress.unlockedWeeks.includes(weekNumber);

  const isWeekComplete = (week: WeekDef) =>
    week.modules.every(m => progress.completedModules.includes(m.id));

  const getCurrentWeek = () => {
    for (const week of curriculum) {
      if (!isWeekComplete(week)) return week.number;
    }
    return curriculum[curriculum.length - 1].number;
  };

  const currentWeek = getCurrentWeek();

  const weekLabel = (n: number) =>
    language === 'zh'
      ? `${t('home.weekLabel')} ${n} ${t('home.weekLabelSuffix')}`
      : `${t('home.weekLabel')} ${n}`;

  const progressText = (completed: number, total: number) =>
    language === 'zh'
      ? `${completed} ${t('home.ofComplete')} ${total} ${t('home.complete')}`
      : `${completed} ${t('home.ofComplete')} ${total} ${t('home.complete')}`;

  const lockedText = (n: number) =>
    t('home.completeWeekFirst').replace('{n}', String(n));

  const streak = progress.streak ?? 0;

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#FFF8F0' }}>
      {/* Subtle dot background pattern */}
      <div
        className="absolute inset-0 pointer-events-none bg-dot-pattern"
        style={{ opacity: 0.03 }}
        aria-hidden="true"
      />

      {/* Gradient Header */}
      <div
        className="px-10 pt-8 pb-8 relative"
        style={{
          background: '#8E48FF',
          borderBottomLeftRadius: '32px',
          borderBottomRightRadius: '32px',
        }}
      >
        {/* Top row: title + language toggle */}
        <div className="max-w-5xl mx-auto flex justify-between items-start mb-4">
          <div>
            <h1 className="text-white font-bold mb-1" style={{ fontSize: '48px', fontFamily: 'Nunito' }}>
              {t('appName')}
            </h1>
            <p className="text-white mb-2" style={{ fontSize: '20px', fontFamily: 'Nunito' }}>
              {t('tagline')}
            </p>
            <p className="text-white font-semibold" style={{ fontSize: '18px', fontFamily: 'Nunito', opacity: 0.95 }}>
              {streakMessage(streak, language)}
            </p>
          </div>
          <LanguageToggle />
        </div>

        {/* Kiro image — blends into header */}
        <div className="flex justify-center py-4">
          <img
            src="/kiroBetter.webp"
            alt="Kiro mascot"
            className="animate-kiro-float"
            style={{ maxWidth: '240px', width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-8 relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-semibold text-center mb-8" style={{ fontSize: '28px', color: '#2C3E50', fontFamily: 'Nunito' }}>
            {t('home.journeyTitle')}
          </h2>

          {/* Week Cards with path connectors */}
          <div className="mb-8">
            {curriculum.map((week, index) => {
              const weekProgress = getWeekProgress(week);
              const unlocked = isWeekUnlocked(week.number);
              const complete = isWeekComplete(week);
              const isCurrent = week.number === currentWeek;
              const nextWeek = curriculum[index + 1];

              return (
                <div key={week.number}>
                  {/* Week Card with staggered entrance animation */}
                  <div
                    className="bg-white rounded-3xl p-6 relative animate-card-enter"
                    style={{
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
                      border: isCurrent ? '3px solid #7B5EA7' : 'none',
                      opacity: unlocked ? 1 : 0.5,
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {complete && (
                      <div className="absolute top-4 right-4 text-4xl">✅</div>
                    )}

                    {!unlocked && (
                      <div className="absolute inset-0 bg-gray-200 bg-opacity-50 rounded-3xl flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">🔒</div>
                          <p className="font-semibold" style={{ fontSize: '18px', color: '#7F8C8D', fontFamily: 'Nunito' }}>
                            {lockedText(week.number - 1)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mb-4">
                      <p className="uppercase font-bold mb-1" style={{ fontSize: '14px', color: '#7B5EA7', fontFamily: 'Nunito', letterSpacing: '1px' }}>
                        {weekLabel(week.number)}
                      </p>
                      <h3 className="font-bold mb-2" style={{ fontSize: '24px', color: '#2C3E50', fontFamily: 'Nunito' }}>
                        {t(week.themeKey)}
                      </h3>
                      <p style={{ fontSize: '16px', color: '#7F8C8D', fontFamily: 'Nunito' }}>
                        {progressText(weekProgress.completed, weekProgress.total)}
                      </p>
                    </div>

                    {/* Module mini-buttons */}
                    <div className="grid grid-cols-4 gap-3">
                      {week.modules.map((module) => {
                        const isCompleted = progress.completedModules.includes(module.id);
                        return (
                          <button
                            key={module.id}
                            onClick={() => unlocked && router.push(`/modules/${module.id}`)}
                            disabled={!unlocked}
                            className="rounded-2xl flex flex-col items-center justify-center gap-2 transition-all duration-300 hover:scale-105"
                            style={{
                              width: '100%',
                              height: '100px',
                              backgroundColor: isCompleted ? '#27AE60' : unlocked ? '#7B5EA7' : '#B8A9D0',
                              cursor: unlocked ? 'pointer' : 'not-allowed',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            }}
                          >
                            <span style={{ fontSize: '32px' }}>{module.icon}</span>
                            <span className="font-semibold text-center px-2" style={{ fontSize: '14px', color: '#FFFFFF', fontFamily: 'Nunito', lineHeight: '1.2' }}>
                              {t(`home.modules.${module.id}`)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Path connector between weeks */}
                  {nextWeek && (
                    <WeekPathConnector
                      completedCount={weekProgress.completed}
                      totalCount={weekProgress.total}
                      fromWeekUnlocked={unlocked}
                      toWeekUnlocked={isWeekUnlocked(nextWeek.number)}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Start Over button */}
          <div className="flex justify-center mb-8 mt-4">
            <button
              onClick={handleReset}
              className="bg-transparent rounded-full font-medium hover:bg-gray-100 transition-all duration-300"
              style={{
                fontSize: '16px',
                color: '#9CA3AF',
                border: '1px solid #D1D5DB',
                padding: '10px 24px',
                fontFamily: 'Nunito',
              }}
            >
              {t('home.startOver')}
            </button>
          </div>

          {/* Footer */}
          <div className="flex justify-center items-center gap-2 mb-24 pb-4">
            <p style={{ fontSize: '13px', color: '#B0B8C1', fontFamily: 'Nunito' }}>
              Powered by Kiro 🤖
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
