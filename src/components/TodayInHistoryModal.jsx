import React, { useState } from 'react';
import { X, Calendar, Sparkles, MapPin, Feather, Landmark, ChevronLeft, ChevronRight, Share2 } from 'lucide-react';
import { DAILY_TAMIL_HISTORY, getHistoryForDate } from '../data/dailyHistory';

export const TodayInHistoryModal = ({
  isOpen,
  onClose,
  onSelectPlaceOnMap,
  onOpenShareCard
}) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();

  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = DAILY_TAMIL_HISTORY.findIndex(
      h => h.month === currentMonth && h.day === currentDay
    );
    return idx >= 0 ? idx : 0;
  });

  if (!isOpen) return null;

  const activeEntry = DAILY_TAMIL_HISTORY[currentIndex] || DAILY_TAMIL_HISTORY[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? DAILY_TAMIL_HISTORY.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % DAILY_TAMIL_HISTORY.length);
  };

  return (
    <div className="today-history-modal-overlay">
      <div className="today-history-modal-card">
        {/* Header */}
        <div className="today-history-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="today-history-icon-badge">
              <Calendar size={18} color="#d4952b" />
            </div>
            <div>
              <h2 className="today-history-title">Today in Tamil History</h2>
              <div className="today-history-sub">வரலாற்றில் இன்று • கல்வெட்டுகள் & இலக்கியத் தரவுகள்</div>
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
            <ChevronLeft size={16} />
          </button>

          <div className="date-display-badge">
            <span className="date-text">
              {new Date(2026, activeEntry.month - 1, activeEntry.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </span>
            <span className="date-year-pill">{activeEntry.year}</span>
          </div>

          <button 
            type="button" 
            className="date-nav-btn" 
            onClick={handleNext}
            title="Next Historical Anniversary"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Main Content Capsule */}
        <div className="today-history-content-box">
          <div className="today-history-meta-tags">
            <span className="history-dynasty-badge">
              <Landmark size={12} color="#ffd166" />
              <span>{activeEntry.dynasty}</span>
            </span>
            <span className="history-monarch-badge">
              <span>👑 {activeEntry.monarch}</span>
            </span>
          </div>

          <h3 className="history-event-heading">{activeEntry.title}</h3>
          <div className="history-event-tamil-heading">{activeEntry.tamilTitle}</div>

          <div className="history-significance-callout">
            <Sparkles size={14} color="#ffd166" />
            <span>{activeEntry.significance}</span>
          </div>

          <p className="history-narrative-text">
            {activeEntry.narrative}
          </p>

          {activeEntry.verse && (
            <div className="history-classical-verse-box">
              <Feather size={14} color="#d4952b" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div className="history-verse-text">{activeEntry.verse}</div>
            </div>
          )}

          <div className="today-history-actions-row">
            {activeEntry.placeId && (
              <button
                type="button"
                className="history-jump-map-btn"
                onClick={() => {
                  if (onSelectPlaceOnMap) {
                    onSelectPlaceOnMap(activeEntry.placeId);
                    onClose();
                  }
                }}
              >
                <MapPin size={13} />
                <span>Explore {activeEntry.location} on Map</span>
              </button>
            )}

            {onOpenShareCard && (
              <button
                type="button"
                className="history-share-card-btn"
                onClick={() => {
                  onOpenShareCard({
                    name: activeEntry.title,
                    tamilName: activeEntry.tamilTitle,
                    district: activeEntry.location,
                    timeSpan: activeEntry.year,
                    whyItMatters: activeEntry.significance,
                    classicalVerse: activeEntry.verse
                  });
                }}
                title="Generate Social Media Card"
              >
                <Share2 size={13} />
                <span>Share Card</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
