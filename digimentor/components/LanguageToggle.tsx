'use client';

import { useLanguage } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2 bg-white rounded-lg p-1 shadow-sm">
      <button
        onClick={() => setLanguage('en')}
        className={`px-6 py-3 rounded-md text-senior-base font-medium transition-gentle min-w-touch min-h-touch ${
          language === 'en'
            ? 'bg-soft-blue text-dark-text'
            : 'bg-transparent text-medium-gray hover:bg-light-gray'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => setLanguage('zh')}
        className={`px-6 py-3 rounded-md text-senior-base font-medium transition-gentle min-w-touch min-h-touch ${
          language === 'zh'
            ? 'bg-soft-blue text-dark-text'
            : 'bg-transparent text-medium-gray hover:bg-light-gray'
        }`}
      >
        中文
      </button>
    </div>
  );
}
