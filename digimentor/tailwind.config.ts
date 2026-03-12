import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'warm-white': '#FDFBF7',
        'soft-blue': '#A8DADC',
        'sage-green': '#B8D4C8',
        'gentle-coral': '#F4A261',
        'soft-gold': '#F4D35E',
        'soft-red': '#FF6B6B',
        'light-sage': '#E8F4EA',
        'dark-text': '#2D3748',
        'medium-gray': '#718096',
        'light-gray': '#E2E8F0',
      },
      fontSize: {
        'senior-sm': '18px',
        'senior-base': '22px',
        'senior-lg': '28px',
        'senior-xl': '32px',
      },
      spacing: {
        'touch': '48px',
        'touch-lg': '64px',
      },
      transitionDuration: {
        'gentle': '300ms',
        'calm': '500ms',
      },
    },
  },
  plugins: [],
} satisfies Config;
