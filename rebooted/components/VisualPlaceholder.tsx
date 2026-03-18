import { VisualPlaceholder as VisualPlaceholderType } from '@/lib/types';

interface VisualPlaceholderProps {
  visual: VisualPlaceholderType;
  moduleId?: string;
}

// Map module IDs to their representative emojis
const moduleEmojis: Record<string, string> = {
  'video-calls': '📱',
  'send-photos': '📸',
  'maps': '🗺️',
  'stay-safe': '🛡️',
};

export default function VisualPlaceholder({ visual, moduleId }: VisualPlaceholderProps) {
  const emoji = moduleId ? moduleEmojis[moduleId] || '📷' : '📷';

  return (
    <div
      className="w-full max-w-[90%] mx-auto bg-white rounded-3xl flex flex-col items-center justify-center p-8 gap-4"
      style={{ 
        height: '180px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      <span style={{ fontSize: '72px' }}>{emoji}</span>
    </div>
  );
}
