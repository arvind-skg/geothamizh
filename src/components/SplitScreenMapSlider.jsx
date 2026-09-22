import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { X, Layers, Compass, Clock, MoveHorizontal } from 'lucide-react';
import { HISTORICAL_POLITIES } from '../data/historicalPolities';

export const SplitScreenMapSlider = ({ isOpen, onClose, userLocation }) => {
  const containerRef = useRef(null);
  const leftMapRef = useRef(null);
  const rightMapRef = useRef(null);
  const leftMapInstance = useRef(null);
  const rightMapInstance = useRef(null);
  const isSyncing = useRef(false);

  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDragging = useRef(false);

  // Initialize both synchronized maps
  useEffect(() => {
    if (!isOpen || !leftMapRef.current || !rightMapRef.current) return;

    const initialCenter = userLocation ? [userLocation.lat, userLocation.lng] : [10.5, 78.5];
    const initialZoom = 7.5;

    // 1. Left Map: Historical Atlas (735 CE Parchment)
    const mapL = L.map(leftMapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 5.5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      className: 'historical-parchment-tiles',
      maxZoom: 19
    }).addTo(mapL);

    // Add 735 CE Medieval Polities to left map
    const medievalPolities = HISTORICAL_POLITIES.filter(p => p.periodId === 'medieval');
    medievalPolities.forEach(p => {
      L.polygon(p.polygon, {
        color: '#79736c',
        weight: 2.2,
        opacity: 1,
        fillColor: p.color,
        fillOpacity: p.fillOpacity || 0.72
      }).addTo(mapL);

      if (p.center && p.center.length === 2) {
        const label = L.divIcon({
          className: 'dynasty-div-icon',
          html: `<div class="dynasty-map-label"><div class="dynasty-name-text">${p.name}</div><div class="dynasty-dates-text">${p.dates}</div></div>`,
          iconSize: [160, 40],
          iconAnchor: [80, 20]
        });
        L.marker(p.center, { icon: label, interactive: false }).addTo(mapL);
      }
    });

    // 2. Right Map: Modern Live Map (Default OSM clean tiles)
    const mapR = L.map(rightMapRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 5.5,
      maxZoom: 18,
      zoomControl: false,
      attributionControl: false
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(mapR);

    // Synchronize Pan & Zoom between Map Left and Map Right
    const syncMaps = (source, target) => {
      source.on('move', () => {
        if (isSyncing.current) return;
        isSyncing.current = true;
        target.setView(source.getCenter(), source.getZoom(), { animate: false });
        isSyncing.current = false;
      });
    };

    syncMaps(mapL, mapR);
    syncMaps(mapR, mapL);

    leftMapInstance.current = mapL;
    rightMapInstance.current = mapR;

    return () => {
      mapL.remove();
      mapR.remove();
      leftMapInstance.current = null;
      rightMapInstance.current = null;
    };
  }, [isOpen, userLocation]);

  // Dragging slider divider logic
  const handleMouseDown = () => {
    isDragging.current = true;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (!isOpen) return null;

  return (
    <div className="split-screen-modal-overlay">
      <div 
        ref={containerRef}
        className="split-screen-container"
        onTouchMove={handleTouchMove}
      >
        {/* Right Map Canvas (Modern Live Map, Full Width under clipping) */}
        <div ref={rightMapRef} className="split-map-canvas split-map-right" />

        {/* Left Map Canvas (Historical Atlas, Clipped by sliderPos) */}
        <div 
          className="split-map-left-wrapper"
          style={{ width: `${sliderPos}%` }}
        >
          <div ref={leftMapRef} className="split-map-canvas split-map-left" />
        </div>

        {/* Draggable Vertical Divider Bar with Golden Handle */}
        <div 
          className="split-screen-divider-bar"
          style={{ left: `${sliderPos}%` }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          <div className="split-divider-line" />
          <div className="split-divider-handle">
            <MoveHorizontal size={18} color="#180e09" />
          </div>
        </div>

        {/* Top Badges for Both Halves */}
        <div className="split-badge-left">
          <div className="split-badge-pill">
            <Clock size={13} color="#ffd166" />
            <span>Historical Atlas (735 CE)</span>
          </div>
        </div>

        <div className="split-badge-right">
          <div className="split-badge-pill">
            <Compass size={13} color="#ffd166" />
            <span>Modern World (2026)</span>
          </div>
        </div>

        {/* Top Control Bar with Close Button */}
        <div className="split-screen-top-bar">
          <div className="split-screen-title-group">
            <Layers size={16} color="#d4952b" />
            <span className="split-title-text">Then vs Now: Split-Screen Comparison</span>
            <span className="split-sub-text">Drag curtain left or right to compare</span>
          </div>

          <button 
            type="button"
            className="split-close-btn"
            onClick={onClose}
            title="Exit Split-Screen Mode"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
