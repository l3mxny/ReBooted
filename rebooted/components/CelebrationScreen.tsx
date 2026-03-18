'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';
import { useConfetti } from '@/lib/useConfetti';
import PanicButton from './PanicButton';

interface CelebrationScreenProps {
  moduleName: string;
}

export default function CelebrationScreen({ moduleName }: CelebrationScreenProps) {
  const { t } = useLanguage();
  const { fireModuleConfetti } = useConfetti();

  useEffect(() => {
    fireModuleConfetti();
  }, [fireModuleConfetti]);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8 pb-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #7B5EA7, #5B9BD5)' }}
    >
      {/* Confetti emoji background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none select-none">
        <div className="text-6xl absolute top-10 left-10">🎉</div>
        <div className="text-6xl absolute top-20 right-20">🎊</div>
        <div className="text-6xl absolute bottom-20 left-20">✨</div>
        <div className="text-6xl absolute bottom-10 right-10">🎉</div>
        <div className="text-6xl absolute top-1/2 left-1/4">🎊</div>
        <div className="text-6xl absolute top-1/3 right-1/3">✨</div>
      </div>

      {/* White card */}
      <div
        className="bg-white rounded-3xl p-12 max-w-2xl mx-auto text-center relative z-10"
        style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.2)' }}
      >
        {/* Kiro mascot celebrating */}
        <div className="flex justify-center mb-4">
          <img
            src="/kiroBetter.webp"
            alt="Kiro mascot celebrating"
            className="animate-kiro-float"
            style={{ maxWidth: '300px', width: '100%', height: 'auto' }}
          />
        </div>

        <h1 className="font-bold mb-4" style={{ fontSize: '40px', color: '#7B5EA7', fontFamily: 'Nunito' }}>
          {t('celebration.title')}
        </h1>
        <h2 className="font-bold mb-8" style={{ fontSize: '32px', color: '#7B5EA7', fontFamily: 'Nunito' }}>
          做得好！
        </h2>

        <p className="mb-4" style={{ fontSize: '20px', color: '#7F8C8D', fontFamily: 'Nunito' }}>
          {t('celebration.completed')}
        </p>
        <p className="font-bold mb-12" style={{ fontSize: '28px', color: '#2C3E50', fontFamily: 'Nunito' }}>
          {moduleName}
        </p>

        <div className="flex flex-col gap-4 max-w-md mx-auto">
          <Link
            href="/"
            className="text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center"
            style={{
              minHeight: '64px',
              fontSize: '22px',
              backgroundColor: '#7B5EA7',
              boxShadow: '0 4px 12px rgba(123, 94, 167, 0.3)',
              fontFamily: 'Nunito',
            }}
          >
            {t('buttons.home')} / 回到主页
          </Link>
          <Link
            href="/"
            className="rounded-2xl font-bold hover:scale-105 transition-all duration-300 flex items-center justify-center bg-white"
            style={{
              minHeight: '64px',
              fontSize: '22px',
              border: '2px solid #7B5EA7',
              color: '#7B5EA7',
              fontFamily: 'Nunito',
            }}
          >
            {t('celebration.nextLesson')} / 下一课
          </Link>
        </div>
      </div>

      <PanicButton />
    </div>
  );
}
