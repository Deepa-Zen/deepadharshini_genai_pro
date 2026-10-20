import React, { useState } from 'react';
import { X, CheckSquare, Square, Luggage, Sparkles, Check } from 'lucide-react';

export default function PackingChecklistModal({ isOpen, onClose, trip }) {
  if (!isOpen || !trip) return null;

  const defaultItems = [
    { id: 1, text: 'Passport / National ID & Visa documents', category: 'Essentials', checked: true },
    { id: 2, text: 'International Payment Cards & Currency Notes', category: 'Essentials', checked: true },
    { id: 3, text: 'Smartphone & Universal Travel Power Adapter', category: 'Electronics', checked: false },
    { id: 4, text: 'Portable Power Bank (10,000mAh+)', category: 'Electronics', checked: false },
    { id: 5, text: `Comfortable Walking Sneakers for ${trip.destination}`, category: 'Attire', checked: false },
    { id: 6, text: trip.travel_style === 'Romantic' ? 'Evening Formal / Candlelit Dinner Attire' : 'Lightweight breathable travel layers', category: 'Attire', checked: false },
    { id: 7, text: 'Compact Umbrella / Weatherproof Layer', category: 'Weather', checked: false },
    { id: 8, text: 'Personal Medications & Basic Travel First Aid', category: 'Health', checked: false },
    { id: 9, text: 'Local eSIM / Roaming Data Activated', category: 'Logistics', checked: false }
  ];

  const [items, setItems] = useState(defaultItems);

  const toggleItem = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const completedCount = items.filter(i => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="modal-overlay">
      <div className="glass-panel-elevated modal-content animate-fade-in" style={{
        maxWidth: 580,
        padding: '28px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 38,
              height: 38,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #06b6d4, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Luggage size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Smart Packing Checklist</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Tailored for {trip.duration_days} days in {trip.destination} ({trip.travel_style})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: 6 }}>
            <span style={{ color: 'var(--text-muted)' }}>Packing Readiness</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-emerald)' }}>{completedCount} / {items.length} items ({progressPercent}%)</span>
          </div>
          <div style={{
            height: 8,
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: 'linear-gradient(90deg, var(--accent-cyan), var(--accent-emerald))',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>

        {/* Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 340, overflowY: 'auto', marginBottom: 20 }}>
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                background: item.checked ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                border: `1px solid ${item.checked ? 'rgba(16, 185, 129, 0.25)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
            >
              {item.checked ? (
                <CheckSquare size={18} color="var(--accent-emerald)" />
              ) : (
                <Square size={18} color="var(--text-dim)" />
              )}
              <span style={{
                flex: 1,
                fontSize: '0.88rem',
                color: item.checked ? 'var(--text-muted)' : 'var(--text-main)',
                textDecoration: item.checked ? 'line-through' : 'none'
              }}>
                {item.text}
              </span>
              <span style={{
                fontSize: '0.72rem',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-dim)'
              }}>
                {item.category}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <button onClick={onClose} className="gradient-btn" style={{ padding: '8px 18px' }}>
            <Check size={16} />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
}
