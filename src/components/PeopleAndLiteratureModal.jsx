import React, { useState, useEffect } from 'react';
import { 
  X, Users, MapPin, BookOpen, Crown, Feather, Scroll, 
  Search, Compass, ExternalLink, Quote, Sparkles, Layers
} from 'lucide-react';

export const PeopleAndLiteratureModal = ({
  isOpen,
  onClose,
  people = [],
  works = [],
  initialSubTab = 'people',
  onSelectPlaceById,
  translations = {}
}) => {
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);
  
  // People State
  const [peopleCategory, setPeopleCategory] = useState('all');
  const [peopleSearch, setPeopleSearch] = useState('');
  const [activePerson, setActivePerson] = useState(null);

  // Literature State
  const [worksGenre, setWorksGenre] = useState('all');
  const [worksSearch, setWorksSearch] = useState('');
  const [activeWork, setActiveWork] = useState(null);

  // Sync initial tab when reopened
  useEffect(() => {
    if (isOpen && initialSubTab) {
      setActiveSubTab(initialSubTab);
    }
  }, [isOpen, initialSubTab]);

  if (!isOpen) return null;

  // Categories for People
  const peopleCategories = [
    { id: 'all', label: 'All Figures', icon: Users },
    { id: 'monarch', label: 'Monarchs & Sovereigns', icon: Crown },
    { id: 'poet', label: 'Poets & Bards', icon: Feather },
    { id: 'scholar', label: 'Philosophers & Scholars', icon: BookOpen }
  ];

  // Unique genres for Literature
  const literatureGenres = [
    'all',
    ...Array.from(new Set(works.map(w => w.genre).filter(Boolean)))
  ];

  // Filtering People
  const filteredPeople = people.filter(p => {
    if (peopleCategory !== 'all' && p.category !== peopleCategory) return false;
    if (peopleSearch.trim()) {
      const q = peopleSearch.toLowerCase();
      const matchName = p.name?.toLowerCase().includes(q);
      const matchTamil = p.tamilName?.includes(q);
      const matchDynasty = p.dynasty?.toLowerCase().includes(q);
      const matchBio = p.bio?.toLowerCase().includes(q);
      return matchName || matchTamil || matchDynasty || matchBio;
    }
    return true;
  });

  // Filtering Literature
  const filteredWorks = works.filter(w => {
    if (worksGenre !== 'all' && w.genre !== worksGenre) return false;
    if (worksSearch.trim()) {
      const q = worksSearch.toLowerCase();
      const matchTitle = w.title?.toLowerCase().includes(q);
      const matchTamil = w.tamilTitle?.includes(q);
      const matchPoet = w.poet?.toLowerCase().includes(q);
      const matchSummary = w.summary?.toLowerCase().includes(q);
      return matchTitle || matchTamil || matchPoet || matchSummary;
    }
    return true;
  });

  const currentDisplayPerson = activePerson || filteredPeople[0] || people[0];
  const currentDisplayWork = activeWork || filteredWorks[0] || works[0];

  // Jump from Person to Work
  const handleJumpToWork = (workTitle) => {
    const matched = works.find(w => 
      w.title.toLowerCase().includes(workTitle.toLowerCase()) || 
      workTitle.toLowerCase().includes(w.title.toLowerCase())
    );
    if (matched) {
      setActiveWork(matched);
      setActiveSubTab('works');
    }
  };

  // Jump from Work to Author
  const handleJumpToPerson = (authorName) => {
    const matched = people.find(p => 
      authorName.toLowerCase().includes(p.name.toLowerCase()) ||
      p.name.toLowerCase().includes(authorName.toLowerCase())
    );
    if (matched) {
      setActivePerson(matched);
      setActiveSubTab('people');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="time-travel-modal-box connected-history-box people-explorer-box people-literature-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-sheet-handle" />

        {/* Unified Ornate Antique Modal Header */}
        <div className="modal-header people-literature-header">
          <div className="people-lit-header-left">
            <div 
              className="people-lit-icon-badge"
              style={{
                background: activeSubTab === 'people' 
                  ? 'linear-gradient(135deg, #b24a3b, #d4a359)' 
                  : 'linear-gradient(135deg, #1f7a8c, #09bc8a)'
              }}
            >
              {activeSubTab === 'people' ? <Users size={20} /> : <BookOpen size={20} />}
            </div>
            <div>
              <div className="people-lit-eyebrow">
                <span>CANON & BIOGRAPHIES • மாந்தரும் இலக்கியமும்</span>
              </div>
              <h2 className="people-lit-title">
                {activeSubTab === 'people' ? 'People of Tamilakam' : 'Classical Tamil Literature & Epics'}
              </h2>
            </div>
          </div>

          <div className="people-lit-header-right">
            {/* Top Switcher Pills: People vs Literature */}
            <div className="people-lit-switch-group">
              <button
                type="button"
                className={`people-lit-switch-btn ${activeSubTab === 'people' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('people')}
                title="Browse Kings, Queens, Poets & Scholars"
              >
                <Users size={14} />
                <span>Figures & Poets</span>
                <span className="people-lit-count-badge">{people.length}</span>
              </button>

              <button
                type="button"
                className={`people-lit-switch-btn ${activeSubTab === 'works' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('works')}
                title="Browse Sangam Anthologies, Epics & Treatises"
              >
                <BookOpen size={14} />
                <span>Literature & Epics</span>
                <span className="people-lit-count-badge">{works.length}</span>
              </button>
            </div>

            <button className="drawer-close-btn" onClick={onClose} aria-label="Close explorer">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Sub-Bar Toolbar: Filters & Live Search */}
        <div className="people-lit-toolbar">
          {activeSubTab === 'people' ? (
            <>
              <div className="people-lit-cat-row">
                {peopleCategories.map(cat => {
                  const IconComp = cat.icon;
                  const isCatActive = peopleCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setPeopleCategory(cat.id)}
                      className={`people-lit-filter-chip ${isCatActive ? 'active' : ''}`}
                    >
                      <IconComp size={12} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="people-lit-search-wrap">
                <Search size={13} className="people-lit-search-icon" />
                <input
                  type="text"
                  placeholder="Search figure, poet, dynasty..."
                  value={peopleSearch}
                  onChange={(e) => setPeopleSearch(e.target.value)}
                  className="people-lit-search-input"
                />
              </div>
            </>
          ) : (
            <>
              <div className="people-lit-cat-row">
                <button
                  onClick={() => setWorksGenre('all')}
                  className={`people-lit-filter-chip ${worksGenre === 'all' ? 'active' : ''}`}
                >
                  <Layers size={12} />
                  <span>All Genres ({works.length})</span>
                </button>
                {literatureGenres.filter(g => g !== 'all').map(genre => (
                  <button
                    key={genre}
                    onClick={() => setWorksGenre(genre)}
                    className={`people-lit-filter-chip ${worksGenre === genre ? 'active' : ''}`}
                  >
                    <BookOpen size={12} />
                    <span>{genre.split('&')[0].trim()}</span>
                  </button>
                ))}
              </div>

              <div className="people-lit-search-wrap">
                <Search size={13} className="people-lit-search-icon" />
                <input
                  type="text"
                  placeholder="Search epic, poem, poet, stanza..."
                  value={worksSearch}
                  onChange={(e) => setWorksSearch(e.target.value)}
                  className="people-lit-search-input"
                />
              </div>
            </>
          )}
        </div>

        {/* 2-Column Explorer Content */}
        {activeSubTab === 'people' ? (
          <div className="explorer-grid-layout">
            {/* Left Column: People List */}
            <div className="explorer-list-column">
              {filteredPeople.map(p => {
                const isSelected = currentDisplayPerson?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setActivePerson(p)}
                    className={`explorer-list-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="figure-avatar-wrap">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="figure-avatar-img" 
                        loading="lazy" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    <div className="figure-list-content">
                      <div className="figure-list-top">
                        <span className="figure-name">{p.name}</span>
                        <span className="figure-period">{p.period}</span>
                      </div>
                      <div className="figure-tamil">{p.tamilName}</div>
                      <div className="figure-role-text">{p.role}</div>
                    </div>
                  </div>
                );
              })}
              {filteredPeople.length === 0 && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                  No historical figures matching "{peopleSearch}"
                </div>
              )}
            </div>

            {/* Right Column: Person Deep Stratigraphy & Spatial Jump */}
            {currentDisplayPerson && (
              <div className="explorer-detail-panel">
                {/* Hero Portrait Card */}
                <div className="figure-hero-card">
                  <div className="figure-hero-img-wrap">
                    <img 
                      src={currentDisplayPerson.image} 
                      alt={currentDisplayPerson.name} 
                      className="figure-hero-img" 
                    />
                    <div className="figure-hero-overlay" />
                  </div>
                  <div className="figure-hero-content">
                    <div className="figure-dynasty-badge">
                      {currentDisplayPerson.dynasty} • {currentDisplayPerson.periodName}
                    </div>
                    <h3 className="figure-hero-title">{currentDisplayPerson.name}</h3>
                    <div className="figure-hero-tamil">{currentDisplayPerson.tamilName}</div>
                    <div className="figure-role-badge">{currentDisplayPerson.role}</div>
                  </div>
                </div>

                {/* Biography */}
                <div className="figure-bio-box">
                  {currentDisplayPerson.bio}
                </div>

                {/* Spatial Connections: Associated Places */}
                <div style={{ marginBottom: '16px' }}>
                  <div className="panel-section-title">
                    <MapPin size={13} color="#d4a359" />
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
                        className="place-jump-pill"
                        title="Fly to and highlight this place on the map"
                      >
                        <MapPin size={12} color="#13c2c2" />
                        <span style={{ textTransform: 'capitalize' }}>{placeId.replace(/-/g, ' ')}</span>
                        <span style={{ fontSize: '10px', color: '#ffd166', marginLeft: '2px' }}>→ View Map</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Authored Works / Endowments */}
                {currentDisplayPerson.works?.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <div className="panel-section-title">
                      <BookOpen size={13} color="#d4a359" />
                      <span>Authored Works / Architectural Commissions</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {currentDisplayPerson.works.map((w, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleJumpToWork(w)}
                          className="work-jump-pill"
                          title="Click to view work details in Literature tab"
                        >
                          <BookOpen size={11} />
                          <span>{w}</span>
                          <span style={{ fontSize: '10px', color: '#95d5b2' }}>📖 Read</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Epigraphs */}
                {currentDisplayPerson.inscriptions?.length > 0 && (
                  <div>
                    <div className="panel-section-title">
                      <Scroll size={13} color="#d4a359" />
                      <span>Attested Stone Inscriptions & Charters</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {currentDisplayPerson.inscriptions.map((insc, idx) => (
                        <span key={idx} className="inscription-chip">
                          {insc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="explorer-grid-layout">
            {/* Left Column: Works List */}
            <div className="explorer-list-column">
              {filteredWorks.map(w => {
                const isSelected = currentDisplayWork?.id === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setActiveWork(w)}
                    className={`explorer-list-item works-item ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="work-thumb-wrap">
                      <img 
                        src={w.image} 
                        alt={w.title} 
                        className="work-thumb-img" 
                        loading="lazy" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>

                    <div className="work-list-content">
                      <div className="work-list-top">
                        <span className="work-title">{w.title}</span>
                      </div>
                      <div className="work-tamil">{w.tamilTitle}</div>
                      <div className="work-meta-row">
                        <span>{w.genre.split('(')[0].trim()}</span>
                        <span className="work-poet-tag">{w.poet?.split('(')[0].trim()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              {filteredWorks.length === 0 && (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#888', fontSize: '13px' }}>
                  No classical works matching "{worksSearch}"
                </div>
              )}
            </div>

            {/* Right Column: Work Stratigraphy, Verses & Spatial Jump */}
            {currentDisplayWork && (
              <div className="explorer-detail-panel">
                {/* Hero Manuscript Card */}
                <div className="work-hero-card">
                  <div className="work-hero-img-wrap">
                    <img 
                      src={currentDisplayWork.image} 
                      alt={currentDisplayWork.title} 
                      className="work-hero-img" 
                    />
                    <div className="work-hero-overlay" />
                  </div>
                  <div className="work-hero-content">
                    <div className="work-genre-badge">
                      {currentDisplayWork.genre} • {currentDisplayWork.periodName}
                    </div>
                    <h3 className="work-hero-title">{currentDisplayWork.title}</h3>
                    <div className="work-hero-tamil">{currentDisplayWork.tamilTitle}</div>

                    {currentDisplayWork.poet && (
                      <button
                        type="button"
                        onClick={() => handleJumpToPerson(currentDisplayWork.poet)}
                        className="work-author-link-btn"
                        title="Click to view author biography in People tab"
                      >
                        <Feather size={13} />
                        <span>Attributed Author: {currentDisplayWork.poet} (View Biography →)</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="work-summary-box">
                  {currentDisplayWork.summary}
                </div>

                {/* Classical Verse Excerpts */}
                {currentDisplayWork.excerpts?.map((exc, idx) => (
                  <div key={idx} className="work-excerpt-card">
                    <div className="excerpt-header">
                      <Quote size={13} color="#d4a359" />
                      <span>Original Classical Tamil Stanza</span>
                    </div>
                    <div className="excerpt-tamil-text">
                      "{exc.tamil}"
                    </div>
                    <div className="excerpt-english-text">
                      Translation: {exc.english}
                    </div>
                  </div>
                ))}

                {/* Spatial Connections: Places Mentioned in this Work */}
                {currentDisplayWork.placesMentioned?.length > 0 && (
                  <div>
                    <div className="panel-section-title">
                      <MapPin size={13} color="#d4a359" />
                      <span>Geographic Locations Described in this Work (Click to Explore)</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {currentDisplayWork.placesMentioned.map(placeId => (
                        <button
                          key={placeId}
                          onClick={() => {
                            onSelectPlaceById(placeId);
                            onClose();
                          }}
                          className="place-jump-pill"
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
        )}
      </div>
    </div>
  );
};
