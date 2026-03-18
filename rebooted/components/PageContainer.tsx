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
    <div className={`min-h-screen ${className}`} style={{ backgroundColor: '#FFF8F0' }}>
      <div className="p-8 pb-32">
        {showBackButton && (
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 hover:scale-105 transition-all duration-300 bg-white rounded-full px-6 py-3 font-semibold shadow-md"
            style={{ 
              minWidth: '48px', 
              minHeight: '48px', 
              fontSize: '20px',
              color: '#FF8C42',
              fontFamily: 'Nunito',
            }}
            aria-label="Go back to previous page"
          >
            <span className="text-2xl">←</span>
            <span>{t('buttons.back')}</span>
          </button>
        )}
        
        <div className="max-w-4xl mx-auto pb-32">
          {children}
        </div>
      </div>
    </div>
  );
}
