# GeoThamizh Modular AI Chatbot

A self-contained, responsive, exportable AI Heritage Chatbot powered by **React 18** and **Anime.js v4**.

Designed to be dropped directly into any React project or main file with zero mandatory dependencies outside of `react` and `animejs`.

---

## 🚀 Quick Start

```jsx
import React, { useState } from 'react';
import { AIChatbotDrawer, AIChatbotFloatingButton } from './components/AIChatbot';

export default function MyMainApp() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div>
      {/* 1. Floating trigger button (optional) */}
      <AIChatbotFloatingButton 
        onClick={() => setIsChatOpen(true)} 
        label="AI Heritage Guide"
      />

      {/* 2. Chatbot Drawer */}
      <AIChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onSelectPlace={(place) => {
          console.log('User clicked interactive place pin:', place);
          // e.g. map.flyTo([place.lat, place.lng], 12);
        }}
      />
    </div>
  );
}
```

---

## ⚙️ Available Props

All props are completely optional with high-accuracy built-in fallbacks:

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `isOpen` | `boolean` | `false` | Controls whether the chatbot drawer is displayed. |
| `onClose` | `() => void` | `() => {}` | Callback invoked when user clicks the close icon or backdrop. |
| `onSelectPlace` | `(place) => void` | `undefined` | Callback invoked when user clicks an interactive location tag in an AI message. |
| `initialPlaceContext` | `object` | `null` | Optional place object to automatically generate a contextual greeting for. |
| `groqApiKey` | `string` | `''` | Optional Groq API Key (`gsk_...`) for ultra-fast Llama 3.3 / Mixtral inference. Recommended! |
| `geminiApiKey` | `string` | `''` | Optional Google Gemini API Key (`AIza...`) alternative. If neither is set, built-in deterministic scholarly RAG engine is used. |
| `places` | `Array` | *Built-in* | Array of place objects to search and highlight. |
| `people` | `Array` | *Built-in* | Array of historical monarchs, poets, and scholars. |
| `works` | `Array` | *Built-in* | Classical Tamil literature registry. |
| `sourcesRegistry` | `Object` | *Built-in* | Academic source citations registry (ASI, CICT, DHARMA). |

---

## ✨ Features
1. **Anime.js v4 Animations**: Spring drawer entrance, staggered message bubbles, looping wave typing indicator, pulsing golden heritage emblem, and cascading inquiry chips.
2. **Scholarly Grounding**: Grounded in verified Tamil epigraphical corpora (DHARMA, ASI, CICT).
3. **Web Speech Synthesis**: Real-time spoken Tamil and English voice readout with stop/toggle.
4. **Interactive Map Pins**: Discovers mentioned locations in responses and provides clickable fly-to tags.
