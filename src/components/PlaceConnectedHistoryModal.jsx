import React, { useState, useEffect } from 'react';
import { 
  X, Clock, MapPin, Navigation, History, ShieldCheck, 
  BookOpen, Scroll, Users, Compass, Utensils, Award, ExternalLink, Sparkles, ArrowRight,
  Volume2, VolumeX, Play, Pause, Square, Video, RotateCcw
} from 'lucide-react';

export const PlaceConnectedHistoryModal = ({
  place,
  isUserCurrentLocation,
  userCoords,
  userLocation,
  onSelectNearbyPlace,
  onClose,
  translations,
  sourcesRegistry,
  onOpenAIGuide,
  onOpenAudioGuide,
  onOpenShareCard
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  // Stop any active audio on unmount or place change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [place]);

  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in your browser.');
      return;
    }

    // If currently paused, resume speaking
    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = place.audioNarration || `${place.name}. ${place.whyItMatters} ${place.shortDescription}`;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;

    const voices = window.speechSynthesis.getVoices();
    const tamilVoice = voices.find(v => v.lang && v.lang.startsWith('ta'));
    if (tamilVoice && /[\u0B80-\u0BFF]/.test(textToSpeak)) {
      utterance.voice = tamilVoice;
    }

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    };

    window.speechSynthesis.speak(utterance);
    setIsPlayingAudio(true);
    setIsPausedAudio(false);
  };

  const handlePauseAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.pause();
      setIsPausedAudio(true);
      setIsPlayingAudio(false);
    }
  };

  const handleStopAudio = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      setIsPausedAudio(false);
    }
  };

  if (!place) return null;

  const nearbyList = userLocation?.nearbyPlaces || [];
  const isFarFromDirectSite = isUserCurrentLocation && (userLocation?.distanceKm > 4);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="time-travel-modal-box connected-history-box" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle" />
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isUserCurrentLocation ? 'linear-gradient(135deg, #1f7a8c, #09bc8a)' : 'linear-gradient(135deg, #b24a3b, #d4a359)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', boxShadow: '0 0 15px rgba(212, 163, 89, 0.3)' }}>
              {isUserCurrentLocation ? <Navigation size={20} /> : <History size={20} />}
            </div>

            <div>
              <div style={{ fontSize: '11px', color: '#d4a359', letterSpacing: '0.08em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isUserCurrentLocation ? (
                  <span style={{ color: '#95d5b2', fontWeight: 600 }}>
                    📍 Live GPS: {userLocation?.name || 'Your Location'} ({userCoords ? `${userCoords.lat.toFixed(3)}, ${userCoords.lng.toFixed(3)}` : 'Detected'})
                  </span>
                ) : (
                  <span>Connected Historical Stratigraphy</span>
                )}
              </div>

              <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: '2px 0 0 0', lineHeight: 1.2 }}>
                {isUserCurrentLocation && isFarFromDirectSite 
                  ? `Regional Heritage Near ${userLocation?.name || 'You'}`
                  : place.name}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {onOpenAudioGuide && (
              <button
                type="button"
                onClick={() => onOpenAudioGuide(place)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: 'rgba(212, 149, 43, 0.15)',
                  border: '1px solid rgba(212, 149, 43, 0.4)',
                  color: '#ffd166',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Open Bilingual Audio Heritage Guide"
              >
                <Volume2 size={13} />
                <span>Audio Tour</span>
              </button>
            )}

            {onOpenShareCard && (
              <button
                type="button"
                onClick={() => onOpenShareCard(place)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  padding: '5px 10px',
                  borderRadius: '999px',
                  background: 'rgba(143, 29, 29, 0.25)',
                  border: '1px solid rgba(143, 29, 29, 0.5)',
                  color: '#ffccd5',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
                title="Generate 1080x1080 Social Share Card"
              >
                <Sparkles size={13} />
                <span>Share Card</span>
              </button>
            )}

            <button className="drawer-close-btn" onClick={onClose} aria-label="Close history modal">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation Strip */}
        <div className="connected-tabs-bar">
          <button
            className={`connected-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <Compass size={13} />
            <span>Overview & Then vs Now</span>
          </button>

          {isUserCurrentLocation && nearbyList.length > 0 && (
            <button
              className={`connected-tab-btn ${activeTab === 'nearby' ? 'active' : ''}`}
              onClick={() => setActiveTab('nearby')}
              style={{ color: '#ffd166', fontWeight: 600 }}
            >
              <MapPin size={13} />
              <span>Nearby Places ({nearbyList.length})</span>
            </button>
          )}

          <button
            className={`connected-tab-btn ${activeTab === 'names' ? 'active' : ''}`}
            onClick={() => setActiveTab('names')}
          >
            <Scroll size={13} />
            <span>Old Names ({place.historicalNamesChronology?.length || 0})</span>
          </button>

          <button
            className={`connected-tab-btn ${activeTab === 'polities' ? 'active' : ''}`}
            onClick={() => setActiveTab('polities')}
          >
            <ShieldCheck size={13} />
            <span>Political Dynasties</span>
          </button>

          <button
            className={`connected-tab-btn ${activeTab === 'routes' ? 'active' : ''}`}
            onClick={() => setActiveTab('routes')}
          >
            <Navigation size={13} />
            <span>Trade Routes</span>
          </button>

          <button
            className={`connected-tab-btn ${activeTab === 'people_literature' ? 'active' : ''}`}
            onClick={() => setActiveTab('people_literature')}
          >
            <Users size={13} />
            <span>People & Literature</span>
          </button>

          <button
            className={`connected-tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Clock size={13} />
            <span>Timeline Events ({place.historicalEvents?.length || 0})</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="modal-body" style={{ maxHeight: 'calc(85vh - 130px)', overflowY: 'auto' }}>
          
          {/* TAB 1: OVERVIEW & THEN VS NOW */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Nearby Proximity Alert Banner (When GPS detected somewhere without direct monument) */}
              {isUserCurrentLocation && isFarFromDirectSite && (
                <div style={{ background: 'linear-gradient(135deg, #182830, #131d24)', border: '1.5px solid #13c2c2', borderRadius: '8px', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '11px', color: '#13c2c2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      📍 CURRENT GPS LOCATION DETECTED
                    </span>
                    <span style={{ background: 'rgba(19, 194, 194, 0.2)', color: '#90e0ef', padding: '2px 8px', borderRadius: '12px', fontSize: '11px' }}>
                      Nearest Site: ~{userLocation.distanceKm} km away
                    </span>
                  </div>
                  <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 600 }}>
                    You are in <span style={{ color: '#ffd166' }}>{userLocation.name}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#ddd', margin: 0, lineHeight: '1.45' }}>
                    While there are no excavated classical monuments directly on this specific address, your area historically belonged to the regional sphere of <b>{place.name}</b>. Below are the closest historical heritage sites you can explore from where you stand!
                  </p>
                </div>
              )}

              {/* Nearby Heritage Places Carousel / Grid (If GPS location has nearby sites) */}
              {isUserCurrentLocation && nearbyList.length > 0 && (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={15} color="#ffd166" />
                    <span>Nearby Historical Places from Where You Stand</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px' }}>
                    {nearbyList.slice(0, 4).map(nearPlace => (
                      <div 
                        key={nearPlace.id}
                        onClick={() => onSelectNearbyPlace ? onSelectNearbyPlace(nearPlace) : null}
                        style={{ background: '#191612', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '6px', cursor: 'pointer', transition: 'all 0.15s ease' }}
                        onMouseEnter={(e) => e.currentTarget.style.borderColor = '#d4a359'}
                        onMouseLeave={(e) => e.currentTarget.style.borderColor = 'rgba(212, 163, 89, 0.25)'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '10px', color: '#13c2c2', background: 'rgba(19, 194, 194, 0.15)', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                            📍 {nearPlace.distanceKm} km away
                          </span>
                          <span style={{ fontSize: '10px', color: '#888', textTransform: 'capitalize' }}>
                            {nearPlace.categories[0]}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.92rem', color: '#fff', fontWeight: 600 }}>
                          {nearPlace.name}
                        </div>
                        <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '11px', color: '#ffd166' }}>
                          {nearPlace.tamilName}
                        </div>

                        <div style={{ fontSize: '11px', color: '#aaa', marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>Explore History</span>
                          <ArrowRight size={10} color="#d4a359" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Voice Story Narration Bar (Section 15 Audio Guide with Play / Pause / Resume / Stop) */}
              <div style={{
                background: (isPlayingAudio || isPausedAudio) ? 'linear-gradient(135deg, #2a1f10, #181510)' : 'rgba(255, 255, 255, 0.03)',
                border: (isPlayingAudio || isPausedAudio) ? '1.5px solid #d4a359' : '1px solid rgba(212, 163, 89, 0.25)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                boxShadow: (isPlayingAudio || isPausedAudio) ? '0 0 15px rgba(212, 163, 89, 0.2)' : 'none',
                transition: 'all 0.3s ease'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: '240px' }}>
                  {/* Action Buttons: Play / Pause / Resume & Stop */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {!isPlayingAudio && !isPausedAudio ? (
                      <button
                        onClick={handlePlayAudio}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #d4a359, #b24a3b)',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
                          transition: 'transform 0.15s ease'
                        }}
                        title="Listen to Story (30–60s Voice Guide)"
                        aria-label="Play story"
                      >
                        <Play size={18} style={{ marginLeft: '2px' }} />
                      </button>
                    ) : isPlayingAudio ? (
                      <button
                        onClick={handlePauseAudio}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#f59e0b',
                          color: '#120e0a',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 12px rgba(245, 158, 11, 0.6)',
                          transition: 'transform 0.15s ease'
                        }}
                        title="Pause Voice Storytelling"
                        aria-label="Pause story"
                      >
                        <Pause size={18} />
                      </button>
                    ) : (
                      <button
                        onClick={handlePlayAudio}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          background: '#10b981',
                          color: '#fff',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 0 12px rgba(16, 185, 129, 0.6)',
                          transition: 'transform 0.15s ease'
                        }}
                        title="Resume Voice Storytelling"
                        aria-label="Resume story"
                      >
                        <Play size={18} style={{ marginLeft: '2px' }} />
                      </button>
                    )}

                    {(isPlayingAudio || isPausedAudio) && (
                      <button
                        onClick={handleStopAudio}
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'rgba(239, 68, 68, 0.2)',
                          color: '#f87171',
                          border: '1px solid rgba(239, 68, 68, 0.5)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        title="Stop Voice Storytelling"
                        aria-label="Stop story"
                      >
                        <Square size={14} />
                      </button>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: (isPlayingAudio || isPausedAudio) ? '#ffd166' : '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Volume2 size={14} color="#d4a359" />
                      <span>
                        {isPlayingAudio 
                          ? 'Narrating Story...' 
                          : isPausedAudio 
                            ? 'Paused — Click to Resume' 
                            : (translations.listenStory || 'Listen to Story (30–60s Voice Guide)')}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#aaa', marginTop: '1px' }}>
                      {isPlayingAudio 
                        ? 'Audio playing in sync with historical sources' 
                        : isPausedAudio 
                          ? 'Story paused mid-way. Press Play to continue listening' 
                          : 'Source-grounded spoken narration based on epigraphical and archaeological records'}
                    </div>
                  </div>
                </div>

                {/* Animated Sound Wave visualizer (Active when playing, frozen when paused) */}
                {isPlayingAudio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px' }}>
                    {[8, 18, 12, 22, 10, 16, 14, 20].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: '3px',
                          height: `${h}px`,
                          background: '#d4a359',
                          borderRadius: '2px',
                          animation: `soundWave 0.8s ease-in-out infinite alternate ${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                )}
                {isPausedAudio && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', height: '20px', opacity: 0.5 }}>
                    {[12, 12, 12, 12, 12, 12, 12, 12].map((h, i) => (
                      <span
                        key={i}
                        style={{
                          width: '3px',
                          height: `${h}px`,
                          background: '#f59e0b',
                          borderRadius: '2px'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Speed Controls & Action Labels */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#888' }}>{translations.speed || 'Speed'}:</span>
                  {[0.8, 1.0, 1.2].map(rate => (
                    <button
                      key={rate}
                      onClick={() => {
                        setSpeechRate(rate);
                        if (isPlayingAudio) {
                          handleStopAudio();
                          setTimeout(handlePlayAudio, 100);
                        }
                      }}
                      style={{
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        background: speechRate === rate ? '#d4a359' : 'rgba(255,255,255,0.06)',
                        color: speechRate === rate ? '#14100c' : '#bbb',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: speechRate === rate ? 700 : 400
                      }}
                    >
                      {rate}x
                    </button>
                  ))}
                  {isPausedAudio && (
                    <button
                      onClick={handlePlayAudio}
                      style={{
                        padding: '3px 9px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        background: 'rgba(16, 185, 129, 0.2)',
                        color: '#6ee7b7',
                        border: '1px solid rgba(16, 185, 129, 0.5)',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      Resume
                    </button>
                  )}
                  {(isPlayingAudio || isPausedAudio) && (
                    <button
                      onClick={handleStopAudio}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        fontSize: '11px',
                        background: 'rgba(239, 68, 68, 0.2)',
                        color: '#f87171',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        cursor: 'pointer',
                        marginLeft: '4px'
                      }}
                    >
                      Stop
                    </button>
                  )}
                </div>
              </div>

              {/* Location Heritage Banner */}
              <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(212, 163, 89, 0.3)' }}>
                <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(15,14,12,0.95) 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '14px' }}>
                  <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '1.2rem', color: '#ffd166', fontWeight: 600 }}>
                    {place.tamilName}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#e5ded5', marginTop: '2px' }}>
                    Classical Identity: <b style={{ color: '#ffd166' }}>{place.classicalName}</b> • District: {place.district}
                  </div>
                  {place.imageAttribution && (
                    <div style={{ fontSize: '10px', color: '#aaa', marginTop: '2px' }}>
                      📷 {place.imageAttribution}
                    </div>
                  )}
                </div>
              </div>

              {/* Why It Matters */}
              <div style={{ background: '#191612', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '1rem' }}>
                <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: '6px' }}>
                  Historical Significance & Heritage Core
                </div>
                <p style={{ fontSize: '0.92rem', color: '#f5f2eb', lineHeight: '1.6' }}>
                  {place.whyItMatters}
                </p>
              </div>

              {/* Video & Media Showcase Section (Section 24) */}
              <div style={{ background: '#191612', border: '1px solid rgba(212, 163, 89, 0.25)', borderRadius: '8px', padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Video size={13} />
                    <span>Documentary & Visual Survey (Section 24)</span>
                  </div>
                  <span style={{ fontSize: '10px', color: '#95d5b2', background: 'rgba(9, 188, 138, 0.15)', padding: '2px 8px', borderRadius: '4px' }}>
                    Verified Media Archive
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#ccc', margin: '0 0 10px 0', lineHeight: 1.4 }}>
                  Archaeological and architectural walkthrough video documenting the stratified monument features, plinths, and inscriptions of {place.name}.
                </p>
                <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '6px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', background: '#0a0908' }}>
                  <iframe 
                    src={place.videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ"} 
                    title={`${place.name} Video Guide`}
                    style={{ width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Then vs Now Side-by-Side */}
              <div>
                <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <History size={15} />
                  <span>Then vs Now: Historical Transformation</span>
                </div>

                <div className="then-vs-now-grid">
                  <div className="comparison-col then-col">
                    <div className="comparison-badge then-badge">THEN (Historical Epoch)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffd166' }}>{place.classicalName}</div>
                    <p style={{ fontSize: '0.85rem', color: '#e0d5c1', lineHeight: '1.5' }}>
                      {place.thenVsNow?.then || place.fullStory}
                    </p>
                  </div>

                  <div className="comparison-col">
                    <div className="comparison-badge now-badge">NOW (Present Reality)</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>{place.name}</div>
                    <p style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: '1.5' }}>
                      {place.thenVsNow?.now || place.shortDescription}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stratigraphy Across Periods */}
              {place.whatWasHere && (
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} />
                    <span>Chronological Stratigraphy Across All Epochs</span>
                  </div>

                  <div className="periods-matrix-list">
                    {Object.entries(place.whatWasHere).map(([periodKey, desc]) => (
                      <div key={periodKey} className="period-matrix-item">
                        <div className="period-matrix-header">
                          <span style={{ textTransform: 'capitalize' }}>{periodKey.replace('_', ' ')} Era</span>
                        </div>
                        <div className="period-matrix-text">{desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: NEARBY PLACES LIST */}
          {activeTab === 'nearby' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>
                Heritage sites, temples, archaeological excavations and ancient cities located near your current position:
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {nearbyList.map((item, idx) => (
                  <div
                    key={item.id}
                    style={{ background: '#181512', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ background: 'rgba(19, 194, 194, 0.2)', color: '#13c2c2', border: '1px solid #13c2c2', padding: '1px 7px', borderRadius: '12px', fontSize: '11px', fontWeight: 700 }}>
                          📍 {item.distanceKm} km away
                        </span>
                        <span style={{ fontSize: '11px', color: '#d4a359' }}>{item.district} District</span>
                      </div>
                      <h4 style={{ fontSize: '1.1rem', color: '#fff', margin: '2px 0' }}>{item.name}</h4>
                      <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '12px', color: '#ffd166' }}>{item.tamilName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#bbb', marginTop: '4px' }}>{item.shortDescription}</div>
                    </div>

                    <button
                      onClick={() => onSelectNearbyPlace ? onSelectNearbyPlace(item) : null}
                      style={{ background: 'linear-gradient(135deg, #3d2c18, #22180d)', border: '1px solid #d4a359', color: '#ffd166', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: OLD NAMES & TOPONYMY EVOLUTION */}
          {activeTab === 'names' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>
                How the place name evolved across classical literature, Greek & Roman navigators, royal inscriptions, and modern records:
              </div>

              {place.historicalNamesChronology ? (
                place.historicalNamesChronology.map((item, idx) => (
                  <div key={idx} style={{ background: '#191612', borderLeft: '4px solid #d4a359', padding: '12px 16px', borderRadius: '0 8px 8px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', color: '#ffd166', fontWeight: 600, textTransform: 'uppercase' }}>
                        {item.era}
                      </span>
                      <span style={{ fontSize: '11px', color: '#999', fontStyle: 'italic' }}>
                        Source: {item.source}
                      </span>
                    </div>

                    <div style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 700 }}>
                      {item.name}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                      Meaning / Etymology: <span style={{ color: '#ffd166' }}>{item.meaning}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ color: '#888', fontStyle: 'italic' }}>Historical names data compiling from epigraphical indices.</div>
              )}
            </div>
          )}

          {/* TAB 3: POLITICAL REGIONS & DYNASTIC SPHERES */}
          {activeTab === 'polities' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>
                Historical ruling dynasties and kingdoms that controlled and developed this region:
              </div>

              {place.connectedPolities?.map((pol, idx) => (
                <div key={idx} style={{ background: '#181512', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1.05rem', color: '#ffd166', fontWeight: 700 }}>
                      {pol.dynasty}
                    </span>
                    <span style={{ fontSize: '11px', background: '#262019', border: '1px solid #4a3a2a', padding: '2px 8px', borderRadius: '12px', color: '#ccc' }}>
                      {pol.period}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#90e0ef', fontWeight: 500 }}>
                    Role: {pol.role}
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#ddd', lineHeight: '1.5' }}>
                    <b>Contributions:</b> {pol.contribution}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TRADE ROUTES & CONNECTIVITY */}
          {activeTab === 'routes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>
                Ancient commercial highways and maritime corridors connecting this location:
              </div>

              {place.connectedTradeRoutes?.map((route, idx) => (
                <div key={idx} style={{ background: '#181512', border: '1px solid rgba(8, 151, 156, 0.3)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '1rem', color: '#69c0ff', fontWeight: 600 }}>
                      {route.name}
                    </span>
                    <span style={{ fontSize: '11px', color: '#ffd166', background: 'rgba(8, 151, 156, 0.2)', padding: '2px 8px', borderRadius: '12px' }}>
                      {route.type}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.85rem', color: '#ccc' }}>
                    <b>Connected Hubs:</b> {route.connectsTo}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: HISTORICAL PEOPLE & LITERATURE */}
          {activeTab === 'people_literature' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={15} />
                  <span>Historical Figures Connected to This Place</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {place.relatedPeople?.map((person, idx) => (
                    <div key={idx} style={{ background: '#241c14', border: '1px solid #d4a359', color: '#ffd166', padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px', textTransform: 'capitalize' }}>
                      👤 {person.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <BookOpen size={15} />
                  <span>Mentions in Classical Tamil Literature</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {place.relatedLiterature?.map((lit, idx) => (
                    <div key={idx} style={{ background: '#191f24', border: '1px solid #69c0ff', color: '#90e0ef', padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px', fontStyle: 'italic', textTransform: 'capitalize' }}>
                      📖 {lit.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.9rem', color: '#ffd166', fontWeight: 600, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Scroll size={15} />
                  <span>Epigraphical Inscriptions Discovered</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {place.relatedInscriptions?.map((insc, idx) => (
                    <div key={idx} style={{ background: '#1c2419', border: '1px solid #95de64', color: '#b7eb8f', padding: '6px 12px', borderRadius: '20px', fontSize: '12.5px' }}>
                      📜 {insc.replace(/-/g, ' ')}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: CHRONOLOGICAL EVENTS TIMELINE */}
          {activeTab === 'events' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ fontSize: '0.85rem', color: '#aaa', lineHeight: '1.5' }}>
                Major historical milestones, royal proclamations, and archaeological breakthroughs:
              </div>

              {place.historicalEvents?.map((event, idx) => (
                <div key={idx} style={{ background: '#191612', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '12px' }}>
                  <div style={{ minWidth: '85px', fontSize: '11.5px', color: '#ffd166', fontWeight: 700 }}>
                    {event.year}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: '#fff', margin: '0 0 4px 0' }}>{event.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#ccc', margin: 0, lineHeight: '1.45' }}>{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer with Actions */}
        <div style={{ padding: '1rem', background: '#14110e', borderTop: '1px solid var(--bg-dark-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#888' }}>
            <ShieldCheck size={14} color="#95d5b2" />
            <span>Cross-verified with DHARMA, CICT, ASI & State Archaeology records</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAIGuide(place);
            }}
            style={{ background: 'linear-gradient(135deg, #b24a3b, #d4a359)', border: 'none', color: '#fff', padding: '6px 14px', borderRadius: '4px', fontSize: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
          >
            <Sparkles size={14} />
            <span>Ask AI Guide About This Location</span>
          </button>
        </div>
      </div>
    </div>
  );
};
