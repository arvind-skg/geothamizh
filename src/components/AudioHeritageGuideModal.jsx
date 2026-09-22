import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, RotateCcw, X, MapPin, Sparkles, BookOpen, Globe } from 'lucide-react';

export const AudioHeritageGuideModal = ({
  isOpen,
  onClose,
  place,
  currentLanguage = 'en'
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [language, setLanguage] = useState(currentLanguage === 'ta' ? 'ta' : 'en');
  const [progress, setProgress] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);

  // Fallback place narration if place is empty
  const activePlace = place || {
    name: 'Meenakshi Sundareswarar Temple',
    tamilName: 'மதுரை மீனாட்சி சுந்தரேசுவரர் திருக்கோயில்',
    audioNarration: 'Welcome to Madurai, ancient Koodal. For over two millennia, this sacred city on the Vaigai river has echoed with the verses of Tamil poets and the bells of Meenakshi Temple. Notice the concentric streets designed like lotus petals, reflecting ancient urban planning described in the Sangam epic Silappadikaram.',
    district: 'Madurai',
    classicalName: 'Koodal (கூடல்)',
    whyItMatters: 'Madurai is the spiritual and literary heart of Tamil civilization. It nurtured the ancient Tamil Sangams.'
  };

  const getNarrationText = () => {
    if (language === 'ta') {
      return `${activePlace.tamilName}. ${activePlace.whyItMatters || activePlace.name}. சங்க இலக்கியங்களில் கூடல் என போற்றப்பட்ட இந்த வரலாற்றுப் பெருநகரம், இரண்டாயிரத்திற்கும் மேற்பட்ட ஆண்டுகளாக தமிழ் மொழியையும், கலைகளையும், பண்பாட்டையும் தன்னுள் தாங்கி நிற்கிறது.`;
    }
    return activePlace.audioNarration || activePlace.whyItMatters || `${activePlace.name} is one of the pivotal historical anchors of Tamil civilization.`;
  };

  // Speech Synthesis Controller
  useEffect(() => {
    if (!isOpen) {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      setIsPlaying(false);
      setProgress(0);
    }
  }, [isOpen]);

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        synthRef.current.cancel();
        const text = getNarrationText();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = playbackSpeed;
        utterance.pitch = 1.0;

        if (language === 'ta') {
          utterance.lang = 'ta-IN';
        } else {
          utterance.lang = 'en-US';
        }

        utterance.onend = () => {
          setIsPlaying(false);
          setProgress(100);
        };

        utterance.onerror = () => {
          setIsPlaying(false);
        };

        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleRestart = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsPlaying(false);
    setProgress(0);
    setTimeout(() => {
      handleTogglePlay();
    }, 150);
  };

  if (!isOpen) return null;

  return (
    <div className="audio-guide-modal-overlay">
      <div className="audio-guide-card">
        {/* Header */}
        <div className="audio-guide-header">
          <div className="audio-guide-badge">
            <Volume2 size={15} color="#ffd166" />
            <span>Hands-Free Heritage Audio Tour</span>
          </div>
          <button 
            type="button"
            className="audio-guide-close-btn"
            onClick={onClose}
            aria-label="Close audio guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Place Metadata Card */}
        <div className="audio-guide-place-info">
          <div className="audio-guide-place-avatar">
            <span style={{ fontSize: '24px' }}>🏛️</span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 className="audio-guide-place-title">{activePlace.name}</h3>
            <div className="audio-guide-place-tamil">{activePlace.tamilName}</div>
            <div className="audio-guide-place-district">
              <MapPin size={11} color="#d4952b" />
              <span>{activePlace.district} • {activePlace.classicalName || 'Heritage Site'}</span>
            </div>
          </div>
        </div>

        {/* Language Switcher Tabs */}
        <div className="audio-guide-lang-tabs">
          <button 
            type="button"
            className={`audio-lang-tab ${language === 'en' ? 'active' : ''}`}
            onClick={() => {
              if (synthRef.current) synthRef.current.cancel();
              setIsPlaying(false);
              setLanguage('en');
            }}
          >
            <Globe size={12} />
            <span>English Narration</span>
          </button>
          <button 
            type="button"
            className={`audio-lang-tab ${language === 'ta' ? 'active' : ''}`}
            onClick={() => {
              if (synthRef.current) synthRef.current.cancel();
              setIsPlaying(false);
              setLanguage('ta');
            }}
          >
            <span>தமிழ் ஒலி விளக்கம்</span>
          </button>
        </div>

        {/* Audio Waveform / Transcript Display */}
        <div className="audio-guide-transcript-box">
          <div className="audio-guide-transcript-header">
            <BookOpen size={13} color="#d4952b" />
            <span>Spoken Narration Transcript:</span>
          </div>
          <p className="audio-guide-transcript-text">
            {getNarrationText()}
          </p>
        </div>

        {/* Audio Player Controls */}
        <div className="audio-guide-controls-row">
          <button 
            type="button"
            className="audio-ctrl-btn"
            onClick={handleRestart}
            title="Restart Narration"
          >
            <RotateCcw size={16} />
          </button>

          <button 
            type="button"
            className="audio-main-play-btn"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause' : 'Listen'}
          >
            {isPlaying ? <Pause size={22} fill="#fff" /> : <Play size={22} fill="#fff" style={{ marginLeft: '2px' }} />}
          </button>

          <button 
            type="button"
            className="audio-ctrl-btn"
            onClick={() => {
              const next = playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 0.9 : 1;
              setPlaybackSpeed(next);
              if (isPlaying) handleRestart();
            }}
            title="Playback Speed"
          >
            <span style={{ fontSize: '12px', fontWeight: 700 }}>{playbackSpeed}x</span>
          </button>
        </div>

        <div className="audio-guide-footer-tip">
          <Sparkles size={12} color="#ffd166" />
          <span>Proximity Mode: Automatically narrating based on your heritage location</span>
        </div>
      </div>
    </div>
  );
};
