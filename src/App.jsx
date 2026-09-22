import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapViewer } from './components/MapViewer';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { TimelineSlider } from './components/TimelineSlider';
import { PlaceConnectedHistoryModal } from './components/PlaceConnectedHistoryModal';
import { AIGuideDrawer } from './components/AIGuideDrawer';
import { StoriesDrawer } from './components/StoriesDrawer';
import { LivingCultureSection } from './components/LivingCultureSection';
import { KnowledgeGraphModal } from './components/KnowledgeGraphModal';
import { PeopleExplorerModal } from './components/PeopleExplorerModal';
import { WorksExplorerModal } from './components/WorksExplorerModal';
import { SplashScreen } from './components/SplashScreen';

import { PLACES } from './data/places';
import { TIMELINE_PERIODS, PERIODS } from './data/periods';
import { HISTORICAL_POLITIES } from './data/historicalPolities';
import { TRADE_ROUTES } from './data/tradeRoutes';
import { SOURCES } from './data/sources';
import { LIVING_CULTURE } from './data/livingCulture';
import { KNOWLEDGE_GRAPH } from './data/knowledgeGraph';
import { STORIES } from './data/stories';
import { TRANSLATIONS } from './data/translations';
import { HISTORICAL_PEOPLE } from './data/people';
import { LITERATURE_WORKS } from './data/works';

