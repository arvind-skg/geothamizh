import React, { useState, useEffect } from 'react';
import { 
  X, Calendar, Sparkles, MapPin, Feather, Landmark, 
  ChevronLeft, ChevronRight, Volume2, RotateCcw, Play, Pause 
} from 'lucide-react';
import { DAILY_TAMIL_HISTORY } from '../data/dailyHistory';

export const TodayInHistoryModal = ({
  isOpen,
  onClose,
  dailyEntries = DAILY_TAMIL_HISTORY,
  onSelectPlaceById,
  onSelectPlaceOnMap,
  translations
}) => {
  const entries = dailyEntries && dailyEntries.length > 0 ? dailyEntries : DAILY_TAMIL_HISTORY;

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = entries.findIndex(
      h => h.month === currentMonth && h.day === currentDay
    );
    return idx >= 0 ? idx : 0;
  });

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Stop audio on close or entry change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isOpen, currentIndex]);

  if (!isOpen) return null;

  const activeEntry = entries[currentIndex] || entries[0];

  const handlePrev = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentIndex(prev => (prev === 0 ? entries.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setCurrentIndex(prev => (prev + 1) % entries.length);
  };

  const handleResetToToday = () => {
    const idx = entries.findIndex(
      h => h.month === currentMonth && h.day === currentDay
    );
    setCurrentIndex(idx >= 0 ? idx : 0);
  };

  const handleToggleVoice = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const narration = `${activeEntry.title}. ${activeEntry.tamilTitle}. In ${activeEntry.year}, ${activeEntry.monarch || ''} of the ${activeEntry.dynasty}. ${activeEntry.significance}. ${activeEntry.narrative}`;
      const utterance = new SpeechSynthesisUtterance(narration);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  const handleExploreOnMap = () => {
    const handler = onSelectPlaceById || onSelectPlaceOnMap;
    if (handler && activeEntry.placeId) {
      handler(activeEntry.placeId);
      onClose();
    }
  };

  return (
    <div className="today-history-modal-overlay" onClick={onClose}>
      <div className="today-history-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="today-history-header">
          <div className="today-history-header-left">
            <div className="today-history-icon-badge">
              <Calendar size={20} color="#d4952b" />
            </div>
            <div>
              <h2 className="today-history-title">Today in Tamil History</h2>
              <div className="today-history-sub">வரலாற்றில் இன்று • Daily Epigraphical & Literary Anniversaries</div>
            </div>
          </div>
          <button 
            type="button"
            className="today-history-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Date Selector Navigation Bar */}
        <div className="today-history-date-nav">
          <button 
            type="button" 
            className="date-nav-btn" 
            onClick={handlePrev}
            title="Previous Historical Anniversary"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="date-display-badge">
            <Calendar size={14} color="#ffd166" />
            <span className="date-text">
              {new Date(2026, activeEntry.month - 1, activeEntry.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
            <span className="date-year-pill">{activeEntry.year}</span>
            <span className="today-count-pill" style={{ marginLeft: '6px', fontSize: '11px', opacity: 0.8 }}>
              {currentIndex + 1} / {entries.length}
            </span>
          </div>

          <button 
            type="button" 
            className="date-nav-btn" 
            onClick={handleNext}
            title="Next Historical Anniversary"
          >
            <ChevronRight size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="date"
              value={`2026-${String(activeEntry.month).padStart(2, '0')}-${String(activeEntry.day).padStart(2, '0')}`}
              onChange={(e) => {
                const val = e.target.value;
                if (!val) return;
                const parts = val.split('-');
                const m = parseInt(parts[1], 10);
                const d = parseInt(parts[2], 10);
                const idx = entries.findIndex(h => h.month === m && h.day === d);
                if (idx >= 0) setCurrentIndex(idx);
              }}
              className="today-date-native-picker"
              title="Jump to any date in the 365-day calendar"
            />
            <button
              type="button"
              className="today-history-today-btn"
              onClick={handleResetToToday}
              title="Jump to Today's Date"
            >
              Today
            </button>
          </div>
        </div>

        {/* Main Content Capsule */}
        <div className="today-history-content-box">
          {/* Metadata Badges */}
          <div className="today-history-meta-tags">
            {activeEntry.dynasty && (
              <span className="history-dynasty-badge">
                <Landmark size={12} color="#ffd166" />
                <span>{activeEntry.dynasty}</span>
              </span>
            )}
            {activeEntry.monarch && (
              <span className="history-monarch-badge">
                <span>👑 {activeEntry.monarch}</span>
              </span>
            )}
            {activeEntry.location && (
              <span className="history-location-badge">
                <MapPin size={11} color="#90e0ef" />
                <span>{activeEntry.location}</span>
              </span>
            )}
          </div>

          {/* Titles */}
          <h3 className="history-event-heading">{activeEntry.title}</h3>
          {activeEntry.tamilTitle && (
            <div className="history-event-tamil-heading">{activeEntry.tamilTitle}</div>
          )}

          {/* Significance Highlight */}
          <div className="history-significance-callout">
            <Sparkles size={16} color="#ffd166" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <span style={{ color: '#ffd166', fontWeight: 700 }}>Epigraphical Significance: </span>
              <span>{activeEntry.significance}</span>
            </div>
          </div>

          {/* Narrative */}
          <div className="history-narrative-box">
            <p className="history-narrative-text">
              {activeEntry.narrative}
            </p>
          </div>

          {/* Classical Verse / Epigraph Inscription */}
          {activeEntry.verse && (
            <div className="history-classical-verse-box">
              <Feather size={16} color="#d4952b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '10.5px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: '2px' }}>
                  Classical Inscription / Sangam Verse
                </div>
                <div className="history-verse-text">{activeEntry.verse}</div>
              </div>
            </div>
          )}

          {/* Action Buttons Row */}
          <div className="today-history-actions-row">
            {activeEntry.placeId && (
              <button
                type="button"
                className="history-jump-map-btn"
                onClick={handleExploreOnMap}
                title={`Explore ${activeEntry.location || 'Site'} on Map`}
              >
                <MapPin size={14} />
                <span>Explore on Interactive Map</span>
              </button>
            )}

            <button
              type="button"
              className="history-voice-btn"
              onClick={handleToggleVoice}
              title={isPlayingAudio ? 'Stop Voice Narration' : 'Listen to Voice Narration'}
            >
              {isPlayingAudio ? <Pause size={14} /> : <Volume2 size={14} />}
              <span>{isPlayingAudio ? 'Stop Voice' : 'Listen Story'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
