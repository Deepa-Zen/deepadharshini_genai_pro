import React from 'react';
import { User, Heart, Users, ArrowRight, Zap, Clock, DollarSign } from 'lucide-react';

export default function ScenarioPresets({ onSelectScenario, loading }) {
  const scenarios = [
    {
      id: 'solo-weekend',
      title: 'Solo Weekend Getaway',
      subtitle: 'Scenario 1: Short trip, limited time, optimized routes & food',
      icon: User,
      color: 'var(--accent-indigo)',
      badgeClass: 'badge-indigo',
      badgeText: 'Solo Traveler',
      duration: '3 Days',
      destination: 'Tokyo, Japan',
      budget: 'Moderate',
      description: 'Generates a balanced itinerary that minimizes travel delays, highlights solo-friendly dining, and curates iconic tech and culture districts.',
      data: {
        destination: 'Tokyo',
        start_date: '2026-11-06',
        end_date: '2026-11-08',
        duration_days: 3,
        budget_level: 'Moderate',
        travel_party: 'Solo',
        group_size: 1,
        travel_style: 'Balanced',
        interests: ['Sightseeing', 'Food & Dining', 'Technology', 'Photography'],
        special_requirements: 'Fast-paced, maximize attractions with minimum transit, recommend top solo dining spots'
      }
    },
    {
      id: 'couple-romantic',
      title: 'Couple Romantic Vacation',
      subtitle: 'Scenario 2: Relaxed pacing, scenic sunset spots & fine dining',
      icon: Heart,
      color: 'var(--accent-rose)',
      badgeClass: 'badge-amber',
      badgeText: 'Couple Vacation',
      duration: '5 Days',
      destination: 'Paris, France',
      budget: 'Luxury',
      description: 'Crafts a day-wise itinerary with candlelit bistros, unhurried morning strolls, panoramic viewpoints, and luxury accommodations.',
      data: {
        destination: 'Paris',
        start_date: '2026-12-10',
        end_date: '2026-12-14',
        duration_days: 5,
        budget_level: 'Luxury',
        travel_party: 'Couple',
        group_size: 2,
        travel_style: 'Romantic',
        interests: ['Scenic Views', 'Fine Dining', 'Art & Architecture', 'Relaxation'],
        special_requirements: 'Unhurried mornings, candlelit dinners, picturesque riverside viewpoints'
      }
    },
    {
      id: 'group-multiday',
      title: 'Small Group Multi-Day Trip',
      subtitle: 'Scenario 3: Shared budget, outdoor adventure & balanced logistics',
      icon: Users,
      color: 'var(--accent-cyan)',
      badgeClass: 'badge-cyan',
      badgeText: 'Group Travel (5 People)',
      duration: '7 Days',
      destination: 'Bali, Indonesia',
      budget: 'Budget',
      description: 'Structures shared activities, minimizes group coordination friction, and recommends cost-effective villas and adventure excursions.',
      data: {
        destination: 'Bali',
        start_date: '2027-01-15',
        end_date: '2027-01-21',
        duration_days: 7,
        budget_level: 'Budget',
        travel_party: 'Friends',
        group_size: 5,
        travel_style: 'Adventure',
        interests: ['Outdoor Adventure', 'Beaches', 'Culture', 'Nightlife', 'Local Markets'],
        special_requirements: 'Coordinate schedules for 5 friends, budget accommodation, group transport guidance'
      }
    }
  ];

  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={20} color="var(--accent-amber)" />
            <span>Interactive Project Scenarios</span>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            One-click launch for the 3 official evaluation use cases
          </p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 20
      }}>
        {scenarios.map((sc) => {
          const IconComp = sc.icon;
          return (
            <div
              key={sc.id}
              className="glass-panel"
              style={{
                padding: '24px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform var(--transition-fast), border-color var(--transition-fast)',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
              }}
              onClick={() => onSelectScenario(sc.data)}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <IconComp size={20} color="#a5b4fc" />
                  </div>
                  <span className={`badge ${sc.badgeClass}`}>
                    {sc.badgeText}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.18rem', marginBottom: 6 }}>{sc.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 12 }}>
                  {sc.subtitle}
                </p>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 16 }}>
                  {sc.description}
                </p>

                <div style={{
                  display: 'flex',
                  gap: 12,
                  padding: '10px 12px',
                  background: 'rgba(0, 0, 0, 0.25)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  marginBottom: 16
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={14} color="var(--accent-cyan)" />
                    <span>{sc.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <DollarSign size={14} color="var(--accent-emerald)" />
                    <span>{sc.budget}</span>
                  </div>
                  <div style={{ marginLeft: 'auto', fontWeight: 600, color: '#f8fafc' }}>
                    {sc.destination}
                  </div>
                </div>
              </div>

              <button
                className="gradient-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}
                disabled={loading}
              >
                <span>{loading ? 'Synthesizing Plan...' : 'Generate This Scenario'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
