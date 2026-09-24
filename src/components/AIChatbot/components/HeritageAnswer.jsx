import React, { useState } from 'react';
import { 
  Compass, 
  MapPin, 
  Map as MapIcon, 
  Clock, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Landmark,
  FileText
} from 'lucide-react';
import { animateActionButtonFeedback } from '../chatbotAnimations';

/**
 * ImageWithFallback: Robust image renderer preventing broken images or layout shift.
 * Displays a crafted archaeological placeholder with site type and location if image fails.
 */
function ImageWithFallback({ src, alt, category = 'heritage', location = '' }) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src || hasError) {
    return (
      <div className="archaeological-placeholder" aria-label={alt}>
        <div className="placeholder-icon-wrap">
          {category === 'temples' ? <Landmark size={20} /> : <Compass size={20} />}
        </div>
        <div className="placeholder-meta">
          <span className="placeholder-category">{category.toUpperCase()}</span>
          {location && <span className="placeholder-loc">{location}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="image-aspect-frame">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`heritage-card-img ${isLoaded ? 'is-loaded' : 'is-loading'}`}
      />
    </div>
  );
}

export function HeritageAnswer({
  data,
  lang = 'en',
  onSelectPlace,
  onOpenPlaceDetails,
  onShowJourney,
  onSelectPeriod,
  onOpenPeople,
  onSendQuery
}) {
  const [isEvidenceExpanded, setIsEvidenceExpanded] = useState(false);
  const [isReadMoreExpanded, setIsReadMoreExpanded] = useState(false);
  const [activeActionId, setActiveActionId] = useState(null);

  if (!data) return null;

  const isTamil = lang === 'ta';

  // Trigger map action with visual feedback
  const handleMapActionClick = (e, entity) => {
    animateActionButtonFeedback(e.currentTarget);
    setActiveActionId(entity.id);

    if (onSelectPlace) {
      onSelectPlace({
        id: entity.id,
        name: entity.name,
        tamilName: entity.tamilName,
        lat: entity.lat,
        lng: entity.lng
      });
    }

    setTimeout(() => {
      setActiveActionId(null);
    }, 1500);
  };

  // Open full connected history stratigraphy details modal
  const handleDetailsClick = (e, entity) => {
    animateActionButtonFeedback(e.currentTarget);
    if (onOpenPlaceDetails) {
      onOpenPlaceDetails({
        id: entity.id,
        name: entity.name,
        tamilName: entity.tamilName,
        lat: entity.lat,
        lng: entity.lng
      });
    } else if (onSelectPlace) {
      onSelectPlace(entity);
    }
  };

  const handleShowJourneyClick = (e, act) => {
    animateActionButtonFeedback(e.currentTarget);
    setActiveActionId('journey');

    if (onShowJourney && act.payload?.stops) {
      onShowJourney(act.payload.stops);
    }

    setTimeout(() => {
      setActiveActionId(null);
    }, 1500);
  };

  // Dedicated Scope Guidance Card for Off-Topic / Non-Heritage / Code Queries
  if (data.type === 'out_of_scope' || data.isOutOfScope) {
    return (
      <article className="heritage-answer-container" lang={lang}>
        <div className="heritage-scope-card">
          <header className="heritage-scope-header">
            <div className="heritage-scope-icon-wrap" aria-hidden="true">
              <Compass size={18} color="#ffd166" />
            </div>
            <div className="heritage-scope-titles">
              <span className="heritage-scope-badge">
                {isTamil ? 'மரபு வழிகாட்டி வரம்பு' : (lang === 'hi' ? 'डोमेन दायरा' : 'HERITAGE DOMAIN FOCUS')}
              </span>
              <h3 className="heritage-scope-title">
                {isTamil 
                  ? (data.title || data.bilingualTitle) 
                  : (data.bilingualTitle || data.title)}
              </h3>
            </div>
          </header>

          <p className="heritage-scope-message">
            {data.subtitle || data.message}
          </p>

          {data.suggestedQuestions && data.suggestedQuestions.length > 0 && (
            <div className="heritage-scope-suggested">
              <div className="heritage-scope-suggested-title">
                {isTamil 
                  ? 'இதற்குப் பதிலாக பின்வரும் வரலாற்றுத் தலைப்புகளை ஆராயலாம்:' 
                  : (lang === 'hi' 
                    ? 'इसके स्थान पर आप इन तमिल ऐतिहासिक विषयों का अन्वेषण कर सकते हैं:' 
                    : 'Explore authentic Tamil heritage instead:')}
              </div>
              <div className="suggested-pills-row">
                {data.suggestedQuestions.map((qText, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className="suggested-question-pill"
                    onClick={() => onSendQuery && onSendQuery(qText)}
                  >
                    <span>{qText}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="heritage-answer-container" lang={lang}>
      {/* 1. Primary AI Answer: Hero Card (Compact, Scannable 50–220 words) */}
      <div className="heritage-hero-card">
        <header className="heritage-hero-header">
          <div className="heritage-badge-icon" aria-hidden="true">
            <Sparkles size={15} />
          </div>
          <div className="heritage-hero-titles">
            <h3 className="heritage-main-title">
              {isTamil 
                ? (data.title || data.bilingualTitle) 
                : (data.bilingualTitle || data.title)}
            </h3>
            {data.badge && (
              <span className="heritage-status-pill">{data.badge}</span>
            )}
            {data.isGroqGenerated && (
              <span className="heritage-status-pill groq-pill" style={{ background: 'rgba(212, 149, 43, 0.25)', borderColor: '#ffd166', color: '#ffd166', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                ⚡ Groq Grounded
              </span>
            )}
          </div>
        </header>

        <p className="heritage-hero-subtitle">
          {data.subtitle}
        </p>

        {/* Read More toggle for complex research without text dumping */}
        {data.extendedSummary && (
          <div>
            {isReadMoreExpanded && (
              <p className="heritage-extended-text">{data.extendedSummary}</p>
            )}
            <button 
              type="button"
              className="heritage-read-more-btn"
              onClick={() => setIsReadMoreExpanded(!isReadMoreExpanded)}
            >
              <span>{isReadMoreExpanded ? (isTamil ? 'சுருக்குக ▲' : 'Show less ▲') : (isTamil ? 'மேலும் வாசிக்க ▼' : 'Read more ▼')}</span>
            </button>
          </div>
        )}

        {/* Hero Quote Card (e.g. Silappadikaram Anklet Quote) */}
        {data.quote && (
          <blockquote className="heritage-quote-box">
            <p className="heritage-quote-text">{data.quote.text}</p>
            {data.quote.attribution && (
              <cite className="heritage-quote-author">{data.quote.attribution}</cite>
            )}
          </blockquote>
        )}
      </div>

      {/* 2. Visual Waypoint Journey Flow (Wrapping cleanly with NO horizontal scrollbar) */}
      {data.journeySection && data.journeySection.stops?.length > 0 && (
        <section className="heritage-journey-section" aria-label="Journey Waypoints">
          <div className="heritage-section-heading">
            <span>{isTamil ? (data.journeySection.title || data.journeySection.bilingualTitle) : (data.journeySection.bilingualTitle || data.journeySection.title)}</span>
          </div>

          <div className="heritage-journey-waypoints">
            {data.journeySection.stops.map((stop, index) => {
              const isLast = index === data.journeySection.stops.length - 1;
              return (
                <div key={stop.id || index} className="waypoint-flex-item">
                  <div 
                    className="heritage-waypoint-card"
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (onSelectPlace) {
                        onSelectPlace({
                          id: stop.id,
                          name: stop.name,
                          tamilName: stop.tamilName,
                          lat: stop.lat,
                          lng: stop.lng
                        });
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (onSelectPlace) onSelectPlace(stop);
                      }
                    }}
                    title={`View ${stop.name} on map`}
                  >
                    <ImageWithFallback 
                      src={stop.image} 
                      alt={stop.name}
                      category="places" 
                      location={stop.role}
                    />
                    <div className="waypoint-info">
                      <span className="waypoint-name">
                        {isTamil ? (stop.tamilName || stop.name) : stop.name}
                      </span>
                      <span className="waypoint-subname">
                        {isTamil ? `(${stop.name})` : (stop.tamilName || '')}
                      </span>
                      <span className="waypoint-role">{stop.role}</span>
                    </div>
                  </div>

                  {!isLast && (
                    <div className="waypoint-arrow" aria-hidden="true">
                      <ArrowRight size={14} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 3. Secondary: Compact Entity Cards (1-col mobile, 2-col tablet, 2-3 desktop) */}
      {data.entityCardsSection && data.entityCardsSection.entities?.length > 0 && (
        <section className="heritage-entities-section" aria-label="Key Entities">
          <div className="heritage-section-heading">
            <span>{isTamil ? (data.entityCardsSection.title || data.entityCardsSection.bilingualTitle) : (data.entityCardsSection.bilingualTitle || data.entityCardsSection.title)}</span>
          </div>

          <div className="heritage-entity-cards-grid">
            {data.entityCardsSection.entities.map(entity => {
              const isShowingOnMap = activeActionId === entity.id;

              return (
                <div key={entity.id} className="heritage-entity-card">
                  <ImageWithFallback 
                    src={entity.image} 
                    alt={entity.name}
                    category="places"
                    location={entity.district || ''}
                  />

                  <div className="entity-card-content">
                    <div className="entity-card-title-group">
                      <h4 className="entity-card-title">
                        {isTamil ? (entity.tamilName || entity.name) : entity.name}
                      </h4>
                      <span className="entity-card-sub">
                        {isTamil ? `(${entity.name})` : (entity.tamilName || '')}
                      </span>
                    </div>

                    <p className="entity-card-desc">{entity.description}</p>

                    {/* Evidence Type Badges */}
                    {entity.evidenceTags?.length > 0 && (
                      <div className="entity-evidence-tags">
                        {entity.evidenceTags.map((tag, i) => (
                          <span key={i} className={`evidence-badge ${tag.toLowerCase().replace(/\s+/g, '-')}`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Compact Card Actions */}
                    <div className="entity-card-actions">
                      <button 
                        type="button"
                        className={`entity-action-btn primary ${isShowingOnMap ? 'is-active' : ''}`}
                        onClick={(e) => handleMapActionClick(e, entity)}
                        aria-label={`View ${entity.name} on map`}
                      >
                        {isShowingOnMap ? <CheckCircle2 size={12} color="#10b981" /> : <MapPin size={12} />}
                        <span>
                          {isShowingOnMap 
                            ? (isTamil ? 'வரைபடத்தில் காட்டப்படுகிறது...' : 'Showing on map...')
                            : (isTamil ? 'வரைபடத்தில் காண்க' : 'View on Map')}
                        </span>
                      </button>

                      <button 
                        type="button"
                        className="entity-action-btn secondary"
                        onClick={(e) => handleDetailsClick(e, entity)}
                        aria-label={`View details for ${entity.name}`}
                      >
                        <span>{isTamil ? 'விவரங்கள் →' : 'Details →'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Action Buttons Bar (Show Journey on Map, View Timeline, Related People) */}
      {data.actions && data.actions.length > 0 && (
        <div className="heritage-actions-bar">
          {data.actions.map((act, i) => {
            const isJourneyActive = act.type === 'showJourney' && activeActionId === 'journey';

            return (
              <button
                key={i}
                type="button"
                className={`heritage-major-action ${act.type} ${isJourneyActive ? 'is-active' : ''}`}
                onClick={(e) => {
                  if (act.type === 'showJourney') {
                    handleShowJourneyClick(e, act);
                  } else if (act.type === 'focusPlace' && onSelectPlace && act.payload?.place) {
                    animateActionButtonFeedback(e.currentTarget);
                    onSelectPlace(act.payload.place);
                  } else if (act.type === 'viewTimeline' && onSelectPeriod && act.payload?.periodId) {
                    animateActionButtonFeedback(e.currentTarget);
                    onSelectPeriod(act.payload.periodId);
                  } else if (act.type === 'relatedPeople') {
                    animateActionButtonFeedback(e.currentTarget);
                    if (onSendQuery) {
                      onSendQuery(
                        isTamil 
                          ? "சிலப்பதிகாரக் கதைமாந்தர்கள் பற்றி கூறுக: இளங்கோ அடிகள், கண்ணகி, கோவலன்" 
                          : "Tell me about the key people in Silappadikaram: Kannagi, Kovalan, and Ilango Adigal"
                      );
                    } else if (onOpenPeople) {
                      onOpenPeople(act.payload?.peopleIds, act.payload?.initialPersonId);
                    }
                  } else if (act.type === 'openPeopleModal' && onOpenPeople) {
                    animateActionButtonFeedback(e.currentTarget);
                    onOpenPeople(act.payload?.peopleIds, act.payload?.initialPersonId);
                  } else if (act.type === 'exploreTopic' && onSendQuery && act.query) {
                    onSendQuery(act.query);
                  }
                }}
              >
                <div className="action-icon-wrapper" aria-hidden="true">
                  {act.icon === 'map' && (isJourneyActive ? <CheckCircle2 size={16} /> : <MapIcon size={16} />)}
                  {act.icon === 'clock' && <Clock size={16} />}
                  {act.icon === 'users' && <Users size={16} />}
                  {act.icon === 'pin' && <MapPin size={16} />}
                  {act.icon === 'temple' && <Compass size={16} />}
                </div>
                <div className="action-text-wrapper">
                  <span className="action-title">
                    {isJourneyActive ? (isTamil ? 'பயணம் காட்டப்படுகிறது...' : 'Showing on Map...') : act.title}
                  </span>
                  {act.subtitle && <span className="action-subtitle">{act.subtitle}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 5. Tertiary: Evidence & Source Research Cards (Collapsible Accordion) */}
      {((data.evidence && data.evidence.length > 0) || (data.sources && data.sources.length > 0)) && (
        <section className="heritage-sources-accordion" aria-label="Evidence and Sources">
          <button 
            type="button"
            className="sources-accordion-toggle"
            onClick={() => setIsEvidenceExpanded(prev => !prev)}
            aria-expanded={isEvidenceExpanded}
          >
            <div className="sources-toggle-left">
              <BookOpen size={14} aria-hidden="true" />
              <span>{isTamil ? 'ஆதாரங்கள் மற்றும் சான்றுகள்' : 'Sources & Evidence'}</span>
            </div>
            <div className="sources-toggle-right">
              <span className="sources-count-badge">
                {data.sources?.length || 3} {isTamil ? 'ஆதாரங்கள்' : 'sources'}
              </span>
              {isEvidenceExpanded ? <ChevronUp size={14} aria-hidden="true" /> : <ChevronDown size={14} aria-hidden="true" />}
            </div>
          </button>

          {isEvidenceExpanded && (
            <div className="sources-accordion-body">
              {/* Evidence Partitioned by Methodology */}
              {data.evidence && data.evidence.length > 0 && (
                <div className="evidence-items-list">
                  {data.evidence.map((ev, i) => (
                    <div key={i} className={`evidence-item-card ${ev.type}`}>
                      <div className="evidence-type-header">
                        <ShieldCheck size={12} aria-hidden="true" />
                        <span>{ev.label}</span>
                      </div>
                      <p className="evidence-text">{ev.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Research Reference Citation Cards */}
              {data.sources && data.sources.length > 0 && (
                <div className="verified-sources-list">
                  <div className="sources-subheading">
                    {isTamil ? 'ஆய்வுத் தரவுத்தளங்கள்:' : 'Scholarly Reference Citations:'}
                  </div>
                  {data.sources.map((s, i) => (
                    <div key={s.id || i} className="source-citation-card">
                      <div className="source-card-main">
                        <span className="source-idx">[{String(i + 1).padStart(2, '0')}]</span>
                        <div className="source-details">
                          <span className="source-name">{s.title || s.institution}</span>
                          {s.institution && <span className="source-institution">{s.institution}</span>}
                          <span className="source-type-tag">Primary / Scholarly Dataset</span>
                        </div>
                      </div>
                      {s.url && (
                        <a 
                          href={s.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="source-ext-btn"
                          title="Open verified source repository"
                          aria-label={`Open source ${s.title || s.institution}`}
                        >
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* 6. Context-Aware Suggested Question Pills */}
      {data.suggestedQuestions && data.suggestedQuestions.length > 0 && (
        <section className="heritage-suggested-section" aria-label="Suggested Questions">
          <div className="suggested-heading">
            {isTamil ? 'பரிந்துரைக்கப்பட்ட கேள்விகள்' : 'Suggested Inquiries'}
          </div>

          <div className="suggested-pills-row">
            {data.suggestedQuestions.map((qText, i) => (
              <button
                key={i}
                type="button"
                className="suggested-question-pill"
                onClick={() => {
                  if (onSendQuery) onSendQuery(qText);
                }}
              >
                <span>{qText}</span>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
