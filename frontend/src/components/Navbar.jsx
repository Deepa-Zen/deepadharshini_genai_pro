import React from 'react';
import { Compass, Sparkles, Bookmark, PlusCircle, Activity } from 'lucide-react';

export default function Navbar({ onOpenNewTrip, onOpenSaved, savedCount, health }) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 16,
      zIndex: 100,
      margin: '0 auto 28px auto',
      maxWidth: 1280,
      padding: '14px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 42,
          height: 42,
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Compass size={24} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Wander<span className="gradient-text">AI</span>
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              v1.0 • GenAI
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Personalized Travel Itinerary Planner
          </p>
        </div>
      </div>

      {/* Center Status Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8rem',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: health?.status === 'healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${health?.status === 'healthy' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
        }}>
          <span style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: health?.status === 'healthy' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            boxShadow: `0 0 8px ${health?.status === 'healthy' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
          }} />
          <span style={{ color: health?.status === 'healthy' ? '#6ee7b7' : '#fcd34d' }}>
            FastAPI Backend {health?.status === 'healthy' ? 'Online' : 'Connecting'}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 10, fontSize: '0.78rem', color: 'var(--text-dim)' }}>
          <span>Epics: <strong style={{ color: 'var(--text-main)' }}>10</strong></span>
          <span>•</span>
          <span>Tasks: <strong style={{ color: 'var(--text-main)' }}>24</strong></span>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          onClick={onOpenSaved}
          className="secondary-btn"
          style={{ fontSize: '0.88rem', padding: '8px 14px' }}
        >
          <Bookmark size={16} />
          <span>Saved Trips</span>
          {savedCount > 0 && (
            <span style={{
              background: 'var(--accent-primary)',
              color: '#fff',
              fontSize: '0.72rem',
              padding: '1px 6px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700
            }}>
              {savedCount}
            </span>
          )}
        </button>

        <button
          onClick={onOpenNewTrip}
          className="gradient-btn"
          style={{ fontSize: '0.88rem', padding: '8px 16px' }}
        >
          <Sparkles size={16} />
          <span>Plan New Trip</span>
        </button>
      </div>
    </header>
  );
}
