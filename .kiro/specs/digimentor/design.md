# Design Document: ReBooted

## Overview

ReBooted ("Never too late to reboot") is a Progressive Web Application designed to teach Chinese-speaking seniors (60+) essential digital skills through a carefully crafted, anxiety-reducing interface. The design prioritizes extreme simplicity, large touch targets, high contrast, and bilingual support to accommodate users with low tech literacy, aging eyesight, and limited dexterity.

The architecture follows a component-based approach using React and Next.js, with Firebase for real-time data synchronization between senior users and their family helpers. The AI tutor integration uses Anthropic's Claude API to provide contextual, patient assistance in both English and Chinese.

### Design Principles

1. **Radical Simplicity**: Maximum 4 elements per screen, one concept at a time
2. **Physical Accessibility**: 22px+ fonts, 48x48px+ touch targets, high contrast
3. **Emotional Safety**: Warm colors, encouraging language, always-available panic button
4. **Cultural Sensitivity**: Bilingual by default, Chinese text layout considerations
5. **Gentle Motion**: Slow, smooth transitions to prevent disorientation

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (Browser/PWA)                     │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              React + Next.js Frontend                   │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │ │
│  │  │   Senior UI  │  │  Family UI   │  │  AI Tutor    │ │ │
│  │  │  Components  │  │  Components  │  │   Chat UI    │ │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │         State Management (React Context)          │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │      LocalStorage Service (Progress, Language)    │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Backend Services                          │
│  ┌──────────────────┐         ┌──────────────────────────┐ │
│  │  Firebase        │         │  Anthropic Claude API    │ │
│  │  - Firestore DB  │         │  - AI Tutor Responses    │ │
│  │  - Auth (codes)  │         │  - Bilingual Support     │ │
│  │  - Realtime Sync │         └──────────────────────────┘ │
│  └──────────────────┘                                       │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend Framework**: React 18+ with Next.js 14+ (App Router)
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom senior-friendly design tokens
- **State Management**: React Context API for global state
- **Data Persistence**: 
  - Browser localStorage for client-side preferences and progress
  - Firebase Firestore for family portal sync
- **AI Integration**: Anthropic Claude API (claude-sonnet-4-5)
- **Internationalization**: Custom i18n solution with English/Chinese support
- **PWA**: Next.js PWA plugin with service worker for offline support
- **Deployment**: Vercel or similar edge-optimized platform


## Components and Interfaces

### Core Component Hierarchy

```
App
├── LanguageProvider (Context)
├── ProgressProvider (Context)
├── Layout
│   ├── PanicButton (floating, always visible)
│   └── PageContainer
│       ├── WelcomeScreen
│       ├── OnboardingQuiz
│       ├── HomeScreen
│       ├── LearningModule
│       │   ├── ModuleTitleScreen
│       │   ├── ModuleStep
│       │   │   ├── StepContent
│       │   │   ├── VisualPlaceholder
│       │   │   ├── NavigationButtons
│       │   │   └── AITutorButton
│       │   └── CelebrationScreen
│       ├── AITutorPanel
│       │   ├── SuggestedQuestions
│       │   └── ChatInterface
│       └── FamilyPortal
│           ├── AccessCodeEntry
│           └── ProgressDashboard
```

### Component Specifications

#### LanguageProvider

**Purpose**: Manages language state and provides translation functions throughout the app.

**Interface**:
```typescript
interface LanguageContextType {
  language: 'en' | 'zh';
  setLanguage: (lang: 'en' | 'zh') => void;
  t: (key: string) => string; // Translation function
}
```

**Behavior**:
- Loads language preference from localStorage on mount
- Persists language changes to localStorage immediately
- Provides translation function that returns appropriate text based on current language
- All translations stored in structured JSON files (en.json, zh.json)

#### ProgressProvider

**Purpose**: Manages user progress state and synchronization.

**Interface**:
```typescript
interface ProgressState {
  completedModules: string[]; // Module IDs
  currentModule: string | null;
  currentStep: number;
  accessCode: string; // 6-digit code for family linking
}

interface ProgressContextType {
  progress: ProgressState;
  completeModule: (moduleId: string) => void;
  updateCurrentStep: (moduleId: string, step: number) => void;
  generateAccessCode: () => string;
  syncToFirebase: () => Promise<void>;
}
```

