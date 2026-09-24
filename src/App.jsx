import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { MapViewer } from './components/MapViewer';
import { SearchFilterPanel } from './components/SearchFilterPanel';
import { TimelineSlider } from './components/TimelineSlider';
import { PlaceConnectedHistoryModal } from './components/PlaceConnectedHistoryModal';
import { AIChatbotDrawer, AIChatbotFloatingButton } from './components/AIChatbot';
import { StoriesDrawer } from './components/StoriesDrawer';
import { LivingCultureSection } from './components/LivingCultureSection';
import { KnowledgeGraphModal } from './components/KnowledgeGraphModal';
import { PeopleAndLiteratureModal } from './components/PeopleAndLiteratureModal';
import { SplashScreen } from './components/SplashScreen';
import { SplitScreenMapSlider } from './components/SplitScreenMapSlider';
import { AudioHeritageGuideModal } from './components/AudioHeritageGuideModal';
import { ItineraryPlannerModal } from './components/ItineraryPlannerModal';
import { TodayInHistoryModal } from './components/TodayInHistoryModal';
import { SocialShareCardModal } from './components/SocialShareCardModal';
import { TouristSOSModal } from './components/TouristSOSModal';
import { HeritageChroniclesModal } from './components/HeritageChroniclesModal';
import { LoginModal } from './components/LoginModal';

