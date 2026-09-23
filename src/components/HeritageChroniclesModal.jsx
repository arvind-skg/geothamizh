import React, { useState, useEffect } from 'react';
import { 
  X, Navigation, Clock, Utensils, MapPin, CheckCircle, 
  Compass, Sparkles, ExternalLink, Car, Calendar, Route, 
  ArrowDown, ChevronLeft, ChevronRight, BookOpen, Play, Pause,
  Layers, Award, Flame, Volume2
} from 'lucide-react';
import { HERITAGE_ITINERARIES } from '../data/itineraries';
import { DAILY_TAMIL_HISTORY } from '../data/dailyHistory';
import { STORIES } from '../data/stories';
import { LIVING_CULTURE } from '../data/livingCulture';

// Haversine distance formula in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getDrivingDistanceKm = (lat1, lon1, lat2, lon2) => {
  const direct = calculateDistance(lat1, lon1, lat2, lon2);
  if (direct <= 0.3) return 1;
  return Math.round(direct * 1.25);
};

const getDrivingTimeStr = (distanceKm) => {
  if (distanceKm <= 3) return '~10 min drive';
  const totalMins = Math.round((distanceKm / 42) * 60);
  if (totalMins < 60) return `~${totalMins}m drive`;
  const hrs = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  return `~${hrs}h ${remainingMins > 0 ? `${remainingMins}m` : ''}`;
};

