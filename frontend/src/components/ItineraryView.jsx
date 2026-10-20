import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, DollarSign, Bookmark, Share2, 
  Download, Edit3, Compass, Check, ShieldCheck, Sparkles,
  Luggage, Printer, Filter
} from 'lucide-react';
import DayCard from './DayCard';
import BudgetTracker from './BudgetTracker';

const CURRENCY_MAP = {
  USD: { symbol: '$', rate: 1.0 },
  EUR: { symbol: '€', rate: 0.92 },
  GBP: { symbol: '£', rate: 0.79 },
  INR: { symbol: '₹', rate: 86.5 },
  JPY: { symbol: '¥', rate: 152.0 }
};

export default function ItineraryView({ 
  trip, 
  onSaveTrip, 
  onOpenExport, 
  onEditTrip, 
  onOpenRefine,
  onOpenPacking,
  isSaved,
  saveLoading 
}) {
  const [selectedDayTab, setSelectedDayTab] = useState('all');
  const [currency, setCurrency] = useState('USD');
  const [activeCategory, setActiveCategory] = useState('all');

  if (!trip) return null;

  const currentCurrency = CURRENCY_MAP[currency] || CURRENCY_MAP.USD;

  const daysToShow = selectedDayTab === 'all' 
    ? trip.days 
    : trip.days.filter(d => d.day_number === Number(selectedDayTab));

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'attraction', label: '🏛️ Attractions' },
    { id: 'dining', label: '🍽️ Dining' },
    { id: 'transport', label: '🚇 Transit' },
    { id: 'leisure', label: '☕ Leisure' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Banner */}
      <div className="glass-panel-elevated" style={{
        padding: '36px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle accent glow in background */}
        <div style={{
          position: 'absolute',
          top: -60,
          right: -60,
          width: 260,
          height: 260,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.28) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
          <div style={{ maxWidth: 820 }}>
            {/* Meta Tags */}
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <span className="badge badge-indigo">
                <MapPin size={12} />
                <span>{trip.destination}</span>
              </span>
              <span className="badge badge-cyan">
                <Users size={12} />
                <span>{trip.travel_party} ({trip.group_size || 1} people)</span>
              </span>
              <span className="badge badge-amber">
                <Compass size={12} />
                <span>{trip.travel_style} Pace</span>
              </span>
              <span className="badge badge-emerald">
                <DollarSign size={12} />
                <span>{trip.budget_level} Tier</span>
              </span>
            </div>

            <h1 style={{ fontSize: '2.2rem', marginBottom: 12, lineHeight: 1.2 }}>
              {trip.title}
            </h1>

            <p style={{ fontSize: '1rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 18 }}>
              {trip.summary}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, fontSize: '0.86rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Calendar size={15} color="var(--accent-cyan)" />
                <span>{trip.start_date} → {trip.end_date} ({trip.duration_days} Days)</span>
              </span>
              <span>•</span>
              <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                Autonomous Route & Schedule Optimized
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, minWidth: 210 }}>
            <button
              onClick={() => onSaveTrip(trip)}
              className="gradient-btn"
              style={{ justifyContent: 'center' }}
              disabled={saveLoading}
            >
              {isSaved ? <Check size={18} /> : <Bookmark size={18} />}
              <span>{isSaved ? 'Saved to Supabase' : (saveLoading ? 'Saving...' : 'Save to Supabase')}</span>
            </button>

            <button
              onClick={onOpenPacking}
              className="secondary-btn"
              style={{ justifyContent: 'center', borderColor: 'rgba(6, 182, 212, 0.4)', color: '#67e8f9' }}
            >
              <Luggage size={16} />
              <span>Packing Checklist</span>
            </button>

            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={onOpenExport}
                className="secondary-btn"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
              >
                <Download size={15} />
                <span>Export</span>
              </button>

              <button
                onClick={() => window.print()}
                className="secondary-btn"
                style={{ flex: 1, justifyContent: 'center', fontSize: '0.82rem' }}
                title="Print Executive Travel Briefing"
              >
                <Printer size={15} />
                <span>Print</span>
              </button>
            </div>

            <button
              onClick={onEditTrip}
              className="secondary-btn"
              style={{ justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.82rem' }}
            >
              <Edit3 size={14} />
              <span>Adjust Preferences</span>
            </button>
          </div>
        </div>

        {/* Logistics & Transit Intelligence */}
        {trip.logistics_tips && trip.logistics_tips.length > 0 && (
          <div style={{
            marginTop: 24,
            padding: '16px 20px',
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.86rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: 8 }}>
              <ShieldCheck size={16} />
              <span>Smart Logistics & Route Optimization</span>
            </div>
            <ul style={{ paddingLeft: 18, margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {trip.logistics_tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Financial & Budget Analytics Component */}
      <BudgetTracker
        trip={trip}
        currency={currency}
        onChangeCurrency={setCurrency}
        currencyRate={currentCurrency.rate}
        currencySymbol={currentCurrency.symbol}
      />

      {/* Control Bar: Day Tabs & Category Filter */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        marginBottom: 22
      }}>
        {/* Day Tabs */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          overflowX: 'auto',
          paddingBottom: 4
        }}>
          <button
            onClick={() => setSelectedDayTab('all')}
            style={{
              background: selectedDayTab === 'all' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
              color: selectedDayTab === 'all' ? '#fff' : 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '6px 16px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all var(--transition-fast)'
            }}
          >
            All {trip.duration_days} Days
          </button>

          {trip.days.map(d => (
            <button
              key={d.day_number}
              onClick={() => setSelectedDayTab(d.day_number.toString())}
              style={{
                background: selectedDayTab === d.day_number.toString() ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)',
                color: selectedDayTab === d.day_number.toString() ? '#fff' : 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 14px',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all var(--transition-fast)'
              }}
            >
              Day {d.day_number}
            </button>
          ))}
        </div>

        {/* Activity Category Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.25)', padding: '4px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              style={{
                background: activeCategory === c.id ? 'rgba(99, 102, 241, 0.3)' : 'transparent',
                color: activeCategory === c.id ? '#a5b4fc' : 'var(--text-dim)',
                border: 'none',
                borderRadius: 'var(--radius-full)',
                padding: '4px 10px',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Day Cards */}
      <div>
        {daysToShow.map(day => (
          <DayCard
            key={day.day_number}
            day={day}
            destination={trip.destination}
            onOpenRefine={onOpenRefine}
            currencySymbol={currentCurrency.symbol}
            currencyRate={currentCurrency.rate}
            activeCategory={activeCategory}
          />
        ))}
      </div>
    </div>
  );
}
