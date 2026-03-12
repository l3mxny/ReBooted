import { VisualPlaceholder as VisualPlaceholderType } from '@/lib/types';

interface VisualPlaceholderProps {
  visual: VisualPlaceholderType;
}

export default function VisualPlaceholder({ visual }: VisualPlaceholderProps) {
  const aspectRatioClass = {
    '16:9': 'aspect-video',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
  }[visual.aspectRatio];

  return (
    <div
      className={`w-full max-w-[90%] mx-auto ${aspectRatioClass} bg-light-sage border-2 border-dashed border-[#CBD5E0] rounded-xl flex flex-col items-center justify-center p-6`}
    >
      <span className="text-5xl mb-4">📷</span>
      <p className="text-lg text-center text-dark-text font-medium">
        {visual.description}
      </p>
    </div>
  );
}
