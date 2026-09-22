import React, { useState } from 'react';
import { 
  Navigation, BookOpen, Utensils, Share2, Sparkles, 
  Globe, Menu, X, Loader2, MapPin, History 
} from 'lucide-react';

export const Navbar = ({
  activeTab,
  setActiveTab,
  currentLanguage,
  setCurrentLanguage,
  translations,
  onOpenAIGuide,
  onOpenKnowledgeGraph,
  onOpenLivingCulture,
  onOpenStories,
  onOpenPeople,
  onOpenWorks,
  onDetectLocation,
  isDetectingLocation,
  userLocation,
  onOpenCurrentLocationHistory,
  mapMode = 'live',
  setMapMode,
  onOpenItineraries,
  onOpenTodayInHistory,
  onOpenSplitScreen
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="navbar">
      {/* Brand Section */}
      <div 
        className="brand-section"
        onClick={() => setActiveTab('explore')}
      >
        <div className="brand-logo-frame">
          <img src="/logo.png" alt="GeoThamizh Logo" className="brand-logo-img" />
        </div>
        <div className="brand-title-wrap">
          <h1 className="brand-title">GeoThamizh</h1>
          <span className="brand-subtitle">Rooted in Time. Alive in Stories.</span>
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
          className="nav-link-btn"
          onClick={onOpenItineraries}
          title="Curated 1-Day Heritage Itineraries"
        >
          <span style={{ fontSize: '13px' }}>🧭</span>
          <span>Itineraries</span>
        </button>

        <button 
          className="nav-link-btn"
          onClick={onOpenTodayInHistory}
          title="Today in Tamil History — Daily Historical Capsule"
        >
          <span style={{ fontSize: '13px' }}>📅</span>
          <span>Today in History</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'people' ? 'active' : ''}`}
          onClick={onOpenPeople}
          title="Explore Historical Figures, Monarchs & Poets"
        >
          <span style={{ fontSize: '12px' }}>👑</span>
          <span>{translations.navPeople || 'People'}</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'works' ? 'active' : ''}`}
          onClick={onOpenWorks}
          title="Explore Classical Tamil Literature, Epics & Treatises"
        >
          <span style={{ fontSize: '12px' }}>📜</span>
          <span>{translations.navWorks || 'Literature'}</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'stories' ? 'active' : ''}`}
          onClick={onOpenStories}
        >
          <BookOpen size={14} />
          <span>{translations.navStories}</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'culture' ? 'active' : ''}`}
          onClick={onOpenLivingCulture}
        >
          <Utensils size={14} />
          <span>{translations.navCulture}</span>
        </button>

        <button 
          className={`nav-link-btn ${activeTab === 'graph' ? 'active' : ''}`}
          onClick={onOpenKnowledgeGraph}
        >
          <Share2 size={14} />
          <span>{translations.navGraph}</span>
        </button>
      </nav>

      {/* Global Controls */}
      <div className="nav-actions">
        {/* Split Screen Button */}
        {onOpenSplitScreen && (
          <button 
            className="btn-ai-guide"
            onClick={onOpenSplitScreen}
            title="Split Screen Map View"
            aria-label="Split Screen Map View"
          >
            <span style={{ fontSize: '14px' }}>🪞</span>
            <span className="nav-btn-text">Split View</span>
          </button>
        )}

        {/* AI Heritage Guide Button */}
        <button 
          className="btn-ai-guide"
          onClick={onOpenAIGuide}
          title={translations.askAI}
          aria-label="Open AI Heritage Guide"
        >
          <Sparkles size={14} />
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

      {/* Mobile Dropdown Menu with Backdrop */}
      {mobileMenuOpen && (
        <>
          <div 
            className="mobile-nav-backdrop" 
            onClick={() => setMobileMenuOpen(false)} 
            aria-hidden="true"
          />
          <div className="mobile-nav-dropdown">
            <div className="mobile-nav-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/logo.png" alt="GeoThamizh" style={{ width: '24px', height: '24px', borderRadius: '4px', objectFit: 'cover' }} />
                <span style={{ fontFamily: 'var(--font-serif)', color: '#ffd166', fontWeight: 700, fontSize: '0.95rem' }}>
                  GeoThamizh Atlas Menu
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', padding: '4px' }}
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            {/* Mobile Mode Switcher */}
            <div style={{ padding: '0.75rem 1rem 0.5rem', borderBottom: '1px solid rgba(212, 163, 89, 0.15)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => { setMapMode('live'); setMobileMenuOpen(false); }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1.5px solid ${mapMode === 'live' ? '#d99b38' : 'rgba(212, 163, 89, 0.2)'}`,
                    background: mapMode === 'live' ? 'linear-gradient(135deg, #9e3223, #7d2417)' : '#1a1410',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px'
                  }}
                >
                  <span>📍</span>
                  <span>Live Map</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setMapMode('historical'); setMobileMenuOpen(false); }}
                  style={{
                    padding: '8px',
                    borderRadius: '8px',
                    border: `1.5px solid ${mapMode === 'historical' ? '#d99b38' : 'rgba(212, 163, 89, 0.2)'}`,
                    background: mapMode === 'historical' ? 'linear-gradient(135deg, #9e3223, #7d2417)' : '#1a1410',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '12px'
                  }}
                >
                  <span>⏳</span>
                  <span>Historical</span>
                </button>
              </div>
            </div>

            <div className="mobile-nav-list">
              <button 
                className="mobile-nav-item"
                onClick={() => {
                  if (onOpenPeople) onOpenPeople();
                  setMobileMenuOpen(false);
                }}
              >
                <span style={{ fontSize: '16px' }}>👑</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{translations.navPeople || 'People of Tamilakam'}</div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>Monarchs, poets, scholars & saints</div>
                </div>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => {
                  if (onOpenWorks) onOpenWorks();
                  setMobileMenuOpen(false);
                }}
              >
                <span style={{ fontSize: '16px' }}>📜</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{translations.navWorks || 'Classical Literature'}</div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>Sangam anthologies, epics & treaties</div>
                </div>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => {
                  onOpenStories();
                  setMobileMenuOpen(false);
                }}
              >
                <BookOpen size={16} color="#d4a359" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{translations.navStories}</div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>Curated journeys & historical trails</div>
                </div>
              </button>

              <button 
                className="mobile-nav-item"
                onClick={() => {
                  onOpenLivingCulture();
                  setMobileMenuOpen(false);
                }}
              >
                <Utensils size={16} color="#ffd166" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{translations.navCulture}</div>
                  <div style={{ fontSize: '10.5px', color: '#aaa' }}>Culinary heritage, GI crafts & festivals</div>
                </div>
              </button>

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
