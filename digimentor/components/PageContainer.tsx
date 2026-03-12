'use client';

import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReactNode } from 'react';

interface PageContainerProps {
  children: ReactNode;
  showBackButton?: boolean;
  className?: string;
}

export default function PageContainer({ 
  children, 
  showBackButton = false,
  className = '' 
}: PageContainerProps) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className={`min-h-screen bg-[#FDFBF7] p-8 ${className}`}>
      {showBackButton && (
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-senior-base text-dark-text hover:scale-105 transition-all duration-300"
          style={{ minWidth: '48px', minHeight: '48px' }}
          aria-label="Go back to previous page"
        >
          <span className="text-2xl">←</span>
          <span className="font-medium">{t('buttons.back')}</span>
        </button>
      )}
      
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
