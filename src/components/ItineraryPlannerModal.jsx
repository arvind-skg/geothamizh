import React, { useState } from 'react';
import { X, Navigation, Clock, Utensils, MapPin, CheckCircle, ChevronRight, Compass, Sparkles, ExternalLink } from 'lucide-react';
import { HERITAGE_ITINERARIES } from '../data/itineraries';

export const ItineraryPlannerModal = ({
  isOpen,
  onClose,
  userLocation,
  onSelectPlaceOnMap
}) => {
  const [selectedItineraryId, setSelectedItineraryId] = useState(HERITAGE_ITINERARIES[0].id);

  if (!isOpen) return null;

  const currentItinerary = HERITAGE_ITINERARIES.find(it => it.id === selectedItineraryId) || HERITAGE_ITINERARIES[0];

  return (
    <div className="itinerary-modal-overlay">
      <div className="itinerary-modal-card">
        {/* Header */}
        <div className="itinerary-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="itinerary-header-icon">
              <Navigation size={18} color="#d4952b" />
            </div>
            <div>
              <h2 className="itinerary-modal-title">1-Day Curated Heritage Itineraries</h2>
              <div className="itinerary-modal-sub">ஒரு நாள் வரலாற்றுச் சுற்றுலாப் பயணத் திட்டங்கள்</div>
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

        {/* Itinerary Selector Tabs */}
        <div className="itinerary-tabs-row">
          {HERITAGE_ITINERARIES.map(circuit => {
            const isActive = circuit.id === selectedItineraryId;
            return (
              <button
                key={circuit.id}
                type="button"
                className={`itinerary-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedItineraryId(circuit.id)}
              >
                <span className="itinerary-tab-title">{circuit.title}</span>
                <span className="itinerary-tab-dist">{circuit.totalDistanceKm} km • {circuit.duration}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Circuit Hero Summary */}
        <div className="itinerary-circuit-overview">
          <div className="itinerary-overview-text">
            <h3 className="circuit-heading">{currentItinerary.title}</h3>
            <div className="circuit-tamil-heading">{currentItinerary.tamilTitle}</div>
            <p className="circuit-desc">{currentItinerary.description}</p>
            <div className="circuit-stats-row">
              <span className="circuit-stat-tag">
                <Clock size={12} color="#d4952b" /> {currentItinerary.duration}
              </span>
              <span className="circuit-stat-tag">
                <Navigation size={12} color="#d4952b" /> {currentItinerary.totalDistanceKm} km total loop
              </span>
              <span className="circuit-stat-tag">
                <MapPin size={12} color="#d4952b" /> Base: {currentItinerary.idealBaseCity}
              </span>
            </div>
          </div>
        </div>

        {/* Step-by-Step Route Timeline */}
        <div className="itinerary-timeline-wrap">
          <div className="itinerary-timeline-title">
            <Compass size={14} color="#ffd166" />
            <span>Curated Stop-by-Stop Schedule</span>
          </div>

          <div className="itinerary-stops-list">
            {currentItinerary.stops.map((stop, index) => {
              const isCulinary = Boolean(stop.isCulinaryStop);

              return (
                <div key={index} className={`itinerary-stop-card ${isCulinary ? 'is-culinary' : ''}`}>
                  <div className="itinerary-stop-badge">
                    {isCulinary ? <Utensils size={14} color="#ffd166" /> : <span>{stop.order}</span>}
                  </div>

                  <div className="itinerary-stop-content">
                    <div className="itinerary-stop-top">
                      <div>
                        <span className="itinerary-stop-time">{stop.time}</span>
                        <h4 className="itinerary-stop-name">{stop.name}</h4>
                        <div className="itinerary-stop-sub">{stop.sub}</div>
                      </div>

                      {stop.placeId && (
                        <button
                          type="button"
                          className="itinerary-locate-stop-btn"
                          onClick={() => {
                            if (onSelectPlaceOnMap) {
                              onSelectPlaceOnMap(stop.placeId);
                              onClose();
                            }
                          }}
                          title="Point to this site on map"
                        >
                          <ExternalLink size={12} />
                          <span>View on Map</span>
                        </button>
                      )}
                    </div>

                    {/* Highlights */}
                    {stop.highlights && (
                      <ul className="itinerary-highlights-list">
                        {stop.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    )}

                    {/* Pro-Tip */}
                    {stop.tip && (
                      <div className="itinerary-stop-tip">
                        <Sparkles size={11} color="#ffd166" />
                        <span><b>Curator Tip:</b> {stop.tip}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
