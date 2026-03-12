# Requirements Document

## Introduction

ReBooted is a learning platform designed specifically for Chinese-speaking senior citizens (60+) with low tech literacy. The tagline "Never too late to reboot" reflects the platform's mission to empower seniors with digital skills. The platform addresses the unique challenges these users face: language barriers, tech anxiety, unfamiliar UI patterns, and lack of patient guidance. ReBooted provides step-by-step tutorials for common digital tasks, an AI-powered tutor for contextual help, and a family portal for loved ones to track progress.

## Glossary

- **Senior_User**: A Chinese-speaking person aged 60+ with low tech literacy who is the primary learner
- **Learning_Module**: A structured tutorial teaching one specific digital skill (e.g., making video calls)
- **Module_Step**: A single screen within a Learning_Module presenting one concept
- **AI_Tutor**: An AI-powered chatbot that provides contextual help within learning modules
- **Family_Helper**: An adult family member who monitors the Senior_User's progress
- **Family_Portal**: A separate interface for Family_Helpers to view learning progress
- **Language_Toggle**: A UI control that switches between English and Chinese (中文)
- **Panic_Button**: A persistent help button that returns users to the home screen
- **Access_Code**: A 6-digit code that links a Senior_User to their Family_Helper
- **Home_Screen**: The main navigation screen showing available learning modules
- **Progress_State**: The saved record of which modules and steps a user has completed

## Requirements

### Requirement 1: Language Support

**User Story:** As a Chinese-speaking senior, I want to use the application in my native language, so that I can understand the content without language barriers.

#### Acceptance Criteria

1. THE Language_Toggle SHALL display both English and Chinese (中文) options
2. WHEN a Senior_User selects a language, THE System SHALL persist that choice to browser localStorage
3. WHEN a Senior_User returns to the application, THE System SHALL load their previously selected language
4. THE System SHALL render all UI text, instructions, and module content in the selected language
5. THE AI_Tutor SHALL respond in the language matching the current Language_Toggle setting


### Requirement 2: Onboarding Flow

**User Story:** As a new senior user, I want a welcoming introduction that helps me choose what to learn first, so that I feel comfortable and can start with topics relevant to my needs.

#### Acceptance Criteria

1. WHEN a Senior_User first visits the application, THE System SHALL display a welcome screen with large text and warm colors
2. THE Welcome_Screen SHALL include the Language_Toggle prominently displayed
3. WHEN the onboarding begins, THE System SHALL present a picture-based quiz asking "What do you want to learn first?"
4. THE Quiz_Screen SHALL display exactly 4 large icon buttons representing: Video Calls, Sending Photos, Using Maps, and Staying Safe Online
5. WHEN a Senior_User selects a topic, THE System SHALL navigate directly to that Learning_Module
6. THE System SHALL use minimum 18px font size throughout the onboarding flow

### Requirement 3: Learning Module Structure

**User Story:** As a senior user, I want to learn digital skills through simple, visual step-by-step lessons, so that I can master one concept at a time without feeling overwhelmed.

#### Acceptance Criteria

1. THE Learning_Module SHALL contain a maximum of 5 Module_Steps
2. WHEN displaying a Module_Step, THE System SHALL present exactly one concept per screen
3. THE Module_Step SHALL include large visuals or screenshot placeholders
4. THE System SHALL use simple language at a 4th grade reading level with no technical jargon
5. THE Module_Step SHALL display large "next" and "back" buttons with clear labels
6. WHEN a Senior_User completes all Module_Steps, THE System SHALL display a celebration screen with encouraging text in both languages
7. WHEN a Senior_User progresses through a module, THE System SHALL save their Progress_State to localStorage
8. THE System SHALL ensure all tap targets are minimum 48x48 pixels


### Requirement 4: Video Call Learning Module

**User Story:** As a senior user, I want to learn how to make video calls using FaceTime or WeChat, so that I can stay connected with my family.

#### Acceptance Criteria

1. THE Video_Call_Module SHALL include a title screen with a friendly illustration
2. THE Video_Call_Module SHALL contain 3 to 5 Module_Steps teaching video call basics
3. WHEN displaying instructions, THE System SHALL use screenshots or visual placeholders showing FaceTime and WeChat interfaces
4. THE Video_Call_Module SHALL teach: opening the app, finding a contact, initiating a call, and ending a call
5. WHEN a Senior_User completes the Video_Call_Module, THE System SHALL mark it as complete in their Progress_State

### Requirement 5: Maps Learning Module

**User Story:** As a senior user, I want to learn how to use Google Maps to navigate to places, so that I can travel independently with confidence.

#### Acceptance Criteria

