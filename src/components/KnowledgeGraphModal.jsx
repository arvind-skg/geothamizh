import React, { useState } from 'react';
import { X, Share2, Filter, MapPin, User, BookOpen, Scroll, ArrowRight } from 'lucide-react';

export const KnowledgeGraphModal = ({
  isOpen,
  onClose,
  knowledgeGraph,
  onSelectPlaceById,
  translations
}) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNodeId, setSelectedNodeId] = useState('madurai');

  if (!isOpen) return null;

  const { nodes, edges } = knowledgeGraph;

  // Filter nodes
  const filteredNodes = selectedFilter === 'all' 
    ? nodes 
    : nodes.filter(n => n.type === selectedFilter);

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Connected edges for active node
  const incomingEdges = edges.filter(e => e.target === activeNode.id);
  const outgoingEdges = edges.filter(e => e.source === activeNode.id);

  const getNodeIcon = (type) => {
    switch (type) {
      case 'person': return <User size={14} color="#ffd166" />;
      case 'place': return <MapPin size={14} color="#ff7875" />;
      case 'literature': return <BookOpen size={14} color="#69c0ff" />;
      case 'inscription': return <Scroll size={14} color="#95de64" />;
      default: return <Share2 size={14} color="#d4a359" />;
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="time-travel-modal-box knowledge-graph-box" onClick={(e) => e.stopPropagation()}>
        <div className="mobile-sheet-handle" />
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #1f7a8c, #d4a359)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <Share2 size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: '#fff', margin: 0 }}>
                {translations.navGraph}: Time-Aware Semantic Network
              </h2>
              <div style={{ fontSize: '11px', color: '#ffd166' }}>
                Connecting Place ↔ Person ↔ Literature ↔ Inscription ↔ Period
              </div>
            </div>
          </div>

          <button className="drawer-close-btn" onClick={onClose} aria-label="Close graph">
            <X size={18} />
          </button>
        </div>

        {/* Filter bar */}
        <div style={{ padding: '0.65rem 1.25rem', background: '#161310', borderBottom: '1px solid var(--bg-dark-border)', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '11px', color: '#999', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={11} /> Filter:
          </span>
          {['all', 'place', 'person', 'literature', 'inscription'].map(f => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              style={{
                background: selectedFilter === f ? '#332719' : '#1c1915',
                border: selectedFilter === f ? '1px solid #d4a359' : '1px solid rgba(212, 163, 89, 0.15)',
                color: selectedFilter === f ? '#ffd166' : '#aaa',
                padding: '3px 9px',
                borderRadius: '12px',
                fontSize: '11px',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {f}s
            </button>
          ))}
        </div>

        {/* Graph Content Split View */}
        <div className="modal-body knowledge-graph-grid">
          {/* Node Selector Column */}
          <div style={{ background: '#181512', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '10px', maxHeight: '420px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div style={{ fontSize: '11px', color: '#888', fontWeight: 600, textTransform: 'uppercase', marginBottom: '4px' }}>
              Select Entity ({filteredNodes.length})
            </div>
            {filteredNodes.map(node => {
              const isSelected = activeNode.id === node.id;
              return (
                <div
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #2b2014, #19140f)' : '#1c1814',
                    border: isSelected ? '1px solid #d4a359' : '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {getNodeIcon(node.type)}
                    <div>
                      <div style={{ fontSize: '12.5px', color: isSelected ? '#ffd166' : '#fff', fontWeight: isSelected ? 600 : 400 }}>
                        {node.label}
                      </div>
                      <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '11px', color: '#999' }}>
                        {node.tamilLabel}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '10px', color: '#777', textTransform: 'uppercase' }}>
                    {node.type}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Active Node Detail & Linked Semantic Connections */}
          <div style={{ background: '#181512', border: '1px solid var(--bg-dark-border)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Active Node Card */}
            <div style={{ borderBottom: '1px solid rgba(212, 163, 89, 0.2)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '11px', color: '#d4a359', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Active Focus Node
                </span>
                {activeNode.type === 'place' && (
                  <button
                    onClick={() => {
                      onSelectPlaceById(activeNode.id);
                      onClose();
                    }}
                    style={{ background: '#291f15', border: '1px solid #d4a359', color: '#ffd166', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
                  >
                    <MapPin size={11} />
                    <span>Locate on Map</span>
                  </button>
                )}
              </div>

              <h3 style={{ fontSize: '1.25rem', color: '#fff', margin: '4px 0 2px 0' }}>
                {activeNode.label}
              </h3>
              <div style={{ fontFamily: "'Noto Sans Tamil'", fontSize: '13px', color: '#ffd166' }}>
                {activeNode.tamilLabel}
              </div>
              <div style={{ fontSize: '11.5px', color: '#aaa', marginTop: '4px' }}>
                Category: <b>{activeNode.role || activeNode.category || activeNode.genre || activeNode.script}</b>
              </div>
            </div>

            {/* Outgoing Semantic Links */}
            <div>
              <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                Outgoing Relationships ({outgoingEdges.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {outgoingEdges.length === 0 ? (
                  <span style={{ fontSize: '11.5px', color: '#666', fontStyle: 'italic' }}>No direct outgoing relationships recorded.</span>
                ) : (
                  outgoingEdges.map((e, idx) => {
                    const targetNode = nodes.find(n => n.id === e.target);
                    return (
                      <div
                        key={idx}
                        onClick={() => targetNode && setSelectedNodeId(targetNode.id)}
                        style={{ background: '#1e1a15', border: '1px solid rgba(212, 163, 89, 0.15)', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      >
                        <span style={{ fontSize: '11px', color: '#d4a359', fontWeight: 600 }}>
                          —[{e.label}]→
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '12px', color: '#fff' }}>{targetNode?.label || e.target}</span>
                          {getNodeIcon(targetNode?.type)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Incoming Semantic Links */}
            <div>
              <div style={{ fontSize: '11px', color: '#999', fontWeight: 600, textTransform: 'uppercase', marginBottom: '6px' }}>
                Referenced By ({incomingEdges.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {incomingEdges.length === 0 ? (
                  <span style={{ fontSize: '11.5px', color: '#666', fontStyle: 'italic' }}>No inbound references recorded.</span>
                ) : (
                  incomingEdges.map((e, idx) => {
                    const srcNode = nodes.find(n => n.id === e.source);
                    return (
                      <div
                        key={idx}
                        onClick={() => srcNode && setSelectedNodeId(srcNode.id)}
                        style={{ background: '#1e1a15', border: '1px solid rgba(212, 163, 89, 0.15)', padding: '6px 10px', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          {getNodeIcon(srcNode?.type)}
                          <span style={{ fontSize: '12px', color: '#fff' }}>{srcNode?.label || e.source}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#90e0ef', fontWeight: 600 }}>
                          ←[{e.label}]—
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
