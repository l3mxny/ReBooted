'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '4px', border: '2px solid white', borderRadius: '999px', padding: '4px' }}>
      <button
        onClick={() => setLanguage('en')}
        className="rounded-full font-semibold transition-all duration-300 min-w-touch min-h-touch px-6 py-3"
        style={{
          fontSize: '20px',
          fontFamily: 'Nunito',
          backgroundColor: language === 'en' ? '#7C3AED' : 'transparent',
          color: 'white',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className="rounded-full font-semibold transition-all duration-300 min-w-touch min-h-touch px-6 py-3"
        style={{
          fontSize: '20px',
          fontFamily: 'Nunito',
          backgroundColor: language === 'zh' ? '#7C3AED' : 'transparent',
          color: 'white',
        }}
      >
        中文
      </button>
    </div>
  );
}
