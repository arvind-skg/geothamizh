import React from 'react';
import { X, BookOpen, ChevronRight, ChevronLeft, MapPin, Play, CheckCircle } from 'lucide-react';

export const StoriesDrawer = ({
  isOpen,
  onClose,
  stories,
  activeStory,
  setActiveStory,
  activeStoryStopIndex,
  setActiveStoryStopIndex,
  onSelectPlaceById,
  translations
}) => {
  if (!isOpen) return null;

  const currentStory = activeStory || stories[0];
  const currentStop = currentStory?.stops[activeStoryStopIndex] || currentStory?.stops[0];

  const handleSelectStory = (story) => {
    setActiveStory(story);
    setActiveStoryStopIndex(0);
    if (story.stops.length > 0) {
      onSelectPlaceById(story.stops[0].placeId);
    }
  };

  const handleNextStop = () => {
    if (activeStoryStopIndex < currentStory.stops.length - 1) {
      const nextIdx = activeStoryStopIndex + 1;
      setActiveStoryStopIndex(nextIdx);
      onSelectPlaceById(currentStory.stops[nextIdx].placeId);
    }
  };

  const handlePrevStop = () => {
    if (activeStoryStopIndex > 0) {
      const prevIdx = activeStoryStopIndex - 1;
      setActiveStoryStopIndex(prevIdx);
      onSelectPlaceById(currentStory.stops[prevIdx].placeId);
    }
  };

  return (
    <div className="sliding-drawer-backdrop" onClick={onClose}>
      <div className="sliding-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a359, #8c6721)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#120e0a' }}>
              <BookOpen size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                {translations.navStories}
              </h2>
              <div style={{ fontSize: '11px', color: '#d4a359' }}>
                Curated Historical & Literary Journeys
              </div>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close stories">
            <X size={18} />
          </button>
        </div>

        {/* Story Selector Cards */}
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--bg-dark-border)', display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {stories.map(story => {
            const isSelected = currentStory?.id === story.id;
            return (
              <button
                key={story.id}
                onClick={() => handleSelectStory(story)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #3d2c18, #22180d)' : '#181512',
                  border: isSelected ? '1px solid #d4a359' : '1px solid rgba(212, 163, 89, 0.2)',
                  color: isSelected ? '#ffd166' : '#bbb',
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? 600 : 400,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                {isSelected && <Play size={10} fill="#ffd166" />}
                <span>{story.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Story Progress Bar & Stop Details */}
        <div className="drawer-body">
          {/* Story Cover and Summary */}
          <div style={{ position: 'relative', height: '140px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212, 163, 89, 0.25)' }}>
            <img src={currentStory.coverImage} alt={currentStory.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,14,12,0.95) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '10px' }}>
              <div style={{ fontSize: '11px', color: '#ffd166', fontFamily: "'Noto Sans Tamil', sans-serif" }}>
                {currentStory.tamilTitle}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ddd', marginTop: '2px' }}>
                {currentStory.summary}
              </div>
            </div>
          </div>

          {/* Stepper Timeline Navigation */}
          <div style={{ background: '#191612', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', color: '#ffd166', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                Stop {activeStoryStopIndex + 1} of {currentStory.stops.length}
              </span>
              <span style={{ fontSize: '11px', color: '#999' }}>
                {currentStop.highlight}
              </span>
            </div>

            <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '8px' }}>
              {currentStop.title}
            </h3>

            <p className="manuscript-text" style={{ fontSize: '1rem', color: '#e5ded5' }}>
              {currentStop.narrative}
            </p>

            {/* Stepper Control Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid rgba(212, 163, 89, 0.15)' }}>
              <button
                onClick={handlePrevStop}
                disabled={activeStoryStopIndex === 0}
                style={{
                  background: activeStoryStopIndex === 0 ? '#14120f' : '#261f17',
                  border: '1px solid rgba(212, 163, 89, 0.25)',
                  color: activeStoryStopIndex === 0 ? '#555' : '#ffd166',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: activeStoryStopIndex === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <ChevronLeft size={14} />
                <span>{translations.prevStop}</span>
              </button>

              <button
                onClick={handleNextStop}
                disabled={activeStoryStopIndex === currentStory.stops.length - 1}
                style={{
                  background: activeStoryStopIndex === currentStory.stops.length - 1 ? '#14120f' : 'linear-gradient(135deg, #3d2c18, #22180d)',
                  border: '1px solid #d4a359',
                  color: activeStoryStopIndex === currentStory.stops.length - 1 ? '#555' : '#ffd166',
                  padding: '6px 14px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: activeStoryStopIndex === currentStory.stops.length - 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600
                }}
              >
                <span>{translations.nextStop}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Sequential Stops Checklist */}
          <div>
            <div style={{ fontSize: '12px', color: '#ffd166', fontWeight: 600, marginBottom: '8px' }}>
              Journey Route Itinerary:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {currentStory.stops.map((stop, idx) => {
                const isCurrent = idx === activeStoryStopIndex;
                const isPast = idx < activeStoryStopIndex;

                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setActiveStoryStopIndex(idx);
                      onSelectPlaceById(stop.placeId);
                    }}
                    style={{
                      background: isCurrent ? 'rgba(212, 163, 89, 0.15)' : '#161310',
                      border: isCurrent ? '1px solid #d4a359' : '1px solid rgba(255,255,255,0.06)',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: isPast ? '#4f772d' : isCurrent ? '#d4a359' : '#262019', color: isCurrent ? '#120e0a' : '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '12.5px', color: isCurrent ? '#ffd166' : '#ccc', fontWeight: isCurrent ? 600 : 400 }}>
                        {stop.title}
                      </span>
                    </div>

                    <MapPin size={13} color={isCurrent ? '#ffd166' : '#666'} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