1. THE Maps_Module SHALL include a title screen with a friendly illustration
2. THE Maps_Module SHALL contain 3 to 5 Module_Steps teaching Google Maps basics
3. WHEN displaying instructions, THE System SHALL use screenshots or visual placeholders showing Google Maps interface
4. THE Maps_Module SHALL teach: opening Maps, searching for a location, viewing directions, and following navigation
5. WHEN a Senior_User completes the Maps_Module, THE System SHALL mark it as complete in their Progress_State

### Requirement 6: AI Tutor Integration

**User Story:** As a senior user, I want to ask questions when I'm confused during a lesson, so that I can get immediate, patient help without bothering my family.

#### Acceptance Criteria

1. WHEN viewing any Module_Step, THE System SHALL display an "I have a question" button
2. WHEN a Senior_User taps the question button, THE System SHALL open a chat panel
3. THE Chat_Panel SHALL display 3 pre-seeded suggested questions relevant to the current Module_Step
4. WHEN a Senior_User asks a question, THE AI_Tutor SHALL respond using the Anthropic Claude API
5. THE AI_Tutor SHALL use warm, simple language with no jargon
6. THE AI_Tutor SHALL provide short responses that always end with encouragement
7. THE AI_Tutor SHALL answer questions about both the specific app being learned and the ReBooted lesson content
8. IF a question is outside the scope of the current module, THEN THE AI_Tutor SHALL respond with "That's a great question for your family helper! Let's get back to our lesson."
9. THE AI_Tutor SHALL respond in the language matching the current Language_Toggle setting


### Requirement 7: Panic Button

**User Story:** As a senior user who gets confused easily, I want a reliable way to get back to safety when I'm lost, so that I never feel trapped or frustrated.

#### Acceptance Criteria

1. THE System SHALL display a Panic_Button on every screen in the application
2. THE Panic_Button SHALL be positioned at the bottom center of the screen
3. THE Panic_Button SHALL be large and clearly labeled "Help / 帮助"
4. WHEN a Senior_User taps the Panic_Button, THE System SHALL display a calm message: "No problem! Let's go back to the main menu."
5. WHEN the Panic_Button is activated, THE System SHALL navigate the user to the Home_Screen
6. THE Home_Screen SHALL display the 4 main module selection buttons

### Requirement 8: Family Portal Access

**User Story:** As a family helper, I want to monitor my elderly relative's learning progress, so that I can provide targeted support and celebrate their achievements.

#### Acceptance Criteria

1. THE System SHALL provide a separate Family_Portal interface for Family_Helpers
2. WHEN a Senior_User first uses the application, THE System SHALL generate a unique 6-digit Access_Code
3. THE System SHALL display the Access_Code to the Senior_User for sharing with family
4. WHEN a Family_Helper enters a valid Access_Code, THE System SHALL grant access to that Senior_User's progress data
5. THE Senior_User SHALL NOT be required to create an account
6. THE Family_Portal SHALL use a separate authentication flow from the Senior_User interface

### Requirement 9: Family Portal Progress Dashboard

**User Story:** As a family helper, I want to see which lessons my relative has completed and where they struggled, so that I can provide appropriate encouragement and assistance.

#### Acceptance Criteria

1. WHEN a Family_Helper accesses the Family_Portal, THE System SHALL display a progress dashboard
2. THE Dashboard SHALL show which Learning_Modules the Senior_User has completed
3. THE Dashboard SHALL show which Module_Step the Senior_User last viewed in incomplete modules
4. THE Dashboard SHALL present information in a simple, friendly format without complex charts
5. THE Dashboard SHALL update in real-time as the Senior_User makes progress


### Requirement 10: Accessibility and Visual Design

**User Story:** As a senior user with aging eyesight and limited dexterity, I want an interface designed for my physical capabilities, so that I can use the application comfortably and successfully.

#### Acceptance Criteria

1. THE System SHALL use a minimum font size of 18px, with 22px or larger preferred for primary content
2. THE System SHALL use high contrast with dark text on light backgrounds only
3. THE System SHALL ensure all interactive buttons are minimum 48x48 pixels
4. THE System SHALL NOT use tooltips or hover-only interactions
5. THE System SHALL display no more than 4 items on any screen at once
6. THE System SHALL use a warm color palette including soft blues, greens, and whites
7. THE System SHALL NOT use aggressive or flashy colors
8. THE System SHALL display a visible back button on every screen except the Home_Screen
9. THE System SHALL NOT implement dark mode

### Requirement 11: Data Persistence

**User Story:** As a senior user, I want my progress and preferences saved automatically, so that I can pick up where I left off without having to remember anything.

#### Acceptance Criteria

1. WHEN a Senior_User selects a language, THE System SHALL persist the choice to browser localStorage
2. WHEN a Senior_User completes a Module_Step, THE System SHALL persist their Progress_State to browser localStorage
3. WHEN a Senior_User returns to the application, THE System SHALL load their saved language preference
4. WHEN a Senior_User returns to the application, THE System SHALL load their saved Progress_State
5. WHEN a Senior_User navigates to an incomplete module, THE System SHALL resume from their last viewed Module_Step

