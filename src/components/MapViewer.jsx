import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Crosshair, Loader2, Navigation, Layers, Eye, EyeOff, ZoomIn, Sparkles } from 'lucide-react';
import { HISTORICAL_CITIES } from '../data/historicalPolities';

export const MapViewer = ({
  places,
  polities,
  tradeRoutes,
  selectedPlace,
  onSelectPlace,
  activePeriodId,
  mapMode = 'live',
  userLocation,
  activeStory,
  activeStoryStopIndex,
  onOpenCurrentLocationHistory,
  onDetectLocation,
  isDetectingLocation
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const politiesLayerRef = useRef(null);
  const tradeRoutesLayerRef = useRef(null);
  const storyRouteLayerRef = useRef(null);
  const userLocationLayerRef = useRef(null);
  const currentTileLayerRef = useRef(null);

  // Selected dynasty polity card (matching reference image top-left card)
  const [selectedPolity, setSelectedPolity] = useState(null);

  // Historical Map Base Tone: 'parchment' (Warm Antique Parchment) | 'slate' (Brightened Slate)
  const [mapTone, setMapTone] = useState('parchment');

  // Section 26 Zoom LOD States
  const [currentZoom, setCurrentZoom] = useState(7.5);
  const [isSmartLODActive, setIsSmartLODActive] = useState(true);

  const isHistorical = activePeriodId !== 'today';

  // Fly to user location automatically when live location is detected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation?.lat || !userLocation?.lng) return;

    map.flyTo([userLocation.lat, userLocation.lng], 12, {
      duration: 1.5
    });
  }, [userLocation?.lat, userLocation?.lng]);

  // When selected place changes externally (from Search, People, Works, or AI), fly to it
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace?.lat || !selectedPlace?.lng) return;

    map.flyTo([selectedPlace.lat, selectedPlace.lng], Math.max(map.getZoom(), 11), {
      duration: 1.2
    });
  }, [selectedPlace]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default to user's live position if already detected, or geographical center of Tamil Nadu
    const initialCenter = (userLocation?.lat && userLocation?.lng) 
      ? [userLocation.lat, userLocation.lng] 
      : [11.1271, 78.6569];
    const initialZoom = (userLocation?.lat && userLocation?.lng) ? 12 : 7.0;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: initialZoom,
      minZoom: 5.5,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Listen to zoom changes for Section 26 LOD
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom());
    });

    markersLayerRef.current = L.layerGroup().addTo(map);
    politiesLayerRef.current = L.layerGroup().addTo(map);
    tradeRoutesLayerRef.current = L.layerGroup().addTo(map);
    storyRouteLayerRef.current = L.layerGroup().addTo(map);
    userLocationLayerRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile Layer dynamically for Live vs Historical Map mode
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (currentTileLayerRef.current) {
      map.removeLayer(currentTileLayerRef.current);
    }

    if (isHistorical) {
      // Historical Mode: Reliable OpenStreetMap tiles with brightened cartographic filter
      const tileClass = mapTone === 'parchment' ? 'historical-parchment-tiles' : 'historical-antique-tiles';
      currentTileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | GeoThamizh Historical Atlas',
          maxZoom: 19,
          className: tileClass
        }
      ).addTo(map);
    } else {
      // Live Mode: OpenStreetMap with clean street network & modern landmarks
      currentTileLayerRef.current = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap | GeoThamizh',
          maxZoom: 19,
          className: 'live-osm-tiles'
        }
      ).addTo(map);
    }

    currentTileLayerRef.current.bringToBack();
  }, [isHistorical, mapTone]);

  // Update User Location Marker & Accuracy Ring
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocationLayerRef.current) return;

    userLocationLayerRef.current.clearLayers();

    if (userLocation && userLocation.lat && userLocation.lng) {
      const circle = L.circle([userLocation.lat, userLocation.lng], {
        radius: userLocation.accuracy || 2000,
        color: '#8F1D1D',
        fillColor: '#8F1D1D',
        fillOpacity: 0.08,
        weight: 1.5,
        dashArray: '4, 4'
      });

      const pulseIcon = L.divIcon({
        className: 'user-location-pin',
        html: `
          <div style="position: relative; width: 28px; height: 28px; cursor: pointer;">
            <!-- Outer radar pulse ring matching logo red & gold -->
            <div style="position: absolute; inset: -4px; border-radius: 50%; background: rgba(143, 29, 29, 0.45); animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <!-- Golden accent ring -->
            <div style="position: absolute; inset: 0px; border-radius: 50%; background: #D4952B; opacity: 0.6;"></div>
            <!-- Logo Terracotta Madder Red pin core with white dot matching logo geo pin -->
            <div style="position: absolute; inset: 2.5px; border-radius: 50%; background: #8F1D1D; border: 2.5px solid #FAF5EC; box-shadow: 0 0 10px rgba(143, 29, 29, 0.7); display: flex; align-items: center; justify-content: center;">
              <div style="width: 5px; height: 5px; border-radius: 50%; background: #FAF5EC;"></div>
            </div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([userLocation.lat, userLocation.lng], { icon: pulseIcon });

      marker.bindTooltip(`
        <div style="padding: 5px 8px; font-family: 'Outfit', sans-serif;">
          <div style="font-weight: 700; color: #ffd166; display: flex; align-items: center; gap: 4px;">
            <span>📍 Your Current Location</span>
          </div>
          <div style="font-size: 13px; font-weight: 600; color: #fff; margin-top: 2px;">${userLocation.name || 'Current Position'}</div>
          ${userLocation.distanceKm !== undefined ? `<div style="font-size: 11px; color: #95d5b2; margin-top: 2px;">Closest Heritage: <b>${userLocation.closestPlace?.name || ''}</b> (${userLocation.distanceKm} km away)</div>` : ''}
          <div style="font-size: 10.5px; color: #f2c76e; margin-top: 4px;">Click to explore connected history</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -14]
      });

      marker.on('click', () => {
        if (onOpenCurrentLocationHistory) {
          onOpenCurrentLocationHistory();
        }
      });

      userLocationLayerRef.current.addLayer(circle);
      userLocationLayerRef.current.addLayer(marker);
    }
  }, [userLocation, onOpenCurrentLocationHistory]);

  // Render Place Markers based on active period & filters
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current) return;

    markersLayerRef.current.clearLayers();

    // Filter places based on timeline period & Section 26 Zoom LOD
    const visiblePlaces = places.filter(place => {
      if (isHistorical && !place.periods.includes(activePeriodId)) {
        return false;
      }
      // In historical mode at macro zoom (< 8), declutter kingdom territories like reference atlas
      if (isHistorical && currentZoom < 8 && selectedPlace?.id !== place.id) {
        return false;
      }
      if (!isSmartLODActive) return true;
      if (selectedPlace?.id === place.id) return true;

      const tier = place.zoomTier || 'macro';
      if (currentZoom < 8) {
        return tier === 'macro';
      } else if (currentZoom <= 10.5) {
        return tier === 'macro' || tier === 'regional';
      } else {
        return true;
      }
    });

    visiblePlaces.forEach(place => {
      const isSelected = selectedPlace?.id === place.id;
      
      let pinColor = '#b24a3b';
      if (place.categories.includes('archaeology')) pinColor = '#d48806';
      else if (place.categories.includes('temples')) pinColor = '#722ed1';
      else if (place.categories.includes('crafts') || place.categories.includes('food_culture')) pinColor = '#1f7a8c';

      const customIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `
          <div style="
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50% 50% 50% 0;
            transform: rotate(-45deg);
            background: ${pinColor};
            border: 2px solid ${isSelected ? '#ffd166' : '#f5f2eb'};
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          ">
            <span style="
              transform: rotate(45deg);
              font-family: 'Noto Sans Tamil', serif;
              font-size: ${isSelected ? '14px' : '12px'};
              font-weight: 700;
              color: #fff;
            ">${place.tamilName ? place.tamilName.charAt(0) : 'த'}</span>
          </div>
        `,
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 38 : 32]
      });

      const marker = L.marker([place.lat, place.lng], { icon: customIcon });

      const tooltipContent = `
        <div style="padding: 4px 6px; font-family: 'Outfit', sans-serif;">
          <div style="font-weight: 700; font-size: 13px; color: #fff;">${place.name}</div>
          <div style="font-family: 'Noto Sans Tamil', sans-serif; font-size: 12px; color: #ffd166;">${place.tamilName}</div>
          <div style="font-size: 11px; color: #a89f91; margin-top: 2px;">
            ${isHistorical ? `Classical: <b>${place.classicalName}</b>` : place.shortDescription.slice(0, 75) + '...'}
          </div>
          <div style="font-size: 10px; color: #ffd166; margin-top: 2px;">Click to view full connected history ➔</div>
        </div>
      `;

      marker.bindTooltip(tooltipContent, {
        direction: 'top',
        offset: [0, -25]
      });

      marker.on('click', () => {
        onSelectPlace(place);
      });

      markersLayerRef.current.addLayer(marker);
    });
  }, [places, isHistorical, activePeriodId, selectedPlace, onSelectPlace, currentZoom, isSmartLODActive]);

  // Automatically sync selected polity when switching eras
  useEffect(() => {
    if (isHistorical) {
      const active = polities.filter(p => p.periodId === activePeriodId);
      if (active.length > 0) {
        const preferred = active.find(p => p.id.includes('pallava')) || active[0];
        setSelectedPolity(preferred);
      } else {
        setSelectedPolity(null);
      }
    } else {
      setSelectedPolity(null);
    }
  }, [isHistorical, activePeriodId, polities]);

  // Render Historical Dynastic Polities & Reference Historical Cities
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !politiesLayerRef.current) return;

    politiesLayerRef.current.clearLayers();

    if (isHistorical) {
      const activePolities = polities.filter(p => p.periodId === activePeriodId);

      activePolities.forEach(polity => {
        const isSelected = selectedPolity?.id === polity.id;
        const boundaryColor = isSelected ? '#3f3832' : (polity.borderColor || '#79736c');
        const boundaryWeight = isSelected ? 3.0 : 2.2;

        // 1. Shaded Contiguous Territorial Polygon with authentic atlas boundary lines (matching user reference image)
        const polygon = L.polygon(polity.polygon, {
          color: boundaryColor,
          weight: boundaryWeight,
          opacity: 1.0,
          fillColor: polity.color,
          fillOpacity: isSelected ? Math.min(0.85, (polity.fillOpacity || 0.72) + 0.08) : (polity.fillOpacity || 0.72),
          smoothFactor: 1.0,
          className: `historical-polity-boundary ${isSelected ? 'is-selected' : ''} ${polity.id}`
        });

        polygon.bindTooltip(`
          <div style="padding: 6px 8px; font-family: 'Outfit', sans-serif;">
            <b style="color: #ffd166; font-size: 13.5px; display: block; margin-bottom: 2px;">${polity.name} (${polity.dates})</b>
            <div style="font-family: 'Noto Sans Tamil'; font-size: 12px; color: #ffd166; font-weight: 600;">${polity.tamilName}</div>
            <div style="font-size: 11px; color: #eee; margin-top: 4px;">Imperial Seat: <b>${polity.capital}</b></div>
            <div style="font-size: 11px; color: #ccc; margin-top: 2px;">Dynasty: <b>${polity.rulingDynasty}</b></div>
            <div style="font-size: 10.5px; color: #ffab91; font-style: italic; margin-top: 4px; line-height: 1.3;">${polity.notes}</div>
          </div>
        `, { sticky: true, opacity: 0.95 });

        // Clicking a territory selects that dynasty in the top-left card
        polygon.on('click', () => {
          setSelectedPolity(polity);
        });

        politiesLayerRef.current.addLayer(polygon);

        // Ensure clean, solid vector boundary line matching reference picture (no drop-shadow, no blur)
        const pathEl = polygon.getElement();
        if (pathEl) {
          pathEl.style.filter = 'none';
          pathEl.style.stroke = boundaryColor;
          pathEl.style.strokeWidth = `${boundaryWeight}px`;
        }

        // On hover, clean cartographic line highlight (no neon)
        polygon.on('mouseover', () => {
          const el = polygon.getElement();
          if (el) {
            el.style.stroke = '#3a342e';
            el.style.strokeWidth = '3.0px';
            el.style.filter = 'none';
          }
        });

        polygon.on('mouseout', () => {
          const isStillSelected = selectedPolity?.id === polity.id;
          const el = polygon.getElement();
          if (el) {
            el.style.stroke = isStillSelected ? '#3f3832' : (polity.borderColor || '#79736c');
            el.style.strokeWidth = isStillSelected ? '3.0px' : '2.2px';
            el.style.filter = 'none';
          }
        });

        // 2. Permanent In-Map Dynasty Royal Flag Banner & Text Label (matching user reference image)
        if (polity.center && polity.center.length === 2) {
          const isPandyaFlag = Boolean(polity.hasRoyalFlag);
          const labelIcon = L.divIcon({
            className: 'dynasty-div-icon',
            iconSize: [180, 56],
            iconAnchor: [90, 28],
            html: `
              <div class="dynasty-map-label ${isSelected ? 'is-selected' : ''}">
                ${isPandyaFlag ? `
                  <div class="pandya-swallowtail-flag">
                    <svg width="34" height="24" viewBox="0 0 34 24" fill="none">
                      <!-- Golden Flag Pole -->
                      <line x1="4" y1="2" x2="4" y2="23" stroke="#f6c343" stroke-width="2.2" stroke-linecap="round"/>
                      <!-- Swallowtail Double Pennant -->
                      <path d="M5 3 L32 3 L23 8.5 L32 14 L5 14 Z" fill="#ffd166" stroke="#c49016" stroke-width="1.2" />
                      <!-- Twin Fish Emblem -->
                      <text x="14" y="11" font-size="7.5" fill="#593a00" font-weight="900" text-anchor="middle">🐟🐟</text>
                    </svg>
                  </div>
                ` : ''}
                <div class="dynasty-name-text" style="${isSelected ? 'color: #fff; text-shadow: 0 0 6px #000, 0 2px 8px #000;' : ''}">${polity.name}</div>
                <div class="dynasty-dates-text">${polity.dates}</div>
              </div>
            `
          });

          const labelMarker = L.marker(polity.center, {
            icon: labelIcon,
            interactive: false,
            zIndexOffset: -50
          });

          politiesLayerRef.current.addLayer(labelMarker);
        }
      });

      // 3. Render Historical Reference Cities matching the reference image (e.g. • Madurai, Salem, Puducherry)
      HISTORICAL_CITIES.forEach(city => {
        const cityIcon = L.divIcon({
          className: 'historical-city-div-icon',
          iconSize: [110, 20],
          iconAnchor: [55, 10],
          html: `
            <div class="historical-map-city-label ${city.isCapital ? 'is-capital' : ''}">
              ${city.isCapital ? '<span class="city-dot">●</span> ' : ''}${city.name}
            </div>
          `
        });

        const cityMarker = L.marker([city.lat, city.lng], {
          icon: cityIcon,
          interactive: false,
          zIndexOffset: 120
        });

        politiesLayerRef.current.addLayer(cityMarker);
      });
    }
  }, [isHistorical, polities, activePeriodId, selectedPolity]);

  // Render Ancient Trade Routes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tradeRoutesLayerRef.current) return;

    tradeRoutesLayerRef.current.clearLayers();

    if (isHistorical) {
      const activeRoutes = tradeRoutes.filter(r => r.periodId === activePeriodId);

      activeRoutes.forEach(route => {
        const polyline = L.polyline(route.path, {
          color: route.color,
          weight: 3.5,
          dashArray: route.dashArray,
          opacity: 0.85
        });

        polyline.bindTooltip(`
          <div style="padding: 4px 6px; font-family: 'Outfit', sans-serif;">
            <b style="color: ${route.color}; font-size: 12px;">${route.name}</b>
            <div style="font-family: 'Noto Sans Tamil'; font-size: 11px; color: #ffd166;">${route.tamilName}</div>
            <div style="font-size: 10px; color: #ccc; margin-top: 2px;">${route.type} • Connects: ${route.connects}</div>
          </div>
        `, { sticky: true });

        tradeRoutesLayerRef.current.addLayer(polyline);
      });
    }
  }, [isHistorical, tradeRoutes, activePeriodId]);

  // Render Active Guided Story Trail
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !storyRouteLayerRef.current) return;

    storyRouteLayerRef.current.clearLayers();

    if (activeStory) {
      const stops = activeStory.stops;
      const stopCoords = stops.map(stop => {
        const p = places.find(place => place.id === stop.placeId);
        return p ? [p.lat, p.lng] : null;
      }).filter(Boolean);

      if (stopCoords.length > 1) {
        const storyLine = L.polyline(stopCoords, {
          color: '#d4a359',
          weight: 4,
          dashArray: '8, 8',
          opacity: 0.95
        });
        storyRouteLayerRef.current.addLayer(storyLine);
      }

      const currentStop = stops[activeStoryStopIndex];
      if (currentStop) {
        const currentPlace = places.find(p => p.id === currentStop.placeId);
        if (currentPlace) {
          map.flyTo([currentPlace.lat, currentPlace.lng], 10, {
            duration: 1.2
          });
        }
      }
    }
  }, [activeStory, activeStoryStopIndex, places]);

  // Smooth Pan to Selected Place
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedPlace) return;

    map.flyTo([selectedPlace.lat, selectedPlace.lng], 11, {
      duration: 1.0
    });
  }, [selectedPlace]);

  // Determine current LOD description
  const lodTierDescription = currentZoom < 8 
    ? 'Macro: Capitals, Ports & Polities' 
    : currentZoom <= 10.5 
      ? 'Regional: Temples, Forts & Towns' 
      : 'Detailed: Excavations & Craft Shrines';

  // Year Pill Number matching reference image
  const getYearBadgeDisplay = () => {
    switch (activePeriodId) {
      case 'pre_sangam':
        return '2172 BCE';
      case 'sangam':
        return '300 BCE';
      case 'post_sangam':
        return '450 CE';
      case 'medieval':
        return '735'; // Exact number from user's reference image
      case 'later':
        return '1636';
      default:
        return '2026';
    }
  };

  return (
    <div className={`map-canvas-container ${mapMode === 'historical' ? 'is-historical-mode' : 'is-live-mode'}`}>
      <div ref={mapContainerRef} className="leaflet-map-host" />

      {/* Top-Left Selected Dynasty Header Card (Matching User Reference Image) */}
      {isHistorical && selectedPolity && (
        <div 
          className="dynasty-floating-card"
          style={{
            borderColor: 'var(--terracotta)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 12px rgba(143, 29, 29, 0.4)'
          }}
        >
          <button 
            type="button"
            className="dynasty-floating-card-back" 
            onClick={() => setSelectedPolity(null)}
            title="Deselect"
            aria-label="Back"
          >
            ‹
          </button>
          <div className="dynasty-floating-card-info">
            <div className="dynasty-floating-card-name" style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span>{selectedPolity.name}</span>
              <span 
                className="dynasty-pulse-dot" 
                style={{ 
                  backgroundColor: '#8F1D1D',
                  boxShadow: '0 0 6px rgba(143, 29, 29, 0.7)' 
                }} 
                title="Active Dynasty" 
              />
            </div>
            <div className="dynasty-floating-card-dates">({selectedPolity.dates})</div>
          </div>
          <div 
            className="dynasty-floating-card-thumb"
            style={{
              borderColor: 'var(--gold-primary)',
              boxShadow: '0 0 6px rgba(212, 149, 43, 0.3)'
            }}
          >
            <img 
              src={selectedPolity.thumbImage || "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=400&q=80"} 
              alt={selectedPolity.name} 
            />
          </div>
        </div>
      )}

      {/* Section 26: Floating Zoom-Based Discovery & LOD Decluttering Badge */}
      <div className="zoom-lod-badge-panel" style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        zIndex: 500,
        background: 'rgba(28, 16, 11, 0.92)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(212, 149, 43, 0.35)',
        borderRadius: '24px',
        padding: '6px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        fontSize: '11.5px',
        color: '#e5ded5'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Layers size={13} color="#d4a359" />
          <span style={{ color: '#d4a359', fontWeight: 600 }}>Zoom {currentZoom.toFixed(1)}</span>
          <span style={{ color: '#888' }}>•</span>
          <span style={{ color: '#ffd166' }}>{lodTierDescription}</span>
        </div>

        {isHistorical && (
          <button
            onClick={() => setMapTone(mapTone === 'slate' ? 'parchment' : 'slate')}
            style={{
              background: mapTone === 'parchment' ? 'rgba(212, 149, 43, 0.25)' : 'rgba(143, 29, 29, 0.25)',
              border: '1px solid',
              borderColor: mapTone === 'parchment' ? 'rgba(212, 149, 43, 0.65)' : 'rgba(143, 29, 29, 0.65)',
              color: mapTone === 'parchment' ? '#ffd166' : '#f8b4b4',
              borderRadius: '12px',
              padding: '2px 8px',
              fontSize: '10.5px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
            title="Toggle Historical Map Tone: Bright Slate or Warm Parchment"
          >
            <span>{mapTone === 'slate' ? '🗺️ Slate' : '📜 Parchment'}</span>
          </button>
        )}

        <button
          onClick={() => setIsSmartLODActive(!isSmartLODActive)}
          style={{
            background: isSmartLODActive ? 'rgba(75, 102, 47, 0.25)' : 'rgba(143, 29, 29, 0.25)',
            border: '1px solid',
            borderColor: isSmartLODActive ? 'rgba(75, 102, 47, 0.6)' : 'rgba(143, 29, 29, 0.5)',
            color: isSmartLODActive ? '#95d5b2' : '#fca5a5',
            borderRadius: '12px',
            padding: '2px 8px',
            fontSize: '10.5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
          title="Toggle Section 26 Smart Level-of-Detail Decluttering"
        >
          {isSmartLODActive ? <Eye size={11} /> : <EyeOff size={11} />}
          <span>{isSmartLODActive ? 'Smart LOD: ON' : 'All Sites: ON'}</span>
        </button>
      </div>

      {/* Floating Terracotta Year Pill Badge (Matching User Reference Image) */}
      {isHistorical && (
        <div className="historical-year-floating-badge" title="Active Historical Era Year">
          <span className="year-badge-text">{getYearBadgeDisplay()}</span>
        </div>
      )}

      {/* Floating Live Location Button in Bottom Right Corner (Matching Logo Red & Gold) */}
      <button
        className={`gmaps-locate-fab ${isDetectingLocation ? 'detecting' : ''}`}
        onClick={onDetectLocation}
        title="Your Current Location (Live GPS)"
        aria-label="Detect current location"
        style={{
          borderColor: userLocation?.isRealGPS ? 'var(--terracotta)' : 'var(--gold-primary)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.5), 0 0 12px rgba(143, 29, 29, 0.4)'
        }}
      >
        {isDetectingLocation ? (
          <Loader2 size={22} className="spin-icon" color="#D4952B" />
        ) : (
          <Crosshair size={22} color={userLocation?.isRealGPS ? '#8F1D1D' : '#D4952B'} />
        )}
      </button>
    </div>
  );
};