// Distance calculation utility (Haversine formula in km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function App() {
  // App Mode State ('live' = Modern world & nearby, 'historical' = Time-travel & boundaries)
  const [mapMode, setMapMode] = useState('live');
  // Timeline Period State ('today', 'later', 'medieval', 'post_sangam', 'sangam', 'pre_sangam')
  const [activePeriodId, setActivePeriodId] = useState('today');
  const [activeTab, setActiveTab] = useState('explore');
  const [currentLanguage, setCurrentLanguage] = useState('en');
  // App Initial Splash Loading Screen (1 Second Duration)
  const [showSplash, setShowSplash] = useState(true);

  const handleSetMapMode = (mode) => {
    setMapMode(mode);
    if (mode === 'live') {
      setActivePeriodId('today');
    } else {
      if (activePeriodId === 'today') {
        setActivePeriodId('medieval');
      }
    }
  };

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Modals & Drawers State
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [connectedHistoryPlace, setConnectedHistoryPlace] = useState(null);
  const [isCurrentLocationHistory, setIsCurrentLocationHistory] = useState(false);
  const [isAIGuideOpen, setIsAIGuideOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isCultureOpen, setIsCultureOpen] = useState(false);
  const [isGraphOpen, setIsGraphOpen] = useState(false);
  const [isPeopleOpen, setIsPeopleOpen] = useState(false);
  const [isWorksOpen, setIsWorksOpen] = useState(false);

  // Story Trail State
  const [activeStory, setActiveStory] = useState(null);
  const [activeStoryStopIndex, setActiveStoryStopIndex] = useState(0);

  // User Location State: Initiated on app mount to user's live GPS coordinates
  const [userLocation, setUserLocation] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(true);

  const translations = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;

  // Live GPS Geolocation Handler with Reverse Geocoding & Proximity Matching
  const handleDetectLocation = (openModalOnSuccess = false) => {
    setIsDetectingLocation(true);

    if (!navigator.geolocation) {
      console.warn('Geolocation is not supported by your browser.');
      fallbackToDefaultRegion();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Calculate distances to all heritage sites in database
        const sortedPlaces = PLACES.map(place => {
          const dist = calculateDistance(latitude, longitude, place.lat, place.lng);
          return {
            ...place,
            distanceKm: Math.round(dist)
          };
        }).sort((a, b) => a.distanceKm - b.distanceKm);

        const closestPlace = sortedPlaces[0];
        const nearbyPlaces = sortedPlaces.slice(0, 5);

        // Reverse geocoding via OpenStreetMap Nominatim with 3s timeout
        let detectedName = `Near ${closestPlace?.name || 'Heritage Site'}`;
        let detailedAddress = '';

        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const localArea = addr.suburb || addr.neighbourhood || addr.village || addr.town || addr.city_district || addr.city || addr.county;
            const region = addr.state_district || addr.state || '';
            if (localArea) {
              detectedName = `${localArea}${region ? ', ' + region : ''}`;
            } else if (data.display_name) {
              detectedName = data.display_name.split(',').slice(0, 2).join(',');
            }
            detailedAddress = data.display_name || '';
          }
        } catch (e) {
          console.log('Reverse geocode fallback to proximity:', e.message);
        }

        const newLoc = {
          name: detectedName,
          realAddress: detailedAddress,
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 100,
          isRealGPS: true,
          nearestPlaceId: closestPlace?.id,
          closestPlace: closestPlace,
          distanceKm: closestPlace?.distanceKm,
          nearbyPlaces: nearbyPlaces
        };

        setUserLocation(newLoc);
        setIsDetectingLocation(false);

        if (openModalOnSuccess && closestPlace) {
          setConnectedHistoryPlace(closestPlace);
          setIsCurrentLocationHistory(true);
        }
      },
      (error) => {
        console.warn('Live geolocation access error or denied:', error.message);
        fallbackToDefaultRegion();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0
      }
    );
  };

  const fallbackToDefaultRegion = () => {
    setIsDetectingLocation(false);
    const centerLat = 11.1271;
    const centerLng = 78.6569;
    const sortedPlaces = PLACES.map(place => {
      const dist = calculateDistance(centerLat, centerLng, place.lat, place.lng);
      return {
        ...place,
        distanceKm: Math.round(dist)
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);

    setUserLocation({
      name: 'Tamil Nadu Region (Live GPS Unavailable)',
      realAddress: 'Tamil Nadu, India',
      lat: centerLat,
      lng: centerLng,
      accuracy: 25000,
      isRealGPS: false,
      nearestPlaceId: sortedPlaces[0]?.id,
      closestPlace: sortedPlaces[0],
      distanceKm: sortedPlaces[0]?.distanceKm,
      nearbyPlaces: sortedPlaces.slice(0, 5)
    });
  };

  // Automatically request and point to live GPS location on app open
  useEffect(() => {
    handleDetectLocation(false);
  }, []);

  // Open Current Location History manually
  const handleOpenCurrentLocationHistory = () => {
    if (!userLocation) return;
    const targetPlace = PLACES.find(p => p.id === userLocation.nearestPlaceId) || PLACES[0];
    setConnectedHistoryPlace(targetPlace);
    setIsCurrentLocationHistory(true);
  };

  // Filtered Places for Map & Listing
  const filteredPlaces = useMemo(() => {
    return PLACES.filter(place => {
      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = place.name.toLowerCase().includes(q);
        const matchTamil = place.tamilName.includes(q);
        const matchClassical = place.classicalName?.toLowerCase().includes(q);
        const matchDistrict = place.district.toLowerCase().includes(q);
        const matchCat = place.categories.some(c => c.toLowerCase().includes(q));
        if (!matchName && !matchTamil && !matchClassical && !matchDistrict && !matchCat) {
          return false;
        }
      }

      // Category filter (when active)
      if (activeCategory !== 'all') {
        if (!place.categories.includes(activeCategory)) {
          return false;
        }
      }

      // Period filter (when historical period is selected on timeline)
      if (activePeriodId !== 'today') {
        if (!place.periods.includes(activePeriodId)) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, activeCategory, activePeriodId]);

  // When a place is clicked on the map, open its full connected history
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setConnectedHistoryPlace(place);
    setIsCurrentLocationHistory(false);
  };

  const handleSelectPlaceById = (placeId) => {
    const p = PLACES.find(item => item.id === placeId);
    if (p) {
      handleSelectPlace(p);
    }
  };

  return (
    <div className="app-shell" lang={currentLanguage}>
      {/* 1-Second Initial Splash Screen with Brand Logo */}
      {showSplash && (
        <SplashScreen 
          duration={1000} 
          onFinish={() => setShowSplash(false)} 
        />
      )}

      {/* Top Global Navigation Bar with GPS Locator */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentLanguage={currentLanguage}
        setCurrentLanguage={setCurrentLanguage}
        translations={translations}
        onOpenAIGuide={() => setIsAIGuideOpen(true)}
        onOpenKnowledgeGraph={() => setIsGraphOpen(true)}
        onOpenLivingCulture={() => setIsCultureOpen(true)}
        onOpenStories={() => setIsStoriesOpen(true)}
        onOpenPeople={() => setIsPeopleOpen(true)}
        onOpenWorks={() => setIsWorksOpen(true)}
        onDetectLocation={handleDetectLocation}
        isDetectingLocation={isDetectingLocation}
        userLocation={userLocation}
        onOpenCurrentLocationHistory={handleOpenCurrentLocationHistory}
        mapMode={mapMode}
        setMapMode={handleSetMapMode}
      />

      {/* Interactive Map Canvas & Floating Controls Viewport Wrapper */}
      <main className="map-viewport-wrapper">
        {/* Hero Leaflet Map Canvas */}
        <MapViewer
          places={filteredPlaces}
          polities={HISTORICAL_POLITIES}
          tradeRoutes={TRADE_ROUTES}
          selectedPlace={selectedPlace}
          onSelectPlace={handleSelectPlace}
          activePeriodId={activePeriodId}
          mapMode={mapMode}
          userLocation={userLocation}
          activeStory={activeStory}
          activeStoryStopIndex={activeStoryStopIndex}
          onOpenCurrentLocationHistory={handleOpenCurrentLocationHistory}
          onDetectLocation={handleDetectLocation}
          isDetectingLocation={isDetectingLocation}
        />

        {/* Floating Search & Filter Directory (Active in Live Map Mode) */}
        {mapMode === 'live' && (
          <SearchFilterPanel
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            translations={translations}
            placesCount={filteredPlaces.length}
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
          />
        )}

        {/* Interactive Unified Timeline Slider — ONLY rendered in Historical Map Mode */}
        {mapMode === 'historical' && (
          <TimelineSlider
            activePeriodId={activePeriodId}
            onPeriodChange={setActivePeriodId}
            translations={translations}
            currentLanguage={currentLanguage}
          />
        )}
      </main>

      {/* Signature Connected History Modal (Shows entire connected history for any place or current location) */}
      <PlaceConnectedHistoryModal
        place={connectedHistoryPlace}
        isUserCurrentLocation={isCurrentLocationHistory}
        userCoords={userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : null}
        userLocation={userLocation}
        onSelectNearbyPlace={(nearP) => setConnectedHistoryPlace(nearP)}
        onClose={() => setConnectedHistoryPlace(null)}
        translations={translations}
        sourcesRegistry={SOURCES}
        onOpenAIGuide={() => setIsAIGuideOpen(true)}
      />

      {/* Source-Grounded AI Heritage Guide Drawer */}
      <AIGuideDrawer
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        places={PLACES}
        periods={PERIODS}
        sourcesRegistry={SOURCES}
        onSelectPlace={handleSelectPlace}
        initialPlaceContext={selectedPlace}
        translations={translations}
      />

      {/* Curated Journeys & Story Trails Drawer */}
      <StoriesDrawer
        isOpen={isStoriesOpen}
        onClose={() => setIsStoriesOpen(false)}
        stories={STORIES}
        activeStory={activeStory}
        setActiveStory={setActiveStory}
        activeStoryStopIndex={activeStoryStopIndex}
        setActiveStoryStopIndex={setActiveStoryStopIndex}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />

      {/* Living Culture (Food, Crafts & Festivals) Drawer */}
      <LivingCultureSection
        isOpen={isCultureOpen}
        onClose={() => setIsCultureOpen(false)}
        livingCulture={LIVING_CULTURE}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />

      {/* Time-Aware Knowledge Graph Modal */}
      <KnowledgeGraphModal
        isOpen={isGraphOpen}
        onClose={() => setIsGraphOpen(false)}
        knowledgeGraph={KNOWLEDGE_GRAPH}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />

      {/* People Explorer Modal (Section 17) */}
      <PeopleExplorerModal
        isOpen={isPeopleOpen}
        onClose={() => setIsPeopleOpen(false)}
        people={HISTORICAL_PEOPLE}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />

      {/* Literature & Works Explorer Modal (Section 18) */}
      <WorksExplorerModal
        isOpen={isWorksOpen}
        onClose={() => setIsWorksOpen(false)}
        works={LITERATURE_WORKS}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />
    </div>
  );
}
