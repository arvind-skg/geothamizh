import React, { useState } from 'react';
import { X, BookOpen, MapPin, Feather, Compass, Scroll, Search, Quote } from 'lucide-react';

export const WorksExplorerModal = ({
  isOpen,
  onClose,
  works,
  onSelectPlaceById,
  translations
}) => {
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [activeWork, setActiveWork] = useState(null);

  if (!isOpen) return null;

  const filteredWorks = works.filter(w => {
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchTitle = w.title.toLowerCase().includes(q);
      const matchTamil = w.tamilTitle.includes(q);
      const matchPoet = w.poet.toLowerCase().includes(q);
      const matchSummary = w.summary.toLowerCase().includes(q);
      return matchTitle || matchTamil || matchPoet || matchSummary;
    }
    return true;
  });

  const currentDisplayWork = activeWork || filteredWorks[0] || works[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="time-travel-modal-box connected-history-box works-explorer-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-sheet-handle" />
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f7a8c, #09bc8a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(9, 188, 138, 0.3)' }}>
              <BookOpen size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#95d5b2', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Spatial Literature & Poetry (Section 18)
              </div>
              <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                Classical Tamil Works & Epics
              </h2>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close works explorer">
            <X size={18} />
          </button>
        </div>

        {/* Search Toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(212, 163, 89, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(20, 16, 12, 0.5)' }}>
          <div style={{ fontSize: '12px', color: '#d4a359' }}>
            Exploring {filteredWorks.length} Classical Anthologies, Epics & Treatises
          </div>

          <div style={{ position: 'relative', width: '240px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '9px', color: '#888' }} />
            <input
              type="text"
              placeholder="Search epic, poem, poet..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(212, 163, 89, 0.2)',
                color: '#fff',
                fontSize: '12px',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* 2-Column Responsive Explorer Content */}
        <div className="explorer-grid-layout">
          
          {/* Left/Top Column: Works Carousel / List */}
          <div className="explorer-list-column">
            {filteredWorks.map(w => {
              const isSelected = currentDisplayWork?.id === w.id;
              return (
                <div
                  key={w.id}
                  onClick={() => setActiveWork(w)}
                  className={`explorer-list-item works-item ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#95d5b2' : '#fff' }}>
                      {w.title}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#ffd166', marginBottom: '2px' }}>
                    {w.tamilTitle}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa' }}>
                    {w.genre}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right/Bottom Column: Work Stratigraphy, Verses & Spatial Jump */}
          {currentDisplayWork && (
            <div className="explorer-detail-panel">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#d4a359', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {currentDisplayWork.genre} • {currentDisplayWork.periodName}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                    {currentDisplayWork.title}
                  </h3>
                  <div style={{ fontSize: '1.1rem', color: '#ffd166', marginTop: '2px' }}>
                    {currentDisplayWork.tamilTitle}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#95d5b2', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Feather size={12} />
                    <span>Attributed Author: {currentDisplayWork.poet}</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ fontSize: '13.5px', color: '#e0d8cc', lineHeight: 1.6, background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '8px', borderLeft: '3px solid #09bc8a', marginBottom: '16px' }}>
                {currentDisplayWork.summary}
              </div>

              {/* Classical Verse Excerpt */}
              {currentDisplayWork.excerpts?.map((exc, idx) => (
                <div key={idx} style={{ background: 'rgba(212, 163, 89, 0.08)', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '8px', padding: '12px 16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', marginBottom: '6px' }}>
                    <Quote size={12} />
                    <span>Original Classical Tamil Stanza</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#ffd166', fontStyle: 'italic', marginBottom: '6px', lineHeight: 1.5 }}>
                    "{exc.tamil}"
                  </div>
                  <div style={{ fontSize: '12px', color: '#ddd', lineHeight: 1.4 }}>
                    Translation: {exc.english}
                  </div>
                </div>
              ))}

              {/* Spatial Connections: Places Mentioned in this Work */}
              {currentDisplayWork.placesMentioned?.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={12} />
                    <span>Places Described in this Work (Click to Navigate Map)</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {currentDisplayWork.placesMentioned.map(placeId => (
                      <button
                        key={placeId}
                        onClick={() => {
                          onSelectPlaceById(placeId);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          background: 'rgba(9, 188, 138, 0.15)',
                          border: '1px solid rgba(9, 188, 138, 0.4)',
                          color: '#95d5b2',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'background 0.2s'
                        }}
                        title="Fly to and highlight this place on the map"
                      >
                        <MapPin size={12} color="#09bc8a" />
                        <span style={{ textTransform: 'capitalize' }}>{placeId.replace(/-/g, ' ')}</span>
                        <span style={{ fontSize: '10px', color: '#ffd166', marginLeft: '2px' }}>→ View Map</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
