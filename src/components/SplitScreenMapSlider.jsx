import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { X, Layers, Compass, Clock, MoveHorizontal, Plus, Minus, MapPin } from 'lucide-react';
import { HISTORICAL_POLITIES } from '../data/historicalPolities';
import { PLACES } from '../data/places';

export const SplitScreenMapSlider = ({ 
  isOpen, 
  onClose, 
  userLocation,
  places = PLACES,
  translations 
}) => {
  const containerRef = useRef(null);
  const leftMapRef = useRef(null);
  const rightMapRef = useRef(null);
  const leftMapInstance = useRef(null);
  const rightMapInstance = useRef(null);
  const isSyncing = useRef(false);

  const [sliderPos, setSliderPos] = useState(50); // percentage 0 - 100
  const isDragging = useRef(false);

  // Quick navigation sites
  const QUICK_CITIES = [
    { name: 'Thanjavur', coords: [10.7828, 79.1318], zoom: 12 },
    { name: 'Madurai', coords: [9.9195, 78.1193], zoom: 12 },
    { name: 'Mamallapuram', coords: [12.6208, 80.1944], zoom: 13 },
    { name: 'Keeladi', coords: [9.8631, 78.1887], zoom: 13 },
    { name: 'Kanchipuram', coords: [12.8342, 79.7036], zoom: 12 }
  ];

  // Initialize both synchronized maps
  useEffect(() => {
    if (!isOpen) return;

    // Small delay to ensure container DOM is measured and rendered
    const initTimer = setTimeout(() => {
      if (!leftMapRef.current || !rightMapRef.current) return;

      // Clean up previous instances if any
      if (leftMapInstance.current) {
        try { leftMapInstance.current.remove(); } catch (e) {}
        leftMapInstance.current = null;
      }
      if (rightMapInstance.current) {
        try { rightMapInstance.current.remove(); } catch (e) {}
        rightMapInstance.current = null;
      }

      const initialCenter = userLocation ? [userLocation.lat, userLocation.lng] : [10.7828, 79.1318];
      const initialZoom = 9;

      // 1. Right Map (Modern World - Base Layer)
      const mapR = L.map(rightMapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      }).addTo(mapR);

      // Add modern site markers to right map
      places.forEach(place => {
        const markerIcon = L.divIcon({
          className: 'split-modern-marker',
          html: `<div style="background: #182830; border: 1.5px solid #09bc8a; color: #80ed99; padding: 2px 7px; border-radius: 10px; font-size: 10.5px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">📍 ${place.name.split(' (')[0]}</div>`,
          iconSize: [100, 22],
          iconAnchor: [50, 11]
        });
        L.marker([place.lat, place.lng], { icon: markerIcon }).addTo(mapR);
      });

      // 2. Left Map (Historical Atlas - Clipped Overlay)
      const mapL = L.map(leftMapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        minZoom: 5,
        maxZoom: 18,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        className: 'historical-parchment-tiles',
        maxZoom: 19
      }).addTo(mapL);

      // Add 735 CE Medieval Polities to historical left map
      const medievalPolities = HISTORICAL_POLITIES.filter(p => p.periodId === 'medieval');
      medievalPolities.forEach(p => {
        L.polygon(p.polygon, {
          color: '#8f1d1d',
          weight: 2.5,
          opacity: 0.9,
          fillColor: p.color,
          fillOpacity: 0.45,
          dashArray: '4, 4'
        }).addTo(mapL);

        if (p.center && p.center.length === 2) {
          const label = L.divIcon({
            className: 'dynasty-div-icon',
            html: `<div style="background: rgba(28, 16, 11, 0.9); border: 1px solid #d4952b; color: #ffd166; padding: 3px 8px; border-radius: 6px; font-size: 11px; font-weight: bold; text-align: center; box-shadow: 0 3px 10px rgba(0,0,0,0.7);"><div style="color: #ffd166;">${p.name}</div><div style="font-size: 9px; color: #aaa;">(${p.dates})</div></div>`,
            iconSize: [140, 36],
            iconAnchor: [70, 18]
          });
          L.marker(p.center, { icon: label, interactive: false }).addTo(mapL);
        }
      });

      // Add classical names to historical left map
      places.forEach(place => {
        const markerIcon = L.divIcon({
          className: 'split-hist-marker',
          html: `<div style="background: #24140b; border: 1.5px solid #d4952b; color: #ffd166; padding: 2px 7px; border-radius: 10px; font-size: 10.5px; font-weight: 700; white-space: nowrap; box-shadow: 0 2px 6px rgba(0,0,0,0.6);">🏛️ ${place.classicalName ? place.classicalName.split('/')[0].trim() : place.name.split(' (')[0]}</div>`,
          iconSize: [110, 22],
          iconAnchor: [55, 11]
        });
        L.marker([place.lat, place.lng], { icon: markerIcon }).addTo(mapL);
      });

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

      // Invalidate sizes after rendering
      setTimeout(() => {
        mapL.invalidateSize();
        mapR.invalidateSize();
      }, 200);
    }, 100);

    return () => {
      clearTimeout(initTimer);
      if (leftMapInstance.current) {
        try { leftMapInstance.current.remove(); } catch (e) {}
        leftMapInstance.current = null;
      }
      if (rightMapInstance.current) {
        try { rightMapInstance.current.remove(); } catch (e) {}
        rightMapInstance.current = null;
      }
    };
  }, [isOpen]);

  // Handle window resizing to keep maps aligned
  useEffect(() => {
    if (!isOpen) return;
    const handleResize = () => {
      if (leftMapInstance.current) leftMapInstance.current.invalidateSize();
      if (rightMapInstance.current) rightMapInstance.current.invalidateSize();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  // Dragging slider divider logic
  const handleMouseDown = (e) => {
    e.preventDefault();
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
    if (!isDragging.current && e.type !== 'touchmove') return;
    if (!containerRef.current || !e.touches || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSliderPos(pct);
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    const onWindowTouchMove = (e) => {
      if (isDragging.current) {
        handleTouchMove(e);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', onWindowTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', onWindowTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Quick jump to city
  const handleJumpToCity = (city) => {
    if (leftMapInstance.current && rightMapInstance.current) {
      leftMapInstance.current.flyTo(city.coords, city.zoom, { duration: 1 });
    }
  };

  // Synchronized Zoom Controls
  const handleZoomIn = () => {
    if (leftMapInstance.current) leftMapInstance.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (leftMapInstance.current) leftMapInstance.current.zoomOut();
  };

  if (!isOpen) return null;

  return (
    <div className="split-screen-modal-overlay" onClick={onClose}>
      <div 
        className="split-screen-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="split-screen-header">
          <div className="split-screen-header-left">
            <div className="split-screen-badge-icon">
              <Layers size={18} />
            </div>
            <div>
              <div className="split-screen-title-text">
                Then vs Now: Historical Split-Screen Slider
              </div>
              <div className="split-screen-sub-text">
                Ancient Imperial Polities (735 CE) vs Modern Satellite Reality (2026)
              </div>
            </div>
          </div>

          {/* Quick Jump Pills */}
          <div className="split-city-jumps-row">
            <span style={{ fontSize: '11px', color: '#aaa', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <MapPin size={11} color="#d4952b" /> Jump:
            </span>
            {QUICK_CITIES.map(c => (
              <button
                key={c.name}
                type="button"
                className="split-city-jump-btn"
                onClick={() => handleJumpToCity(c)}
              >
                {c.name}
              </button>
            ))}
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

        {/* Dual Map Curtain Canvas Container */}
        <div 
          ref={containerRef}
          className="split-screen-canvas-container"
          onTouchMove={handleTouchMove}
        >
          {/* Base Layer: Modern Live Map (Full 100% x 100%) */}
          <div 
            ref={rightMapRef} 
            className="split-map-canvas split-map-modern"
          />

          {/* Overlay Layer: Historical Atlas (Exact 100% x 100%, Clipped by Polygon) */}
          <div 
            ref={leftMapRef} 
            className="split-map-canvas split-map-historical"
            style={{
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
              WebkitClipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`
            }}
          />

          {/* Draggable Curtain Vertical Divider Bar */}
          <div 
            className="split-curtain-divider"
            style={{ left: `${sliderPos}%` }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="split-curtain-handle">
              <MoveHorizontal size={18} />
            </div>
          </div>

          {/* Floating Era Badges */}
          <div className="split-banner-left">
            <Clock size={13} color="#ffd166" />
            <span>📜 Historical Atlas (735 CE Chola-Pandya)</span>
          </div>

          <div className="split-banner-right">
            <Compass size={13} color="#80ed99" />
            <span>🗺️ Modern World (Present 2026)</span>
          </div>

          {/* Floating Zoom Controls (+ / -) */}
          <div className="split-zoom-controls">
            <button 
              type="button" 
              className="split-zoom-btn" 
              onClick={handleZoomIn}
              title="Zoom In"
            >
              <Plus size={16} />
            </button>
            <button 
              type="button" 
              className="split-zoom-btn" 
              onClick={handleZoomOut}
              title="Zoom Out"
            >
              <Minus size={16} />
            </button>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="split-screen-footer-hint">
          <span>👈 Drag the golden curtain bar left or right to reveal ancient geography vs contemporary landscapes</span>
        </div>
      </div>
    </div>
  );
};
