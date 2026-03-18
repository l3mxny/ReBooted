# Getting Started with ReBooted

## What's Been Built

✅ **Complete Project Structure** - Next.js 14 with TypeScript and Tailwind CSS
✅ **Home Screen** - 4 module buttons with bilingual support
✅ **Language Toggle** - Persistent English/Chinese switching
✅ **Panic Button** - Always-visible help button on every screen
✅ **Routing** - Navigation between home and module pages
✅ **Senior-Friendly Design** - All design rules applied (22px+ fonts, 48px+ buttons, high contrast)
✅ **Comprehensive Spec** - Complete requirements, design, and task breakdown in `.kiro/specs/digimentor/`

## Quick Start

1. **Install dependencies** (if not already done):
   ```bash
   cd digimentor
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** to http://localhost:3000

You should see the home screen with:
- ReBooted title and tagline
- Language toggle (EN / 中文) in top right
- 4 large module buttons with icons
- Panic button at bottom center

## What to Build Next

Follow the spec tasks in `.kiro/specs/digimentor/tasks.md`:

### Immediate Next Steps:
1. **Create module content** - Add the actual learning steps for Video Calls and Maps modules
2. **Build ModuleStep component** - Display individual learning steps with visuals
3. **Add AI Tutor integration** - Connect to Claude API for contextual help
4. **Implement progress tracking** - Save user progress to localStorage
5. **Build celebration screen** - Celebrate module completion

### API Keys Needed:
- **Firebase**: Create a project at https://console.firebase.google.com
- **Anthropic Claude**: Get API key at https://console.anthropic.com

Add these to `.env.local` (copy from `.env.local.example`)

## Testing the Current Build

Try these interactions:
1. Click the language toggle - all text should switch between English and Chinese
2. Click any module button - you'll see a placeholder page
3. Click the "Help / 帮助" panic button - it shows a calm message and returns home
4. Test on mobile - all buttons should be easy to tap (48px+ minimum)

## Design Rules in Action

Every component follows these rules:
- **Minimum 18px font** (22px+ for primary content)
- **48x48px minimum touch targets** (64px for panic button)
- **High contrast** - dark text on light backgrounds only
- **Warm colors** - soft blues, greens, whites
- **Maximum 4 items per screen**
- **Visible back button** on all non-home screens

## File Structure

```
digimentor/
├── app/
│   ├── layout.tsx          # Root layout with LanguageProvider and PanicButton
│   ├── page.tsx            # Home page (renders HomeScreen)
│   ├── globals.css         # Global styles
│   └── modules/[moduleId]/ # Dynamic module routes
├── components/
│   ├── HomeScreen.tsx      # Main navigation with 4 module buttons
│   ├── LanguageToggle.tsx  # EN/中文 switcher
│   └── PanicButton.tsx     # Emergency home button
├── contexts/
│   └── LanguageContext.tsx # Language state + localStorage persistence
├── lib/
│   ├── types.ts            # TypeScript interfaces
│   └── translations.ts     # English and Chinese strings
└── public/
    └── manifest.json       # PWA configuration
```

## Next Development Session

When you're ready to continue:

1. **Review the spec**: Read `.kiro/specs/digimentor/design.md` for component details
2. **Pick a task**: Start with Task 7 (Create module content structure)
3. **Build incrementally**: Complete one task at a time, test thoroughly
4. **Follow checkpoints**: The spec has built-in checkpoints to verify progress

## Need Help?

- Check the spec documents in `.kiro/specs/digimentor/`
- Review component examples in `components/`
- Look at the design tokens in `tailwind.config.ts`
- All translations are in `lib/translations.ts`

Happy building! 🚀
