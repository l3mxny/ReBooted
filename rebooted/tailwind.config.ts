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
        // Kiro brand colors
        'kiro-purple': '#7B5EA7',
        'kiro-blue': '#5B9BD5',
        'kiro-purple-light': '#EEE8F7',
        // Keep warm cream background
        'warm-cream': '#FFF8F0',
        // Legacy / keep for compatibility
        'warm-orange': '#FF8C42',
        'warm-orange-light': '#FFB347',
        'teal': '#4ECDC4',
        'card-white': '#FFFFFF',
        'navy': '#2C3E50',
        'soft-text': '#7F8C8D',
        'success-green': '#27AE60',
        'panic-red': '#FF6B6B',
        'warm-white': '#FDFBF7',
        'soft-blue': '#A8DADC',
        'sage-green': '#B8D4C8',
        'gentle-coral': '#F4A261',
        'soft-gold': '#F4D35E',
        'soft-red': '#FF6B6B',
        'light-sage': '#EEE8F7',
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
      fontFamily: {
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