**Behavior**:
- Loads progress from localStorage on mount
- Persists all progress changes to localStorage immediately
- Generates 6-digit access code on first use
- Syncs progress to Firebase for family portal access
- Handles offline scenarios gracefully


#### PanicButton

**Purpose**: Provides always-available escape route to home screen.

**Props**:
```typescript
interface PanicButtonProps {
  // No props - behavior is consistent everywhere
}
```

**Styling Requirements**:
- Fixed position: bottom center of viewport
- Size: 64x64px minimum (larger than standard 48px)
- Background: Soft red (#FF6B6B with 90% opacity)
- Text: "Help / 帮助" in 20px bold font
- Border radius: 32px (fully rounded)
- Box shadow: 0 4px 12px rgba(0,0,0,0.15)
- Z-index: 9999 (always on top)
- Margin bottom: 24px from screen edge

**Behavior**:
- On tap: Show modal with calm message "No problem! Let's go back to the main menu."
- Modal displays for 2 seconds with gentle fade
- Automatically navigates to HomeScreen
- Haptic feedback on tap (if supported)

#### HomeScreen

**Purpose**: Main navigation hub showing 4 learning module options.

**Layout**:
```
┌─────────────────────────────────────┐
│  ReBooted                    [EN|中文] │
│  Never too late to reboot           │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   📹        │  │   📸        │  │
│  │ Video Calls │  │Send Photos  │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│  ┌─────────────┐  ┌─────────────┐  │
│  │   🗺️        │  │   🔒        │  │
│  │ Using Maps  │  │Stay Safe    │  │
│  └─────────────┘  └─────────────┘  │
│                                     │
│         [Help / 帮助]                │
└─────────────────────────────────────┘
```

**Styling Requirements**:
- Background: Warm white (#FDFBF7)
- Module buttons: 160x160px minimum
- Button spacing: 24px gap
- Icons: 48x48px, simple line art
- Button background: Soft blue (#A8DADC) or sage green (#B8D4C8)
- Button text: 22px bold, dark gray (#2D3748)
- Hover/active state: Slight scale (1.05x) with 300ms transition

#### LearningModule

**Purpose**: Container for multi-step learning experiences.

**Props**:
```typescript
interface LearningModuleProps {
  moduleId: 'video-calls' | 'send-photos' | 'maps' | 'stay-safe';
  steps: ModuleStep[];
}

interface ModuleStep {
  id: string;
  title: { en: string; zh: string };
  content: { en: string; zh: string };
  visual: VisualPlaceholder;
  suggestedQuestions: { en: string[]; zh: string[] };
}
```

**Behavior**:
- Displays progress indicator: "Step 2 of 4" at top
- Loads current step from ProgressProvider
- Auto-saves progress on step navigation
- Shows celebration screen after final step


#### ModuleStep

**Purpose**: Displays single learning concept with visual aid and navigation.

**Layout**:
```
┌─────────────────────────────────────┐
│  ← Back          Step 2 of 4        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │                             │   │
│  │   [Visual Placeholder]      │   │
│  │                             │   │
│  └─────────────────────────────┘   │
│                                     │
│  Step Title in Large Text           │
│                                     │
│  Simple instruction text that       │
│  explains one concept clearly.      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  I have a question / 我有问题  │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌──────────┐        ┌──────────┐  │
│  │   Back   │        │   Next   │  │
│  └──────────┘        └──────────┘  │
│                                     │
│         [Help / 帮助]                │
└─────────────────────────────────────┘
```

**Styling Requirements**:
- Content padding: 32px all sides
- Title: 28px bold, dark gray (#2D3748)
- Body text: 22px regular, line height 1.6
- Visual placeholder: Max width 90%, centered
- Navigation buttons: 140x56px, 20px text
- "I have a question" button: Full width, 56px height, gentle coral (#F4A261)
- Back button: Soft gray (#E2E8F0)
- Next button: Soft blue (#A8DADC)

#### VisualPlaceholder

**Purpose**: Displays descriptive placeholder for screenshots/illustrations.

**Props**:
```typescript
interface VisualPlaceholderProps {
  description: string; // e.g., "SCREENSHOT: FaceTime green call button circled"
  aspectRatio: '16:9' | '4:3' | '1:1';
}
```

**Styling**:
- Background: Light sage green (#E8F4EA)
- Border: 2px dashed soft gray (#CBD5E0)
- Border radius: 12px
- Padding: 24px
- Text: 18px medium, centered, dark gray
- Icon: 📷 emoji at 32px above text


#### AITutorPanel

**Purpose**: Provides contextual help through AI-powered chat interface.

**Props**:
```typescript
interface AITutorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStep: ModuleStep;
}
```

**Layout**:
```
┌─────────────────────────────────────┐
│  AI Tutor / AI 导师          [✕]    │
├─────────────────────────────────────┤
│  Suggested Questions:               │
│  ┌─────────────────────────────┐   │
│  │ How do I find the app?      │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ What if I tap the wrong     │   │
│  │ button?                     │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ Can you repeat that?        │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  [Chat messages appear here]        │
│                                     │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ Type your question...       │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Behavior**:
- Slides in from right side (300ms ease-out)
- Occupies 90% of screen width on mobile, 400px on desktop
- Suggested questions are tappable, populate input field
- Chat messages display with 2-second delay for readability
- AI responses use warm, encouraging tone
- Automatically scrolls to latest message

**AI System Prompt**:
```
You are a patient, warm tutor helping seniors (60+) learn technology. 

Rules:
- Use simple language (4th grade reading level)
- No technical jargon
- Keep responses to 2-3 sentences maximum
- Always end with encouragement
- If question is off-topic, gently redirect: "That's a great question for your family helper! Let's get back to our lesson."
- Respond in the user's language (English or Chinese)
- Be specific to the current lesson step when possible

Current lesson: {moduleTitle}
Current step: {stepTitle}
Step content: {stepContent}
```

#### CelebrationScreen

**Purpose**: Celebrates module completion and encourages continued learning.

**Layout**:
```
┌─────────────────────────────────────┐
│                                     │
│           🎉                        │
│                                     │
│      Great job!                     │
│      做得好！                         │
│                                     │
│  You completed:                     │
│  [Module Name]                      │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Back to Home / 回到主页      │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │  Try Next Lesson / 下一课     │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Styling**:
- Background: Gentle gradient from warm white to soft gold (#FFF9E6)
- Emoji: 72px size
- Title: 32px bold, celebration color (#F4A261)
- Bilingual text stacked, 24px each
- Buttons: 180x64px, 22px text
- Gentle pulse animation on emoji (1.5s duration, infinite)


#### FamilyPortal

**Purpose**: Allows family members to monitor senior's progress.

**Access Flow**:
1. Family member visits `/family` route
2. Enters 6-digit access code
3. Code validated against Firebase
4. Dashboard displays if valid

**Props**:
```typescript
interface FamilyPortalProps {
  accessCode: string;
}

interface ProgressDashboardData {
  seniorName?: string; // Optional, can be set by family
  completedModules: ModuleProgress[];
  currentActivity: {
    moduleId: string;
    stepNumber: number;
    lastActive: Date;
  };
}

interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  stepsCompleted: number;
  totalSteps: number;
  lastAttempted?: Date;
}
```

**Dashboard Layout**:
```
┌─────────────────────────────────────┐
│  ReBooted Family Portal             │
│  Tracking progress for: [Name]      │
│                                     │
│  📊 Progress Summary                │
│  ✅ 2 modules completed             │
│  📚 Currently learning: Using Maps  │
│  🕐 Last active: 2 hours ago        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 💌 Send Encouragement       │   │
│  └─────────────────────────────┘   │
│                                     │
│  Module Progress:                   │
│  ┌─────────────────────────────┐   │
│  │ ✅ Video Calls (Complete)   │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 🔄 Using Maps (Step 3 of 4) │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⭕ Send Photos (Not started)│   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ ⭕ Stay Safe (Not started)  │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

**Styling**:
- Uses standard web design (not senior-optimized)
- Clean, modern interface with 16px base font
- Progress bars with soft blue fill
- Real-time updates via Firebase listeners

**Send Encouragement Feature**:
- Family members can tap "Send Encouragement" button
- Opens modal with text input (max 100 characters)
- Message is saved to Firebase and displayed to senior on next login
- Senior sees encouragement message as a gentle notification banner at top of home screen
- Message displays in senior's selected language (family can write in either language)
- Banner shows: "💌 Message from family: [text]" with dismiss button
- Only one active encouragement message at a time (new message replaces old)

## Data Models

### LocalStorage Schema

**Key: `rebooted_language`**
```typescript
type Language = 'en' | 'zh';
```

**Key: `rebooted_progress`**
```typescript
interface StoredProgress {
  version: 1; // For future migrations
  accessCode: string;
  completedModules: string[];
  currentModule: string | null;
  currentStep: number;
  lastUpdated: string; // ISO timestamp
}
```

### Firebase Firestore Schema

**Collection: `users`**
```typescript
interface UserDocument {
  accessCode: string; // Document ID
  progress: {
    completedModules: string[];
    currentModule: string | null;
    currentStep: number;
    lastActive: Timestamp;
  };
  encouragementMessage?: {
    text: string;
    sentAt: Timestamp;
    dismissed: boolean;
  };
  createdAt: Timestamp;
  seniorName?: string; // Set by family helper
}
```

**Security Rules**:
- Users collection readable by anyone with valid access code
- Only the specific document matching access code is accessible
- Family helpers can write to encouragementMessage field
- No write access to progress field from client (progress synced via Cloud Function)


### Module Content Schema

**File: `content/modules.json`**
```typescript
interface ModuleContent {
  modules: {
    [moduleId: string]: {
      id: string;
      title: { en: string; zh: string };
      icon: string; // Emoji
      steps: {
        id: string;
        title: { en: string; zh: string };
        content: { en: string; zh: string };
        visual: {
          description: string;
          aspectRatio: '16:9' | '4:3' | '1:1';
        };
        suggestedQuestions: {
          en: string[];
          zh: string[];
        };
      }[];
    };
  };
}
```

**Example Module: Video Calls**
```json
{
  "video-calls": {
    "id": "video-calls",
    "title": {
      "en": "Making Video Calls",
      "zh": "视频通话"
    },
    "icon": "📹",
    "steps": [
      {
        "id": "step-1",
        "title": {
          "en": "Finding the Video Call App",
          "zh": "找到视频通话应用"
        },
        "content": {
          "en": "Look for the green icon with a camera. It might say FaceTime or WeChat.",
          "zh": "寻找带有相机的绿色图标。它可能显示为FaceTime或微信。"
        },
        "visual": {
          "description": "SCREENSHOT: Phone home screen with FaceTime icon circled in green",
          "aspectRatio": "16:9"
        },
        "suggestedQuestions": {
          "en": [
            "What if I can't find the app?",
            "Is FaceTime the same as WeChat?",
            "Can you show me again?"
          ],
          "zh": [
            "如果我找不到应用怎么办？",
            "FaceTime和微信一样吗？",
            "你能再给我看一遍吗？"
          ]
        }
      }
    ]
  }
}
```

## Design Tokens (Tailwind Config)

```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        // Senior-friendly palette
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
        // Minimum sizes for seniors
        'senior-sm': '18px',
        'senior-base': '22px',
        'senior-lg': '28px',
        'senior-xl': '32px',
      },
      spacing: {
        // Large touch targets
        'touch': '48px',
        'touch-lg': '64px',
      },
      transitionDuration: {
        // Slow, gentle animations
        'gentle': '300ms',
        'calm': '500ms',
      },
    },
  },
};
```


## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system - essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Language Preference Persistence Round-Trip

*For any* language selection (English or Chinese), saving the preference to localStorage and then loading it should return the same language value.

**Validates: Requirements 1.2, 1.3, 11.1, 11.3**

### Property 2: UI Text Language Consistency

*For any* selected language and any screen in the application, all rendered UI text, instructions, and module content should be in that selected language.

**Validates: Requirements 1.4**

### Property 3: AI Tutor Language Matching

*For any* language toggle setting and any question asked to the AI tutor, the response should be in the language matching the current toggle setting.

**Validates: Requirements 1.5, 6.9, 15.6**

### Property 4: Module Navigation

*For any* module button selection or topic selection during onboarding, the system should navigate to the corresponding learning module.

**Validates: Requirements 2.5, 12.4**

### Property 5: Font Size Accessibility

*For any* text element in the application, the font size should be at least 18px.

**Validates: Requirements 2.6, 10.1**

### Property 6: Module Step Count Limit

*For any* learning module, the number of steps should be between 1 and 5 (inclusive).

**Validates: Requirements 3.1**

### Property 7: Module Step Visual Presence

*For any* module step, a visual element (image or placeholder) should be present.

**Validates: Requirements 3.3**

### Property 8: Module Step Navigation Buttons

*For any* module step (except the first and last), both "next" and "back" buttons should be present with clear labels.

**Validates: Requirements 3.5**

### Property 9: Module Completion Celebration

*For any* learning module, when a senior user completes all steps, a celebration screen should be displayed with encouraging text in both English and Chinese.

**Validates: Requirements 3.6, 16.1**

### Property 10: Progress State Persistence Round-Trip

*For any* progress through a module (step completion), saving the progress state to localStorage and then loading it should return the same progress state.

**Validates: Requirements 3.7, 11.2, 11.4**

### Property 11: Touch Target Minimum Size

*For any* interactive button or tap target in the application, the dimensions should be at least 48x48 pixels.

**Validates: Requirements 3.8, 10.3**

### Property 12: AI Tutor Question Button Presence

*For any* module step screen, an "I have a question" button should be displayed.

**Validates: Requirements 6.1**

### Property 13: AI Tutor Panel Opening

*For any* tap on the "I have a question" button, the AI tutor chat panel should open.

**Validates: Requirements 6.2**

### Property 14: Suggested Questions Count

*For any* module step, when the AI tutor panel opens, exactly 3 suggested questions should be displayed.

**Validates: Requirements 6.3**

### Property 15: AI Tutor API Response

*For any* question submitted to the AI tutor, a response should be generated using the Anthropic Claude API.

**Validates: Requirements 6.4**

### Property 16: AI Response Length Limit

*For any* AI tutor response, the response should contain at most 4 sentences.

**Validates: Requirements 6.6, 15.4, 15.5**

### Property 17: Panic Button Universal Presence

*For any* screen in the application, a panic button should be displayed at the bottom center.

**Validates: Requirements 7.1, 7.2**

### Property 18: Panic Button Label

*For any* panic button instance, it should be labeled "Help / 帮助" and be at least 64x64 pixels.

**Validates: Requirements 7.3**

### Property 19: Panic Button Navigation

*For any* panic button activation, the system should display a calm message and navigate to the home screen.

**Validates: Requirements 7.4, 7.5**

### Property 20: Home Screen Module Button Count

*For any* home screen display, exactly 4 module selection buttons should be shown.

**Validates: Requirements 7.6, 12.1**

### Property 21: Family Portal Access Code Validation

*For any* valid 6-digit access code entered in the family portal, the system should grant access to the corresponding senior user's progress data.

**Validates: Requirements 8.4**

### Property 22: Family Dashboard Progress Display

*For any* family portal access, the dashboard should display which modules are completed and which step was last viewed in incomplete modules.

**Validates: Requirements 9.1, 9.2, 9.3**

### Property 23: Real-Time Dashboard Synchronization

*For any* progress change made by a senior user, the family dashboard should update to reflect the new state.

**Validates: Requirements 9.5**

### Property 24: High Contrast Text

*For any* text element in the application, it should use dark text on a light background (high contrast).

**Validates: Requirements 10.2**

### Property 25: No Hover-Only Interactions

*For any* interactive element in the application, it should not require hover to reveal functionality or information.

**Validates: Requirements 10.4**

### Property 26: Maximum Items Per Screen

*For any* screen in the application, no more than 4 primary interactive items should be displayed at once.

**Validates: Requirements 10.5**

### Property 27: Back Button Presence

*For any* screen except the home screen, a visible back button should be displayed.

**Validates: Requirements 10.8**

### Property 28: Module Resume from Last Step

*For any* incomplete module that a senior user navigates to, the system should resume from their last viewed step.

**Validates: Requirements 11.5**

### Property 29: Visual Placeholder Descriptive Text

*For any* visual placeholder component, it should include descriptive text indicating what the final image will show.

**Validates: Requirements 13.1, 13.2, 13.3**

### Property 30: Offline Content Availability

*For any* previously loaded content, it should be accessible when the application is offline.

**Validates: Requirements 14.6**

### Property 31: Navigation History Maintenance

*For any* navigation action, the system should maintain history to support back button functionality.

**Validates: Requirements 17.3**

### Property 32: Back Button Navigation

*For any* back button tap, the system should navigate to the previous screen in the history.

**Validates: Requirements 17.4**

### Property 33: Module Progress Indicator

*For any* module step display, the current location within the module should be shown (e.g., "Step 2 of 4").

**Validates: Requirements 17.6**

### Property 34: Error Message Language Consistency

*For any* error that occurs, the error message should be displayed in the currently selected language.

**Validates: Requirements 18.1, 18.2**

### Property 35: Error Recovery Action

*For any* error message displayed, a clear recovery action should be provided to the user.

**Validates: Requirements 18.3**

### Property 36: Error Logging Without Technical Details

*For any* error that occurs, the system should log the error for debugging without displaying technical details to the user.

**Validates: Requirements 18.6**

### Property 37: Celebration Screen Bilingual Text

*For any* celebration screen displayed, encouraging text should be present in both English and Chinese.

**Validates: Requirements 16.2**

### Property 38: Celebration Screen Navigation Buttons

*For any* celebration screen, buttons to return to home and start the next module should be present.

**Validates: Requirements 16.4, 16.5**

### Property 39: Module Completion State Update

*For any* celebration screen display, the corresponding module should be marked as complete in the progress state.

**Validates: Requirements 16.6**


## Error Handling

### Error Categories and Responses

#### 1. Network Errors (AI Tutor API)

**Scenario**: Anthropic Claude API is unreachable or returns an error.

**Handling**:
- Display friendly message: "I'm having trouble right now. Please try again in a moment." (English) / "我现在遇到了一些问题。请稍后再试。" (Chinese)
- Log error details to console for debugging
- Disable AI tutor button temporarily (30 seconds)
- Retry with exponential backoff (3 attempts)
- If all retries fail, show option to continue without AI help

**Code Pattern**:
```typescript
try {
  const response = await callClaudeAPI(question);
  return response;
} catch (error) {
  console.error('AI Tutor API Error:', error);
  showFriendlyError('ai_tutor_unavailable');
  scheduleRetry();
}
```

#### 2. LocalStorage Errors

**Scenario**: Browser localStorage is unavailable or quota exceeded.

**Handling**:
- Gracefully degrade to in-memory state management
- Display one-time notice: "Your progress will be saved for this session only." (English) / "您的进度仅在本次会话中保存。" (Chinese)
- Continue full functionality with temporary state
- Attempt localStorage on each action (may become available)

**Code Pattern**:
```typescript
function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem('rebooted_progress', JSON.stringify(state));
  } catch (error) {
    console.warn('LocalStorage unavailable, using memory:', error);
    inMemoryState = state;
    showOneTimeNotice('storage_unavailable');
  }
}
```

#### 3. Firebase Connection Errors

**Scenario**: Firebase is unreachable or authentication fails.

**Handling**:
- Family portal: Show "Unable to connect. Please check your internet connection."
- Senior user: Continue functioning normally (Firebase is optional for seniors)
- Queue progress updates for later sync
- Retry connection every 60 seconds in background
- Show connection status indicator in family portal

#### 4. Invalid Access Code

**Scenario**: Family helper enters non-existent access code.

**Handling**:
- Display: "We couldn't find that code. Please check and try again."
- Highlight input field with gentle red border
- Provide "Need help?" link with instructions
- After 3 failed attempts, suggest contacting senior user

#### 5. Module Content Loading Errors

**Scenario**: Module JSON fails to load or is malformed.

**Handling**:
- Display: "We're having trouble loading this lesson. Let's try another one."
- Return to home screen automatically after 3 seconds
- Log error with module ID for debugging
- Attempt to reload module content in background

#### 6. Navigation Errors

**Scenario**: Invalid route or broken navigation state.

**Handling**:
- Redirect to home screen (safe fallback)
- Display brief message: "Let's start fresh from the main menu."
- Reset navigation history
- Log error for debugging

### Error Message Translations

All error messages must be available in both languages:

```typescript
const errorMessages = {
  ai_tutor_unavailable: {
    en: "I'm having trouble right now. Please try again in a moment.",
    zh: "我现在遇到了一些问题。请稍后再试。"
  },
  storage_unavailable: {
    en: "Your progress will be saved for this session only.",
    zh: "您的进度仅在本次会话中保存。"
  },
  connection_error: {
    en: "Unable to connect. Please check your internet connection.",
    zh: "无法连接。请检查您的网络连接。"
  },
  invalid_access_code: {
    en: "We couldn't find that code. Please check and try again.",
    zh: "我们找不到该代码。请检查后重试。"
  },
  module_load_error: {
    en: "We're having trouble loading this lesson. Let's try another one.",
    zh: "我们无法加载此课程。让我们试试另一个。"
  },
  navigation_error: {
    en: "Let's start fresh from the main menu.",
    zh: "让我们从主菜单重新开始。"
  }
};
```

### Panic Button as Ultimate Fallback

The panic button serves as the ultimate error recovery mechanism:
- Always visible, always functional
- Never disabled, even during errors
- Provides immediate escape route
- Resets application state to known-good home screen


## Testing Strategy

### Dual Testing Approach

ReBooted requires both unit testing and property-based testing to ensure correctness and reliability for our vulnerable user population. These approaches are complementary:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

Together, they provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing

**Library Selection**: 
- **JavaScript/TypeScript**: Use `fast-check` library
- Minimum 100 iterations per property test (due to randomization)
- Each test must reference its design document property

**Property Test Configuration**:
```typescript
import fc from 'fast-check';

// Example property test
describe('Feature: digimentor, Property 1: Language Preference Persistence Round-Trip', () => {
  it('should persist and load language preference correctly', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('en', 'zh'), // Generate random language
        (language) => {
          // Save language
          saveLanguagePreference(language);
          
          // Load language
          const loaded = loadLanguagePreference();
          
          // Verify round-trip
          expect(loaded).toBe(language);
        }
      ),
      { numRuns: 100 } // Minimum 100 iterations
    );
  });
});
```

**Tag Format**: Each property test must include a comment:
```typescript
// Feature: digimentor, Property {number}: {property_text}
```

### Unit Testing Strategy

**Focus Areas**:
1. **Specific Examples**: Test concrete scenarios like "welcome screen displays on first visit"
2. **Edge Cases**: Test boundary conditions like empty input, maximum step count
3. **Error Conditions**: Test specific error scenarios like API failures
4. **Integration Points**: Test component interactions and data flow

**Balance**: Avoid writing too many unit tests. Property-based tests handle covering lots of inputs. Unit tests should focus on:
- Demonstrating correct behavior with specific examples
- Testing integration between components
- Validating error handling paths
- Checking UI rendering for specific states

**Example Unit Tests**:
```typescript
describe('WelcomeScreen', () => {
  it('should display language toggle on first visit', () => {
    render(<WelcomeScreen />);
    expect(screen.getByText(/EN|中文/)).toBeInTheDocument();
  });
  
  it('should show 4 module buttons in onboarding quiz', () => {
    render(<OnboardingQuiz />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(4);
  });
});

describe('AITutor', () => {
  it('should display out-of-scope message for unrelated questions', async () => {
    const response = await askAITutor('What is the weather today?');
    expect(response).toContain("That's a great question for your family helper");
  });
  
  it('should handle API failure gracefully', async () => {
    mockClaudeAPI.mockRejectedValue(new Error('Network error'));
    const response = await askAITutor('How do I make a call?');
    expect(response).toContain("I'm having trouble right now");
  });
});
```

### Testing Coverage by Requirement

**Language Support (Req 1)**:
- Property: Language persistence round-trip (Property 1)
- Property: UI text language consistency (Property 2)
- Property: AI tutor language matching (Property 3)
- Unit: Welcome screen shows language toggle
- Unit: Switching language updates all visible text

**Onboarding Flow (Req 2)**:
- Property: Module navigation (Property 4)
- Property: Font size accessibility (Property 5)
- Unit: Welcome screen displays on first visit
- Unit: Quiz shows exactly 4 module buttons
- Unit: Module button labels are correct

**Learning Module Structure (Req 3)**:
- Property: Module step count limit (Property 6)
- Property: Module step visual presence (Property 7)
- Property: Module step navigation buttons (Property 8)
- Property: Module completion celebration (Property 9)
- Property: Progress state persistence (Property 10)
- Property: Touch target minimum size (Property 11)
- Unit: First step shows only "next" button
- Unit: Last step shows only "back" button
- Unit: Middle steps show both buttons

**Video Call Module (Req 4)**:
- Unit: Video call module has title screen
- Unit: Video call module has 3-5 steps
- Unit: Video call module completion marks progress

**Maps Module (Req 5)**:
- Unit: Maps module has title screen
- Unit: Maps module has 3-5 steps
- Unit: Maps module completion marks progress

**AI Tutor Integration (Req 6)**:
- Property: AI tutor question button presence (Property 12)
- Property: AI tutor panel opening (Property 13)
- Property: Suggested questions count (Property 14)
- Property: AI tutor API response (Property 15)
- Property: AI response length limit (Property 16)
- Unit: Out-of-scope questions get redirect message
- Unit: API failure shows friendly error

**Panic Button (Req 7)**:
- Property: Panic button universal presence (Property 17)
- Property: Panic button label (Property 18)
- Property: Panic button navigation (Property 19)
- Property: Home screen module button count (Property 20)
- Unit: Panic button appears on all screens
- Unit: Panic button navigates to home

**Family Portal (Req 8, 9)**:
- Property: Family portal access code validation (Property 21)
- Property: Family dashboard progress display (Property 22)
- Property: Real-time dashboard synchronization (Property 23)
- Unit: Invalid access code shows error
- Unit: Dashboard shows completed modules
- Unit: Dashboard shows current step for incomplete modules

**Accessibility and Visual Design (Req 10)**:
- Property: Font size accessibility (Property 5)
- Property: Touch target minimum size (Property 11)
- Property: High contrast text (Property 24)
- Property: No hover-only interactions (Property 25)
- Property: Maximum items per screen (Property 26)
- Property: Back button presence (Property 27)
- Unit: No dark mode toggle exists
- Unit: Color palette uses warm colors

**Data Persistence (Req 11)**:
- Property: Language persistence round-trip (Property 1)
- Property: Progress state persistence (Property 10)
- Property: Module resume from last step (Property 28)
- Unit: LocalStorage unavailable falls back to memory
- Unit: Progress loads on app restart

**Module Visual Placeholders (Req 13)**:
- Property: Visual placeholder descriptive text (Property 29)
- Unit: Placeholder shows description
- Unit: Placeholder maintains aspect ratio

**PWA Support (Req 14)**:
- Property: Offline content availability (Property 30)
- Unit: Manifest file exists with correct name
- Unit: Service worker registers successfully
- Unit: App installs to home screen

**Navigation (Req 17)**:
- Property: Navigation history maintenance (Property 31)
- Property: Back button navigation (Property 32)
- Property: Module progress indicator (Property 33)
- Unit: Client-side routing works
- Unit: Beforeunload handler prevents accidental exit

**Error Handling (Req 18)**:
- Property: Error message language consistency (Property 34)
- Property: Error recovery action (Property 35)
- Property: Error logging without technical details (Property 36)
- Unit: AI API failure shows specific message
- Unit: LocalStorage failure continues functioning
- Unit: Invalid route redirects to home

**Celebration Screen (Req 16)**:
- Property: Celebration screen bilingual text (Property 37)
- Property: Celebration screen navigation buttons (Property 38)
- Property: Module completion state update (Property 39)
- Unit: Celebration shows "Great job! 做得好!"
- Unit: Celebration has home and next buttons

### Test Environment Setup

**Required Tools**:
- Jest or Vitest for test runner
- React Testing Library for component testing
- fast-check for property-based testing
- MSW (Mock Service Worker) for API mocking
- Firebase emulator for backend testing

**Configuration**:
```typescript
// jest.config.js or vitest.config.ts
export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.tsx'
  ],
  coverageThresholds: {
    global: {
      statements: 80,
      branches: 75,
      functions: 80,
      lines: 80
    }
  }
};
```

### Continuous Integration

**CI Pipeline**:
1. Run all unit tests
2. Run all property tests (100 iterations each)
3. Check code coverage thresholds
4. Run accessibility tests (axe-core)
5. Build PWA and verify manifest
6. Deploy to staging environment

**Pre-commit Hooks**:
- Run tests for changed files
- Lint code with ESLint
- Format code with Prettier
- Check TypeScript types

### Manual Testing Checklist

**Senior User Testing**:
- [ ] Test with actual seniors (60+) if possible
- [ ] Verify all text is readable at arm's length
- [ ] Confirm all buttons are easily tappable
- [ ] Check that panic button is always visible
- [ ] Verify language switching works correctly
- [ ] Test on various devices (phone, tablet)
- [ ] Test with different font size settings
- [ ] Verify offline functionality

**Family Portal Testing**:
- [ ] Test access code entry
- [ ] Verify real-time progress updates
- [ ] Check dashboard displays correctly
- [ ] Test on desktop and mobile browsers

**Accessibility Testing**:
- [ ] Run axe DevTools on all screens
- [ ] Test with screen reader (VoiceOver, TalkBack)
- [ ] Verify keyboard navigation works
- [ ] Check color contrast ratios
- [ ] Test with browser zoom at 200%

