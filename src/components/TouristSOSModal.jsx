import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertTriangle, PhoneCall, MapPin, Share2, Copy, Check, 
  Volume2, VolumeX, ShieldAlert, HeartPulse, Shield, Compass, 
  X, ExternalLink, MessageCircle, Hospital, Radio
} from 'lucide-react';

export const TouristSOSModal = ({
  isOpen,
  onClose,
  userLocation,
  selectedPlace,
  onDetectLocation
}) => {
  const [copied, setCopied] = useState(false);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const [gpsRefreshing, setGpsRefreshing] = useState(false);
  
  // AudioContext reference for synthesized emergency distress siren
  const audioCtxRef = useRef(null);
  const sirenOscRef = useRef(null);
  const sirenTimerRef = useRef(null);

  function stopSiren() {
    if (sirenTimerRef.current) {
      clearInterval(sirenTimerRef.current);
      sirenTimerRef.current = null;
    }
    if (sirenOscRef.current) {
      try {
        sirenOscRef.current.stop();
        sirenOscRef.current.disconnect();
      } catch (e) {}
      sirenOscRef.current = null;
    }
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch (e) {}
      audioCtxRef.current = null;
    }
    setIsSirenPlaying(false);
  }

  function startSiren() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      audioCtxRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      gain.gain.setValueAtTime(0.35, ctx.currentTime);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      sirenOscRef.current = osc;

      // European/Indian emergency wail pattern (960 Hz alternating with 770 Hz every 400ms)
      let highTone = true;
      sirenTimerRef.current = setInterval(() => {
        if (!audioCtxRef.current || !sirenOscRef.current) return;
        const now = audioCtxRef.current.currentTime;
        sirenOscRef.current.frequency.setTargetAtTime(highTone ? 960 : 770, now, 0.05);
        highTone = !highTone;
      }, 400);

      setIsSirenPlaying(true);
    } catch (e) {
      console.warn('Web Audio error:', e);
    }
  }

  // Stop siren on unmount or modal close
  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve active coordinates (user live GPS or fallback to currently viewed place or default Chennai)
  const lat = userLocation?.lat || selectedPlace?.lat || 13.0827;
  const lng = userLocation?.lng || selectedPlace?.lng || 80.2707;
  const locationName = userLocation?.name || selectedPlace?.name || 'Tamil Nadu, India';
  const mapsUrl = `https://www.google.com/maps?q=${lat.toFixed(5)},${lng.toFixed(5)}`;

  // Distress message for SMS / WhatsApp / Copy
  const distressText = `EMERGENCY ALERT (GeoThamizh Tourist SOS): I require immediate emergency assistance. My current GPS location: ${lat.toFixed(5)}, ${lng.toFixed(5)} near ${locationName}. Map Link: ${mapsUrl}`;

  const handleCopyGPS = async () => {
    try {
      await navigator.clipboard.writeText(distressText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  const handleWhatsAppAlert = () => {
    const encoded = encodeURIComponent(distressText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleSmsAlert = () => {
    const encoded = encodeURIComponent(distressText);
    window.location.href = `sms:?body=${encoded}`;
  };

  const toggleSiren = () => {
    if (isSirenPlaying) {
      stopSiren();
    } else {
      startSiren();
    }
  };

  const handleRefreshLocation = () => {
    if (onDetectLocation) {
      setGpsRefreshing(true);
      onDetectLocation();
      setTimeout(() => setGpsRefreshing(false), 2000);
    }
  };

  // Official Tamil Nadu & National Emergency Contacts
  const EMERGENCY_CONTACTS = [
    {
      id: 'erss-112',
      number: '112',
      title: 'National Emergency Helpline (ERSS)',
      tamilTitle: 'அனைத்து அவசர உதவி',
      desc: 'Single unified emergency number for Police, Fire & Medical response across India',
      icon: ShieldAlert,
      color: '#e63946',
      badge: '24x7 ALL-IN-ONE'
    },
    {
      id: 'medical-108',
      number: '108',
      title: 'Free Emergency Ambulance (Tamil Nadu)',
      tamilTitle: 'இலவச ஆம்புலன்ஸ் சேவை',
      desc: 'Free state-wide emergency medical & road accident ambulance response',
      icon: HeartPulse,
      color: '#ff4d4f',
      badge: 'FREE AMBULANCE'
    },
    {
      id: 'tourist-1363',
      number: '1363',
      title: 'National Tourist Helpline (Tamil & 11 Langs)',
      tamilTitle: 'சுற்றுலாப் பயணிகள் உதவி',
      desc: 'Ministry of Tourism 24x7 multi-lingual helpline for travelers & pilgrims',
      icon: Compass,
      color: '#ffd166',
      badge: 'TOURIST POLICE'
    },
    {
      id: 'women-1091',
      number: '1091',
      title: 'Women in Distress Helpline',
      tamilTitle: 'பெண்கள் அவசர உதவி',
      desc: 'Immediate protective assistance & guidance for female travelers and tourists',
      icon: Shield,
      color: '#f72585',
      badge: 'WOMEN SAFETY'
    },
    {
      id: 'fire-101',
      number: '101',
      title: 'Fire & Rescue Services',
      tamilTitle: 'தீயணைப்பு மற்றும் மீட்பு',
      desc: 'Emergency fire fighting, flood rescue and temple structure emergencies',
      icon: AlertTriangle,
      color: '#fa8c16',
      badge: 'FIRE & RESCUE'
    },
    {
      id: 'disaster-1077',
      number: '1077',
      title: 'District Disaster Management Authority',
      tamilTitle: 'பேரிடர் மேலாண்மை மையம்',
      desc: 'Severe weather, cyclone, flash flood and pilgrimage emergency control',
      icon: Radio,
      color: '#13c2c2',
      badge: 'DISASTER RELIEF'
    }
  ];

  return (
    <div className="sos-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="sos-title">
      <div className="sos-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle" />

        {/* SOS Header */}
        <div className="sos-modal-header">
          <div className="sos-header-left">
            <div className="sos-beacon-icon-wrap">
              <ShieldAlert size={22} className="sos-beacon-icon" />
              <span className="sos-beacon-ping" />
            </div>
            <div>
              <div className="sos-header-eyebrow">TAMIL NADU TOURIST SAFETY & RESCUE</div>
              <h2 id="sos-title" className="sos-modal-title">
                அவசர உதவி • Emergency SOS Assistance
              </h2>
            </div>
          </div>
          <button 
            type="button" 
            className="sos-close-btn" 
            onClick={onClose}
            aria-label="Close SOS modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="sos-modal-body">
          {/* 1. Live Location Telemetry Card */}
          <div className="sos-location-telemetry-card">
            <div className="sos-telemetry-top">
              <div className="sos-telemetry-badge">
                <MapPin size={14} color="#ffd166" />
                <span>Your Real-Time Coordinates</span>
              </div>
              <button 
                type="button" 
                className="sos-refresh-gps-btn"
                onClick={handleRefreshLocation}
                title="Refresh GPS Coordinates"
              >
                <Compass size={12} className={gpsRefreshing ? 'spin-icon' : ''} />
                <span>{gpsRefreshing ? 'Acquiring...' : 'Refresh GPS'}</span>
              </button>
            </div>

            <div className="sos-coords-display">
              <span className="sos-coord-val">{lat.toFixed(5)}° N</span>
              <span className="sos-coord-divider">,</span>
              <span className="sos-coord-val">{lng.toFixed(5)}° E</span>
            </div>

            <div className="sos-location-name-row">
              <span className="sos-location-dot" />
              <span className="sos-location-text">{locationName}</span>
            </div>

            {/* Quick Share Buttons */}
            <div className="sos-telemetry-actions">
              <button 
                type="button" 
                className={`sos-action-btn ${copied ? 'copied' : ''}`}
                onClick={handleCopyGPS}
                title="Copy GPS coordinates and distress text"
              >
                {copied ? <Check size={14} color="#80ed99" /> : <Copy size={14} />}
                <span>{copied ? 'Coordinates Copied!' : 'Copy Location'}</span>
              </button>

              <button 
                type="button" 
                className="sos-action-btn sos-btn-whatsapp"
                onClick={handleWhatsAppAlert}
                title="Send Live GPS distress alert via WhatsApp"
              >
                <MessageCircle size={14} />
                <span>WhatsApp Alert</span>
              </button>

              <button 
                type="button" 
                className="sos-action-btn sos-btn-sms"
                onClick={handleSmsAlert}
                title="Send SMS distress alert with GPS"
              >
                <Share2 size={14} />
                <span>SMS Alert</span>
              </button>
            </div>
          </div>

          {/* 2. Audible Distress Siren & Audio Beacon */}
          <div className="sos-siren-card">
            <div className="sos-siren-info">
              <div className="sos-siren-title">
                <Volume2 size={16} color={isSirenPlaying ? '#e63946' : '#ffd166'} />
                <b>Audible Distress Siren (ஒலி எழுப்பும் கருவி)</b>
              </div>
              <p className="sos-siren-desc">
                Plays a high-decibel acoustic beacon through your device speaker to alert nearby locals, temple guards, or search teams if you are stranded.
              </p>
            </div>
            <button
              type="button"
              className={`sos-siren-toggle-btn ${isSirenPlaying ? 'is-playing' : ''}`}
              onClick={toggleSiren}
            >
              {isSirenPlaying ? (
                <>
                  <VolumeX size={16} />
                  <span>STOP SIREN</span>
                </>
              ) : (
                <>
                  <Volume2 size={16} />
                  <span>SOUND SIREN</span>
                </>
              )}
            </button>
          </div>

          {/* 3. Direct One-Touch Dial Emergency Services */}
          <div className="sos-services-section">
            <div className="sos-section-title-row">
              <PhoneCall size={15} color="#e63946" />
              <span>Official Emergency Helplines (Direct 1-Tap Dial)</span>
            </div>

            <div className="sos-contacts-grid">
              {EMERGENCY_CONTACTS.map(contact => {
                const IconComponent = contact.icon;
                return (
                  <div key={contact.id} className="sos-contact-card">
                    <div className="sos-contact-left">
                      <div className="sos-contact-icon-frame" style={{ background: `${contact.color}22`, borderColor: contact.color, color: contact.color }}>
                        <IconComponent size={20} />
                      </div>
                      <div className="sos-contact-text">
                        <div className="sos-contact-badge-pill" style={{ color: contact.color, borderColor: `${contact.color}55` }}>
                          {contact.badge}
                        </div>
                        <div className="sos-contact-name">{contact.title}</div>
                        <div className="sos-contact-tamil">{contact.tamilTitle}</div>
                        <div className="sos-contact-desc">{contact.desc}</div>
                      </div>
                    </div>

                    <a 
                      href={`tel:${contact.number}`}
                      className="sos-dial-btn"
                      style={{ background: contact.color }}
                      title={`Call ${contact.number} immediately`}
                    >
                      <PhoneCall size={16} />
                      <span>DIAL {contact.number}</span>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Find Nearest Medical & Police Facilities */}
          <div className="sos-nearby-facilities-card">
            <div className="sos-section-title-row">
              <Hospital size={15} color="#80ed99" />
              <span>Instant Google Maps Emergency Search Around You</span>
            </div>
            <div className="sos-quick-links-row">
              <a 
                href={`https://www.google.com/maps/search/hospital/@${lat},${lng},14z`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="sos-facility-link"
              >
                <span>🏥 Nearest Government & Multi-Specialty Hospitals</span>
                <ExternalLink size={12} />
              </a>
              <a 
                href={`https://www.google.com/maps/search/police+station/@${lat},${lng},14z`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="sos-facility-link"
              >
                <span>🚓 Nearest Police Station & Outpost</span>
                <ExternalLink size={12} />
              </a>
              <a 
                href={`https://www.google.com/maps/search/pharmacy/@${lat},${lng},14z`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="sos-facility-link"
              >
                <span>💊 24-Hour Emergency Pharmacies</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Guidance */}
        <div className="sos-modal-footer">
          <ShieldAlert size={14} color="#ffd166" />
          <span>GeoThamizh Emergency Beacon • Keep calm, stay in a safe visible area, and share your coordinates.</span>
        </div>
      </div>
    </div>
  );
};
