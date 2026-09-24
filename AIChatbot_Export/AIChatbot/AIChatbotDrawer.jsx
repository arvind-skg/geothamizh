import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Send, MapPin, ExternalLink, Volume2, VolumeX, 
  Settings, Compass, BookOpen, Key, ChevronRight, ArrowDown
} from 'lucide-react';
import './AIChatbot.css';
import { 
  animateDrawerEnter, 
  animateDrawerExit, 
  animateMessageBubble, 
  animateTypingDots, 
  animateEmblemPulse
} from './chatbotAnimations';
import { HeritageAnswer } from './components/HeritageAnswer';
import { resolveHeritageQuery } from './heritageSchema';
import { queryGroqHeritage } from './groqHeritageEngine';

// Default Fallback Datasets (ensures standalone exportability)
import { PLACES as DEFAULT_PLACES } from '../../data/places';
import { HISTORICAL_PEOPLE as DEFAULT_PEOPLE } from '../../data/people';
import { LITERATURE_WORKS as DEFAULT_WORKS } from '../../data/works';
import { INSCRIPTIONS as DEFAULT_INSCRIPTIONS } from '../../data/inscriptions';
import { SOURCES as DEFAULT_SOURCES } from '../../data/sources';

export const AIChatbotDrawer = ({
  isOpen = false,
  onClose = () => {},
  onSelectPlace,
  onOpenPlaceDetails,
  onShowJourney,
  onSelectPeriod,
  onOpenPeople,
  initialPlaceContext = null,
  currentLanguage = 'en',
  onLanguageChange,
  translations = {},
  geminiApiKey: initialApiKey = '',
  groqApiKey: initialGroqKey = '',
  places = DEFAULT_PLACES,
  people = DEFAULT_PEOPLE,
  works = DEFAULT_WORKS,
  inscriptions = DEFAULT_INSCRIPTIONS,
  sourcesRegistry = DEFAULT_SOURCES,
  theme = 'heritage-dark'
}) => {
  const [chatLanguage, setChatLanguage] = useState(currentLanguage || 'en');
  const [query, setQuery] = useState('');
  const [geminiApiKey, setGeminiApiKey] = useState(() => 
    initialApiKey || 
    import.meta.env.VITE_GEMINI_API_KEY || 
    localStorage.getItem('geothamizh_gemini_key') || 
    ''
  );
  const [groqApiKey, setGroqApiKey] = useState(() => 
    initialGroqKey || 
    import.meta.env.VITE_GROQ_API_KEY || 
    localStorage.getItem('geothamizh_groq_key') || 
    ''
  );
  const [showSettings, setShowSettings] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeVoiceMsgId, setActiveVoiceMsgId] = useState(null);

  const backdropRef = useRef(null);
  const panelRef = useRef(null);
  const emblemRef = useRef(null);
  const typingDotsRef = useRef(null);
  const messagesEndRef = useRef(null);
  const lastMsgRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const textareaRef = useRef(null);

  const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
  const [hasNewUnseen, setHasNewUnseen] = useState(false);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  };

  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight <= 75;
    if (isNearBottom) {
      setIsUserScrolledUp(false);
      setHasNewUnseen(false);
    } else {
      setIsUserScrolledUp(true);
    }
  };

  // Sync internal chat language if parent language changes
  useEffect(() => {
    if (currentLanguage) {
      setChatLanguage(currentLanguage);
    }
  }, [currentLanguage]);

  // Initial conversation starts clean and open for user inquiries
  const [messages, setMessages] = useState([]);

  // Animate drawer entrance
  useEffect(() => {
    if (isOpen) {
      animateDrawerEnter(panelRef.current, backdropRef.current);
      const emblemAnim = animateEmblemPulse(emblemRef.current);
      return () => {
        if (emblemAnim && typeof emblemAnim.pause === 'function') emblemAnim.pause();
      };
    }
  }, [isOpen]);

  // Animate new incoming message & preserve reading scroll position if user scrolled up
  useEffect(() => {
    if (messages.length > 0 && lastMsgRef.current) {
      animateMessageBubble(lastMsgRef.current);
    }
    if (isUserScrolledUp) {
      setHasNewUnseen(true);
    } else {
      scrollToBottom(true);
    }
  }, [messages]);

  // Animate typing dots wave
  useEffect(() => {
    let anim = null;
    if (isProcessing && typingDotsRef.current) {
      anim = animateTypingDots(typingDotsRef.current);
    }
    return () => {
      if (anim && typeof anim.pause === 'function') anim.pause();
    };
  }, [isProcessing]);

  // If initialPlaceContext changes when opening, inject proactive greeting
  useEffect(() => {
    if (isOpen && initialPlaceContext) {
      const placeGreeting = {
        id: `context-${Date.now()}`,
        sender: 'assistant',
        structuredData: resolveHeritageQuery({
          query: initialPlaceContext.name,
          lang: chatLanguage,
          places,
          people,
          works,
          inscriptions,
          sourcesRegistry
        }),
        sources: initialPlaceContext.sources || ['asi-monuments'],
        confidence: 'high'
      };
      setMessages(prev => [...prev, placeGreeting]);
    }
  }, [isOpen, initialPlaceContext]);

  // Handle switching language
  const handleSwitchLanguage = (newLang) => {
    setChatLanguage(newLang);
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }

    // Re-resolve existing messages to the new language so the UI transforms seamlessly
    setMessages(prev => prev.map(m => {
      if (m.originalQuery !== undefined || m.structuredData) {
        return {
          ...m,
          structuredData: resolveHeritageQuery({
            query: m.originalQuery || m.structuredData?.id || '',
            lang: newLang,
            places,
            people,
            works,
            inscriptions,
            sourcesRegistry
          })
        };
      }
      return m;
    }));
  };

  // Controlled Exit
  const handleClose = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveVoiceMsgId(null);
    animateDrawerExit(panelRef.current, backdropRef.current, onClose);
  };

  // Web Speech Audio Narration
  const handleVoicePlay = (msgId, text) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    if (activeVoiceMsgId === msgId) {
      window.speechSynthesis.cancel();
      setActiveVoiceMsgId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = text.replace(/\*\*/g, '').replace(/#/g, '').replace(/_/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang && v.lang.startsWith('ta'));
    if (tamilVoice && /[\u0B80-\u0BFF]/.test(cleanText)) {
      utterance.voice = tamilVoice;
    }

    utterance.onend = () => setActiveVoiceMsgId(null);
    utterance.onerror = () => setActiveVoiceMsgId(null);

    window.speechSynthesis.speak(utterance);
    setActiveVoiceMsgId(msgId);
  };

  // Handle textarea auto-expansion & keyboard submit
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 110)}px`;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isProcessing) {
        handleSendQuery();
      }
    }
  };

  // Submit and Query Processing
  const handleSendQuery = async (userQueryText) => {
    const textToSend = userQueryText || query;
    if (!textToSend.trim() || isProcessing) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    setIsProcessing(true);

    const qLower = textToSend.toLowerCase().trim();

    // 1. If Groq API Key is available, invoke Groq Heritage Intelligence Engine
    if (groqApiKey && groqApiKey.trim()) {
      try {
        const groqStructuredData = await queryGroqHeritage({
          query: textToSend,
          lang: chatLanguage,
          places,
          people,
          works,
          inscriptions,
          sourcesRegistry,
          apiKey: groqApiKey
        });

        if (groqStructuredData) {
          const aiMsg = {
            id: `ai-${Date.now()}`,
            sender: 'assistant',
            originalQuery: textToSend,
            structuredData: groqStructuredData,
            sources: groqStructuredData.isOutOfScope ? [] : (groqStructuredData.sources?.map(s => s.id) || ['groq-llama-3.3', 'cict-classical-tamil']),
            confidence: groqStructuredData.isOutOfScope ? 'domain-scope' : 'high'
          };

          setMessages(prev => [...prev, aiMsg]);
          setIsProcessing(false);
          return;
        }
      } catch (err) {
        console.warn('Groq Heritage Engine attempt failed, falling back to local verified engine:', err);
      }
    }

    // 2. Client-side verified dataset engine fallback
    const localStructuredData = resolveHeritageQuery({
      query: textToSend,
      lang: chatLanguage,
      places,
      people,
      works,
      inscriptions,
      sourcesRegistry
    });

    const aiMsg = {
      id: `ai-${Date.now()}`,
      sender: 'assistant',
      originalQuery: textToSend,
      structuredData: localStructuredData,
      sources: localStructuredData.isOutOfScope ? [] : (localStructuredData.sources?.map(s => s.id) || ['cict-classical-tamil', 'asi-monuments']),
      confidence: localStructuredData.isOutOfScope ? 'domain-scope' : 'high'
    };

    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="geothamizh-chatbot-overlay" 
      ref={backdropRef} 
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="AI Heritage Guide Chatbot"
    >
      <div 
        className="geothamizh-chatbot-panel" 
        ref={panelRef} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Matching Mockup */}
        <div className="geothamizh-chatbot-header">
          <div className="geothamizh-header-brand">
            <div className="geothamizh-header-emblem" ref={emblemRef}>
              <div className="emblem-inner-ring">
                <Sparkles size={16} color="#ffd166" />
              </div>
            </div>
            <div>
              <div className="geothamizh-header-title">
                <span>
                  {chatLanguage === 'ta' ? 'AI மரபு வழிகாட்டி' : (chatLanguage === 'hi' ? 'एआई हेरिटेज गाइड' : 'AI Heritage Guide')}
                </span>
                <span className="geothamizh-header-beta-badge">BETA</span>
              </div>
              <div className="geothamizh-header-tagline">
                {chatLanguage === 'ta' 
                  ? 'தமிழ் வரலாற்றில் வேரூன்றி, மெய்யான சான்றுகளின் அடிப்படையில் அமைந்தது.'
                  : (chatLanguage === 'hi'
                    ? 'तमिल इतिहास में निहित। वास्तविक ऐतिहासिक स्रोतों पर आधारित।'
                    : 'Rooted in Tamil History. Grounded in Real Sources.')}
              </div>
            </div>
          </div>

          <div className="geothamizh-header-actions">
            {/* Language Switcher Pills: [ EN | தமிழ் | हिन्दी ] */}
            <div className="geothamizh-lang-pill-group">
              <button 
                className={`lang-pill-btn ${chatLanguage === 'en' ? 'active' : ''}`}
                onClick={() => handleSwitchLanguage('en')}
                title="Switch to English"
              >
                EN
              </button>
              <button 
                className={`lang-pill-btn ${chatLanguage === 'ta' ? 'active' : ''}`}
                onClick={() => handleSwitchLanguage('ta')}
                title="தமிழுக்கு மாற்றுக"
              >
                தமிழ்
              </button>
              <button 
                className={`lang-pill-btn ${chatLanguage === 'hi' ? 'active' : ''}`}
                onClick={() => handleSwitchLanguage('hi')}
                title="हिन्दी में बदलें"
              >
                हिन्दी
              </button>
            </div>

            {/* Settings Toggle */}
            <button 
              className={`geothamizh-header-btn ${showSettings ? 'active' : ''}`}
              onClick={() => setShowSettings(prev => !prev)}
              title="API Configuration"
              aria-label="Settings"
            >
              <Settings size={17} />
            </button>

            {/* Close Drawer Button */}
            <button 
              className="geothamizh-header-btn" 
              onClick={handleClose}
              title="Close guide"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Collapsible API Settings Bar */}
        {showSettings && (
          <div className="geothamizh-settings-drawer">
            <div className="settings-inner">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffd166', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }}>
                <Key size={14} />
                <span>Groq API Key (High-Speed LLM Inference)</span>
              </div>
              <p style={{ fontSize: '11px', color: '#a89f91', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                Powered by Groq 120B & 27B models. Loaded automatically from <code>.env</code> (<code>VITE_GROQ_API_KEY</code>).
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="password"
                  value={groqApiKey}
                  onChange={(e) => {
                    setGroqApiKey(e.target.value);
                    localStorage.setItem('geothamizh_groq_key', e.target.value);
                  }}
                  placeholder="gsk_..."
                  style={{
                    flex: 1,
                    background: '#140e0a',
                    border: '1px solid rgba(212, 149, 43, 0.3)',
                    color: '#faf6ed',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontFamily: 'monospace'
                  }}
                />
                {groqApiKey && (
                  <button
                    onClick={() => {
                      setGroqApiKey('');
                      localStorage.removeItem('geothamizh_groq_key');
                    }}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: '#bbb',
                      padding: '0 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Message Scroll Area */}
        <div 
          className="geothamizh-messages-scroll"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {messages.length === 0 ? (
            <div className="geothamizh-empty-welcome">
              <div className="welcome-emblem">
                <Sparkles size={26} color="#ffd166" />
              </div>
              <h3 className="welcome-title">
                {chatLanguage === 'ta' 
                  ? 'Geoதமிழ் வரலாற்று வழிகாட்டி' 
                  : (chatLanguage === 'hi' ? 'जियोतमिल विरासत गाइड' : 'Tamil Heritage AI Guide')}
              </h3>
              <p className="welcome-desc">
                {chatLanguage === 'ta'
                  ? 'சிலப்பதிகாரம், சோழர் வரலாறு, கீழடி அகழ்வாராய்ச்சி மற்றும் பண்டைய துறைமுகங்கள் பற்றி கேளுங்கள்.'
                  : (chatLanguage === 'hi'
                    ? 'सिलप्पादिकारम, चोल वंश, कीलड़ी उत्खनन और प्राचीन संगम बंदरगाहों के बारे में पूछें।'
                    : 'Grounded in authentic Sangam literature, epigraphy, and GIS coordinates. Choose an inquiry below or type your question.')}
              </p>

              <div className="welcome-prompt-chips">
                {[
                  {
                    label: chatLanguage === 'ta' ? '📜 சிலப்பதிகாரம் தொடர்பான இடங்கள்' : (chatLanguage === 'hi' ? '📜 सिलप्पादिकारम से जुड़े स्थल' : '📜 Places in Silappadikaram'),
                    query: chatLanguage === 'ta' ? 'சிலப்பதிகாரம் தொடர்புடைய இடங்கள் யாவை?' : (chatLanguage === 'hi' ? 'सिलप्पादिकारम से जुड़े स्थान कौन से हैं?' : 'What places are connected to Silappadikaram?')
                  },
                  {
                    label: chatLanguage === 'ta' ? '👥 கண்ணகி, கோவலன் & இளங்கோவடிகள்' : (chatLanguage === 'hi' ? '👥 कण्णगी, कोवलन और इलंगो अडिगल' : '👥 Kannagi, Kovalan & Ilango Adigal'),
                    query: chatLanguage === 'ta' ? 'கண்ணகி, கோவலன் மற்றும் இளங்கோவடிகள் பற்றி விவரிக்கவும்' : (chatLanguage === 'hi' ? 'कण्णगी, कोवलन और इलंगो अडिगल के बारे में बताएं' : 'Tell me about Kannagi, Kovalan, and Ilango Adigal')
                  },
                  {
                    label: chatLanguage === 'ta' ? '🏛️ முதலாம் இராஜராஜ சோழன் - தஞ்சாவூர்' : (chatLanguage === 'hi' ? '🏛️ राजराज चोल प्रथम - तंजावुर' : '🏛️ Rajaraja Chola I & Thanjavur'),
                    query: chatLanguage === 'ta' ? 'முதலாம் இராஜராஜ சோழன் தஞ்சாவூரில் என்ன கட்டினார்?' : (chatLanguage === 'hi' ? 'राजराज चोल प्रथम ने तंजावुर में क्या बनवाया?' : 'What did Rajaraja Chola I build in Thanjavur?')
                  },
                  {
                    label: chatLanguage === 'ta' ? '🏺 கீழடி & ஆதிச்சநல்லூர் அகழ்வாராய்ச்சி' : (chatLanguage === 'hi' ? '🏺 कीलड़ी और आदिचनल्लூர் उत्खनन' : '🏺 Keeladi & Adichanallur Excavations'),
                    query: chatLanguage === 'ta' ? 'கீழடி மற்றும் ஆதிச்சநல்லூர் அகழ்வாராய்ச்சிகள் பற்றி கூறு' : (chatLanguage === 'hi' ? 'कीलड़ी और आदिचनल्लूर पुरातात्विक उत्खनन के बारे में बताएं' : 'Tell me about Keeladi and Adichanallur excavations')
                  },
                  {
                    label: chatLanguage === 'ta' ? '⛵ சங்க காலத் துறைமுகங்கள்' : (chatLanguage === 'hi' ? '⛵ संगम काल के प्रमुख बंदरगाह' : '⛵ Sangam Era Ports (Poompuhar, Muziris)'),
                    query: chatLanguage === 'ta' ? 'சங்க காலத்தின் முக்கிய துறைமுகங்கள் யாவை?' : (chatLanguage === 'hi' ? 'संगम काल के प्रमुख बंदरगाह कौन से थे?' : 'What were the major Sangam trading ports like Muziris and Poompuhar?')
                  }
                ].map((chip, cIdx) => (
                  <button
                    key={cIdx}
                    type="button"
                    className="welcome-prompt-chip"
                    onClick={() => handleSendQuery(chip.query)}
                  >
                    <span className="chip-label">{chip.label}</span>
                    <ChevronRight size={13} className="chip-arrow" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isLatest = idx === messages.length - 1;

              if (msg.sender === 'user') {
                return (
                  <div 
                    key={msg.id} 
                    ref={isLatest ? lastMsgRef : null}
                    className="geothamizh-user-bubble-row"
                  >
                    <div className="geothamizh-user-bubble">
                      <span className="user-text-content">{msg.text}</span>
                    </div>
                    <div className="geothamizh-user-avatar">
                      <div className="user-avatar-circle">
                        <div className="user-icon-dot"></div>
                      </div>
                    </div>
                  </div>
                );
              }

              // Assistant message
              return (
                <div 
                  key={msg.id} 
                  ref={isLatest ? lastMsgRef : null}
                  className="geothamizh-assistant-message-row"
                >
                  {/* Structured Museum-Grade Heritage Answer */}
                  {msg.structuredData ? (
                    <HeritageAnswer
                      data={msg.structuredData}
                      lang={chatLanguage}
                      onSelectPlace={onSelectPlace}
                      onOpenPlaceDetails={onOpenPlaceDetails}
                      onShowJourney={onShowJourney}
                      onSelectPeriod={onSelectPeriod}
                      onOpenPeople={onOpenPeople}
                      onSendQuery={handleSendQuery}
                    />
                  ) : (
                    // Conversational Bubble
                    <div className="geothamizh-chat-bubble assistant">
                      <div className="geothamizh-msg-header">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {chatLanguage === 'ta' ? 'Geoதமிழ் வழிகாட்டி' : (chatLanguage === 'hi' ? 'जियोतमिल गाइड' : 'Geoதமிழ் AI Guide')}
                          {msg.sources?.some(s => s.startsWith('groq-')) && (
                            <span style={{ fontSize: '9px', background: 'rgba(212, 149, 43, 0.2)', color: '#ffd166', padding: '1px 5px', borderRadius: '4px', border: '1px solid rgba(212, 149, 43, 0.3)' }}>
                              ⚡ Groq
                            </span>
                          )}
                        </span>
                        <button
                          onClick={() => handleVoicePlay(msg.id, msg.text)}
                          className="voice-play-btn"
                          title={activeVoiceMsgId === msg.id ? "Stop voice narration" : "Listen to answer"}
                        >
                          {activeVoiceMsgId === msg.id ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>
                      </div>

                      <div className="geothamizh-msg-body">{msg.text}</div>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {/* Animated Wave Typing Indicator */}
          {isProcessing && (
            <div className="geothamizh-typing-indicator" ref={typingDotsRef}>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <span className="typing-label">
                {chatLanguage === 'ta' 
                  ? 'ஆதாரங்களைத் தொகுக்கிறது...' 
                  : (chatLanguage === 'hi' ? 'ऐतिहासिक साक्ष्य खोज रहे हैं...' : 'Synthesizing evidence...')}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Matching Mockup */}
        <div className="geothamizh-chatbot-input-tray">
          {/* Floating 'New response' scroll indicator when user is scrolled up */}
          {hasNewUnseen && (
            <button
              className="scroll-to-bottom-btn"
              onClick={() => {
                scrollToBottom(true);
                setHasNewUnseen(false);
                setIsUserScrolledUp(false);
              }}
              title="Scroll to latest response"
            >
              <ArrowDown size={13} />
              <span>
                {chatLanguage === 'ta' ? 'புதிய பதில் ↓' : (chatLanguage === 'hi' ? 'नवीनतम उत्तर ↓' : 'New response ↓')}
              </span>
            </button>
          )}

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="geothamizh-input-form"
          >
            <div className="input-compass-icon">
              <Compass size={16} />
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={
                chatLanguage === 'ta'
                  ? 'தமிழ் மரபு, மக்கள், இடங்கள், இலக்கியம் அல்லது வரலாறு பற்றிக் கேளுங்கள்...'
                  : (chatLanguage === 'hi'
                    ? 'तमिल विरासत, मन्दिर, स्थल, साहित्य या इतिहास के बारे में पूछें...'
                    : 'Ask about Tamil heritage, people, places, literature, or history...')
              }
              className="geothamizh-chat-textarea"
              disabled={isProcessing}
            />

            <button 
              type="submit" 
              className="geothamizh-send-btn"
              disabled={!query.trim() || isProcessing}
              title="Send message"
              aria-label="Send message"
            >
              <Send size={15} />
            </button>
          </form>

          {/* Footer Attribution Line */}
          <div className="geothamizh-input-footer">
            <span className="footer-disclaimer">
              {chatLanguage === 'ta'
                ? 'பதில்கள் கல்வெட்டு, இலக்கியம் மற்றும் தொல்லியல் சான்றுகளின் அடிப்படையில் வழங்கப்படுகின்றன.'
                : (chatLanguage === 'hi'
                  ? 'उत्तर शिलालेखों, साहित्य और पुरातात्विक साक्ष्यों पर आधारित हैं।'
                  : 'Answers are grounded in epigraphical, literary and archaeological sources.')}
            </span>
            <a 
              href="https://www.tnarch.gov.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="footer-learn-more"
            >
              <span>{chatLanguage === 'ta' ? 'மேலும் அறிக' : (chatLanguage === 'hi' ? 'अधिक जानें' : 'Learn more')}</span>
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIChatbotDrawer;
