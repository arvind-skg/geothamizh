import React, { useState } from 'react';
import { X, Users, MapPin, BookOpen, Crown, Feather, Scroll, Search, Compass, ExternalLink } from 'lucide-react';

export const PeopleExplorerModal = ({
  isOpen,
  onClose,
  people,
  onSelectPlaceById,
  translations
}) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [activePerson, setActivePerson] = useState(null);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Personalities', icon: Users },
    { id: 'monarch', label: 'Monarchs & Sovereigns', icon: Crown },
    { id: 'poet', label: 'Poets & Bards', icon: Feather },
    { id: 'scholar', label: 'Philosophers & Scholars', icon: BookOpen }
  ];

  const filteredPeople = people.filter(p => {
    if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchTamil = p.tamilName.includes(q);
      const matchDynasty = p.dynasty.toLowerCase().includes(q);
      const matchBio = p.bio.toLowerCase().includes(q);
      return matchName || matchTamil || matchDynasty || matchBio;
    }
    return true;
  });

  const currentDisplayPerson = activePerson || filteredPeople[0] || people[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="time-travel-modal-box connected-history-box people-explorer-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-sheet-handle" />
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #d4a359, #b24a3b)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(212, 163, 89, 0.3)' }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#d4a359', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Spatial Biographies (Section 17)
              </div>
              <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                People of Tamilakam
              </h2>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close people explorer">
            <X size={18} />
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div style={{ padding: '12px 20px', borderBottom: '1px solid rgba(212, 163, 89, 0.15)', display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(20, 16, 12, 0.5)' }}>
          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
            {categories.map(cat => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid',
                    borderColor: selectedCategory === cat.id ? '#d4a359' : 'rgba(212, 163, 89, 0.2)',
                    background: selectedCategory === cat.id ? 'rgba(212, 163, 89, 0.2)' : 'transparent',
                    color: selectedCategory === cat.id ? '#ffd166' : '#d8d0c5',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <IconComp size={12} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div style={{ position: 'relative', width: '220px' }}>
            <Search size={13} style={{ position: 'absolute', left: '10px', top: '9px', color: '#888' }} />
            <input
              type="text"
              placeholder="Search figure, poet..."
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
          
          {/* Left/Top Column: People Carousel / List */}
          <div className="explorer-list-column">
            {filteredPeople.map(p => {
              const isSelected = currentDisplayPerson?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setActivePerson(p)}
                  className={`explorer-list-item ${isSelected ? 'selected' : ''}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#ffd166' : '#fff' }}>
                      {p.name}
                    </span>
                    <span style={{ fontSize: '10px', color: '#d4a359', textTransform: 'uppercase' }}>
                      {p.period}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#95d5b2', marginBottom: '2px' }}>
                    {p.tamilName}
                  </div>
                  <div style={{ fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{p.role}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right/Bottom Column: Person Deep Stratigraphy & Spatial Jump */}
          {currentDisplayPerson && (
            <div className="explorer-detail-panel">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#d4a359', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>
                    {currentDisplayPerson.dynasty} • {currentDisplayPerson.periodName}
                  </div>
                  <h3 style={{ fontSize: '1.4rem', color: '#fff', margin: 0, lineHeight: 1.2 }}>
                    {currentDisplayPerson.name}
                  </h3>
                  <div style={{ fontSize: '1.05rem', color: '#ffd166', marginTop: '2px', fontWeight: 500 }}>
                    {currentDisplayPerson.tamilName}
                  </div>
                </div>

                <div style={{ padding: '4px 10px', borderRadius: '12px', background: 'rgba(212, 163, 89, 0.15)', border: '1px solid rgba(212, 163, 89, 0.3)', color: '#d4a359', fontSize: '11px', textTransform: 'uppercase' }}>
                  {currentDisplayPerson.category}
                </div>
              </div>

              {/* Biography */}
              <div style={{ fontSize: '13.5px', color: '#e0d8cc', lineHeight: 1.6, background: 'rgba(0, 0, 0, 0.25)', padding: '14px 16px', borderRadius: '8px', borderLeft: '3px solid #d4a359', marginBottom: '16px' }}>
                {currentDisplayPerson.bio}
              </div>

              {/* Spatial Connections: Associated Places */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={12} />
                  <span>Associated Geographic Centers & Monuments</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {currentDisplayPerson.associatedPlaceIds?.map(placeId => (
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
                        background: 'rgba(19, 194, 194, 0.12)',
                        border: '1px solid rgba(19, 194, 194, 0.4)',
                        color: '#90e0ef',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      title="Fly to and highlight this place on the map"
                    >
                      <MapPin size={12} color="#13c2c2" />
                      <span style={{ textTransform: 'capitalize' }}>{placeId.replace(/-/g, ' ')}</span>
                      <span style={{ fontSize: '10px', color: '#ffd166', marginLeft: '2px' }}>→ View Map</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Works & Endowments */}
              {currentDisplayPerson.works?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={12} />
                    <span>Authored Works / Architectural Commissions</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentDisplayPerson.works.map((w, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', background: 'rgba(212, 163, 89, 0.1)', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '4px', fontSize: '12px', color: '#ffd166' }}>
                        {w}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Epigraphs */}
              {currentDisplayPerson.inscriptions?.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Scroll size={12} />
                    <span>Attested Stone Inscriptions & Charters</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {currentDisplayPerson.inscriptions.map((insc, idx) => (
                      <span key={idx} style={{ padding: '4px 10px', background: 'rgba(9, 188, 138, 0.1)', border: '1px solid rgba(9, 188, 138, 0.3)', borderRadius: '4px', fontSize: '12px', color: '#95d5b2' }}>
                        {insc}
                      </span>
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
