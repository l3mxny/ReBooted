# Implementation Plan: ReBooted

## Overview

This implementation plan breaks down the ReBooted learning platform into incremental, testable steps. The approach prioritizes core functionality first (language support, navigation, basic modules), then adds AI tutor integration, and finally implements the family portal. Each task builds on previous work, with checkpoints to ensure quality and gather user feedback.

## Tasks

- [x] 1. Project setup and foundation
  - Initialize Next.js 14+ project with TypeScript and App Router
  - Configure Tailwind CSS with senior-friendly design tokens (warm colors, large fonts, touch targets)
  - Set up project structure: `/app`, `/components`, `/lib`, `/content`, `/test`
  - Install dependencies: React 18+, Tailwind, fast-check, Firebase SDK, Anthropic SDK
  - Create `.env.local` template for API keys
  - Set up ESLint and Prettier with accessibility rules
  - _Requirements: 10.1, 10.2, 10.3, 14.1_

- [x] 2. Implement language support system
  - [x] 2.1 Create LanguageProvider context with localStorage persistence
    - Implement language state management ('en' | 'zh')
    - Create translation function that loads from JSON files
    - Persist language selection to localStorage with key `rebooted_language`
    - Load saved language preference on app mount
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x]* 2.2 Write property test for language persistence round-trip
    - **Property 1: Language Preference Persistence Round-Trip**
    - **Validates: Requirements 1.2, 1.3**
  
  - [x] 2.3 Create translation JSON files (en.json, zh.json)
    - Add translations for all UI text, button labels, error messages
    - Include module titles, step content, and AI tutor messages
    - Organize by feature area for maintainability
    - _Requirements: 1.4_
  
  - [x]* 2.4 Write property test for UI text language consistency
    - **Property 2: UI Text Language Consistency**
    - **Validates: Requirements 1.4**


- [x] 3. Implement progress tracking system
  - [x] 3.1 Create ProgressProvider context with localStorage persistence
    - Define ProgressState interface (completedModules, currentModule, currentStep, accessCode)
    - Generate 6-digit access code on first use
    - Implement save/load functions for localStorage with key `rebooted_progress`
    - Handle localStorage unavailable scenario (fallback to memory)
    - _Requirements: 8.2, 11.1, 11.2, 11.4_
  
  - [x]* 3.2 Write property test for progress state persistence round-trip
    - **Property 10: Progress State Persistence Round-Trip**
    - **Validates: Requirements 3.7, 11.2, 11.4**
  
  - [x] 3.3 Implement progress update functions
    - completeModule(moduleId): Mark module as complete
    - updateCurrentStep(moduleId, step): Save current position
    - resumeModule(moduleId): Load last viewed step
    - _Requirements: 4.5, 5.5, 11.5_
  
  - [x]* 3.4 Write property test for module resume from last step
    - **Property 28: Module Resume from Last Step**
    - **Validates: Requirements 11.5**
  
  - [x]* 3.5 Write unit test for localStorage unavailable fallback
    - Test that app continues functioning with in-memory state
    - _Requirements: 18.5_

