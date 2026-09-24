# Geoதமிழ் AI Heritage Guide - Export & Integration Guide

This guide explains how to transfer and integrate the **AI Heritage Guide Chatbot** into your main codebase on another laptop.

---

## What Has Been Packaged For You

We have already created a **self-contained ZIP archive**:
📁 **`AIChatbot_Export.zip`** (located in the root of this project: `d:\Downloads\New folder geo\AIChatbot_Export.zip`)

Inside this single archive is the complete modular chatbot:
```
AIChatbot/
├── AIChatbotDrawer.jsx            # Main interactive chatbot drawer component
├── AIChatbotFloatingButton.jsx    # Floating trigger button (optional)
├── AIChatbot.css                  # Production responsive museum styling
├── groqHeritageEngine.js          # High-speed Groq LLM (gpt-oss-120b) RAG engine
├── heritageScopeGuard.js          # Domain boundary guard for off-topic/code questions
├── heritageSchema.js              # Museum-grade structured schema & offline fallback
├── chatbotAnimations.js           # Anime.js v4 animations & motion tokens
├── index.js                       # Module export entry point
├── README.md                      # Architecture notes
└── components/
    └── HeritageAnswer.jsx         # Museum card, waypoint & source renderer
```

---

## 3 Ways to Transfer (Pick What Works Best For You)

### Method 1: Direct Folder Copy (Easiest & Fastest via USB / Drive)
1. Send `AIChatbot_Export.zip` (or the folder `src/components/AIChatbot/`) to your friend via USB drive, Google Drive, or Discord.
2. On your friend's laptop, extract the `AIChatbot` folder directly into:
   ```
   src/components/AIChatbot/
   ```
3. Follow the **4 Simple Integration Steps** below.

---

### Method 2: Git Branch & Pull Request (Recommended for Team Collaboration)
If you and your friend share a Git repository on GitHub / GitLab:
1. On your laptop, create a branch and push:
   ```bash
   git checkout -b feature/ai-heritage-guide
   git add src/components/AIChatbot src/App.jsx package.json
   git commit -m "feat: Add production-grade AI Heritage Guide chatbot"
   git push origin feature/ai-heritage-guide
   ```
2. Your friend can either:
   - Run `git checkout feature/ai-heritage-guide` and `git pull`, OR
   - Merge the Pull Request directly on GitHub into `main`.

---

### Method 3: Git Patch File (One-File Code Transfer)
You can generate a `.patch` file that transfers all code changes in a single text file:
1. Create the patch:
   ```bash
   git diff main > ai-heritage-guide.patch
   ```
2. Your friend runs on their laptop:
   ```bash
   git apply ai-heritage-guide.patch
   ```

---

## The 4 Simple Integration Steps on the Friend's Laptop

### Step 1: Install Dependencies
Open terminal in the project folder and make sure `animejs` and `lucide-react` are installed:
```bash
npm install animejs lucide-react
```

### Step 2: Set the Groq API Key
In the root directory, open or create `.env` and add:
```env
VITE_GROQ_API_KEY=gsk_your_groq_api_key_here
```

### Step 3: Import in `App.jsx`
At the top of `src/App.jsx`:
```jsx
import { AIChatbotDrawer, AIChatbotFloatingButton } from './components/AIChatbot';
```

### Step 4: Render in `App.jsx`
1. Ensure state exists:
```jsx
const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
```

2. Inside the return JSX of `App.jsx`:
```jsx
{/* Trigger Button (or use the one in Navbar) */}
<AIChatbotFloatingButton onClick={() => setIsAIGuideOpen(true)} />

{/* AI Heritage Guide Drawer */}
<AIChatbotDrawer
  isOpen={isAIGuideOpen}
  onClose={() => setIsAIGuideOpen(false)}
  places={PLACES}
  people={HISTORICAL_PEOPLE}
  works={LITERATURE_WORKS}
  inscriptions={INSCRIPTIONS}
  sourcesRegistry={SOURCES}
  onSelectPlace={handleFocusPlaceOnMap}
  onOpenPlaceDetails={handleSelectPlace}
  onShowJourney={handleShowJourneyRoute}
  onSelectPeriod={(periodId) => {
    setMapMode('historical');
    setActivePeriodId(periodId);
  }}
  onOpenPeople={handleOpenPeople}
  initialPlaceContext={selectedPlace}
  currentLanguage={currentLanguage}
  onLanguageChange={handleLanguageChange}
  translations={translations}
  groqApiKey={import.meta.env.VITE_GROQ_API_KEY}
/>
```

---

## Self-Contained Fallbacks
The module is designed so that even if your friend passes NO props at all, it automatically falls back to internal default data imports and standalone safe defaults!
