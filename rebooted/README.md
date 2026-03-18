# ReBooted

**Never too late to reboot** - A learning platform designed for Chinese-speaking seniors (60+) to master digital skills.

## 🎯 Project Overview

ReBooted addresses the challenge that Chinese-speaking immigrant seniors face with technology - not just language barriers, but tech anxiety, unfamiliar UI patterns, and lack of patient guidance. Built for the "Build for Impact - Code That Matters to Your Community" hackathon.

## ✨ Features

- **Bilingual Support**: Seamless English/Chinese language toggle
- **Senior-Friendly Design**: 22px+ fonts, 48x48px+ touch targets, high contrast
- **Learning Modules**: Step-by-step tutorials for Video Calls, Maps, Photos, and Online Safety
- **AI Tutor**: Context-aware help powered by Claude API
- **Panic Button**: Always-available escape route to home screen
- **Family Portal**: Progress tracking for family members
- **PWA Support**: Install to home screen like a native app

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.local.example` to `.env.local` and add your API keys:
   ```bash
   cp .env.local.example .env.local
   ```

4. Add your Firebase and Anthropic API keys to `.env.local`

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
rebooted/
├── app/                    # Next.js app router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home page
│   └── modules/           # Learning module pages
├── components/            # React components
│   ├── HomeScreen.tsx    # Main navigation screen
│   ├── LanguageToggle.tsx # Language switcher
│   └── PanicButton.tsx   # Emergency home button
├── contexts/             # React contexts
│   └── LanguageContext.tsx # Language state management
├── lib/                  # Utilities and types
│   ├── types.ts         # TypeScript interfaces
│   └── translations.ts  # i18n strings
└── public/              # Static assets
```

## 🎨 Design Principles

1. **Radical Simplicity**: Maximum 4 elements per screen
2. **Physical Accessibility**: Large fonts and touch targets
3. **Emotional Safety**: Warm colors, encouraging language
4. **Cultural Sensitivity**: Bilingual by default
5. **Gentle Motion**: Slow, smooth transitions

## 📋 Spec-Driven Development

This project follows a comprehensive specification located in `.kiro/specs/rebooted/`:
- `requirements.md` - 18 detailed requirements
- `design.md` - Architecture and component specifications
- `tasks.md` - Implementation task breakdown

## 🛠 Tech Stack

- **Frontend**: React 18 + Next.js 14 + TypeScript
- **Styling**: Tailwind CSS with custom design tokens
- **Database**: Firebase Firestore
- **AI**: Anthropic Claude API
- **Deployment**: Vercel (recommended)

## 📱 PWA Features

ReBooted can be installed as a Progressive Web App:
- Add to home screen on mobile devices
- Offline support for previously loaded content
- Native app-like experience

## 🤝 Contributing

This is a hackathon project. Contributions welcome!

## 📄 License

MIT License - feel free to use this for community impact projects.
