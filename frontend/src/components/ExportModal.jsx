import React, { useState } from 'react';
import { X, Copy, Download, Check, FileText, Share2, Code } from 'lucide-react';

export default function ExportModal({ isOpen, onClose, trip }) {
  if (!isOpen || !trip) return null;

  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('summary'); // 'summary' | 'json'

  const generateMarkdown = () => {
    let md = `# ${trip.title}\n\n`;
    md += `**Destination**: ${trip.destination}\n`;
    md += `**Dates**: ${trip.start_date} to ${trip.end_date} (${trip.duration_days} Days)\n`;
    md += `**Party**: ${trip.travel_party} (${trip.group_size || 1} people) | **Pace**: ${trip.travel_style}\n`;
    md += `**Budget Level**: ${trip.budget_level} | **Est. Total**: $${trip.total_estimated_cost?.toLocaleString()}\n\n`;
    md += `## Trip Overview\n${trip.summary}\n\n`;
    
    if (trip.logistics_tips && trip.logistics_tips.length > 0) {
      md += `## Logistics & Transit Tips\n`;
      trip.logistics_tips.forEach(tip => {
        md += `- ${tip}\n`;
      });
      md += `\n`;
    }

    md += `## Day-by-Day Schedule\n\n`;
    trip.days.forEach(day => {
      md += `### Day ${day.day_number}: ${day.theme}\n`;
      md += `*${day.daily_overview}* (Est. Day Cost: $${day.estimated_day_cost})\n\n`;
      day.activities.forEach(act => {
        md += `- **[${act.time_slot} - ${act.start_time}] ${act.title}** ($${act.estimated_cost})\n`;
        md += `  ${act.description}\n`;
        if (act.tips) md += `  *Tip: ${act.tips}*\n`;
      });
      md += `\n`;
    });

    return md;
  };

  const markdownContent = generateMarkdown();
  const jsonContent = JSON.stringify(trip, null, 2);

  const handleCopy = () => {
    const text = activeTab === 'summary' ? markdownContent : jsonContent;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const isJson = activeTab === 'json';
    const blob = new Blob([isJson ? jsonContent : markdownContent], {
      type: isJson ? 'application/json' : 'text/markdown'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${trip.destination.toLowerCase().replace(/\s+/g, '_')}_itinerary.${isJson ? 'json' : 'md'}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel-elevated modal-content animate-fade-in" style={{
        maxWidth: 680,
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
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={20} color="#fff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Export Itinerary</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Download or copy your complete customized plan
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

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <button
            onClick={() => setActiveTab('summary')}
            className={activeTab === 'summary' ? 'gradient-btn' : 'secondary-btn'}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <FileText size={15} />
            <span>Markdown Plan</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={activeTab === 'json' ? 'gradient-btn' : 'secondary-btn'}
            style={{ fontSize: '0.82rem', padding: '6px 14px' }}
          >
            <Code size={15} />
            <span>JSON Data</span>
          </button>
        </div>

        {/* Text Viewport */}
        <div style={{
          background: 'rgba(0,0,0,0.5)',
          padding: '16px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          maxHeight: 360,
          overflowY: 'auto',
          fontSize: '0.82rem',
          fontFamily: 'monospace',
          color: '#cbd5e1',
          whiteSpace: 'pre-wrap',
          lineHeight: 1.5,
          marginBottom: 20
        }}>
          {activeTab === 'summary' ? markdownContent : jsonContent}
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleCopy}
            className="secondary-btn"
          >
            {copied ? <Check size={16} color="var(--accent-emerald)" /> : <Copy size={16} />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy to Clipboard'}</span>
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={onClose} className="secondary-btn">
              Close
            </button>
            <button onClick={handleDownload} className="gradient-btn">
              <Download size={16} />
              <span>Download File</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
