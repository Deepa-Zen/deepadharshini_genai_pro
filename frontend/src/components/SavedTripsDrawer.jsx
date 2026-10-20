import React from 'react';
import { X, Bookmark, Trash2, Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function SavedTripsDrawer({ 
  isOpen, 
  onClose, 
  savedTrips, 
  onSelectTrip, 
  onDeleteTrip 
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-end', padding: 0 }}>
      <div className="glass-panel-elevated animate-fade-in" style={{
        width: '100%',
        maxWidth: 480,
        height: '100vh',
        borderRadius: '0',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 40px rgba(0,0,0,0.6)'
      }}>
        {/* Drawer Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bookmark size={20} color="var(--accent-primary)" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Saved Itineraries</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {savedTrips.length} {savedTrips.length === 1 ? 'trip' : 'trips'} saved in database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 4 }}
          >
            <X size={22} />
          </button>
        </div>

        {/* Trips List */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {savedTrips.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px',
              color: 'var(--text-dim)'
            }}>
              <Bookmark size={40} style={{ margin: '0 auto 12px auto', opacity: 0.3 }} />
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-muted)' }}>No Saved Trips Yet</p>
              <p style={{ fontSize: '0.82rem', marginTop: 4 }}>
                Generate an itinerary and click "Save to Supabase" to keep track of your travels.
              </p>
            </div>
          ) : (
            savedTrips.map(trip => (
              <div
                key={trip.id}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', marginBottom: 4 }}>
                      {trip.title}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={12} color="var(--accent-cyan)" />
                        <span>{trip.destination}</span>
                      </span>
                      <span>•</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Calendar size={12} />
                        <span>{trip.duration_days} Days</span>
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: 4
                    }}
                    title="Delete saved trip"
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-emerald)' }}>
                    ${trip.total_estimated_cost ? trip.total_estimated_cost.toLocaleString() : 0}
                  </span>

                  <button
                    onClick={() => {
                      onSelectTrip(trip);
                      onClose();
                    }}
                    className="secondary-btn"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                  >
                    <span>Load Plan</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
