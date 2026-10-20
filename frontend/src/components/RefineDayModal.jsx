import React, { useState } from 'react';
import { X, RefreshCw, Wand2, Sparkles, Tag } from 'lucide-react';

const QUICK_INSTRUCTIONS = [
  "Add more romantic scenic sunset spots & candlelit dinner",
  "Replace expensive restaurants with authentic local street food",
  "Make this day more leisurely and relaxed with fewer rushed spots",
  "Include outdoor nature trails and scenic photography viewpoints",
  "Focus on museums, art galleries and architectural monuments"
];

export default function RefineDayModal({ isOpen, onClose, day, trip, onRefineDay, loading }) {
  if (!isOpen || !day) return null;

  const [instruction, setInstruction] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!instruction.trim()) return;

    onRefineDay({
      trip_id: trip.id,
      destination: trip.destination,
      day_number: day.day_number,
      current_day: day,
      user_instruction: instruction,
      budget_level: trip.budget_level,
      travel_style: trip.travel_style,
      interests: trip.interests || []
    });
  };

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
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Wand2 size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Refine Day {day.day_number} Plan</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                {day.theme}
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

        {/* Current Day Preview */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(0,0,0,0.25)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 16,
          fontSize: '0.85rem'
        }}>
          <div style={{ color: 'var(--text-dim)', marginBottom: 4 }}>Current Activities:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {day.activities.map((a, idx) => (
              <span key={idx} style={{
                background: 'rgba(255,255,255,0.06)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.78rem'
              }}>
                {a.time_slot}: {a.title}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">How would you like to customize this day?</label>
            <textarea
              className="form-textarea"
              rows={3}
              required
              placeholder="e.g. Add more romantic spots, swap museum for a park, or find budget street food..."
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
            />
          </div>

          {/* Quick suggestions */}
          <div style={{ marginBottom: 20 }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'block', marginBottom: 8 }}>
              Quick prompts:
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {QUICK_INSTRUCTIONS.map((text, i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setInstruction(text)}
                  style={{
                    textAlign: 'left',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 10px',
                    color: 'var(--text-muted)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    transition: 'background var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99,102,241,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                >
                  ✨ {text}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <button type="button" onClick={onClose} className="secondary-btn" disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="gradient-btn" disabled={loading || !instruction.trim()}>
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              <span>{loading ? 'Regenerating Day...' : 'Apply AI Customization'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