export const HeritageChroniclesModal = ({
  isOpen,
  onClose,
  initialTab = 'itineraries',
  onSelectPlaceById,
  onSelectPlaceOnMap,
  userLocation,
  onStartStory,
  translations = {}
}) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  // 1-Day Itineraries State
  const [selectedItineraryId, setSelectedItineraryId] = useState('great-living-chola-temples');

  // Today in History State
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const currentDay = today.getDate();
  const [historyIndex, setHistoryIndex] = useState(() => {
    const idx = DAILY_TAMIL_HISTORY.findIndex(
      h => h.month === currentMonth && h.day === currentDay
    );
    return idx >= 0 ? idx : 0;
  });
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Living Culture Filter
  const [selectedCultureCategory, setSelectedCultureCategory] = useState('all');

  // Story Trail State
  const [selectedStoryId, setSelectedStoryId] = useState(STORIES[0]?.id || 'chola-navy');

  // Sync initial tab when opened
  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Clean audio on close
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const currentItinerary = HERITAGE_ITINERARIES.find(it => it.id === selectedItineraryId) || HERITAGE_ITINERARIES[0];
  const stops = currentItinerary.stops || [];

  let measuredTotalKm = 0;
  for (let i = 1; i < stops.length; i++) {
    measuredTotalKm += getDrivingDistanceKm(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  if (measuredTotalKm === 0) measuredTotalKm = currentItinerary.totalDistanceKm || 75;

  const handleSelectPlace = (placeId) => {
    const handler = onSelectPlaceById || onSelectPlaceOnMap;
    if (handler && placeId) {
      handler(placeId);
      onClose();
    }
  };

  const currentHistoryEntry = DAILY_TAMIL_HISTORY[historyIndex] || DAILY_TAMIL_HISTORY[0];

  const handleToggleHistoryAudio = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = `${currentHistoryEntry.title}. In the year ${currentHistoryEntry.year}. ${currentHistoryEntry.narrative || currentHistoryEntry.significance || ''}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = 0.95;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
  };

  const allCultureItems = [
    ...(LIVING_CULTURE?.food || []).map(item => ({ ...item, cultureType: 'culinary', tagLabel: 'Culinary Heritage' })),
    ...(LIVING_CULTURE?.crafts || []).map(item => ({ ...item, cultureType: 'craft', tagLabel: item.giTagged ? 'GI Handicraft' : 'Craft & Art' })),
    ...(LIVING_CULTURE?.festivals || []).map(item => ({ ...item, cultureType: 'ritual', tagLabel: 'Living Tradition' }))
  ];

  const filteredCulture = allCultureItems.filter(item => {
    if (selectedCultureCategory === 'all') return true;
    return item.cultureType === selectedCultureCategory;
  });

  const currentStory = STORIES.find(s => s.id === selectedStoryId) || STORIES[0];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="time-travel-modal-box connected-history-box heritage-chronicles-box"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-sheet-handle" />

        {/* Unified Ornate Header */}
        <div className="modal-header chronicles-modal-header">
          <div className="chronicles-header-left">
            <div className="chronicles-header-icon-badge">
              <Compass size={22} />
            </div>
            <div>
              <div className="chronicles-eyebrow">HERITAGE DISCOVERY VAULT • வரலாற்றுக் களஞ்சியம்</div>
              <h2 className="chronicles-title">Tamil Heritage Chronicles</h2>
              <div className="chronicles-header-sub">
                Curated Road Circuits • Daily Epigraphical History • Thematic Story Trails • Living Culture
              </div>
            </div>
          </div>

          <div className="chronicles-header-right">
            <div className="chronicles-vault-badge">
              <Sparkles size={13} color="#ffd166" />
              <span>Imperial Tamilakam Stratigraphy</span>
            </div>

            <button className="drawer-close-btn" onClick={onClose} aria-label="Close Chronicles Hub" title="Close (Esc)">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dedicated Full-Width Inner Navigation Bar Strip */}
        <nav className="chronicles-inner-navbar" aria-label="Heritage Discovery Vault Modules">
          <button
            type="button"
            className={`chronicles-nav-tab ${activeTab === 'itineraries' ? 'active' : ''}`}
            onClick={() => setActiveTab('itineraries')}
            title="1-Day Curated Road Circuits (UNESCO & Heritage Sites)"
          >
            <div className="tab-icon-wrap">
              <Route size={17} />
            </div>
            <div className="tab-text-wrap">
              <div className="tab-title-line">
                <span className="tab-primary-title">1-Day Circuits</span>
                <span className="tab-count-badge">{HERITAGE_ITINERARIES.length} Routes</span>
              </div>
              <span className="tab-tamil-sub">ஒரு நாள் சுற்றுலா</span>
            </div>
          </button>

          <button
            type="button"
            className={`chronicles-nav-tab ${activeTab === 'today' ? 'active' : ''}`}
            onClick={() => setActiveTab('today')}
            title="Today in Tamil History — Daily Historical Capsule & Epigraphs"
          >
            <div className="tab-icon-wrap">
              <Calendar size={17} />
            </div>
            <div className="tab-text-wrap">
              <div className="tab-title-line">
                <span className="tab-primary-title">Today in History</span>
                <span className="tab-count-badge live-badge">Live Capsule</span>
              </div>
              <span className="tab-tamil-sub">இன்றைய வரலாறு</span>
            </div>
          </button>

          <button
            type="button"
            className={`chronicles-nav-tab ${activeTab === 'stories' ? 'active' : ''}`}
            onClick={() => setActiveTab('stories')}
            title="Thematic Story Trails across Eras & Dynasties"
          >
            <div className="tab-icon-wrap">
              <BookOpen size={17} />
            </div>
            <div className="tab-text-wrap">
              <div className="tab-title-line">
                <span className="tab-primary-title">Story Trails</span>
                <span className="tab-count-badge">{STORIES.length} Trails</span>
              </div>
              <span className="tab-tamil-sub">வரலாற்றுப் பாதைகள்</span>
            </div>
          </button>

          <button
            type="button"
            className={`chronicles-nav-tab ${activeTab === 'culture' ? 'active' : ''}`}
            onClick={() => setActiveTab('culture')}
            title="Living Culture — GI Crafts, Culinary Traditions & Rituals"
          >
            <div className="tab-icon-wrap">
              <Utensils size={17} />
            </div>
            <div className="tab-text-wrap">
              <div className="tab-title-line">
                <span className="tab-primary-title">Living Culture</span>
                <span className="tab-count-badge">{allCultureItems.length} Traditions</span>
              </div>
              <span className="tab-tamil-sub">வாழும் பண்பாடு</span>
            </div>
          </button>
        </nav>

        {/* Tab 1: 1-Day Curated Circuits */}
        {activeTab === 'itineraries' && (
          <div className="chronicles-tab-content">
            {/* Circuit Selector Row */}
            <div className="chronicles-sub-pills-row">
              {HERITAGE_ITINERARIES.map(circuit => {
                const isSelected = circuit.id === selectedItineraryId;
                const eraTag = circuit.id.includes('chola') 
                  ? 'CHOLA IMPERIAL APEX' 
                  : circuit.id.includes('vaigai') 
                  ? 'PANDYAN SANGAM CIVILIZATION' 
                  : 'PALLAVA MARITIME HAVEN';

                return (
                  <button
                    key={circuit.id}
                    onClick={() => setSelectedItineraryId(circuit.id)}
                    className={`chronicles-circuit-card-btn ${isSelected ? 'active' : ''}`}
                  >
                    <div className="circuit-card-top-row">
                      <span className="circuit-btn-era">{eraTag}</span>
                      <span className="circuit-stops-badge">🏛️ {circuit.stops?.length || 0} Stops</span>
                    </div>

                    <div className="circuit-btn-title">{circuit.title}</div>
                    <div className="circuit-btn-tamil">{circuit.tamilTitle}</div>

                    <div className="circuit-btn-meta">
                      <span>⏱️ {circuit.duration || '1 Day'}</span>
                      <span>•</span>
                      <span>🚗 ~{circuit.totalDistanceKm || 75} km</span>
                      <span>•</span>
                      <span>📍 {circuit.idealBaseCity?.split('/')[0] || 'Tamil Nadu'}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Circuit Overview & Timeline Stops */}
            <div className="chronicles-circuit-viewer">
              <div className="circuit-overview-bar">
                <div className="circuit-overview-stats">
                  <div className="circuit-stat-chip">
                    <Clock size={14} color="#ffd166" />
                    <span>Duration: <strong>1 Day (8h – 10h)</strong></span>
                  </div>
                  <div className="circuit-stat-chip">
                    <Car size={14} color="#80ed99" />
                    <span>Total Route: <strong>~{measuredTotalKm} km road drive</strong></span>
                  </div>
                  <div className="circuit-stat-chip">
                    <MapPin size={14} color="#ffccd5" />
                    <span>Stops: <strong>{stops.length} UNESCO & Heritage Sites</strong></span>
                  </div>
                </div>

                <div className="circuit-actions">
                  <button
                    type="button"
                    onClick={() => handleSelectPlace(stops[0]?.placeId)}
                    className="circuit-fly-map-btn"
                  >
                    <span>🧭 Start Circuit at Stop 1</span>
                  </button>
                </div>
              </div>

              {/* Stop Cards List */}
              <div className="circuit-stops-grid">
                {stops.map((stop, idx) => {
                  const isFirst = idx === 0;
                  const isLast = idx === stops.length - 1;
                  const drivingDistKm = idx > 0 ? getDrivingDistanceKm(stops[idx - 1].lat, stops[idx - 1].lng, stop.lat, stop.lng) : 0;
                  const drivingTimeStr = idx > 0 ? getDrivingTimeStr(drivingDistKm) : '';

                  return (
                    <div key={idx} className="circuit-stop-visual-card">
                      {idx > 0 && (
                        <div className="circuit-leg-indicator">
                          <Car size={11} color="#d4952b" />
                          <span>{drivingDistKm} km ({drivingTimeStr})</span>
                        </div>
                      )}

                      <div className="circuit-stop-body">
                        <div className="circuit-stop-badge-row">
                          <span className="circuit-stop-number">Stop {idx + 1}</span>
                          <span className="circuit-stop-time">{stop.time}</span>
                          {stop.order && <span className="circuit-stop-duration">Seq #{stop.order}</span>}
                        </div>

                        <h4 className="circuit-stop-name">{stop.name}</h4>
                        {stop.sub && (
                          <div className="circuit-stop-tamil" style={{ fontStyle: 'italic', fontSize: '11.5px', color: '#ffd166', marginBottom: '4px' }}>
                            {stop.sub}
                          </div>
                        )}

                        <p className="circuit-stop-desc">{stop.highlights?.[0] || stop.tip || ''}</p>

                        <div className="circuit-stop-footer">
                          {stop.tip && (
                            <div className="circuit-culinary-tip">
                              <Utensils size={11} color="#ffd166" />
                              <span>{stop.tip}</span>
                            </div>
                          )}
                          {stop.placeId && (
                            <button
                              type="button"
                              onClick={() => handleSelectPlace(stop.placeId)}
                              className="circuit-view-site-link"
                            >
                              <span>Inspect Site →</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Today in Tamil History */}
        {activeTab === 'today' && (
          <div className="chronicles-tab-content">
            <div className="today-history-card-wrap">
              <div className="today-date-badge-row">
                <button 
                  type="button" 
                  onClick={() => setHistoryIndex(prev => prev > 0 ? prev - 1 : DAILY_TAMIL_HISTORY.length - 1)}
                  className="today-nav-arrow"
                  title="Previous Day in History"
                >
                  <ChevronLeft size={16} />
                </button>

                <div className="today-date-center">
                  <div className="today-eyebrow">EPIGRAPHICAL & LITERARY CHRONICLE</div>
                  <div className="today-date-display">
                    {new Date(2026, currentHistoryEntry.month - 1, currentHistoryEntry.day).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                    <span className="today-year-pill">{currentHistoryEntry.year}</span>
                  </div>
                </div>

                <button 
                  type="button" 
                  onClick={() => setHistoryIndex(prev => prev < DAILY_TAMIL_HISTORY.length - 1 ? prev + 1 : 0)}
                  className="today-nav-arrow"
                  title="Next Day in History"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Main History Capsule Card */}
              <div className="today-capsule-body">
                <div className="today-title-row">
                  <h3 className="today-entry-title">{currentHistoryEntry.title}</h3>
                  <button 
                    type="button"
                    onClick={handleToggleHistoryAudio}
                    className={`today-audio-btn ${isPlayingAudio ? 'is-playing' : ''}`}
                    title="Listen to spoken history narration"
                  >
                    {isPlayingAudio ? <Pause size={14} /> : <Volume2 size={14} />}
                    <span>{isPlayingAudio ? 'Pause Narration' : 'Listen Narration'}</span>
                  </button>
                </div>

                <div className="today-tamil-title">{currentHistoryEntry.tamilTitle}</div>

                <div className="today-quote-box">
                  <span className="today-quote-mark">“</span>
                  <p className="today-quote-text">{currentHistoryEntry.narrative || currentHistoryEntry.significance || currentHistoryEntry.description}</p>
                </div>

                {/* Metadata Chips */}
                <div className="today-meta-chips-row">
                  <div className="today-chip">
                    <span>🏛️ Dynasty:</span>
                    <strong>{currentHistoryEntry.dynasty || 'Imperial Chola'}</strong>
                  </div>
                  <div className="today-chip">
                    <span>📜 Source / Ruler:</span>
                    <strong>{currentHistoryEntry.monarch || currentHistoryEntry.source || 'ASI Epigraphia'}</strong>
                  </div>
                  <div className="today-chip">
                    <span>📍 Geography:</span>
                    <strong>{currentHistoryEntry.location || currentHistoryEntry.placeName || 'Thanjavur'}</strong>
                  </div>
                </div>

                {/* Jump to Map */}
                {currentHistoryEntry.placeId && (
                  <div className="today-jump-row">
                    <button
                      type="button"
                      onClick={() => handleSelectPlace(currentHistoryEntry.placeId)}
                      className="today-jump-map-btn"
                    >
                      <MapPin size={14} />
                      <span>Fly to {currentHistoryEntry.location || currentHistoryEntry.placeName || 'Historical Site'} on Map →</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Story Trails */}
        {activeTab === 'stories' && (
          <div className="chronicles-tab-content">
            <div className="chronicles-trails-layout">
              {/* Left Column: Trail List */}
              <div className="chronicles-trails-list">
                {STORIES.map(story => {
                  const isSelected = story.id === selectedStoryId;
                  return (
                    <div
                      key={story.id}
                      onClick={() => setSelectedStoryId(story.id)}
                      className={`chronicles-trail-item ${isSelected ? 'active' : ''}`}
                    >
                      <div className="trail-item-top">
                        <span className="trail-era-tag">{story.era || 'HISTORICAL TRAIL'}</span>
                        <span className="trail-stops-count">{story.stops?.length || 0} Waypoints</span>
                      </div>
                      <h4 className="trail-item-title">{story.title}</h4>
                      <p className="trail-item-desc">{(story.summary || story.description || '').slice(0, 85)}...</p>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Selected Trail Details */}
              <div className="chronicles-trail-detail">
                <div className="trail-detail-header">
                  <div>
                    <span className="trail-detail-badge">{currentStory.era || 'Curated Trail'}</span>
                    <h3 className="trail-detail-title">{currentStory.title}</h3>
                    <p className="trail-detail-synopsis">{currentStory.summary || currentStory.description || ''}</p>
                  </div>

                  {onStartStory && (
                    <button
                      type="button"
                      onClick={() => {
                        onStartStory(currentStory);
                        onClose();
                      }}
                      className="trail-start-btn"
                    >
                      <Compass size={14} />
                      <span>Start Guided Trail</span>
                    </button>
                  )}
                </div>

                <div className="trail-waypoints-header">
                  <span>🗺️ Waypoints in this Journey</span>
                </div>

                <div className="trail-waypoints-list">
                  {currentStory.stops?.map((stop, sIdx) => (
                    <div key={sIdx} className="trail-waypoint-row">
                      <div className="waypoint-number">{sIdx + 1}</div>
                      <div className="waypoint-info">
                        <div className="waypoint-title">{stop.title || stop.name}</div>
                        <div className="waypoint-snippet">{stop.narrative?.slice(0, 95)}...</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSelectPlace(stop.placeId)}
                        className="waypoint-view-btn"
                      >
                        <span>View Map →</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Living Culture & GI Crafts */}
        {activeTab === 'culture' && (
          <div className="chronicles-tab-content">
            {/* Category Filter Chips */}
            <div className="chronicles-sub-pills-row">
              <button
                onClick={() => setSelectedCultureCategory('all')}
                className={`people-lit-filter-chip ${selectedCultureCategory === 'all' ? 'active' : ''}`}
              >
                <span>All Living Traditions ({allCultureItems.length})</span>
              </button>
              <button
                onClick={() => setSelectedCultureCategory('craft')}
                className={`people-lit-filter-chip ${selectedCultureCategory === 'craft' ? 'active' : ''}`}
              >
                <span>🏺 GI Handicrafts</span>
              </button>
              <button
                onClick={() => setSelectedCultureCategory('culinary')}
                className={`people-lit-filter-chip ${selectedCultureCategory === 'culinary' ? 'active' : ''}`}
              >
                <span>🍲 Culinary Heritage</span>
              </button>
              <button
                onClick={() => setSelectedCultureCategory('ritual')}
                className={`people-lit-filter-chip ${selectedCultureCategory === 'ritual' ? 'active' : ''}`}
              >
                <span>🪔 Rituals & Epics</span>
              </button>
            </div>

            {/* Visual Culture Grid */}
            <div className="chronicles-culture-grid">
              {filteredCulture.map(item => (
                <div key={item.id} className="chronicles-culture-card">
                  <div className="culture-card-top">
                    <span className="culture-badge">{item.tagLabel || (item.giTagged ? 'GI Handicraft' : 'Living Heritage')}</span>
                    <span className="culture-era">{item.region || item.month || 'Tamil Heritage'}</span>
                  </div>

                  <h4 className="culture-name">{item.name}</h4>
                  <div className="culture-tamil">{item.tamilName}</div>

                  <p className="culture-desc">{item.description}</p>

                  <div className="culture-origin-box">
                    <MapPin size={12} color="#d4952b" />
                    <span>Region / Origin: <strong>{item.region || 'Tamil Nadu'}</strong></span>
                  </div>

                  <div className="culture-card-footer">
                    <button
                      type="button"
                      onClick={() => handleSelectPlace(item.placeId)}
                      className="circuit-view-site-link"
                    >
                      <span>Locate on Map →</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
