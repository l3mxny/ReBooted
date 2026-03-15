'use client';

interface WuOwlProps {
  size?: 'sm' | 'md' | 'lg';
  speechBubble?: string;
  className?: string;
}

const sizes = {
  sm: { emoji: '48px', bubble: '14px' },
  md: { emoji: '64px', bubble: '16px' },
  lg: { emoji: '96px', bubble: '18px' },
};

export default function WuOwl({ size = 'md', speechBubble, className = '' }: WuOwlProps) {
  const s = sizes[size];

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {speechBubble && (
        <div
          className="bg-white rounded-2xl px-4 py-2 mb-2 shadow-md relative"
          style={{ fontSize: s.bubble, color: '#2C3E50', fontFamily: 'Nunito', maxWidth: '200px', textAlign: 'center' }}
        >
          {speechBubble}
          {/* Speech bubble tail */}
          <div
            className="absolute left-1/2 -bottom-2"
            style={{
              transform: 'translateX(-50%)',
              width: 0,
              height: 0,
              borderLeft: '8px solid transparent',
              borderRight: '8px solid transparent',
              borderTop: '8px solid white',
            }}
          />
        </div>
      )}
      <div
        className="animate-owl-bob select-none"
        style={{ fontSize: s.emoji, lineHeight: 1 }}
        role="img"
        aria-label="Wǔ the owl mascot"
      >
        🦉
      </div>
    </div>
  );
}
