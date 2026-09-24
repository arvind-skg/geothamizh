import React, { useState, useRef } from 'react';
import { 
  Navigation, BookOpen, Utensils, Share2, Sparkles, 
  Globe, Menu, X, Loader2, MapPin, History, ChevronDown, Volume2, User
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  setCurrentLanguage,
  translations,
  currentUser,
  onOpenLogin,
  onOpenAIGuide,
  onOpenKnowledgeGraph,
  onOpenLivingCulture,
  onOpenStories,
  onOpenPeople,
  onOpenWorks,
  onOpenPeopleAndLiterature,
  onDetectLocation,
  isDetectingLocation,
  userLocation,
  onOpenCurrentLocationHistory,
  mapMode = 'live',
  setMapMode,
  onOpenChronicles,
  onOpenItineraries,
  onOpenTodayInHistory,
  onOpenSplitScreen,
  onOpenAudioGuide,
  onOpenShareCard,
  onOpenSOS
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  return (
    <header className="navbar">
      {/* Brand Section */}
      <div 
        className="brand-section"
        onClick={() => setActiveTab('explore')}
        title="GeoThamizh — Click to return to explore map"
      >
        <div className="brand-logo-frame">
          <img src="/navbar-logo.png" alt="Geoதமிழ் Logo" className="brand-logo-img" />
        </div>
        <div className="brand-title-wrap">
          <h1 className="brand-title">Geo<span className="brand-title-tamil">தமிழ்</span></h1>
          <span className="brand-subtitle">ROOTED IN TIME. ALIVE IN STORIES.</span>
        </div>
      </div>

      {/* Dual Mode Switcher: Live Map vs Historical Map (Slide Type Cards) */}
      <div className="nav-mode-switcher-container">
        <div className={`nav-mode-slider ${mapMode === 'historical' ? 'is-historical' : 'is-live'}`}>
          <button 
            type="button"
            className={`nav-mode-card ${mapMode === 'live' ? 'active' : ''}`}
            onClick={() => setMapMode('live')}
            title="Live Map — Explore Modern Tamil Nadu & Nearby Heritage"
          >
            <span className="nav-mode-icon">📍</span>
            <div className="nav-mode-text-group">
              <span className="nav-mode-title">Live Map</span>
              <span className="nav-mode-sub">நிகழ்காலம்</span>
            </div>
          </button>

          <button 
            type="button"
            className={`nav-mode-card ${mapMode === 'historical' ? 'active' : ''}`}
            onClick={() => setMapMode('historical')}
            title="Historical Map — Time-Travel across Dynasties, Eras & Imperial Boundaries"
          >
            <span className="nav-mode-icon">⏳</span>
            <div className="nav-mode-text-group">
              <span className="nav-mode-title">Historical Map</span>
              <span className="nav-mode-sub">வரலாறு</span>
            </div>
          </button>

          {/* Sliding indicator element */}
          <div className="nav-mode-slider-indicator" />
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="nav-links">
        <button 
          className={`nav-link-btn ${['chronicles', 'itineraries', 'today', 'stories', 'culture'].includes(activeTab) ? 'active' : ''}`}
          onClick={() => onOpenChronicles ? onOpenChronicles('itineraries') : (onOpenItineraries && onOpenItineraries())}
          title="Tamil Heritage Chronicles — Curated 1-Day Circuits, Today in History, Story Trails & Living Culture"
        >
          <span className="nav-link-icon">🧭</span>
          <span>{translations.navChronicles || 'Chronicles & Tours'}</span>
        </button>

        <button 
          className={`nav-link-btn ${['people', 'works', 'people-literature'].includes(activeTab) ? 'active' : ''}`}
          onClick={onOpenPeopleAndLiterature || onOpenPeople}
          title="Explore Historical Figures, Monarchs, Poets & Classical Literature of Tamilakam"
        >
          <span className="nav-link-icon">👑</span>
          <span>{translations.navPeopleAndLiterature || 'People & Literature'}</span>
        </button>

        {/* More Heritage Explorers Dropdown */}
        <div className="nav-more-container">
          <button 
            type="button"
            className={`nav-link-btn nav-more-trigger ${['stories', 'culture', 'graph'].includes(activeTab) || moreMenuOpen ? 'active' : ''}`}
            onClick={() => setMoreMenuOpen(!moreMenuOpen)}
            title="Explore Story Trails, Living Culture & Knowledge Graph"
          >
            <span>Explore More</span>
            <ChevronDown size={13} className={`more-chevron ${moreMenuOpen ? 'is-open' : ''}`} />
          </button>

          {moreMenuOpen && (
            <>
              <div 
                className="nav-more-backdrop" 
                onClick={() => setMoreMenuOpen(false)} 
              />
              <div className="nav-more-menu">
                <button 
                  className={`nav-more-item ${activeTab === 'stories' ? 'active' : ''}`}
                  onClick={() => {
                    onOpenStories();
                    setMoreMenuOpen(false);
                  }}
                >
                  <BookOpen size={15} color="#d4952b" />
                  <div className="nav-more-text">
                    <span className="nav-more-title">{translations.navStories || 'Story Trails'}</span>
                    <span className="nav-more-desc">Curated journeys across eras</span>
                  </div>
                </button>

                <button 
                  className={`nav-more-item ${activeTab === 'culture' ? 'active' : ''}`}
                  onClick={() => {
                    onOpenLivingCulture();
                    setMoreMenuOpen(false);
                  }}
                >
                  <Utensils size={15} color="#ffd166" />
                  <div className="nav-more-text">
                    <span className="nav-more-title">{translations.navCulture || 'Living Culture'}</span>
                    <span className="nav-more-desc">GI crafts, food & rituals</span>
                  </div>
                </button>

                <button 
                  className={`nav-more-item ${activeTab === 'graph' ? 'active' : ''}`}
                  onClick={() => {
                    onOpenKnowledgeGraph();
                    setMoreMenuOpen(false);
                  }}
                >
                  <Share2 size={15} color="#13c2c2" />
                  <div className="nav-more-text">
                    <span className="nav-more-title">{translations.navGraph || 'Knowledge Graph'}</span>
                    <span className="nav-more-desc">Connected network of history</span>
                  </div>
                </button>

                {onOpenAudioGuide && (
                  <button 
                    className="nav-more-item"
                    onClick={() => {
                      onOpenAudioGuide();
                      setMoreMenuOpen(false);
                    }}
                  >
                    <Volume2 size={15} color="#ffd166" />
                    <div className="nav-more-text">
                      <span className="nav-more-title">Heritage Audio Tour</span>
                      <span className="nav-more-desc">Spoken bilingual narration</span>
                    </div>
                  </button>
                )}

                {onOpenShareCard && (
                  <button 
                    className="nav-more-item"
                    onClick={() => {
                      onOpenShareCard();
                      setMoreMenuOpen(false);
                    }}
                  >
                    <Sparkles size={15} color="#fca5a5" />
                    <div className="nav-more-text">
                      <span className="nav-more-title">Social Share Card</span>
                      <span className="nav-more-desc">1080x1080 exportable story card</span>
                    </div>
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </nav>

      {/* Global Actions */}
      <div className="nav-actions">
        {/* Split Screen Button */}
        {onOpenSplitScreen && (
          <button 
            className="btn-nav-action btn-split-view"
            onClick={onOpenSplitScreen}
            title="Split Screen Map View (Then vs Now)"
            aria-label="Split Screen Map View"
          >
            <span style={{ fontSize: '13px' }}>🪞</span>
            <span className="nav-btn-text">Split View</span>
          </button>
        )}

        {/* AI Heritage Guide Button */}
        <button 
          className="btn-nav-action btn-ai-guide"
          onClick={onOpenAIGuide}
          title={translations.askAI}
          aria-label="Open AI Heritage Guide"
        >
          <Sparkles size={13} />
          <span className="nav-btn-text">{translations.askAI}</span>
        </button>

        {/* Desktop Global Language Switcher */}
        <div className="lang-select-wrap">
          <select 
            className="lang-select"
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            aria-label="Select Language"
          >
            <option value="en">EN</option>
            <option value="ta">தமிழ்</option>
            <option value="de">DE</option>
            <option value="fr">FR</option>
            <option value="ja">日本語</option>
          </select>
        </div>

        {/* Explorer Profile / Sign In Button */}
        {onOpenLogin && (
          <button 
            type="button"
            className="btn-nav-action btn-nav-profile"
            onClick={onOpenLogin}
            title={currentUser ? `Explorer Profile: ${currentUser.name} (${currentUser.roleTitle || 'Traveler'})` : "Explorer Sign In & Preferences"}
            aria-label="Explorer Login and Profile"
          >
            <span style={{ fontSize: '13px', lineHeight: 1 }}>{currentUser?.roleIcon || '👤'}</span>
            <span className="nav-btn-text">
              {currentUser ? currentUser.name.split(' ')[0] : (currentLanguage === 'ta' ? 'நுழைவு' : 'Sign In')}
            </span>
          </button>
        )}

        {/* Tourist Emergency SOS Button */}
        {onOpenSOS && (
          <button 
            type="button"
            className="btn-nav-action btn-nav-sos"
            onClick={onOpenSOS}
            title="Tourist Emergency SOS — Police (112), Ambulance (108) & Real-Time GPS Rescue"
            aria-label="Open Tourist Emergency SOS"
          >
            <span className="sos-badge-dot" />
            <span className="sos-text">SOS</span>
          </button>
        )}

        {/* Mobile Hamburger Button */}
        <button 
          className="nav-link-btn mobile-menu-toggle" 
          id="mobile-menu-trigger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Antique Manuscript Drawer with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-nav-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true"
          />
          <div className="mobile-nav-drawer" role="dialog" aria-modal="true" aria-label="Navigation Menu">
            <div className="mobile-nav-header">
              <div className="mobile-nav-brand">
                <img src="/navbar-logo.png" alt="GeoThamizh" className="mobile-nav-logo" />
                <div className="mobile-nav-title-wrap">
                  <span className="brand-title">Geo<span className="brand-title-tamil">தமிழ்</span></span>
                  <span className="mobile-nav-tagline">ROOTED IN TIME. ALIVE IN STORIES.</span>
                </div>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="mobile-nav-close-btn"
                aria-label="Close menu"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Mode Switcher — Antique Card */}
            <div className="mobile-mode-switcher-card">
              <div className="mobile-mode-label">🏛️ Map Stratigraphy Mode:</div>
              <div className="mobile-mode-grid">
                <button
                  type="button"
                  className={`mobile-mode-btn ${mapMode === 'live' ? 'active' : ''}`}
                  onClick={() => { setMapMode('live'); setMobileMenuOpen(false); }}
                >
                  <span className="mobile-mode-icon">📍</span>
                  <div className="mobile-mode-text">
                    <span className="mobile-mode-primary">Live Map</span>
                    <span className="mobile-mode-sub">நிகழ்காலம்</span>
                  </div>
                </button>
                <button
                  type="button"
                  className={`mobile-mode-btn ${mapMode === 'historical' ? 'active' : ''}`}
                  onClick={() => { setMapMode('historical'); setMobileMenuOpen(false); }}
                >
                  <span className="mobile-mode-icon">⏳</span>
                  <div className="mobile-mode-text">
                    <span className="mobile-mode-primary">Historical</span>
                    <span className="mobile-mode-sub">வரலாறு</span>
                  </div>
                </button>
              </div>
            </div>

            <div className="mobile-nav-list">
              {/* Feature: Tourist Emergency SOS in Mobile */}
              {onOpenSOS && (
                <button 
                  className="mobile-nav-item mobile-nav-sos-item"
                  onClick={() => {
                    onOpenSOS();
                    setMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'linear-gradient(135deg, rgba(143, 29, 29, 0.4), rgba(45, 12, 12, 0.7))',
                    border: '1.5px solid #ff4d4f',
                    boxShadow: '0 0 15px rgba(230, 57, 70, 0.25)'
                  }}
                >
                  <span style={{ fontSize: '18px' }}>🚨</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 700, color: '#ff4d4f', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>அவசர உதவி • SOS Rescue</span>
                      <span className="sos-beacon-dot" />
                    </div>
                    <div style={{ fontSize: '10.5px', color: '#ffccd5' }}>
                      112 / 108 dialer, live GPS coords & distress siren
                    </div>
                  </div>
                </button>
              )}
              {/* Consolidated Hub 1: Tamil Heritage Chronicles */}
              <button 
                className="mobile-nav-item"
                onClick={() => {
                  if (onOpenChronicles) onOpenChronicles('itineraries');
                  else if (onOpenItineraries) onOpenItineraries();
                  setMobileMenuOpen(false);
                }}
              >
                <span style={{ fontSize: '18px' }}>🧭</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#ffd166' }}>
                    {translations.navChronicles || 'Chronicles & Tours'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>
                    1-Day Circuits, Today in History, Story Trails & Living Culture
                  </div>
                </div>
              </button>

              {/* Consolidated Hub 2: People & Literature */}
              <button 
                className="mobile-nav-item"
                onClick={() => {
                  if (onOpenPeopleAndLiterature) onOpenPeopleAndLiterature();
                  else if (onOpenPeople) onOpenPeople();
                  setMobileMenuOpen(false);
                }}
              >
                <span style={{ fontSize: '18px' }}>👑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>
                    {translations.navPeopleAndLiterature || 'People & Literature'}
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>
                    Monarchs, poets, Sangam epics & classical treatises
                  </div>
                </div>
              </button>

              {/* Feature 2: Split-Screen in Mobile */}
              {onOpenSplitScreen && (
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onOpenSplitScreen();
                    setMobileMenuOpen(false);
                  }}
                >
                  <span style={{ fontSize: '16px' }}>🪞</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Then vs Now Split View</div>
                    <div style={{ fontSize: '10.5px', color: '#aaa' }}>Ancient atlas vs modern map slider</div>
                  </div>
                </button>
              )}

              <button 
                className="mobile-nav-item"
                onClick={() => {
                  onOpenKnowledgeGraph();
                  setMobileMenuOpen(false);
                }}
              >
                <Share2 size={16} color="#13c2c2" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{translations.navGraph}</div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>Semantic network connecting eras & sites</div>
                </div>
              </button>

              {onOpenAudioGuide && (
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onOpenAudioGuide();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Volume2 size={16} color="#ffd166" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Heritage Audio Tour</div>
                    <div style={{ fontSize: '10.5px', color: '#aaa' }}>Hands-free spoken voice narration</div>
                  </div>
                </button>
              )}

              {onOpenShareCard && (
                <button 
                  className="mobile-nav-item"
                  onClick={() => {
                    onOpenShareCard();
                    setMobileMenuOpen(false);
                  }}
                >
                  <Sparkles size={16} color="#fca5a5" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: 600, color: '#fff' }}>Social Share Card</div>
                    <div style={{ fontSize: '10.5px', color: '#aaa' }}>1080x1080 exportable story card</div>
                  </div>
                </button>
              )}

              {/* Quick GPS Location History in Mobile Menu */}
              <button 
                className="mobile-nav-item"
                onClick={() => {
                  if (onOpenCurrentLocationHistory) onOpenCurrentLocationHistory();
                  setMobileMenuOpen(false);
                }}
                style={{ background: 'linear-gradient(135deg, #13242a, #0e171b)', borderColor: '#13c2c2' }}
              >
                <MapPin size={16} color="#13c2c2" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#90e0ef' }}>
                    📍 My Heritage Stratigraphy
                  </div>
                  <div style={{ fontSize: '10.5px', color: '#888' }}>
                    {userLocation?.name || 'Explore history where you stand'}
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Explorer Profile Button */}
            {onOpenLogin && (
              <div style={{ padding: '10px 16px', borderTop: '1px solid rgba(212, 163, 89, 0.15)' }}>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLogin();
                  }}
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, rgba(212, 149, 43, 0.2), rgba(178, 74, 59, 0.25))',
                    border: '1px solid #d4952b',
                    color: '#ffd166',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    cursor: 'pointer'
                  }}
                >
                  <span>{currentUser?.roleIcon || '👤'}</span>
                  <span>{currentUser ? `${currentUser.name} (${currentUser.roleTitle || 'Profile'})` : (currentLanguage === 'ta' ? 'சுயவிவர நுழைவு (Sign In)' : 'Explorer Sign In & Profile')}</span>
                </button>
              </div>
            )}

            {/* Mobile Language Selector Footer */}
            <div className="mobile-nav-footer">
              <span style={{ fontSize: '11px', color: '#999' }}>Language:</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'ta', label: 'தமிழ்' },
                  { code: 'de', label: 'Deutsch' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ja', label: '日本語' }
                ].map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setCurrentLanguage(l.code);
                      setMobileMenuOpen(false);
                    }}
                    style={{
                      background: currentLanguage === l.code ? '#d4a359' : '#1e1a15',
                      color: currentLanguage === l.code ? '#14100c' : '#bbb',
                      border: '1px solid rgba(212, 163, 89, 0.3)',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      cursor: 'pointer',
                      fontWeight: currentLanguage === l.code ? 700 : 400
                    }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
