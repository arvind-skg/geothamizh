import React, { useState } from 'react';
import { X, Utensils, Award, Sparkles, MapPin, ExternalLink } from 'lucide-react';

export const LivingCultureSection = ({
  isOpen,
  onClose,
  livingCulture,
  onSelectPlaceById,
  translations
}) => {
  const [activeTab, setActiveTab] = useState('food');

  if (!isOpen) return null;

  return (
    <div className="sliding-drawer-backdrop" onClick={onClose}>
      <div className="sliding-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f7a8c, #022b3a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Utensils size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: '#fff', margin: 0 }}>
                {translations.navCulture}
              </h2>
              <div style={{ fontSize: '11px', color: '#ffd166' }}>
                Living Food, Handicrafts, and Annual Traditions
              </div>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close culture">
            <X size={18} />
          </button>
        </div>

        {/* Category Tabs: Food, Crafts, Festivals */}
        <div style={{ display: 'flex', padding: '0.75rem 1.25rem', gap: '8px', borderBottom: '1px solid var(--bg-dark-border)', background: '#161310' }}>
          <button
            onClick={() => setActiveTab('food')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '6px',
              background: activeTab === 'food' ? '#2b2216' : 'transparent',
              border: activeTab === 'food' ? '1px solid #d4a359' : '1px solid transparent',
              color: activeTab === 'food' ? '#ffd166' : '#aaa',
              fontSize: '12px',
              fontWeight: activeTab === 'food' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            Culinary Heritage
          </button>

          <button
            onClick={() => setActiveTab('crafts')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '6px',
              background: activeTab === 'crafts' ? '#2b2216' : 'transparent',
              border: activeTab === 'crafts' ? '1px solid #d4a359' : '1px solid transparent',
              color: activeTab === 'crafts' ? '#ffd166' : '#aaa',
              fontSize: '12px',
              fontWeight: activeTab === 'crafts' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            Crafts & Arts (GI Tagged)
          </button>

          <button
            onClick={() => setActiveTab('festivals')}
            style={{
              flex: 1,
              padding: '6px 10px',
              borderRadius: '6px',
              background: activeTab === 'festivals' ? '#2b2216' : 'transparent',
              border: activeTab === 'festivals' ? '1px solid #d4a359' : '1px solid transparent',
              color: activeTab === 'festivals' ? '#ffd166' : '#aaa',
              fontSize: '12px',
              fontWeight: activeTab === 'festivals' ? 600 : 400,
              cursor: 'pointer'
            }}
          >
            Sacred Festivals
          </button>
        </div>

        {/* Tab Content Cards */}
        <div className="drawer-body">
          {activeTab === 'food' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {livingCulture.food.map(item => (
                <div key={item.id} style={{ background: '#191612', border: '1px solid rgba(212, 163, 89, 0.22)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '11px', color: '#d4a359', fontWeight: 600 }}>{item.region}</div>
                      <h4 style={{ fontSize: '1rem', color: '#fff', margin: '2px 0' }}>{item.name}</h4>
                      <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '12px', color: '#ffd166' }}>{item.tamilName}</div>
                    </div>
                  </div>
                  <div style={{ padding: '0 12px 12px 12px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.45' }}>
                    {item.description}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(212, 163, 89, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#a89f91', fontStyle: 'italic' }}>{item.culturalContext.slice(0, 75)}...</span>
                    {item.placeId && (
                      <button
                        onClick={() => {
                          onSelectPlaceById(item.placeId);
                          onClose();
                        }}
                        style={{ background: '#291f15', border: '1px solid #d4a359', color: '#ffd166', padding: '3px 9px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <MapPin size={11} />
                        <span>Map</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'crafts' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {livingCulture.crafts.map(item => (
                <div key={item.id} style={{ background: '#191612', border: '1px solid rgba(212, 163, 89, 0.22)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#d4a359', fontWeight: 600 }}>{item.region}</span>
                        {item.giTagged && (
                          <span style={{ background: 'rgba(79, 119, 45, 0.3)', color: '#95d5b2', border: '1px solid #4f772d', fontSize: '9.5px', padding: '1px 5px', borderRadius: '10px' }}>
                            GI Tagged
                          </span>
                        )}
                      </div>
                      <h4 style={{ fontSize: '1rem', color: '#fff', margin: '2px 0' }}>{item.name}</h4>
                      <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '12px', color: '#ffd166' }}>{item.tamilName}</div>
                    </div>
                  </div>
                  <div style={{ padding: '0 12px 12px 12px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.45' }}>
                    {item.description}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(212, 163, 89, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#a89f91' }}>{item.culturalSignificance.slice(0, 80)}...</span>
                    {item.placeId && (
                      <button
                        onClick={() => {
                          onSelectPlaceById(item.placeId);
                          onClose();
                        }}
                        style={{ background: '#291f15', border: '1px solid #d4a359', color: '#ffd166', padding: '3px 9px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <MapPin size={11} />
                        <span>Map</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'festivals' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {livingCulture.festivals.map(item => (
                <div key={item.id} style={{ background: '#191612', border: '1px solid rgba(212, 163, 89, 0.22)', borderRadius: '8px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', gap: '12px', padding: '12px' }}>
                    <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#ffd166', fontWeight: 600 }}>{item.month}</span>
                      <h4 style={{ fontSize: '1rem', color: '#fff', margin: '2px 0' }}>{item.name}</h4>
                      <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '12px', color: '#ffd166' }}>{item.tamilName}</div>
                    </div>
                  </div>
                  <div style={{ padding: '0 12px 12px 12px', fontSize: '0.85rem', color: '#ccc', lineHeight: '1.45' }}>
                    {item.description}
                  </div>
                  <div style={{ padding: '8px 12px', background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(212, 163, 89, 0.12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', color: '#a89f91' }}>{item.significance.slice(0, 80)}...</span>
                    {item.placeId && (
                      <button
                        onClick={() => {
                          onSelectPlaceById(item.placeId);
                          onClose();
                        }}
                        style={{ background: '#291f15', border: '1px solid #d4a359', color: '#ffd166', padding: '3px 9px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                      >
                        <MapPin size={11} />
                        <span>Map</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
