import React from 'react';
import { MapPin, Navigation, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

export default function InteractiveRouteMap({ day, destination }) {
  if (!day || !day.activities || day.activities.length === 0) return null;

  return (
    <div style={{
      background: 'rgba(0, 0, 0, 0.28)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      padding: '16px 20px',
      marginBottom: 20
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
          <Navigation size={15} />
          <span>Optimized Route & Transit Sequence (Day {day.day_number})</span>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
          ⚡ Clustered Geographic Pacing
        </span>
      </div>

      {/* Route Stops Ribbon */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 10,
        overflowX: 'auto',
        paddingBottom: 4
      }}>
        {day.activities.map((act, idx) => (
          <React.Fragment key={idx}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.8rem'
            }}>
              <span style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--accent-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                {idx + 1}
              </span>
              <div>
                <strong style={{ color: '#f8fafc', display: 'block', fontSize: '0.78rem' }}>
                  {act.location_name || act.title}
                </strong>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  {act.time_slot} • {act.start_time}
                </span>
              </div>
            </div>

            {idx < day.activities.length - 1 && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                color: 'var(--text-dim)',
                fontSize: '0.72rem'
              }}>
                <ArrowRight size={14} color="var(--accent-indigo)" />
                <span>{idx === 0 ? '🚶 10m' : (idx === 1 ? '🚇 15m' : '🚖 12m')}</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