import { PLACES } from './data/places';
import { TIMELINE_PERIODS, PERIODS } from './data/periods';
import { HISTORICAL_POLITIES } from './data/historicalPolities';
import { TRADE_ROUTES } from './data/tradeRoutes';
import { MARITIME_ROUTES } from './data/maritimeRoutes';
import { CURATED_ITINERARIES } from './data/itineraries';
import { DAILY_HISTORY } from './data/dailyHistory';
import { SOURCES } from './data/sources';
import { LIVING_CULTURE } from './data/livingCulture';
import { KNOWLEDGE_GRAPH } from './data/knowledgeGraph';
import { STORIES } from './data/stories';
import { TRANSLATIONS } from './data/translations';
import { HISTORICAL_PEOPLE } from './data/people';
import { LITERATURE_WORKS } from './data/works';
import { INSCRIPTIONS } from './data/inscriptions';

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

  // User Profile & Authentication State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('geothamizh_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [currentLanguage, setCurrentLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('geothamizh_user');
      if (saved) {
        const u = JSON.parse(saved);
        if (u && u.preferredLanguage) return u.preferredLanguage;
      }
    } catch (e) {}
    return 'en';
  });

  const handleSaveUser = (userData) => {
    setCurrentUser(userData);
    try {
      localStorage.setItem('geothamizh_user', JSON.stringify(userData));
    } catch (e) {}
    if (userData.preferredLanguage) {
      setCurrentLanguage(userData.preferredLanguage);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('geothamizh_user');
    } catch (e) {}
  };

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
  const [isPeopleLiteratureOpen, setIsPeopleLiteratureOpen] = useState(false);
  const [peopleLiteratureTab, setPeopleLiteratureTab] = useState('people');
  const [isSplitScreenOpen, setIsSplitScreenOpen] = useState(false);
  const [isAudioGuideOpen, setIsAudioGuideOpen] = useState(false);
  const [activeAudioPlace, setActiveAudioPlace] = useState(null);
  const [isItinerariesOpen, setIsItinerariesOpen] = useState(false);
  const [isTodayHistoryOpen, setIsTodayHistoryOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [activeSharePlace, setActiveSharePlace] = useState(null);
  const [isSosOpen, setIsSosOpen] = useState(false);

  // Consolidated Heritage Chronicles Hub State
  const [isChroniclesOpen, setIsChroniclesOpen] = useState(false);
  const [chroniclesTab, setChroniclesTab] = useState('itineraries');

  const handleOpenChronicles = (tab = 'itineraries') => {
    setChroniclesTab(tab);
    setIsChroniclesOpen(true);
  };

  // Story Trail State
  const [activeStory, setActiveStory] = useState(null);
  const [activeStoryStopIndex, setActiveStoryStopIndex] = useState(0);

  // Handlers for Audio Guide and Share Card
  const handleOpenAudioGuide = (place) => {
    setActiveAudioPlace(place || selectedPlace || PLACES[0]);
    setIsAudioGuideOpen(true);
  };

  const handleOpenShareCard = (place) => {
    setActiveSharePlace(place || selectedPlace || PLACES[0]);
    setIsShareCardOpen(true);
  };

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
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenAIGuide={() => setIsAIGuideOpen(true)}
        onOpenKnowledgeGraph={() => setIsGraphOpen(true)}
        onOpenLivingCulture={() => handleOpenChronicles('culture')}
        onOpenStories={() => handleOpenChronicles('stories')}
        onOpenPeopleAndLiterature={() => {
          setPeopleLiteratureTab('people');
          setIsPeopleLiteratureOpen(true);
        }}
        onOpenPeople={() => {
          setPeopleLiteratureTab('people');
          setIsPeopleLiteratureOpen(true);
        }}
        onOpenWorks={() => {
          setPeopleLiteratureTab('works');
          setIsPeopleLiteratureOpen(true);
        }}
        onOpenChronicles={handleOpenChronicles}
        onOpenItineraries={() => handleOpenChronicles('itineraries')}
        onOpenTodayInHistory={() => handleOpenChronicles('today')}
        onOpenSplitScreen={() => setIsSplitScreenOpen(true)}
        onOpenAudioGuide={() => handleOpenAudioGuide(selectedPlace)}
        onOpenShareCard={() => handleOpenShareCard(selectedPlace)}
        onOpenSOS={() => setIsSosOpen(true)}
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
          onOpenSplitScreen={() => setIsSplitScreenOpen(true)}
          onOpenAudioGuide={handleOpenAudioGuide}
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
        onOpenAIGuide={(targetP) => {
          if (targetP) setSelectedPlace(targetP);
          setIsAIGuideOpen(true);
        }}
        onOpenAudioGuide={() => handleOpenAudioGuide(connectedHistoryPlace)}
        onOpenShareCard={() => handleOpenShareCard(connectedHistoryPlace)}
      />

      {/* Floating AI Guide Trigger Button */}
      <AIChatbotFloatingButton onClick={() => setIsAIGuideOpen(true)} />

      {/* Production-Grade AI Heritage Guide Drawer */}
      <AIChatbotDrawer
        isOpen={isAIGuideOpen}
        onClose={() => setIsAIGuideOpen(false)}
        places={PLACES}
        people={HISTORICAL_PEOPLE}
        works={LITERATURE_WORKS}
        inscriptions={INSCRIPTIONS}
        sourcesRegistry={SOURCES}
        onSelectPlace={handleSelectPlace}
        onOpenPlaceDetails={handleSelectPlace}
        onShowJourney={(routeData) => {
          if (routeData && routeData.stops && routeData.stops.length > 0) {
            const firstStop = PLACES.find(p => p.id === routeData.stops[0].id) || PLACES[0];
            handleSelectPlace(firstStop);
          }
        }}
        onSelectPeriod={(periodId) => {
          setMapMode('historical');
          setActivePeriodId(periodId);
        }}
        onOpenPeople={(personId) => {
          setPeopleLiteratureTab('people');
          setIsPeopleLiteratureOpen(true);
        }}
        initialPlaceContext={selectedPlace}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        translations={translations}
        groqApiKey={import.meta.env.VITE_GROQ_API_KEY}
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

      {/* Unified People & Literature Explorer Modal */}
      <PeopleAndLiteratureModal
        isOpen={isPeopleLiteratureOpen}
        onClose={() => setIsPeopleLiteratureOpen(false)}
        people={HISTORICAL_PEOPLE}
        works={LITERATURE_WORKS}
        initialSubTab={peopleLiteratureTab}
        onSelectPlaceById={handleSelectPlaceById}
        translations={translations}
      />

      {/* Unified Tamil Heritage Chronicles Hub (1-Day Circuits, Today in History, Story Trails & Living Culture) */}
      <HeritageChroniclesModal
        isOpen={isChroniclesOpen}
        onClose={() => setIsChroniclesOpen(false)}
        initialTab={chroniclesTab}
        onSelectPlaceById={handleSelectPlaceById}
        onSelectPlaceOnMap={handleSelectPlaceById}
        userLocation={userLocation}
        onStartStory={(story) => {
          setActiveStory(story);
          setActiveStoryStopIndex(0);
          setIsChroniclesOpen(false);
        }}
        translations={translations}
      />

      {/* Feature 2: Then vs Now Split-Screen Slider */}
      <SplitScreenMapSlider
        isOpen={isSplitScreenOpen}
        onClose={() => setIsSplitScreenOpen(false)}
        places={PLACES}
        polities={HISTORICAL_POLITIES}
        activePeriodId={activePeriodId}
        onSelectPlace={handleSelectPlace}
        translations={translations}
        userLocation={userLocation}
      />

      {/* Feature 5: Self-Guided Audio Heritage Tour Modal */}
      <AudioHeritageGuideModal
        isOpen={isAudioGuideOpen}
        onClose={() => setIsAudioGuideOpen(false)}
        place={activeAudioPlace || selectedPlace || PLACES[0]}
        places={PLACES}
        onSelectPlace={(p) => {
          setActiveAudioPlace(p);
          setSelectedPlace(p);
        }}
        translations={translations}
        currentLanguage={currentLanguage}
      />

      {/* Feature 6: Curated 1-Day Heritage Itineraries Modal */}
      <ItineraryPlannerModal
        isOpen={isItinerariesOpen}
        onClose={() => setIsItinerariesOpen(false)}
        itineraries={CURATED_ITINERARIES}
        onSelectPlaceById={handleSelectPlaceById}
        onSelectPlaceOnMap={handleSelectPlaceById}
        userLocation={userLocation}
        translations={translations}
      />

      {/* Feature 11: Today in Tamil History Modal */}
      <TodayInHistoryModal
        isOpen={isTodayHistoryOpen}
        onClose={() => setIsTodayHistoryOpen(false)}
        dailyEntries={DAILY_HISTORY}
        onSelectPlaceById={handleSelectPlaceById}
        onSelectPlaceOnMap={handleSelectPlaceById}
        translations={translations}
      />

      {/* Feature 13: Shareable Story & Monument Card Modal */}
      <SocialShareCardModal
        isOpen={isShareCardOpen}
        onClose={() => setIsShareCardOpen(false)}
        place={activeSharePlace || selectedPlace || PLACES[0]}
        cardData={activeSharePlace || selectedPlace || PLACES[0]}
        places={PLACES}
        onSelectPlace={(p) => {
          setActiveSharePlace(p);
          setSelectedPlace(p);
        }}
        userLocation={userLocation}
        translations={translations}
      />

      {/* Feature 14: Tourist Emergency SOS Assistance Modal */}
      <TouristSOSModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        userLocation={userLocation}
        selectedPlace={selectedPlace}
        onDetectLocation={() => handleDetectLocation(false)}
      />

      {/* Explorer Login & Profile Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onSaveUser={handleSaveUser}
        onLogout={handleLogout}
        currentLanguage={currentLanguage}
        onLanguageChange={setCurrentLanguage}
        translations={translations}
      />
    </div>
  );
}
