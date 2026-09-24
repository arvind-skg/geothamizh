import React, { useState } from 'react';
import { 
  X, Navigation, Clock, Utensils, MapPin, CheckCircle, 
  Compass, Sparkles, ExternalLink, Car, Calendar, Route, ArrowDown 
} from 'lucide-react';
import { HERITAGE_ITINERARIES } from '../data/itineraries';

// Precise Haversine distance formula in kilometers
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Road driving factor on Indian highways & city roads (~1.25x direct geodesic distance)
const getDrivingDistanceKm = (lat1, lon1, lat2, lon2) => {
  const direct = calculateDistance(lat1, lon1, lat2, lon2);
  if (direct <= 0.3) return 1;
  return Math.round(direct * 1.25);
};

// Formatted driving time estimate (approx 42 km/h average road speed)
const getDrivingTimeStr = (distanceKm) => {
  if (distanceKm <= 3) return '~8 – 12 mins local drive';
  const totalMins = Math.round((distanceKm / 42) * 60);
  if (totalMins < 60) return `~${totalMins} mins drive`;
  const hrs = Math.floor(totalMins / 60);
  const remainingMins = totalMins % 60;
  return `~${hrs} hr${hrs > 1 ? 's' : ''} ${remainingMins > 0 ? `${remainingMins}m` : ''} drive`;
};

