import React from 'react';
import { Compass, Sparkles, Bookmark, ShieldCheck, User, LogIn, LogOut, ChevronDown } from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeView, // 'traveler' | 'admin'
  onSwitchView, 
  onOpenAuth, 
  onLogout,
  onOpenNewTrip, 
  onOpenSaved, 
  savedCount, 
  health 
}) {
  return (
    <header className="glass-panel" style={{
      position: 'sticky',
      top: 16,
      zIndex: 100,
      margin: '0 auto 28px auto',
      maxWidth: 1280,
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Brand */}
      <div 
        onClick={() => onSwitchView('traveler')}
        style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
      >
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 'var(--radius-sm)',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
        }}>
          <Compass size={22} color="#ffffff" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
              Wander<span className="gradient-text">AI</span>
            </span>
            <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>
              v1.0 Pro
            </span>
          </div>
          <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: 0 }}>
            {activeView === 'admin' ? '🛡️ Administrator Command Center' : 'Personalized Travel Itinerary Planner'}
          </p>
        </div>
      </div>

      {/* Navigation & View Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* View Switcher Pill */}
        <div style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.3)',
          padding: 3,
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => onSwitchView('traveler')}
            style={{
              background: activeView === 'traveler' ? 'var(--accent-primary)' : 'transparent',
              color: activeView === 'traveler' ? '#fff' : 'var(--text-dim)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all var(--transition-fast)'
            }}
          >
            <User size={13} />
            <span>Traveler Side</span>
          </button>

          <button
            onClick={() => onSwitchView('admin')}
            style={{
              background: activeView === 'admin' ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'transparent',
              color: activeView === 'admin' ? '#fff' : 'var(--text-dim)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '6px 14px',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all var(--transition-fast)'
            }}
          >
            <ShieldCheck size={14} />
            <span>Admin Side</span>
          </button>
        </div>

        {/* Backend Status indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.75rem',
          padding: '4px 10px',
          borderRadius: 'var(--radius-full)',
          background: health?.status === 'healthy' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
          border: `1px solid ${health?.status === 'healthy' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: health?.status === 'healthy' ? 'var(--accent-emerald)' : 'var(--accent-amber)',
            boxShadow: `0 0 8px ${health?.status === 'healthy' ? 'var(--accent-emerald)' : 'var(--accent-amber)'}`
          }} />
          <span style={{ color: health?.status === 'healthy' ? '#6ee7b7' : '#fcd34d' }}>
            FastAPI Live
          </span>
        </div>
      </div>

      {/* Right Controls: User Profile + Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {activeView === 'traveler' && (
          <>
            <button
              onClick={onOpenSaved}
              className="secondary-btn"
              style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            >
              <Bookmark size={15} />
              <span>Saved</span>
              {savedCount > 0 && (
                <span style={{
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  fontSize: '0.68rem',
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
              style={{ fontSize: '0.82rem', padding: '7px 14px' }}
            >
              <Sparkles size={15} />
              <span>Plan Trip</span>
            </button>
          </>
        )}

        {/* Auth / Profile Area */}
        {currentUser ? (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '3px 12px 3px 6px'
          }}>
            <img
              src={currentUser.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=User'}
              alt={currentUser.full_name}
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1.1 }}>
                {currentUser.full_name}
              </span>
              <span style={{
                fontSize: '0.65rem',
                color: currentUser.role === 'admin' ? 'var(--accent-amber)' : 'var(--accent-cyan)',
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {currentUser.role === 'admin' ? 'Administrator' : 'Traveler'}
              </span>
            </div>

            <button
              onClick={onLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-dim)',
                cursor: 'pointer',
                padding: '2px 4px',
                marginLeft: 4
              }}
              title="Sign Out"
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
            >
              <LogOut size={14} />
            </button>
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="secondary-btn"
            style={{ fontSize: '0.82rem', padding: '6px 14px', borderColor: 'rgba(99, 102, 241, 0.4)' }}
          >
            <LogIn size={15} color="var(--accent-primary)" />
            <span>Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
}
