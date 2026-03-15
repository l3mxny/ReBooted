'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 bg-white rounded-full p-1 shadow-md">
      <button
        onClick={() => setLanguage('en')}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 min-w-touch min-h-touch`}
        style={{
          fontSize: '20px',
          fontFamily: 'Nunito',
          backgroundColor: language === 'en' ? '#FF8C42' : 'transparent',
          color: language === 'en' ? '#FFFFFF' : '#7F8C8D',
        }}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 min-w-touch min-h-touch`}
        style={{
          fontSize: '20px',
          fontFamily: 'Nunito',
          backgroundColor: language === 'zh' ? '#FF8C42' : 'transparent',
          color: language === 'zh' ? '#FFFFFF' : '#7F8C8D',
        }}
      >
        中文
      </button>
    </div>
  );
}
