import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Play, Pause, RotateCcw, X, MapPin, 
  Sparkles, BookOpen, Globe, SkipForward, SkipBack, Landmark, 
  Headphones, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { PLACES } from '../data/places';
import { getScriptForPlace } from '../data/audioTourScripts';

export const AudioHeritageGuideModal = ({
  isOpen,
  onClose,
  place,
  places = PLACES,
  onSelectPlace,
  currentLanguage = 'ta',
  translations
}) => {
  const [selectedPlaceId, setSelectedPlaceId] = useState(place?.id || 'madurai');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [language, setLanguage] = useState(currentLanguage === 'en' ? 'en' : 'ta');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPrebuffering, setIsPrebuffering] = useState(false);

  const audioRef = useRef(null);
  const audioBlobsRef = useRef({});
  const utteranceRef = useRef(null);
  const transcriptContainerRef = useRef(null);

  // Sync place prop
  useEffect(() => {
    if (place?.id) {
      setSelectedPlaceId(place.id);
    }
  }, [place]);

  const activePlace = places.find(p => p.id === selectedPlaceId) || place || places[0];
  const { sentences, fullText } = getScriptForPlace(activePlace, language);

  const stopAllAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = '';
      } catch (e) {}
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  // Pre-fetch all sentences into memory as Blobs for 0ms gapless speech transitions
  useEffect(() => {
    let isCancelled = false;
    stopAllAudio();
    setCurrentSentenceIndex(0);
    audioBlobsRef.current = {};

    const prefetchAudio = async () => {
      if (!sentences || sentences.length === 0) return;
      setIsPrebuffering(true);

      const fetchSentence = async (text, idx) => {
        try {
          const res = await fetch(`/api/tts?lang=${language}&text=${encodeURIComponent(text)}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const blob = await res.blob();
          if (!isCancelled) {
            audioBlobsRef.current[idx] = URL.createObjectURL(blob);
          }
        } catch (err) {
          console.warn(`Pre-fetch error on sentence ${idx}:`, err);
        }
      };

      // Pre-fetch sentence 0 first for instant playback readiness, then remaining sentences
      if (sentences[0]) {
        await fetchSentence(sentences[0], 0);
      }
      
      const restPromises = sentences.slice(1).map((s, i) => fetchSentence(s, i + 1));
      await Promise.all(restPromises);

      if (!isCancelled) {
        setIsPrebuffering(false);
      }
    };

    prefetchAudio();

    return () => {
      isCancelled = true;
      stopAllAudio();
      // Revoke any created blob URLs to prevent memory leaks
      Object.values(audioBlobsRef.current).forEach(url => {
        try { URL.revokeObjectURL(url); } catch (e) {}
      });
      audioBlobsRef.current = {};
    };
  }, [selectedPlaceId, language, isOpen]);

  // Auto-scroll transcript to active sentence
  useEffect(() => {
    if (transcriptContainerRef.current) {
      const activeEl = transcriptContainerRef.current.querySelector('.audio-sentence-item.is-active');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [currentSentenceIndex]);

  const playSentence = (index) => {
    if (!sentences || index >= sentences.length) {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
      return;
    }

    setCurrentSentenceIndex(index);
    const text = sentences[index];
    const blobUrl = audioBlobsRef.current[index];
    const ttsUrl = blobUrl || `/api/tts?lang=${language}&text=${encodeURIComponent(text)}`;

    let audio = audioRef.current;
    if (!audio) {
      audio = new Audio();
      audioRef.current = audio;
    }

    audio.src = ttsUrl;
    audio.playbackRate = playbackSpeed;
    if ('preservesPitch' in audio) {
      audio.preservesPitch = true;
    }

    // Gapless instant jump to next sentence upon finish
    audio.onended = () => {
      if (index + 1 < sentences.length) {
        playSentence(index + 1);
      } else {
        setIsPlaying(false);
        setIsPaused(false);
        setCurrentSentenceIndex(0);
      }
    };

    audio.onerror = (err) => {
      console.warn('Audio play error, falling back to Web Speech synthesis:', err);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
        const utt = new SpeechSynthesisUtterance(text);
        utt.lang = language === 'ta' ? 'ta-IN' : 'en-US';
        utt.rate = playbackSpeed;
        utt.onend = () => {
          if (index + 1 < sentences.length) {
            playSentence(index + 1);
          } else {
            setIsPlaying(false);
            setIsPaused(false);
            setCurrentSentenceIndex(0);
          }
        };
        utteranceRef.current = utt;
        window.speechSynthesis.speak(utt);
        setIsPlaying(true);
        setIsPaused(false);
      } else {
        if (index + 1 < sentences.length) {
          playSentence(index + 1);
        } else {
          setIsPlaying(false);
          setIsPaused(false);
        }
      }
    };

    audio.play().then(() => {
      setIsPlaying(true);
      setIsPaused(false);
    }).catch(err => {
      console.warn('Audio play promise rejected:', err);
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      setIsPaused(true);
      setIsPlaying(false);
    } else {
      if (isPaused && audioRef.current && audioRef.current.src) {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          setIsPaused(false);
        }).catch(() => {
          playSentence(currentSentenceIndex);
        });
      } else {
        playSentence(currentSentenceIndex || 0);
      }
    }
  };

  const handleRestart = () => {
    stopAllAudio();
    setCurrentSentenceIndex(0);
    setTimeout(() => {
      playSentence(0);
    }, 100);
  };

  const handleNext = () => {
    if (currentSentenceIndex + 1 < sentences.length) {
      stopAllAudio();
      playSentence(currentSentenceIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSentenceIndex > 0) {
      stopAllAudio();
      playSentence(currentSentenceIndex - 1);
    } else {
      handleRestart();
    }
  };

  const cycleSpeed = () => {
    const speeds = [0.8, 1, 1.25];
    const next = speeds[(speeds.indexOf(playbackSpeed) + 1) % speeds.length];
    setPlaybackSpeed(next);
    if (audioRef.current) {
      audioRef.current.playbackRate = next;
    }
  };

  if (!isOpen) return null;

  const totalSentences = sentences.length || 1;
  const progressPercent = Math.min(100, Math.round(((currentSentenceIndex + 1) / totalSentences) * 100));

  return (
    <div className="audio-guide-modal-overlay" onClick={onClose}>
      <div className="audio-guide-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="audio-guide-header">
          <div className="audio-guide-badge">
            <Headphones size={16} color="#ffd166" />
            <span>Spoken Heritage Audio Tour • ஒலி உலா</span>
          </div>
          <button 
            type="button"
            className="audio-guide-close-btn"
            onClick={onClose}
            aria-label="Close audio guide"
          >
            <X size={18} />
          </button>
        </div>

        {/* Place Selector Row with Live Thumbnail */}
        <div className="audio-guide-selector-wrap">
          <label htmlFor="audio-site-select" style={{ fontSize: '11.5px', color: '#d4952b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Landmark size={12} />
            <span>Select Heritage Site:</span>
          </label>
          <select 
            id="audio-site-select"
            className="audio-guide-dropdown"
            value={selectedPlaceId}
            onChange={(e) => {
              stopAllAudio();
              setSelectedPlaceId(e.target.value);
              const p = places.find(item => item.id === e.target.value);
              if (onSelectPlace && p) onSelectPlace(p);
            }}
          >
            {places.map(p => (
              <option key={p.id} value={p.id}>
                {p.name.split(' (')[0]} ({p.district})
              </option>
            ))}
          </select>
        </div>

        {/* Featured Sites Quick-Pill Carousel */}
        <div className="audio-quick-site-strip">
          {[
            { id: 'madurai', label: 'மதுரை • Madurai' },
            { id: 'thanjavur', label: 'தஞ்சாவூர் • Thanjavur' },
            { id: 'keeladi', label: 'கீழடி • Keeladi' },
            { id: 'mamallapuram', label: 'மாமல்லபுரம்' },
            { id: 'gangaikonda-cholapuram', label: 'கங்கைகொண்ட சோழபுரம்' },
            { id: 'kanchipuram', label: 'காஞ்சிபுரம்' },
            { id: 'darasuram', label: 'தாராசுரம்' }
          ].map(item => (
            <button
              key={item.id}
              type="button"
              className={`audio-quick-site-pill ${selectedPlaceId === item.id ? 'active' : ''}`}
              onClick={() => {
                if (selectedPlaceId !== item.id) {
                  stopAllAudio();
                  setSelectedPlaceId(item.id);
                  const p = places.find(x => x.id === item.id);
                  if (onSelectPlace && p) onSelectPlace(p);
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Place Hero Card */}
        <div className="audio-guide-place-info">
          <div className="audio-guide-place-avatar">
            <img 
              src={activePlace.image || "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=300&q=80"} 
              alt={activePlace.name} 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 className="audio-guide-place-title">{activePlace.name.split(' (')[0]}</h3>
            <div className="audio-guide-place-tamil">{activePlace.tamilName}</div>
            <div className="audio-guide-place-district">
              <MapPin size={11} color="#d4952b" />
              <span>{activePlace.district} District • {activePlace.classicalName || 'Ancient Heritage'}</span>
            </div>
          </div>
        </div>

        {/* Language Switcher Tabs */}
        <div className="audio-guide-lang-tabs">
          <button 
            type="button"
            className={`audio-lang-tab ${language === 'ta' ? 'active' : ''}`}
            onClick={() => {
              if (language !== 'ta') {
                stopAllAudio();
                setLanguage('ta');
              }
            }}
          >
            <Sparkles size={13} />
            <span>தமிழ் ஒலி உரை (Tamil Audio)</span>
          </button>
          <button 
            type="button"
            className={`audio-lang-tab ${language === 'en' ? 'active' : ''}`}
            onClick={() => {
              if (language !== 'en') {
                stopAllAudio();
                setLanguage('en');
              }
            }}
          >
            <Globe size={13} />
            <span>English Spoken Narration</span>
          </button>
        </div>

        {/* Dynamic Sound Wave & Status Visualizer */}
        <div className={`audio-soundwave-container ${isPlaying ? 'is-active' : ''}`}>
          <div className="soundwave-bars">
            {[10, 22, 14, 32, 18, 38, 24, 42, 20, 36, 16, 28, 12, 24, 18, 30].map((height, i) => (
              <span 
                key={i} 
                className="soundwave-bar" 
                style={{ 
                  height: isPlaying ? `${height}px` : '4px',
                  animationDelay: `${i * 0.07}s`
                }} 
              />
            ))}
          </div>
          <div className="soundwave-status">
            {isPlaying 
              ? (language === 'ta' ? '🔊 தமிழ் ஒலி விளக்கம் ஒலிக்கிறது • Gapless High-Fidelity Audio' : '🔊 Narrating Historical Audio Tour in English...') 
              : isPaused 
                ? '⏸️ Audio Paused • கிளிக் செய்து தொடரவும்' 
                : isPrebuffering
                  ? '⚡ Pre-buffering continuous audio audio stream...'
                  : (language === 'ta' ? 'தமிழ் உரை கேட்கத் தயார் • Ready to Play' : 'Ready to Play')}
          </div>
        </div>

        {/* Interactive Sentence-by-Sentence Synchronized Transcript */}
        <div className="audio-guide-transcript-box" ref={transcriptContainerRef}>
          <div className="audio-guide-transcript-header">
            <BookOpen size={13} color="#d4952b" />
            <span>Interactive Spoken Script (Click any sentence to listen):</span>
          </div>
          <div className="audio-guide-sentences-list">
            {sentences.map((sent, idx) => (
              <span
                key={idx}
                className={`audio-sentence-item ${idx === currentSentenceIndex && isPlaying ? 'is-active' : ''} ${idx === currentSentenceIndex && !isPlaying ? 'is-selected' : ''}`}
                onClick={() => {
                  stopAllAudio();
                  playSentence(idx);
                }}
                title="Click to jump to this sentence"
              >
                {sent}{' '}
              </span>
            ))}
          </div>
        </div>

        {/* Audio Progress Pill & Timeline */}
        <div className="audio-tour-timeline-wrap">
          <div className="audio-tour-progress-info">
            <span className="audio-tour-sentence-step">
              Sentence {currentSentenceIndex + 1} of {totalSentences}
            </span>
            <span className="audio-tour-percent">{progressPercent}% Completed</span>
          </div>
          <div className="audio-tour-progress-track">
            <div 
              className="audio-tour-progress-fill" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Audio Player Controls */}
        <div className="audio-guide-controls-row">
          <button 
            type="button"
            className="audio-ctrl-btn"
            onClick={handleRestart}
            title="Restart Narration from beginning"
          >
            <RotateCcw size={15} />
          </button>

          <button 
            type="button"
            className="audio-ctrl-btn"
            onClick={handlePrev}
            disabled={currentSentenceIndex === 0}
            title="Previous Sentence"
            style={{ opacity: currentSentenceIndex === 0 ? 0.4 : 1 }}
          >
            <SkipBack size={16} />
          </button>

          <button 
            type="button"
            className="audio-main-play-btn"
            onClick={handleTogglePlay}
            title={isPlaying ? 'Pause Narration' : isPaused ? 'Resume Narration' : 'Start Audio Tour'}
          >
            {isPlaying ? <Pause size={24} fill="#fff" /> : <Play size={24} fill="#fff" style={{ marginLeft: '3px' }} />}
          </button>

          <button 
            type="button"
            className="audio-ctrl-btn"
            onClick={handleNext}
            disabled={currentSentenceIndex >= sentences.length - 1}
            title="Next Sentence"
            style={{ opacity: currentSentenceIndex >= sentences.length - 1 ? 0.4 : 1 }}
          >
            <SkipForward size={16} />
          </button>

          <button 
            type="button"
            className="audio-ctrl-btn audio-speed-pill"
            onClick={cycleSpeed}
            title="Cycle Playback Speed (0.8x, 1x, 1.25x)"
          >
            <span>{playbackSpeed}x</span>
          </button>
        </div>

        {/* Footer Proximity Badge */}
        <div className="audio-guide-footer-tip">
          <Sparkles size={13} color="#ffd166" />
          <span>Continuous Museum Guide: Zero-latency pre-buffering with archaeological accuracy.</span>
        </div>
      </div>
    </div>
  );
};