### Requirement 12: Home Screen Navigation

**User Story:** As a senior user, I want a simple main menu that shows me all available lessons, so that I can easily choose what to learn next.

#### Acceptance Criteria

1. THE Home_Screen SHALL display exactly 4 large module selection buttons
2. THE Module_Buttons SHALL represent: Video Calls, Sending Photos, Using Maps, and Staying Safe Online
3. THE Module_Buttons SHALL use clear icons and text labels
4. WHEN a Senior_User taps a Module_Button, THE System SHALL navigate to that Learning_Module
5. THE Home_Screen SHALL display the Language_Toggle
6. THE Home_Screen SHALL display the Panic_Button


### Requirement 13: Module Visual Placeholders

**User Story:** As a developer, I want to create descriptive placeholder components for module visuals, so that the application can be demonstrated and tested before final images are available.

#### Acceptance Criteria

1. WHEN a Module_Step requires a screenshot or illustration, THE System SHALL display a placeholder component
2. THE Placeholder SHALL include descriptive text indicating what the final image will show
3. THE Placeholder SHALL use clear labels such as "SCREENSHOT: FaceTime green call button circled"
4. THE Placeholder SHALL maintain the same dimensions and layout as the final image will occupy
5. THE Placeholder SHALL use styling consistent with the warm color palette

### Requirement 14: Progressive Web App Support

**User Story:** As a senior user, I want to add ReBooted to my phone's home screen like a regular app, so that I can access it easily without using a browser.

#### Acceptance Criteria

1. THE System SHALL be implemented as a Progressive Web App (PWA)
2. THE System SHALL provide a web app manifest file with the app name "ReBooted"
3. THE System SHALL include the tagline "Never too late to reboot" in the app description
4. THE System SHALL support installation to device home screens
5. WHEN installed, THE Application SHALL function like a native app
6. THE Application SHALL work offline for previously loaded content

### Requirement 15: AI Tutor System Prompt

**User Story:** As a senior user, I want the AI tutor to consistently provide helpful, encouraging, and age-appropriate responses, so that I feel supported throughout my learning journey.

#### Acceptance Criteria

1. THE AI_Tutor SHALL use a system prompt that enforces plain language responses
2. THE AI_Tutor SHALL be configured to avoid technical jargon
3. THE AI_Tutor SHALL maintain a patient and warm tone in all responses
4. THE AI_Tutor SHALL provide short responses (maximum 3-4 sentences)
5. THE AI_Tutor SHALL end every response with encouragement
6. THE AI_Tutor SHALL be bilingual, responding in English or Chinese based on the Language_Toggle
7. IF a question is unrelated to the current module or general tech help, THEN THE AI_Tutor SHALL redirect the user back to the lesson


### Requirement 16: Module Completion Celebration

**User Story:** As a senior user, I want to be celebrated when I finish a lesson, so that I feel accomplished and motivated to continue learning.

#### Acceptance Criteria

1. WHEN a Senior_User completes the final Module_Step in a Learning_Module, THE System SHALL display a celebration screen
2. THE Celebration_Screen SHALL include encouraging text in both English and Chinese
3. THE Celebration_Screen SHALL use the phrase "Great job! 做得好!" or similar positive reinforcement
4. THE Celebration_Screen SHALL include a button to return to the Home_Screen
5. THE Celebration_Screen SHALL include a button to start the next recommended module
6. WHEN the celebration is displayed, THE System SHALL mark the module as complete in Progress_State

### Requirement 17: Routing and Navigation

**User Story:** As a senior user, I want smooth transitions between screens with clear navigation controls, so that I always know where I am and how to move forward or backward.

#### Acceptance Criteria

1. THE System SHALL implement client-side routing for navigation between screens
2. WHEN a Senior_User navigates between screens, THE System SHALL provide smooth transitions
3. THE System SHALL maintain navigation history for back button functionality
4. WHEN a Senior_User taps a back button, THE System SHALL navigate to the previous screen
5. THE System SHALL prevent accidental navigation away from the application
6. THE System SHALL display the current location within a module (e.g., "Step 2 of 4")

### Requirement 18: Error Handling and Resilience

**User Story:** As a senior user with limited tech skills, I want the application to handle errors gracefully without showing confusing technical messages, so that I don't feel intimidated or lost.

#### Acceptance Criteria

1. WHEN an error occurs, THE System SHALL display a friendly, non-technical error message
2. THE Error_Message SHALL be displayed in the current selected language
3. THE System SHALL provide a clear action for the user to recover from the error
4. IF the AI_Tutor API fails, THEN THE System SHALL display "I'm having trouble right now. Please try again in a moment."
5. IF localStorage is unavailable, THEN THE System SHALL continue functioning with in-memory state
6. THE System SHALL log errors for debugging without displaying technical details to users