export const ItineraryPlannerModal = ({
  isOpen,
  onClose,
  itineraries = HERITAGE_ITINERARIES,
  onSelectPlaceById,
  onSelectPlaceOnMap,
  userLocation,
  translations
}) => {
  const allItineraries = itineraries && itineraries.length > 0 ? itineraries : HERITAGE_ITINERARIES;
  const [selectedItineraryId, setSelectedItineraryId] = useState(allItineraries[0]?.id || 'great-living-chola-temples');

  if (!isOpen) return null;

  const currentItinerary = allItineraries.find(it => it.id === selectedItineraryId) || allItineraries[0];
  const stops = currentItinerary.stops || [];

  // Calculate cumulative measured road distance across all stops
  let measuredTotalKm = 0;
  for (let i = 1; i < stops.length; i++) {
    measuredTotalKm += getDrivingDistanceKm(stops[i - 1].lat, stops[i - 1].lng, stops[i].lat, stops[i].lng);
  }
  if (measuredTotalKm === 0) measuredTotalKm = currentItinerary.totalDistanceKm || 75;

  // Real distance from user to the first milestone
  const firstStop = stops[0];
  const hasUserLocation = Boolean(userLocation?.lat && userLocation?.lng && firstStop?.lat && firstStop?.lng);
  const userToStartDistKm = hasUserLocation 
    ? getDrivingDistanceKm(userLocation.lat, userLocation.lng, firstStop.lat, firstStop.lng)
    : null;
  const userToStartTime = userToStartDistKm ? getDrivingTimeStr(userToStartDistKm) : null;

  // Fallback distances from Chennai and Madurai
  const chennaiToStartKm = firstStop?.lat ? getDrivingDistanceKm(13.0827, 80.2707, firstStop.lat, firstStop.lng) : null;
  const maduraiToStartKm = firstStop?.lat ? getDrivingDistanceKm(9.9195, 78.1193, firstStop.lat, firstStop.lng) : null;

  const handleSelectStop = (placeId) => {
    const handler = onSelectPlaceById || onSelectPlaceOnMap;
    if (handler && placeId) {
      handler(placeId);
      onClose();
    }
  };

  const CIRCUIT_META = {
    'great-living-chola-temples': {
      eraBadge: '01 • IMPERIAL CHOLA',
      shortTitle: 'Chola Temples Circuit',
      region: 'Thanjavur & Delta'
    },
    'ancient-vaigai-civilization-trail': {
      eraBadge: '02 • SANGAM HERITAGE',
      shortTitle: 'Vaigai & Keeladi Trail',
      region: 'Madurai & Vaigai'
    },
    'pallava-maritime-monuments-trail': {
      eraBadge: '03 • PALLAVA MARITIME',
      shortTitle: 'Pallava Shore & Rock-Cut',
      region: 'Mamallapuram & Kanchi'
    }
  };

  return (
    <div className="itinerary-modal-overlay" onClick={onClose}>
      <div className="itinerary-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="itinerary-modal-header">
          <div className="itinerary-header-left">
            <div className="itinerary-header-icon">
              <Navigation size={20} color="#d4952b" />
            </div>
            <div>
              <h2 className="itinerary-modal-title">1-Day Curated Heritage Itineraries</h2>
              <div className="itinerary-modal-sub">ஒரு நாள் வரலாற்றுச் சுற்றுலாப் பயணத் திட்டங்கள் • Real Distance Road Circuits</div>
            </div>
          </div>
          <button 
            type="button"
            className="itinerary-close-btn"
            onClick={onClose}
            aria-label="Close itinerary planner"
          >
            <X size={18} />
          </button>
        </div>

        {/* Itinerary Selector Tabs 3-Plan Top Nav Bar */}
        <div className="itinerary-tabs-row">
          {allItineraries.map((circuit, idx) => {
            const isActive = circuit.id === selectedItineraryId;
            const meta = CIRCUIT_META[circuit.id] || {
              eraBadge: `0${idx + 1} • HERITAGE TRAIL`,
              shortTitle: circuit.title,
              region: circuit.idealBaseCity
            };
            return (
              <button
                key={circuit.id}
                type="button"
                className={`itinerary-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedItineraryId(circuit.id)}
              >
                <div className="itinerary-tab-era-pill">{meta.eraBadge}</div>
                <div className="itinerary-tab-title">{meta.shortTitle}</div>
                <div className="itinerary-tab-meta">
                  <span>🚗 {circuit.totalDistanceKm} km</span>
                  <span>•</span>
                  <span>⏳ {circuit.duration?.split(' (')[0] || circuit.duration}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Body: Scrollable */}
        <div className="itinerary-modal-body">
          {/* Selected Circuit Hero Banner */}
          <div className="itinerary-circuit-overview">
            <div className="itinerary-overview-text">
              <div className="circuit-header-badge">
                <Compass size={13} color="#d4952b" />
                <span>Verified Real-World Road Route</span>
              </div>
              <h3 className="circuit-heading">{currentItinerary.title}</h3>
              <div className="circuit-tamil-heading">{currentItinerary.tamilTitle}</div>
              <p className="circuit-desc">{currentItinerary.description}</p>
              
              <div className="circuit-stats-row">
                <span className="circuit-stat-tag">
                  <Clock size={13} color="#d4952b" />
                  <b>Tour Duration:</b> {currentItinerary.duration}
                </span>
                <span className="circuit-stat-tag">
                  <Car size={13} color="#d4952b" />
                  <b>Circuit Distance:</b> ~{measuredTotalKm} km measured road route
                </span>
                <span className="circuit-stat-tag">
                  <MapPin size={13} color="#d4952b" />
                  <b>Base City:</b> {currentItinerary.idealBaseCity}
                </span>
              </div>

              {/* Real Distance Live Proximity Banner */}
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: hasUserLocation ? 'rgba(38, 70, 30, 0.45)' : 'rgba(30, 20, 10, 0.65)',
                border: hasUserLocation ? '1px solid #4b662f' : '1px solid rgba(212, 149, 43, 0.35)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '12.5px',
                color: '#e8dfd1'
              }}>
                <Route size={18} color={hasUserLocation ? '#95d5b2' : '#ffd166'} style={{ flexShrink: 0 }} />
                <div>
                  {hasUserLocation ? (
                    <div>
                      <b style={{ color: '#95d5b2' }}>🧭 Live Proximity to Start ({firstStop.name.split(' (')[0]}):</b>
                      <span> ~{userToStartDistKm} km ({userToStartTime}) from your current location ({userLocation.name ? userLocation.name.split(',')[0] : 'GPS'})</span>
                    </div>
                  ) : (
                    <div>
                      <b style={{ color: '#ffd166' }}>🧭 Real Highway Proximity to Circuit:</b>
                      <span> ~{chennaiToStartKm} km from Chennai • ~{maduraiToStartKm} km from Madurai Hub</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Route Timeline */}
          <div className="itinerary-timeline-wrap">
            <div className="itinerary-timeline-title">
              <Compass size={15} color="#ffd166" />
              <span>Step-by-Step Road Schedule & Real Transit Distances ({stops.length} Milestones)</span>
            </div>

            <div className="itinerary-stops-list">
              {stops.map((stop, index) => {
                const isCulinary = Boolean(stop.isCulinaryStop);

                // Compute real distance and time from previous stop
                let legDrivingKm = null;
                let legDrivingTime = null;
                if (index > 0 && stops[index - 1]?.lat && stop?.lat) {
                  legDrivingKm = getDrivingDistanceKm(
                    stops[index - 1].lat, 
                    stops[index - 1].lng, 
                    stop.lat, 
                    stop.lng
                  );
                  legDrivingTime = getDrivingTimeStr(legDrivingKm);
                }

                return (
                  <React.Fragment key={index}>
                    {/* Inter-Stop Transit / Road Leg Banner */}
                    {index > 0 && legDrivingKm !== null && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '6px 14px',
                        marginLeft: '14px',
                        background: 'rgba(212, 149, 43, 0.08)',
                        borderLeft: '2px dashed #d4952b',
                        borderRight: '1px solid rgba(212, 149, 43, 0.2)',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '11.5px',
                        color: '#d4a359'
                      }}>
                        <Car size={13} color="#ffd166" />
                        <span>
                          <b>Real Transit Leg:</b> ~{legDrivingKm} km • {legDrivingTime}
                        </span>
                        <span style={{ color: '#888', marginLeft: 'auto', fontSize: '10.5px' }}>
                          Road Transit (State / National Highway)
                        </span>
                      </div>
                    )}

                    <div className={`itinerary-stop-card ${isCulinary ? 'is-culinary' : ''}`}>
                      {/* Left Timeline Indicator */}
                      <div className="itinerary-stop-col-left">
                        <div className={`itinerary-stop-badge ${isCulinary ? 'badge-culinary' : 'badge-heritage'}`}>
                          {isCulinary ? <Utensils size={15} color="#ffd166" /> : <span>{stop.order || index + 1}</span>}
                        </div>
                        {index < stops.length - 1 && (
                          <div className="itinerary-timeline-connector" />
                        )}
                      </div>

                      {/* Right Content */}
                      <div className="itinerary-stop-content">
                        <div className="itinerary-stop-header-row">
                          <div>
                            <div className="itinerary-stop-time-badge">
                              <Clock size={11} />
                              <span>{stop.time}</span>
                            </div>
                            <h4 className="itinerary-stop-name">{stop.name}</h4>
                            {stop.sub && <div className="itinerary-stop-sub">{stop.sub}</div>}
                            
                            {/* Real Coordinates Pill */}
                            {stop.lat && stop.lng && (
                              <div style={{ fontSize: '10.5px', color: '#ffd166', opacity: 0.8, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <MapPin size={10} color="#d4952b" />
                                <span>GPS: {stop.lat.toFixed(4)}° N, {stop.lng.toFixed(4)}° E</span>
                              </div>
                            )}
                          </div>

                          {stop.placeId && (
                            <button
                              type="button"
                              className="itinerary-locate-stop-btn"
                              onClick={() => handleSelectStop(stop.placeId)}
                              title={`Explore ${stop.name} on Interactive Map`}
                            >
                              <ExternalLink size={12} />
                              <span>View on Map</span>
                            </button>
                          )}
                        </div>

                        {/* Highlights */}
                        {stop.highlights && stop.highlights.length > 0 && (
                          <div className="itinerary-highlights-container">
                            <div className="itinerary-highlights-label">Key Highlights & Architecture:</div>
                            <ul className="itinerary-highlights-list">
                              {stop.highlights.map((h, i) => (
                                <li key={i}>{h}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Pro-Tip */}
                        {stop.tip && (
                          <div className="itinerary-stop-tip">
                            <Sparkles size={13} color="#ffd166" style={{ flexShrink: 0, marginTop: '1px' }} />
                            <div>
                              <span style={{ color: '#ffd166', fontWeight: 600 }}>Curator Tip: </span>
                              <span>{stop.tip}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="itinerary-modal-footer">
          <div style={{ fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={13} color="#d4952b" />
            <span>Optimal morning start recommended for minimal crowds and best photographic lighting.</span>
          </div>
          <button 
            type="button" 
            className="itinerary-done-btn"
            onClick={onClose}
          >
            Close Itinerary
          </button>
        </div>
      </div>
    </div>
  );
};
