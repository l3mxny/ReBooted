'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PanicButton() {
  const [showMessage, setShowMessage] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const handleClick = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
      router.push('/');
    }, 2000);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] text-white rounded-full font-bold transition-all duration-300 flex items-center justify-center hover:scale-105"
        style={{ 
          minWidth: '64px', 
          minHeight: '64px', 
          padding: '12px 32px',
          backgroundColor: '#FF6B6B',
          boxShadow: '0 8px 24px rgba(255, 107, 107, 0.4)',
          fontFamily: 'Nunito',
          fontSize: '20px',
        }}
        aria-label="Help button - returns to home screen"
      >
        <span className="whitespace-nowrap">
          Help / 帮助
        </span>
      </button>

      {showMessage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/30 animate-fade-in">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md mx-4 text-center">
            <p className="font-medium" style={{ fontSize: '24px', color: '#2C3E50', fontFamily: 'Nunito' }}>
              {t('panic.message')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
