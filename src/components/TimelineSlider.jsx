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
  const [playSpeed, setPlaySpeed] = useState(1); // 1x or 2x
  const [isExpanded, setIsExpanded] = useState(true);

  // Find index of active period
  const activeIndex = TIMELINE_PERIODS.findIndex(p => p.id === activePeriodId);
  const currentPeriod = TIMELINE_PERIODS[activeIndex] || TIMELINE_PERIODS[0];

  // Auto-play time travel animation across empires with adjustable speed
  useEffect(() => {
    let interval = null;
    if (isPlaying) {
      const delay = playSpeed === 2 ? 1900 : playSpeed === 0.5 ? 5000 : 3200;
      interval = setInterval(() => {
        onPeriodChange(prevId => {
          const idx = TIMELINE_PERIODS.findIndex(p => p.id === prevId);
          // Loop through periods in chronological order (pre_sangam -> later)
          const nextIdx = (idx + 1) % TIMELINE_PERIODS.length;
          return TIMELINE_PERIODS[nextIdx].id;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, onPeriodChange]);

  const handleSliderChange = (e) => {
    const idx = parseInt(e.target.value, 10);
    if (TIMELINE_PERIODS[idx]) {
      onPeriodChange(TIMELINE_PERIODS[idx].id);
    }
  };

  const cycleSpeed = () => {
    if (playSpeed === 1) setPlaySpeed(2);
    else if (playSpeed === 2) setPlaySpeed(0.5);
    else setPlaySpeed(1);
  };

  return (
    <div className={`timeline-slider-card ${isExpanded ? 'expanded' : 'minimized'}`}>
      {/* Top Header Row */}
      <div className="timeline-header-row">
        <div className="timeline-badge-group" onClick={() => setIsExpanded(!isExpanded)} style={{ cursor: 'pointer' }}>
          <div className="timeline-indicator-glow" style={{ background: isPlaying ? 'linear-gradient(135deg, #8F1D1D, #D4952B)' : undefined }}>
            {currentPeriod.id === 'today' ? <Compass size={14} /> : <Clock size={14} />}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="timeline-era-label">
                {currentPeriod.id === 'today' ? 'Present Reality' : 'Historical Era'}:
              </span>
              <span className="timeline-period-title">{currentPeriod.name}</span>
              {isPlaying && (
                <span style={{ 
                  fontSize: '10px', 
                  background: 'rgba(143, 29, 29, 0.4)', 
                  border: '1px solid #d4952b', 
                  color: '#ffd166', 
                  padding: '1px 6px', 
                  borderRadius: '10px',
                  animation: 'pulse 1.5s infinite' 
                }}>
                  Morphing • {playSpeed}x
                </span>
              )}
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
            title={isPlaying ? 'Pause Empire Time-Travel' : 'Auto-Play Empire Morphing across Eras'}
            aria-label="Time travel autoplay"
            style={{
              background: isPlaying ? 'linear-gradient(135deg, #8F1D1D, #6B1313)' : undefined,
              borderColor: isPlaying ? '#d4952b' : undefined
            }}
          >
            {isPlaying ? <Pause size={13} fill="#ffd166" /> : <Play size={13} fill="#ffd166" style={{ marginLeft: '1px' }} />}
            <span className="play-label">{isPlaying ? 'Pause' : 'Time-Travel'}</span>
          </button>

          {/* Playback Speed Toggle */}
          <button
            className="timeline-speed-btn"
            onClick={cycleSpeed}
            title="Cycle Animation Playback Speed (0.5x, 1x, 2x)"
            style={{
              background: 'rgba(212, 149, 43, 0.15)',
              border: '1px solid rgba(212, 149, 43, 0.35)',
              color: '#ffd166',
              borderRadius: '6px',
              padding: '4px 8px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {playSpeed}x
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
