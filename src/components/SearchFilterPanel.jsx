import React, { useState, useEffect } from 'react';
import { Search, X, MapPin, ChevronDown, ChevronUp, Landmark, Sparkles, SlidersHorizontal, Eye } from 'lucide-react';

export const SearchFilterPanel = ({
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  translations,
  placesCount,
  places = [],
  selectedPlace,
  onSelectPlace
}) => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });

  const [isCityListOpen, setIsCityListOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth > 768;
    }
    return false;
  });

  // Automatically expand on mobile when user types a search query
  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      setIsMobileExpanded(true);
      setIsCityListOpen(true);
    }
  }, [searchQuery]);

  const categories = [
    { id: 'all', label: translations.filterAll },
    { id: 'temples', label: translations.filterTemples },
    { id: 'ancient_cities', label: translations.filterAncientCities },
    { id: 'archaeology', label: translations.filterArchaeology },
    { id: 'monuments', label: translations.filterMonuments },
    { id: 'crafts', label: translations.filterCrafts },
    { id: 'food_culture', label: translations.filterFood }
  ];

  return (
    <div className={`floating-overlay-card search-filter-panel ${isMobileExpanded ? 'mobile-expanded' : 'mobile-compact'}`}>
      {/* Search Input Row with Mobile Filter Toggle */}
      <div className="search-input-wrap">
        <Search size={15} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder={translations.searchPlaceholder || "Search 28+ Tamil Heritage Sites..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => {
            if (typeof window !== 'undefined' && window.innerWidth <= 768) {
              setIsMobileExpanded(true);
            }
          }}
        />
        {searchQuery ? (
          <button 
            className="search-clear-btn" 
            onClick={() => setSearchQuery('')}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : (
          <button
            className="search-mobile-toggle-btn"
            onClick={() => setIsMobileExpanded(!isMobileExpanded)}
            title={isMobileExpanded ? "Hide Filters (Maximize Map)" : "Show Filters & Sites"}
            aria-label="Toggle filter panel"
          >
            <SlidersHorizontal size={13} color={activeCategory !== 'all' ? '#ffd166' : '#bbb'} />
            <span className="filter-count-dot">{places.length}</span>
          </button>
        )}
      </div>

      {/* Expanded Content: Category Chips & Cities Directory */}
      {isMobileExpanded && (
        <div className="search-expanded-body">
          {/* Category Scroll Strip */}
          <div className="category-scroll-strip">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Left-Side Historical Cities & Heritage Centers Directory */}
          <div className="city-directory-container">
            <button
              className="city-directory-toggle"
              onClick={() => setIsCityListOpen(!isCityListOpen)}
              aria-expanded={isCityListOpen}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Landmark size={13} color="#d4a359" />
                <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#ffd166', letterSpacing: '0.04em' }}>
                  Heritage Sites ({places.length})
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#999', fontSize: '11px' }}>
                <span>{isCityListOpen ? 'Collapse' : 'Show All'}</span>
                {isCityListOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </div>
            </button>

            {isCityListOpen && (
              <div className="city-directory-list">
                {places.map(place => {
                  const isSelected = selectedPlace?.id === place.id;
                  return (
                    <div
                      key={place.id}
                      className={`city-directory-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => onSelectPlace(place)}
                      title={`Explore ${place.name}`}
                    >
                      {place.image ? (
                        <div className="city-item-thumb-wrap">
                          <img 
                            src={place.image} 
                            alt={place.name} 
                            className="city-item-thumb" 
                            loading="lazy" 
                          />
                        </div>
                      ) : (
                        <div className="city-item-thumb-placeholder">
                          <Landmark size={16} color="#d4a359" />
                        </div>
                      )}

                      <div className="city-item-main">
                        <div className="city-item-name-row">
                          <span className="city-item-name">{place.name}</span>
                          <span className="city-item-district">{place.district}</span>
                        </div>

                        <div className="city-item-sub-row">
                          <span className="city-item-tamil">{place.tamilName}</span>
                          <span className="city-item-classical">
                            • {place.classicalName?.split('/')[0]}
                          </span>
                        </div>
                      </div>

                      <div className="city-item-badge">
                        {place.categories[0].replace('_', ' ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
