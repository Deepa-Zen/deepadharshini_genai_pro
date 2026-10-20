import React from 'react';
import { DollarSign, PieChart, Users, Wallet, TrendingUp, RefreshCw } from 'lucide-react';

export default function BudgetTracker({ trip, currency, onChangeCurrency, currencyRate, currencySymbol }) {
  if (!trip) return null;

  const rawTotal = trip.total_estimated_cost || 0;
  const totalCost = Math.round(rawTotal * currencyRate);
  const days = trip.duration_days || 1;
  const groupSize = trip.group_size || 1;
  const perPersonCost = Math.round(totalCost / groupSize);
  const perDayCost = Math.round(totalCost / days);

  const rawBreakdown = trip.budget_breakdown || {
    attractions: rawTotal * 0.38,
    dining: rawTotal * 0.34,
    transportation: rawTotal * 0.16,
    leisure_and_misc: rawTotal * 0.12
  };

  const categories = [
    { label: 'Attractions & Activities', amount: Math.round((rawBreakdown.attractions || 0) * currencyRate), color: '#6366f1' },
    { label: 'Dining & Gastronomy', amount: Math.round((rawBreakdown.dining || 0) * currencyRate), color: '#06b6d4' },
    { label: 'Local Transportation', amount: Math.round((rawBreakdown.transportation || 0) * currencyRate), color: '#10b981' },
    { label: 'Leisure & Extras', amount: Math.round((rawBreakdown.leisure_and_misc || 0) * currencyRate), color: '#f59e0b' }
  ];

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 'var(--radius-sm)',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Wallet size={20} color="var(--accent-emerald)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>Financial & Budget Analytics</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Estimated expenditures for {days} days ({groupSize} {groupSize > 1 ? 'travelers' : 'traveler'})
            </p>
          </div>
        </div>

        {/* Currency Switcher & Total Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(0,0,0,0.3)', padding: '4px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Currency:</span>
            <select
              value={currency}
              onChange={(e) => onChangeCurrency(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-cyan)',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc' }}>
              {currencySymbol}{totalCost.toLocaleString()} <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{currency}</span>
            </div>
            <span className="badge badge-emerald">
              {trip.budget_level} Allocation
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>Daily Average Burn</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {currencySymbol}{perDayCost.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ day</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>Per Person Cost</div>
          <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
            {currencySymbol}{perPersonCost.toLocaleString()} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ person</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(0,0,0,0.25)',
          padding: '12px 16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 4 }}>Travel Configuration</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
            {trip.travel_party} ({trip.group_size || 1}) • {trip.travel_style}
          </div>
        </div>
      </div>

      {/* Segmented Bar */}
      <div style={{
        height: 10,
        borderRadius: 'var(--radius-full)',
        overflow: 'hidden',
        display: 'flex',
        background: 'rgba(255,255,255,0.05)',
        marginBottom: 16
      }}>
        {categories.map((cat, idx) => {
          const pct = totalCost > 0 ? (cat.amount / totalCost) * 100 : 25;
          return (
            <div
              key={idx}
              style={{
                width: `${pct}%`,
                background: cat.color,
                transition: 'width 0.4s ease'
              }}
              title={`${cat.label}: ${currencySymbol}${cat.amount.toLocaleString()} (${Math.round(pct)}%)`}
            />
          );
        })}
      </div>

      {/* Category Legends */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 12
      }}>
        {categories.map((cat, idx) => {
          const pct = totalCost > 0 ? Math.round((cat.amount / totalCost) * 100) : 25;
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.85rem' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color, flexShrink: 0 }} />
              <span style={{ color: 'var(--text-muted)' }}>{cat.label}</span>
              <span style={{ marginLeft: 'auto', fontWeight: 600, color: '#f8fafc' }}>
                {currencySymbol}{cat.amount.toLocaleString()} ({pct}%)
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
