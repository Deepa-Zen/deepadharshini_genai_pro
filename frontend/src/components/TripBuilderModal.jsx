import React, { useState } from 'react';
import { X, Sparkles, MapPin, Calendar, Users, DollarSign, Compass, Tag, Check } from 'lucide-react';

const POPULAR_DESTINATIONS = ['Paris, France', 'Tokyo, Japan', 'New York, USA', 'Bali, Indonesia', 'Rome, Italy', 'London, UK', 'Dubai, UAE', 'Goa, India'];

const AVAILABLE_INTERESTS = [
  'Sightseeing', 'Food & Dining', 'Art & Culture', 'Nature & Parks',
  'Outdoor Adventure', 'Shopping', 'Nightlife', 'Photography', 'Architecture', 'Historic Sites'
];

export default function TripBuilderModal({ isOpen, onClose, onGenerate, initialData, loading }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(initialData || {
    destination: 'Paris',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    duration_days: 4,
    budget_level: 'Moderate',
    travel_party: 'Solo',
    group_size: 1,
    travel_style: 'Balanced',
    interests: ['Sightseeing', 'Food & Dining'],
    special_requirements: '',
    currency: 'USD'
  });

  const toggleInterest = (interest) => {
    setFormData(prev => {
      const exists = prev.interests.includes(interest);
      return {
        ...prev,
        interests: exists 
          ? prev.interests.filter(i => i !== interest)
          : [...prev.interests, interest]
      };
    });
  };

  const handleDateChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.start_date && updated.end_date) {
        const d1 = new Date(updated.start_date);
        const d2 = new Date(updated.end_date);
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
        if (diffDays > 0) {
          updated.duration_days = diffDays;
        }
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel-elevated modal-content animate-fade-in" style={{
        maxWidth: 720,
        padding: '30px',
        position: 'relative'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={24} color="var(--accent-primary)" />
              <span>Smart Trip Builder</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Configure your preferences for custom AI itinerary generation
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              padding: 6
            }}
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Destination */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={16} color="var(--accent-cyan)" />
              <span>Destination City or Country</span>
            </label>
            <input
              type="text"
              required
              className="form-input"
              placeholder="e.g. Tokyo, Paris, Bali, New York"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
            />
            {/* Quick chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
              {POPULAR_DESTINATIONS.map(city => (
                <button
                  type="button"
                  key={city}
                  onClick={() => setFormData({ ...formData, destination: city.split(',')[0] })}
                  style={{
                    background: formData.destination.toLowerCase().includes(city.split(',')[0].toLowerCase()) ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-full)',
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    padding: '3px 10px',
                    cursor: 'pointer'
                  }}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Dates & Duration */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.start_date}
                onChange={(e) => handleDateChange('start_date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">End Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.end_date}
                onChange={(e) => handleDateChange('end_date', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Days</label>
              <input
                type="number"
                min="1"
                max="14"
                className="form-input"
                value={formData.duration_days}
                onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>

          {/* Party & Budget */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Travel Party</label>
              <select
                className="form-select"
                value={formData.travel_party}
                onChange={(e) => setFormData({ ...formData, travel_party: e.target.value })}
              >
                <option value="Solo">Solo Traveler</option>
                <option value="Couple">Couple / Romantic</option>
                <option value="Family">Family with Kids</option>
                <option value="Friends">Friends Group</option>
                <option value="Group">Organized Group</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">People</label>
              <input
                type="number"
                min="1"
                max="25"
                className="form-input"
                value={formData.group_size}
                onChange={(e) => setFormData({ ...formData, group_size: parseInt(e.target.value) || 1 })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Budget Level</label>
              <select
                className="form-select"
                value={formData.budget_level}
                onChange={(e) => setFormData({ ...formData, budget_level: e.target.value })}
              >
                <option value="Budget">Budget Backpacker ($)</option>
                <option value="Moderate">Moderate / Balanced ($$)</option>
                <option value="Luxury">Luxury / Premium ($$$)</option>
              </select>
            </div>
          </div>

          {/* Travel Style */}
          <div className="form-group">
            <label className="form-label">Pace & Style</label>
            <select
              className="form-select"
              value={formData.travel_style}
              onChange={(e) => setFormData({ ...formData, travel_style: e.target.value })}
            >
              <option value="Balanced">Balanced (Comfortable mix of landmarks & relaxation)</option>
              <option value="Relaxed">Relaxed & Leisurely (Unhurried mornings & scenic stops)</option>
              <option value="Adventure">Adventure & Outdoors (Hiking, nature & active tours)</option>
              <option value="Cultural">Cultural & Historic (Museums, temples & heritage walks)</option>
              <option value="Romantic">Romantic (Sunset vistas, cozy dining & scenic strolls)</option>
              <option value="Fast-paced">Fast-paced (Max attractions in minimum time)</option>
            </select>
          </div>

          {/* Interests Checklist */}
          <div className="form-group">
            <label className="form-label">Interests & Activities (Select to customize)</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
              {AVAILABLE_INTERESTS.map(item => {
                const isSelected = formData.interests.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => toggleInterest(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      background: isSelected ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.04)',
                      border: `1px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                      color: isSelected ? '#a5b4fc' : 'var(--text-muted)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {isSelected && <Check size={14} />}
                    <span>{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Special Requirements */}
          <div className="form-group">
            <label className="form-label">Special Preferences or Notes (Optional)</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="e.g. Vegetarian dining preference, prefer walking and metro over taxis, avoid high altitudes..."
              value={formData.special_requirements}
              onChange={(e) => setFormData({ ...formData, special_requirements: e.target.value })}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <button
              type="button"
              onClick={onClose}
              className="secondary-btn"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-btn"
              disabled={loading}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Synthesizing Itinerary with AI...' : 'Generate AI Itinerary'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
