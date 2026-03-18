import { useCallback } from 'react';

const COLORS = ['#FF8C42', '#4ECDC4', '#FFB347', '#27AE60', '#ffffff'];

export function useConfetti() {
  const fireModuleConfetti = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const confetti = (await import('canvas-confetti')).default;

    const burst = () =>
      confetti({
        particleCount: 150,
        spread: 80,
        colors: COLORS,
        origin: { y: 0.6 },
      });

    burst();
    setTimeout(burst, 300);
    setTimeout(burst, 600);
  }, []);

  const fireStepConfetti = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 30,
      spread: 45,
      colors: COLORS,
      origin: { y: 0.7 },
    });
  }, []);

  return { fireModuleConfetti, fireStepConfetti };
}
