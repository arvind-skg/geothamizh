import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Clock, ShieldAlert, Sparkles, Compass, ChevronDown, ChevronUp } from 'lucide-react';
import { TIMELINE_PERIODS } from '../data/periods';

export const TimelineSlider = ({
  activePeriodId,
  onPeriodChange,
  translations,
  currentLanguage
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  // Find index of active period
  const activeIndex = TIMELINE_PERIODS.findIndex(p => p.id === activePeriodId);
  const currentPeriod = TIMELINE_PERIODS[activeIndex] || TIMELINE_PERIODS[0];

  // Auto-play time travel animation
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      interval = setInterval(() => {
        onPeriodChange(prevId => {
          const idx = TIMELINE_PERIODS.findIndex(p => p.id === prevId);
          // Loop through periods
          const nextIdx = (idx + 1) % TIMELINE_PERIODS.length;
          return TIMELINE_PERIODS[nextIdx].id;
        });
      }, 3800);
    }
    return () => clearInterval(interval);
  }, [isPlaying, onPeriodChange]);

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (TIMELINE_PERIODS[idx]) {
      onPeriodChange(TIMELINE_PERIODS[idx].id);
    }
  };

  return (
    <div className={`timeline-slider-card ${isExpanded ? 'expanded' : 'minimized'}`}>
      {/* Top Header Row */}
      <div className="timeline-header-row">
        <div className="timeline-badge-group" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
          <div className="timeline-indicator-glow">
            {currentPeriod.id === 'today' ? <Compass size={14} /> : <Clock size={14} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="timeline-era-label">
                {currentPeriod.id === 'today' ? 'Present Reality' : 'Historical Era'}:
              </span>
              <span className="timeline-period-title">{currentPeriod.name}</span>
            </div>
            <div className="timeline-period-tamil">
              {currentPeriod.tamilName} • <span style={{ color: '#aaa' }}>{currentPeriod.timeSpan}</span>
            </div>
          </div>
        </div>

        {/* Play / Time-Travel Controls & Mobile Minimize Toggle */}
        <div className="timeline-playback-controls">
          <button
            className={`timeline-play-btn ${isPlaying ? 'active' : ''}`}
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Time-Travel' : 'Auto Time-Travel Across Eras'}
            aria-label="Time travel autoplay"
          >
            {isPlaying ? <Pause size={13} fill="#ffd166" /> : <Play size={13} fill="#ffd166" style={{ marginLeft: '1px' }} />}
            <span className="play-label">{isPlaying ? 'Pause' : 'Time-Travel'}</span>
          </button>

          <button
            className="timeline-reset-btn"
            onClick={() => {
              setIsPlaying(false);
              onPeriodChange('today');
            }}
            title="Reset to Present Day (Today)"
          >
            <RotateCcw size={12} />
            <span className="reset-label">Today</span>
          </button>

          <button
            className="timeline-expand-toggle-btn"
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Collapse Timeline" : "Expand Slider"}
            aria-label="Toggle timeline size"
          >
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="timeline-expanded-content">

      {/* Scrubbable Range Slider */}
      <div className="timeline-slider-track-wrap">
        <input
          type="range"
          min="0"
          max={TIMELINE_PERIODS.length - 1}
          step="1"
          value={activeIndex >= 0 ? activeIndex : 0}
          onChange={handleSliderChange}
          className="timeline-range-input"
          aria-label="Timeline Period Slider"
        />

        {/* Notches / Tick Labels */}
        <div className="timeline-notches-row">
          {TIMELINE_PERIODS.map((period, idx) => {
            const isSelected = period.id === activePeriodId;
            return (
              <button
                key={period.id}
                className={`timeline-notch-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setIsPlaying(false);
                  onPeriodChange(period.id);
                }}
              >
                <span className="notch-dot" />
                <span className="notch-label">{period.name.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Context Bar */}
      <div className="timeline-summary-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{ color: '#ffd166', fontWeight: 600 }}>Dominant Polities:</span>
          {currentPeriod.polities.map((polity, i) => (
            <span key={i} className="timeline-polity-chip">
              {polity}
            </span>
          ))}
          <span style={{ color: '#999', marginLeft: 'auto', fontSize: '11px' }}>
            {currentPeriod.keySites.slice(0, 3).join(', ')}
          </span>
        </div>
      </div>
        </div>
      )}
    </div>
  );
};
