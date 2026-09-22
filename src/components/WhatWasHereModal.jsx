import React from 'react';
import { X, Clock, ArrowRight, ShieldCheck, History, Sparkles } from 'lucide-react';

export const WhatWasHereModal = ({
  place,
  onClose,
  translations,
  periods
}) => {
  if (!place) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="time-travel-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #b24a3b, #d4a359)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Clock size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#d4a359', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Signature Time-Travel Explorer
              </div>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                {translations.whatWasHere}: {place.name}
              </h2>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Then vs Now Side-by-Side Comparison */}
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: '#ffd166', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <History size={16} />
              <span>{translations.thenVsNow}</span>
            </div>

            <div className="then-vs-now-grid">
              {/* THEN Box */}
              <div className="comparison-col then-col">
                <div className="comparison-badge then-badge">
                  THEN (Historical Epoch)
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffd166' }}>
                  {place.classicalName}
                </div>
                <p style={{ fontSize: '0.875rem', color: '#e0d5c1', lineHeight: '1.55' }}>
                  {place.thenVsNow?.then || place.fullStory}
                </p>
              </div>

              {/* NOW Box */}
              <div className="comparison-col">
                <div className="comparison-badge now-badge">
                  NOW (Present Day)
                </div>
                <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>
                  {place.name} ({place.district})
                </div>
                <p style={{ fontSize: '0.875rem', color: '#bbb', lineHeight: '1.55' }}>
                  {place.thenVsNow?.now || place.shortDescription}
                </p>
              </div>
            </div>
          </div>

          {/* Temporal Matrix Across All 5 Historical Periods */}
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem', color: '#ffd166', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} />
              <span>Chronological Stratigraphy Across Periods</span>
            </div>

            <div className="periods-matrix-list">
              {periods.map(period => {
                const periodContent = place.whatWasHere?.[period.id];
                if (!periodContent) return null;

                return (
                  <div key={period.id} className="period-matrix-item">
                    <div className="period-matrix-header">
                      <span>{period.name}</span>
                      <span style={{ fontSize: '11px', color: '#999' }}>{period.timeSpan}</span>
                    </div>
                    <div className="period-matrix-text">
                      {periodContent}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scholarly Provenance Footer */}
          <div style={{ background: '#181512', border: '1px solid rgba(212, 163, 89, 0.2)', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#999' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#95d5b2" />
              <span>Evidence cross-verified with epigraphical & archaeological excavation reports.</span>
            </div>
            <span style={{ color: '#ffd166' }}>Sources: {place.sources.join(', ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
