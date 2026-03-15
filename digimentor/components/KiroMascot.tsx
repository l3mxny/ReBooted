'use client';

interface KiroMascotProps {
  size?: number;
  float?: boolean;
  className?: string;
}

export default function KiroMascot({
  size = 80,
  float = false,
  className = '',
}: KiroMascotProps) {
  return (
    <img
      src="/kiroBetter.webp"
      alt="Kiro mascot"
      width={size}
      height={size}
      className={float ? `animate-kiro-float ${className}` : className}
      style={{
        objectFit: 'contain',
        background: 'transparent',
        display: 'block',
        width: size,
        height: size,
      }}
    />
  );
}
