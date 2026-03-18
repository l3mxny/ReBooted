# Senior-Friendly Design Steering Document

## UI Rules (Applied to ALL components)
- Minimum font size: 22px
- All buttons minimum 48x48px tap targets
- Panic button minimum 64x64px
- High contrast only: dark text on light backgrounds
- Maximum 4 elements per screen
- No hover-only interactions
- Warm color palette: #7C3AED (Kiro purple), #FDFBF7 (warm white), #F4A261 (coral)
- Slow gentle animations: 300-500ms only
- Mobile-first, PWA optimized

## Bilingual Rules
- All UI text must have EN and ZH translations
- Chinese text renders differently — account for width
- Language persists via localStorage
- Never translate brand names (ReBooted stays ReBooted)
- Only translate technical words, not full sentences

## AI Tutor Rules
- 4th grade reading level maximum
- 2-3 sentences per response maximum
- Always end with encouragement
- Translate key tech words with pinyin
- Redirect off-topic questions warmly back to lesson
- Pre-seed 3 suggested questions per step

## Color Theme
- Primary: #7C3AED (Kiro purple)
- Background: #FDFBF7 (warm white)
- Success: #27AE60 (green)
- Help button: #FF6B6B (coral red)
- Completed: #27AE60 (green)
