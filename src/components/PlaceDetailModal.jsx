import React, { useState, useEffect } from 'react';
import { 
  X, Volume2, VolumeX, Sparkles, Clock, BookOpen, Scroll, 
  MapPin, ShieldCheck, ExternalLink, FastForward, Play, Pause, Square 
} from 'lucide-react';

export const PlaceDetailModal = ({
  place,
  onClose,
  onOpenWhatWasHere,
  onOpenAIGuideWithPlace,
  translations,
  currentLanguage,
  sourcesRegistry
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isPausedAudio, setIsPausedAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState(1.0);

  // Stop audio on unmount or place change
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [place]);

  if (!place) return null;

  // Text to speech narration handlers (Play / Pause / Resume / Stop)
  const handlePlayAudio = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isPausedAudio) {
      window.speechSynthesis.resume();
      setIsPausedAudio(false);
      setIsPlayingAudio(true);
      return;
    }

    window.speechSynthesis.cancel();
    
    // Determine narration text based on language
    let textToSpeak = place.audioNarration || place.fullStory;
    if (currentLanguage === 'ta' && place.translations?.ta?.short) {
      textToSpeak = `${place.tamilName}. ${place.translations.ta.short}. ${place.whyItMatters}`;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = speechRate;
    
    // Voice preference
    const voices = window.speechSynthesis.getVoices();
    if (currentLanguage === 'ta') {
      const taVoice = voices.find(v => v.lang.includes('ta') || v.name.includes('Tamil'));
      if (taVoice) utterance.voice = taVoice;
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

  const handleCycleSpeed = () => {
    const rates = [0.9, 1.0, 1.2];
    const nextRate = rates[(rates.indexOf(speechRate) + 1) % rates.length];
    setSpeechRate(nextRate);
    if (isPlayingAudio) {
      handleStopAudio();
      setTimeout(handlePlayAudio, 100);
    }
  };

  return (
    <div className="sliding-drawer-backdrop" onClick={onClose}>
      <div className="sliding-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                {place.district} District
              </span>
              <span style={{ fontSize: '11px', color: '#888' }}>•</span>
              <span style={{ fontSize: '11px', color: '#ffd166', fontStyle: 'italic' }}>
                Classical: {place.classicalName}
              </span>
            </div>

            <h2 style={{ fontSize: '1.35rem', color: '#fff', marginTop: '4px', lineHeight: 1.25 }}>
              {place.name}
            </h2>

            <div style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: '1.1rem', color: '#ffd166', marginTop: '2px' }}>
              {place.tamilName}
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close details">
            <X size={18} />
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="drawer-body">
          {/* Hero Image Showcase */}
          <div className="place-hero-img-wrap">
            <img src={place.image} alt={place.name} className="place-hero-img" />
            <div className="place-hero-badge">
              {place.categories[0].toUpperCase().replace('_', ' ')}
            </div>
            {place.imageAttribution && (
              <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '9px', background: 'rgba(0,0,0,0.75)', color: '#bbb', padding: '2px 6px', borderRadius: '4px' }}>
                {place.imageAttribution}
              </div>
            )}
          </div>

          {/* Audio Story Narration Bar ("Listen to this Story" with Play / Pause / Resume / Stop) */}
          <div className="audio-narration-player" style={{
            background: (isPlayingAudio || isPausedAudio) ? 'linear-gradient(135deg, #2b1e12 0%, #17130e 100%)' : undefined,
            borderColor: (isPlayingAudio || isPausedAudio) ? '#d4a359' : undefined
          }}>
            <div className="audio-controls-left">
              {/* Play / Pause / Resume controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {!isPlayingAudio && !isPausedAudio ? (
                  <button 
                    className="audio-play-btn" 
                    onClick={handlePlayAudio}
                    title={translations.listenStory}
                    aria-label="Play voice story"
                  >
                    <Play size={18} fill="#120e0a" style={{ marginLeft: '2px' }} />
                  </button>
                ) : isPlayingAudio ? (
                  <button 
                    className="audio-play-btn" 
                    onClick={handlePauseAudio}
                    style={{ background: '#f59e0b', color: '#120e0a' }}
                    title="Pause Voice Storytelling"
                    aria-label="Pause voice story"
                  >
                    <Pause size={18} fill="#120e0a" />
                  </button>
                ) : (
                  <button 
                    className="audio-play-btn" 
                    onClick={handlePlayAudio}
                    style={{ background: '#10b981', color: '#fff' }}
                    title="Resume Voice Storytelling"
                    aria-label="Resume voice story"
                  >
                    <Play size={18} fill="#fff" style={{ marginLeft: '2px' }} />
                  </button>
                )}

                {(isPlayingAudio || isPausedAudio) && (
                  <button
                    onClick={handleStopAudio}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.2)',
                      color: '#f87171',
                      border: '1px solid rgba(239, 68, 68, 0.5)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Stop Voice Storytelling"
                    aria-label="Stop voice story"
                  >
                    <Square size={13} fill="#f87171" />
                  </button>
                )}
              </div>
              
              <div className="audio-label-wrap">
                <span className="audio-title">
                  {isPlayingAudio 
                    ? 'Narrating Story...' 
                    : isPausedAudio 
                      ? 'Paused — Tap to Resume' 
                      : translations.listenStory}
                </span>
                <span className="audio-subtext">
                  {isPausedAudio ? 'Story narration paused' : '30–60s Curated Spoken Narration'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Sound wave visualizer */}
              {isPlayingAudio && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '16px' }}>
                  {[12, 18, 8, 16, 10].map((h, i) => (
                    <span
                      key={i}
                      style={{
                        width: '2.5px',
                        background: '#d4a359',
                        borderRadius: '2px',
                        animation: `soundWave 0.8s ease-in-out infinite alternate ${i * 0.12}s`
                      }}
                    />
                  ))}
                </div>
              )}

              {isPausedAudio && (
                <span style={{ fontSize: '10px', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.15)', padding: '2px 6px', borderRadius: '4px' }}>
                  PAUSED
                </span>
              )}

              <button 
                onClick={handleCycleSpeed}
                style={{ background: '#1c1814', border: '1px solid #4a3a2a', color: '#ffd166', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}
                title="Change playback speed"
              >
                {speechRate}x
              </button>
            </div>
          </div>

          {/* Action Button Grid */}
          <div className="place-action-buttons">
            <button 
              className="btn-primary-action"
              onClick={() => onOpenWhatWasHere(place)}
            >
              <Clock size={15} />
              <span>{translations.whatWasHere}</span>
            </button>

            <button 
              className="btn-secondary-action"
              onClick={() => onOpenAIGuideWithPlace(place)}
            >
              <Sparkles size={15} color="#d4a359" />
              <span>{translations.askAI}</span>
            </button>
          </div>

          {/* Why It Matters */}
          <div className="detail-section">
            <div className="section-label">
              <Sparkles size={14} />
              <span>{translations.whyItMatters}</span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#f5f2eb', lineHeight: '1.6' }}>
              {place.whyItMatters}
            </p>
          </div>

          {/* Historical Background */}
          <div className="detail-section">
            <div className="section-label">
              <Scroll size={14} />
              <span>{translations.historicalContext}</span>
            </div>
            <p className="manuscript-text">
              {place.fullStory}
            </p>
          </div>

          {/* Related Literature */}
          {place.relatedLiterature?.length > 0 && (
            <div className="detail-section">
              <div className="section-label">
                <BookOpen size={14} />
                <span>{translations.relatedLiterature}</span>
              </div>
              <div className="tag-list">
                {place.relatedLiterature.map((lit, idx) => (
                  <span key={idx} style={{ background: '#261f17', border: '1px solid rgba(212, 163, 89, 0.3)', color: '#ffd166', padding: '3px 10px', borderRadius: '12px', fontSize: '12px', fontStyle: 'italic' }}>
                    {lit.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Related Inscriptions */}
          {place.relatedInscriptions?.length > 0 && (
            <div className="detail-section">
              <div className="section-label">
                <Scroll size={14} />
                <span>{translations.relatedInscriptions}</span>
              </div>
              <div className="tag-list">
                {place.relatedInscriptions.map((insc, idx) => (
                  <span key={idx} style={{ background: '#1c242b', border: '1px solid rgba(31, 122, 140, 0.4)', color: '#90e0ef', padding: '3px 10px', borderRadius: '12px', fontSize: '12px' }}>
                    {insc.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Sourced Provenance Evidence Registry */}
          <div className="detail-section">
            <div className="section-label">
              <ShieldCheck size={14} />
              <span>{translations.sourcesEvidence}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {place.sources.map(sourceId => {
                const source = sourcesRegistry[sourceId];
                if (!source) return null;
                return (
                  <div key={sourceId} className="provenance-pill">
                    <div className="provenance-pill-header">
                      <span>{source.institution}</span>
                      <span className={`confidence-badge confidence-${source.confidence}`}>
                        {source.confidence} confidence
                      </span>
                    </div>
                    <div style={{ color: '#d8c7a5', fontSize: '11px', marginTop: '2px' }}>
                      {source.title}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px', fontSize: '10.5px', color: '#888' }}>
                      <span>Type: {source.evidenceType} | License: {source.license}</span>
                      <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: '#d4a359', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        Source <ExternalLink size={10} />
                      </a>
                    </div>
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
