import React from 'react';
import { Layers, Compass, ShieldAlert, Sparkles, Navigation } from 'lucide-react';

export const HistoricalControls = ({
  periods,
  selectedPeriodId,
  onSelectPeriod,
  showPolities,
  setShowPolities,
  showTradeRoutes,
  setShowTradeRoutes,
  translations
}) => {
  const currentPeriod = periods.find(p => p.id === selectedPeriodId) || periods[1];

  return (
    <div className="historical-controls-panel">
      <div className="historical-header-row">
        <div className="historical-title">
          <Layers size={17} color="#d4a359" />
          <span>{translations.selectPeriod}: <b>{currentPeriod.name}</b></span>
          <span style={{ fontFamily: "'Noto Sans Tamil', sans-serif", fontSize: '12px', color: '#ffd166', marginLeft: '6px' }}>
            ({currentPeriod.tamilName})
          </span>
        </div>

        <div className="historical-layer-toggles">
          <label className="layer-checkbox-label">
            <input 
              type="checkbox" 
              checked={showPolities} 
              onChange={(e) => setShowPolities(e.target.checked)} 
            />
            <span>{translations.politiesSpheres}</span>
          </label>

          <label className="layer-checkbox-label">
            <input 
              type="checkbox" 
              checked={showTradeRoutes} 
              onChange={(e) => setShowTradeRoutes(e.target.checked)} 
            />
            <span>{translations.tradeRoutes}</span>
          </label>
        </div>
      </div>

      {/* 5-Period Stepper */}
      <div className="historical-period-stepper">
        {periods.map(period => {
          const isActive = period.id === selectedPeriodId;
          return (
            <button
              key={period.id}
              className={`period-step-btn ${isActive ? 'active' : ''}`}
              onClick={() => onSelectPeriod(period.id)}
            >
              <span className="period-step-name">{period.name}</span>
              <span className="period-step-time">{period.timeSpan}</span>
            </button>
          );
        })}
      </div>

      {/* Active Period Brief & Sourced Polities */}
      <div style={{ fontSize: '0.8rem', color: '#d8c7a5', lineHeight: '1.45', background: 'rgba(0,0,0,0.25)', padding: '0.5rem 0.75rem', borderRadius: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ color: '#ffd166', fontWeight: 600 }}>Active Polities:</span>
          {currentPeriod.polities.map((polity, idx) => (
            <span key={idx} style={{ background: '#262019', border: '1px solid #4a3a2a', padding: '1px 7px', borderRadius: '12px', fontSize: '11px' }}>
              {polity}
            </span>
          ))}
          <span style={{ color: '#aaa', marginLeft: 'auto', fontSize: '11px' }}>Key Sites: {currentPeriod.keySites.join(', ')}</span>
        </div>
        <div>{currentPeriod.description}</div>
      </div>

      {/* Scholarly Precision Disclaimer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: '#a89f91', fontStyle: 'italic' }}>
        <ShieldAlert size={13} color="#d4a359" style={{ flexShrink: 0 }} />
        <span>{translations.approximateBoundariesNotice}</span>
      </div>
    </div>
  );
};