- [x] 4. Create core layout components
  - [x] 4.1 Implement PanicButton component
    - Fixed position at bottom center, 64x64px minimum
    - Soft red background (#FF6B6B), bilingual label "Help / 帮助"
    - On tap: show modal with calm message, navigate to home after 2 seconds
    - Ensure z-index 9999 (always on top)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_
  
  - [x]* 4.2 Write property tests for panic button
    - **Property 17: Panic Button Universal Presence**
    - **Property 18: Panic Button Label**
    - **Property 19: Panic Button Navigation**
    - **Validates: Requirements 7.1, 7.2, 7.3, 7.4, 7.5**
  
  - [x] 4.3 Create PageContainer layout wrapper
    - Include PanicButton on all pages
    - Apply warm white background (#FDFBF7)
    - Ensure minimum 32px padding on all sides
    - Add back button for non-home screens
    - _Requirements: 10.8_
  
  - [x]* 4.4 Write property test for back button presence
    - **Property 27: Back Button Presence**
    - **Validates: Requirements 10.8**

- [x] 5. Implement home screen and navigation
  - [x] 5.1 Create HomeScreen component
    - Display app title "ReBooted" and tagline "Never too late to reboot"
    - Render 4 module buttons: Video Calls, Send Photos, Using Maps, Stay Safe
    - Each button 160x160px with icon, label, and soft blue/sage green background
    - Include LanguageToggle component at top right
    - _Requirements: 12.1, 12.2, 12.5, 12.6_
  
  - [x]* 5.2 Write property test for home screen module button count
    - **Property 20: Home Screen Module Button Count**
    - **Validates: Requirements 7.6, 12.1**
  
  - [x]* 5.3 Write unit tests for home screen
    - Test that 4 specific module buttons are displayed
    - Test that language toggle is present
    - Test that panic button is present
    - _Requirements: 12.2, 12.5, 12.6_
  
  - [x] 5.4 Implement module navigation routing
    - Set up Next.js App Router routes: /modules/[moduleId]
    - Create navigation functions for module selection
    - Maintain navigation history for back button
    - _Requirements: 2.5, 12.4, 17.1, 17.3_
  
  - [x]* 5.5 Write property tests for navigation
    - **Property 4: Module Navigation**
    - **Property 31: Navigation History Maintenance**
    - **Property 32: Back Button Navigation**
    - **Validates: Requirements 2.5, 12.4, 17.3, 17.4**

- [ ] 6. Checkpoint - Ensure basic navigation works
  - Verify language toggle switches all text
  - Verify panic button navigates to home from any screen
  - Verify all 4 module buttons navigate correctly
  - Verify back button returns to previous screen
  - Ensure all tests pass, ask the user if questions arise.


- [x] 7. Create module content structure
  - [x] 7.1 Define module content schema and TypeScript interfaces
    - Create ModuleContent, ModuleStep, VisualPlaceholder interfaces
    - Define module IDs: 'video-calls', 'send-photos', 'maps', 'stay-safe'
    - _Requirements: 3.1, 4.1, 5.1_
  
  - [x] 7.2 Create modules.json content file
    - Implement Video Calls module with 3-5 steps
    - Implement Maps module with 3-5 steps
    - Include bilingual titles, content, and suggested questions for each step
    - Add visual placeholder descriptions for each step
    - _Requirements: 4.2, 4.3, 5.2, 5.3_
  
  - [x]* 7.3 Write property test for module step count limit
    - **Property 6: Module Step Count Limit**
    - **Validates: Requirements 3.1**
  
  - [x]* 7.4 Write unit tests for module content
    - Test Video Calls module has 3-5 steps
    - Test Maps module has 3-5 steps
    - Test each step has required fields (title, content, visual, questions)
    - _Requirements: 4.2, 5.2_

- [x] 8. Implement learning module components
  - [x] 8.1 Create VisualPlaceholder component
    - Display placeholder with descriptive text and camera emoji
    - Support aspect ratios: 16:9, 4:3, 1:1
    - Light sage green background with dashed border
    - _Requirements: 13.1, 13.2, 13.3_
  
  - [x]* 8.2 Write property test for visual placeholder descriptive text
    - **Property 29: Visual Placeholder Descriptive Text**
    - **Validates: Requirements 13.1, 13.2, 13.3**
  
  - [x] 8.3 Create ModuleStep component
    - Display step title (28px bold), content (22px), and visual placeholder
    - Show progress indicator "Step X of Y" at top
    - Render "next" and "back" buttons (140x56px, 20px text)
    - Include "I have a question" button (full width, 56px height)
    - Ensure all fonts >= 18px, all buttons >= 48x48px
    - _Requirements: 3.2, 3.3, 3.5, 17.6_
  
  - [x]* 8.4 Write property tests for module step
    - **Property 7: Module Step Visual Presence**
    - **Property 8: Module Step Navigation Buttons**
    - **Property 33: Module Progress Indicator**
    - **Validates: Requirements 3.3, 3.5, 17.6**
  
  - [x] 8.5 Create LearningModule container component
    - Load module content from modules.json
    - Manage current step state
    - Handle step navigation (next/back)
    - Auto-save progress on step change
    - Show celebration screen after final step
    - _Requirements: 3.6, 3.7, 11.5_
  
  - [x]* 8.6 Write property tests for module completion
    - **Property 9: Module Completion Celebration**
    - **Property 39: Module Completion State Update**
    - **Validates: Requirements 3.6, 16.1, 16.6**

- [ ] 9. Implement celebration screen
  - [ ] 9.1 Create CelebrationScreen component
    - Display 🎉 emoji (72px) with gentle pulse animation
    - Show "Great job! 做得好!" in bilingual format (32px, 24px)
    - Include module name that was completed
    - Add "Back to Home" and "Try Next Lesson" buttons (180x64px)
    - Use warm gradient background (warm white to soft gold)
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_
  
  - [ ]* 9.2 Write property tests for celebration screen
    - **Property 37: Celebration Screen Bilingual Text**
    - **Property 38: Celebration Screen Navigation Buttons**
    - **Validates: Requirements 16.2, 16.4, 16.5**
  
  - [ ]* 9.3 Write unit test for celebration screen
    - Test that "Great job! 做得好!" text is displayed
    - Test that both navigation buttons are present
    - _Requirements: 16.3_

- [ ] 10. Checkpoint - Ensure learning modules work end-to-end
  - Complete Video Calls module from start to finish
  - Verify progress is saved at each step
  - Verify celebration screen appears after completion
  - Verify module resumes from last step when revisited
  - Test with both English and Chinese languages
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 11. Implement AI tutor integration
  - [ ] 11.1 Set up Anthropic Claude API client
    - Install @anthropic-ai/sdk package
    - Create API client wrapper with error handling
    - Configure to use claude-sonnet-4-5 model
    - Implement retry logic with exponential backoff (3 attempts)
    - _Requirements: 6.4_
  
  - [ ] 11.2 Create AI tutor system prompt template
    - Enforce plain language, no jargon, 4th grade reading level
    - Limit responses to 2-3 sentences maximum
    - Always end with encouragement
    - Include current module and step context
    - Handle bilingual responses based on language setting
    - Redirect out-of-scope questions: "That's a great question for your family helper! Let's get back to our lesson."
    - _Requirements: 15.1, 15.2, 15.4, 15.7_
  
  - [ ]* 11.3 Write unit tests for AI system prompt
    - Test system prompt includes plain language instruction
    - Test system prompt includes jargon avoidance instruction
    - Test out-of-scope redirect message
    - _Requirements: 15.1, 15.2, 15.7_
  
  - [ ] 11.4 Create AITutorPanel component
    - Slide-in panel from right (300ms ease-out)
    - Display 3 suggested questions relevant to current step
    - Implement chat interface with message history
    - Show typing indicator while waiting for response
    - Auto-scroll to latest message
    - Include close button (✕) at top right
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 11.5 Write property tests for AI tutor panel
    - **Property 12: AI Tutor Question Button Presence**
    - **Property 13: AI Tutor Panel Opening**
    - **Property 14: Suggested Questions Count**
    - **Validates: Requirements 6.1, 6.2, 6.3**
  
  - [ ] 11.6 Implement AI tutor API integration
    - Send question with system prompt and context to Claude API
    - Parse and display response in chat interface
    - Handle API errors gracefully with friendly message
    - Ensure responses match current language setting
    - Validate response length (max 4 sentences)
    - _Requirements: 6.4, 6.5, 6.6, 6.9, 15.4_
  
  - [ ]* 11.7 Write property tests for AI tutor responses
    - **Property 3: AI Tutor Language Matching**
    - **Property 15: AI Tutor API Response**
    - **Property 16: AI Response Length Limit**
    - **Validates: Requirements 1.5, 6.4, 6.6, 6.9, 15.4, 15.5, 15.6**
  
  - [ ]* 11.8 Write unit test for AI API error handling
    - Test that API failure shows "I'm having trouble right now" message
    - Test that error is logged without showing technical details
    - _Requirements: 18.4, 18.6_

- [ ] 12. Implement onboarding flow
  - [ ] 12.1 Create WelcomeScreen component
    - Display large welcome text with warm colors
    - Show language toggle prominently
    - Include "Get Started" button to proceed to quiz
    - Use minimum 22px font size
    - _Requirements: 2.1, 2.2, 2.6_
  
  - [ ]* 12.2 Write unit test for welcome screen
    - Test that welcome screen displays on first visit
    - Test that language toggle is present
    - _Requirements: 2.1, 2.2_
  
  - [ ] 12.3 Create OnboardingQuiz component
    - Display question "What do you want to learn first?"
    - Show 4 large icon buttons for module selection
    - Each button navigates directly to selected module
    - Mark onboarding as complete in localStorage
    - _Requirements: 2.3, 2.4, 2.5_
  
  - [ ]* 12.4 Write unit test for onboarding quiz
    - Test that exactly 4 module buttons are displayed
    - Test that buttons have correct labels and icons
    - _Requirements: 2.4_
  
  - [ ]* 12.5 Write property test for font size accessibility
    - **Property 5: Font Size Accessibility**
    - **Validates: Requirements 2.6, 10.1**

- [ ] 13. Checkpoint - Ensure AI tutor and onboarding work
  - Complete onboarding flow from welcome to module selection
  - Ask AI tutor questions in both English and Chinese
  - Verify suggested questions populate input field
  - Verify out-of-scope questions get redirect message
  - Test API error handling by simulating network failure
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 14. Set up Firebase backend
  - [ ] 14.1 Initialize Firebase project and install SDK
    - Create Firebase project in console
    - Enable Firestore database
    - Install firebase and firebase-admin packages
    - Configure Firebase in app with environment variables
    - _Requirements: 8.1, 9.5_
  
  - [ ] 14.2 Create Firestore schema and security rules
    - Create `users` collection with UserDocument interface
    - Add fields: accessCode, progress, encouragementMessage, createdAt, seniorName
    - Configure security rules: read access with valid code, write access for encouragement
    - _Requirements: 8.4, 9.1_
  
  - [ ] 14.3 Implement progress sync to Firebase
    - Create syncToFirebase function in ProgressProvider
    - Sync progress on module completion and step updates
    - Handle offline scenarios with queue and retry
    - _Requirements: 9.5_
  
  - [ ]* 14.4 Write property test for real-time dashboard synchronization
    - **Property 23: Real-Time Dashboard Synchronization**
    - **Validates: Requirements 9.5**
  
  - [ ]* 14.5 Write unit test for Firebase connection error
    - Test that app continues functioning when Firebase is unreachable
    - Test that progress updates are queued for later sync
    - _Requirements: 18.3_

- [ ] 15. Implement family portal
  - [ ] 15.1 Create family portal route and access code entry
    - Create /family route with AccessCodeEntry component
    - Implement 6-digit code input with validation
    - Show error message for invalid codes
    - Store valid code in session storage
    - _Requirements: 8.1, 8.3, 8.4_
  
  - [ ]* 15.2 Write property test for family portal access code validation
    - **Property 21: Family Portal Access Code Validation**
    - **Validates: Requirements 8.4**
  
  - [ ]* 15.3 Write unit test for invalid access code
    - Test that invalid code shows error message
    - Test that error message is user-friendly
    - _Requirements: 18.1, 18.2_
  
  - [ ] 15.4 Create ProgressDashboard component
    - Display progress summary: completed modules, current activity, last active time
    - Show module progress list with completion status
    - Display current step for incomplete modules
    - Use clean, modern design (not senior-optimized)
    - _Requirements: 9.1, 9.2, 9.3_
  
  - [ ]* 15.5 Write property test for family dashboard progress display
    - **Property 22: Family Dashboard Progress Display**
    - **Validates: Requirements 9.1, 9.2, 9.3**
  
  - [ ]* 15.6 Write unit tests for progress dashboard
    - Test that completed modules are displayed
    - Test that current step is shown for incomplete modules
    - Test that last active time is displayed
    - _Requirements: 9.2, 9.3_
  
  - [ ] 15.7 Implement "Send Encouragement" feature
    - Add "Send Encouragement" button to dashboard
    - Create modal with text input (max 100 characters)
    - Save encouragement message to Firebase
    - Display message to senior as banner on next login
    - Banner shows "💌 Message from family: [text]" with dismiss button
    - Only one active message at a time (new replaces old)
    - _Requirements: 9.1_
  
  - [ ]* 15.8 Write unit tests for encouragement feature
    - Test that encouragement button opens modal
    - Test that message is saved to Firebase
    - Test that senior sees banner on next login
    - Test that dismiss button removes banner

- [ ] 16. Implement accessibility features
  - [ ] 16.1 Ensure all touch targets meet minimum size
    - Audit all buttons and interactive elements
    - Verify all are >= 48x48px
    - Fix any that don't meet requirement
    - _Requirements: 3.8, 10.3_
  
  - [ ]* 16.2 Write property test for touch target minimum size
    - **Property 11: Touch Target Minimum Size**
    - **Validates: Requirements 3.8, 10.3**
  
  - [ ] 16.3 Implement high contrast and color requirements
    - Verify all text uses dark on light backgrounds
    - Ensure no hover-only interactions exist
    - Confirm warm color palette is used throughout
    - Verify no dark mode toggle exists
    - _Requirements: 10.2, 10.4, 10.6, 10.9_
  
  - [ ]* 16.4 Write property tests for accessibility
    - **Property 24: High Contrast Text**
    - **Property 25: No Hover-Only Interactions**
    - **Validates: Requirements 10.2, 10.4**
  
  - [ ]* 16.5 Write unit test for no dark mode
    - Test that no dark mode toggle exists in UI
    - _Requirements: 10.9_
  
  - [ ] 16.6 Implement maximum items per screen rule
    - Audit all screens for item count
    - Ensure no screen has more than 4 primary items
    - Refactor any screens that violate this rule
    - _Requirements: 10.5_
  
  - [ ]* 16.7 Write property test for maximum items per screen
    - **Property 26: Maximum Items Per Screen**
    - **Validates: Requirements 10.5**

- [ ] 17. Checkpoint - Ensure family portal and accessibility work
  - Test family portal with valid and invalid access codes
  - Verify real-time progress updates in dashboard
  - Send encouragement message and verify senior sees it
  - Verify all touch targets are >= 48x48px
  - Verify all text has high contrast
  - Verify no screen has more than 4 items
  - Ensure all tests pass, ask the user if questions arise.


- [ ] 18. Implement PWA features
  - [ ] 18.1 Create web app manifest
    - Set app name to "ReBooted"
    - Set description to "Never too late to reboot"
    - Configure icons for various sizes
    - Set display mode to "standalone"
    - Set theme color to warm white (#FDFBF7)
    - _Requirements: 14.1, 14.2, 14.3_
  
  - [ ]* 18.2 Write unit tests for PWA manifest
    - Test that manifest file exists
    - Test that app name is "ReBooted"
    - Test that tagline is in description
    - _Requirements: 14.2, 14.3_
  
  - [ ] 18.3 Implement service worker for offline support
    - Cache static assets (HTML, CSS, JS, images)
    - Cache module content JSON
    - Implement cache-first strategy for assets
    - Implement network-first strategy for API calls
    - _Requirements: 14.4, 14.6_
  
  - [ ]* 18.4 Write property test for offline content availability
    - **Property 30: Offline Content Availability**
    - **Validates: Requirements 14.6**
  
  - [ ]* 18.5 Write unit test for service worker
    - Test that service worker registers successfully
    - Test that cached content is accessible offline
    - _Requirements: 14.4_

- [ ] 19. Implement error handling
  - [ ] 19.1 Create error message translation system
    - Add all error messages to en.json and zh.json
    - Include messages for: AI unavailable, connection error, invalid code, module load error, navigation error
    - _Requirements: 18.1, 18.2_
  
  - [ ] 19.2 Implement error display components
    - Create ErrorMessage component with friendly styling
    - Show error in current language
    - Include clear recovery action (button or link)
    - Never show technical details to users
    - _Requirements: 18.1, 18.2, 18.3, 18.6_
  
  - [ ]* 19.3 Write property tests for error handling
    - **Property 34: Error Message Language Consistency**
    - **Property 35: Error Recovery Action**
    - **Property 36: Error Logging Without Technical Details**
    - **Validates: Requirements 18.1, 18.2, 18.3, 18.6**
  
  - [ ] 19.4 Implement specific error handlers
    - AI API failure: Show "I'm having trouble right now" message
    - LocalStorage unavailable: Continue with in-memory state
    - Firebase connection error: Queue updates for later
    - Invalid route: Redirect to home screen
    - Module load error: Return to home with message
    - _Requirements: 18.4, 18.5_
  
  - [ ]* 19.5 Write unit tests for specific error scenarios
    - Test AI API failure shows correct message
    - Test localStorage fallback works
    - Test invalid route redirects to home
    - _Requirements: 18.4, 18.5_

- [ ] 20. Implement navigation safety features
  - [ ] 20.1 Add beforeunload handler
    - Prevent accidental navigation away from app
    - Show confirmation dialog if user tries to leave
    - Exclude confirmation for intentional navigation (panic button, back button)
    - _Requirements: 17.5_
  
  - [ ]* 20.2 Write unit test for navigation prevention
    - Test that beforeunload handler is registered
    - Test that confirmation appears on accidental exit
    - _Requirements: 17.5_
  
  - [ ] 20.3 Implement smooth transitions
    - Add 300ms ease-out transitions for screen changes
    - Use gentle fade effects for modals and panels
    - Ensure animations don't disorient users
    - _Requirements: 17.2_

- [ ] 21. Create remaining module content
  - [ ] 21.1 Implement "Send Photos" module
    - Create 3-5 steps teaching photo sharing
    - Include bilingual content and suggested questions
    - Add visual placeholders for each step
    - _Requirements: 12.2_
  
  - [ ] 21.2 Implement "Stay Safe Online" module
    - Create 3-5 steps teaching online safety
    - Include bilingual content and suggested questions
    - Add visual placeholders for each step
    - _Requirements: 12.2_
  
  - [ ]* 21.3 Write unit tests for new modules
    - Test that Send Photos module has 3-5 steps
    - Test that Stay Safe module has 3-5 steps
    - Test that all steps have required fields

- [ ] 22. Final integration and polish
  - [ ] 22.1 Implement gentle animations
    - Add pulse animation to celebration emoji (1.5s infinite)
    - Add scale animation to button hovers (1.05x, 300ms)
    - Add fade-in for screen transitions (300ms)
    - Ensure all animations are slow and gentle
    - _Requirements: 17.2_
  
  - [ ] 22.2 Audit and fix font sizes
    - Verify all text is >= 18px
    - Ensure primary content is >= 22px
    - Fix any violations found
    - _Requirements: 10.1_
  
  - [ ] 22.3 Audit and fix color contrast
    - Run axe DevTools on all screens
    - Verify all text meets WCAG AA contrast requirements
    - Fix any contrast issues found
    - _Requirements: 10.2_
  
  - [ ] 22.4 Test on multiple devices
    - Test on mobile phones (iOS and Android)
    - Test on tablets
    - Test with different screen sizes
    - Test with browser zoom at 200%
    - Verify PWA installation works on all devices

- [ ] 23. Final checkpoint - End-to-end testing
  - Complete full user journey: onboarding → module → completion → family portal
  - Test all 4 modules from start to finish
  - Verify progress syncs to family portal in real-time
  - Test AI tutor in multiple scenarios
  - Test error handling by simulating failures
  - Verify offline functionality works
  - Test with both English and Chinese languages throughout
  - Ensure all property tests pass (100 iterations each)
  - Ensure all unit tests pass
  - Verify accessibility with screen reader
  - Ask the user if questions arise or if ready for deployment.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and user feedback
- Property tests validate universal correctness properties (100 iterations minimum)
- Unit tests validate specific examples and edge cases
- All code should be written in TypeScript for type safety
- All UI components should follow senior-friendly design rules (22px+ fonts, 48px+ touch targets, high contrast)
- All text should be bilingual (English and Chinese)
- Panic button should be present and functional on every screen

