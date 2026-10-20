import React from 'react';
import { Clock, MapPin, DollarSign, Wand2, Info, AlertCircle, Sun, CloudSun, Compass } from 'lucide-react';
import InteractiveRouteMap from './InteractiveRouteMap';

const CATEGORY_COLORS = {
  Attraction: { bg: 'rgba(99, 102, 241, 0.15)', text: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)' },
  Dining: { bg: 'rgba(236, 72, 153, 0.15)', text: '#f472b6', border: 'rgba(236, 72, 153, 0.3)' },
  Transport: { bg: 'rgba(6, 182, 212, 0.15)', text: '#67e8f9', border: 'rgba(6, 182, 212, 0.3)' },
  Accommodation: { bg: 'rgba(16, 185, 129, 0.15)', text: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  Leisure: { bg: 'rgba(245, 158, 11, 0.15)', text: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' }
};

const WEATHER_FORECASTS = [
  { temp: '22°C', condition: 'Sunny & Pleasant', icon: Sun },
  { temp: '20°C', condition: 'Partly Cloudy', icon: CloudSun },
  { temp: '24°C', condition: 'Clear Blue Sky', icon: Sun },
  { temp: '19°C', condition: 'Mild Breeze', icon: CloudSun }
];

export default function DayCard({ day, destination, onOpenRefine, currencySymbol = '$', currencyRate = 1.0, activeCategory = 'all' }) {
  const weather = WEATHER_FORECASTS[(day.day_number - 1) % WEATHER_FORECASTS.length];
  const WeatherIcon = weather.icon;

  const activities = day.activities || [];
  const filteredActivities = activeCategory === 'all' 
    ? activities 
    : activities.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  const formatCost = (val) => {
    if (!val || val === 0) return 'Free';
    const converted = Math.round(val * currencyRate);
    return `${currencySymbol}${converted.toLocaleString()}`;
  };

  return (
    <div className="glass-panel" style={{
      padding: '26px',
      marginBottom: 28,
      borderRadius: 'var(--radius-md)',
      border: '1px solid var(--border-subtle)',
      position: 'relative'
    }}>
      {/* Day Header */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 16,
        marginBottom: 20,
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 10, marginBottom: 6 }}>
            <span style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: '#fff',
              fontSize: '0.8rem',
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 'var(--radius-full)'
            }}>
              Day {day.day_number}
            </span>
            {day.date && (
              <span style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                {day.date}
              </span>
            )}

            {/* Weather Widget Pill */}
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontSize: '0.78rem',
              padding: '2px 8px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              color: '#fcd34d'
            }}>
              <WeatherIcon size={13} />
              <span>{weather.temp} • {weather.condition}</span>
            </span>

            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              • Est. Day Total: <strong style={{ color: 'var(--text-main)' }}>{formatCost(day.estimated_day_cost)}</strong>
            </span>
          </div>

          <h3 style={{ fontSize: '1.32rem', color: '#f8fafc' }}>
            {day.theme}
          </h3>
          {day.daily_overview && (
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginTop: 4 }}>
              {day.daily_overview}
            </p>
          )}
        </div>

        <button
          onClick={() => onOpenRefine(day)}
          className="secondary-btn"
          style={{
            fontSize: '0.82rem',
            padding: '6px 14px',
            color: '#c4b5fd',
            borderColor: 'rgba(139, 92, 246, 0.35)',
            boxShadow: '0 2px 10px rgba(139, 92, 246, 0.15)'
          }}
        >
          <Wand2 size={14} color="#a78bfa" />
          <span>Refine Day with AI</span>
        </button>
      </div>

      {/* Interactive Transit Route Ribbon */}
      <InteractiveRouteMap day={day} destination={destination} />

      {/* Activity Timeline List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filteredActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            No activities matching this category filter on Day {day.day_number}.
          </div>
        ) : (
          filteredActivities.map((act, idx) => {
            const style = CATEGORY_COLORS[act.category] || CATEGORY_COLORS.Attraction;
            return (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '110px 1fr',
                  gap: 16,
                  padding: '16px 18px',
                  background: 'rgba(15, 23, 42, 0.55)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(22, 30, 49, 0.8)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(15, 23, 42, 0.55)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {/* Time slot column */}
                <div>
                  <span style={{
                    fontSize: '0.72rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    display: 'block'
                  }}>
                    {act.time_slot}
                  </span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Clock size={12} />
                    <span>{act.start_time}</span>
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginTop: 4 }}>
                    {act.duration_minutes} mins
                  </span>
                </div>

                {/* Activity details column */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 6 }}>
                    <h4 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>
                      {act.title}
                    </h4>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: style.bg,
                      color: style.text,
                      border: `1px solid ${style.border}`
                    }}>
                      {act.category}
                    </span>

                    <span style={{ marginLeft: 'auto', fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                      {formatCost(act.estimated_cost)}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 10 }}>
                    {act.description}
                  </p>

                  {/* Location & Extra Info */}
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, fontSize: '0.78rem' }}>
                    {act.location_name && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-dim)' }}>
                        <MapPin size={13} color="var(--accent-cyan)" />
                        <span>{act.location_name}</span>
                      </span>
                    )}

                    {act.booking_required && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#fcd34d' }}>
                        <AlertCircle size={13} />
                        <span>Advance Booking Recommended</span>
                      </span>
                    )}

                    {act.tips && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#a5b4fc', fontStyle: 'italic' }}>
                        <Info size={13} />
                        <span>{act.tips}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
