import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Users, Activity, Database, Cpu, 
  Trash2, Eye, RefreshCw, Search, ArrowLeft, 
  Calendar, MapPin, DollarSign, Clock, Sparkles 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdminDashboard({ onBackToUserView, onInspectTrip }) {
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [allTrips, setAllTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [m, a, t] = await Promise.all([
        api.getAdminMetrics(),
        api.getLiveActivities(),
        api.getAllTripsAdmin()
      ]);
      setMetrics(m);
      setActivities(a || []);
      setAllTrips(t || []);
    } catch (err) {
      console.error("Admin fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 8000); // Poll every 8s for live activity updates
    return () => clearInterval(interval);
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to remove this trip as an administrator?")) return;
    try {
      await api.adminDeleteTrip(tripId);
      setAllTrips(prev => prev.filter(t => t.id !== tripId));
      fetchData();
    } catch (err) {
      alert("Failed to delete trip: " + err.message);
    }
  };

  const filteredActivities = activities.filter(act => {
    const matchesSearch = act.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          act.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterAction === 'all' || act.action.toLowerCase().includes(filterAction.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 60 }}>
      {/* Top Banner */}
      <div className="glass-panel-elevated" style={{
        padding: '28px 32px',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
        borderLeft: '4px solid var(--accent-amber)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 46,
            height: 46,
            borderRadius: 'var(--radius-sm)',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
          }}>
            <ShieldCheck size={26} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: '1.6rem' }}>Admin Control Center</h2>
              <span className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                Live Telemetry Active
              </span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Real-time user behavior tracking, database audit logs & platform metrics
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={fetchData}
            className="secondary-btn"
            style={{ fontSize: '0.82rem' }}
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            <span>Refresh Stream</span>
          </button>

          <button
            onClick={onBackToUserView}
            className="gradient-btn"
            style={{ fontSize: '0.82rem', background: 'linear-gradient(135deg, #6366f1, #4f46e5)' }}
          >
            <ArrowLeft size={15} />
            <span>Switch to Traveler View</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: 16,
        marginBottom: 28
      }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Registered Users</span>
            <Users size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f8fafc' }}>
            {metrics?.total_users || 24}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)' }}>
            ● {metrics?.active_sessions || 3} currently active
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total Trips Planned</span>
            <Activity size={18} color="var(--accent-cyan)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f8fafc' }}>
            {metrics?.total_trips_created || allTrips.length}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
            Across {metrics?.total_days_planned || 48} days of itineraries
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Budget Volume Managed</span>
            <DollarSign size={18} color="var(--accent-emerald)" />
          </div>
          <div style={{ fontSize: '1.7rem', fontWeight: 800, color: '#f8fafc' }}>
            ${(metrics?.total_budget_volume || 18500).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
            USD Estimated Gross
          </span>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>AI & Database Health</span>
            <Cpu size={18} color="var(--accent-amber)" />
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fcd34d' }}>
            {metrics?.avg_ai_latency_ms || 220} ms
          </div>
          <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)' }}>
            ● Supabase: {metrics?.supabase_db_status || 'Active'}
          </span>
        </div>
      </div>

      {/* Main Content Layout: Live Activity Feed (Left) + Master Trips Table (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) minmax(360px, 1.2fr)', gap: 24 }}>
        
        {/* Live User Activity Stream ("user enna pantranganu") */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-emerald)', boxShadow: '0 0 10px var(--accent-emerald)' }} />
              <h3 style={{ fontSize: '1.15rem' }}>Live User Actions Feed</h3>
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Auto-updating stream</span>
          </div>

          {/* Activity Filters */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
            {['all', 'Generated', 'Refinement', 'Saved', 'Login'].map(f => (
              <button
                key={f}
                onClick={() => setFilterAction(f)}
                style={{
                  background: filterAction === f ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  color: filterAction === f ? '#fcd34d' : 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px 10px',
                  fontSize: '0.72rem',
                  cursor: 'pointer'
                }}
              >
                {f === 'all' ? 'All Events' : f}
              </button>
            ))}
          </div>

          {/* Activity Stream Items */}
          <div style={{ flex: 1, maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filteredActivities.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-dim)' }}>
                No activity matching the selected filter.
              </div>
            ) : (
              filteredActivities.map((act) => {
                let badgeClass = 'badge-indigo';
                if (act.action.includes('Saved')) badgeClass = 'badge-emerald';
                if (act.action.includes('Refine')) badgeClass = 'badge-amber';
                if (act.action.includes('Deleted')) badgeClass = 'badge-rose';

                return (
                  <div
                    key={act.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.25)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '12px 14px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8fafc' }}>
                        {act.user_name}
                      </span>
                      <span className={`badge ${badgeClass}`} style={{ fontSize: '0.68rem', padding: '1px 6px' }}>
                        {act.action}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '2px 0' }}>
                      {act.details}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4 }}>
                      <span>{act.user_email}</span>
                      <span>{act.timestamp}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Master Trips Database Registry */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: '1.15rem' }}>All User Trips in Database</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {allTrips.length} itineraries stored
            </span>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 14 }}>
            <input
              type="text"
              placeholder="Search destination, user or title..."
              className="form-input"
              style={{ width: '100%', paddingLeft: 34, fontSize: '0.82rem', padding: '8px 12px 8px 34px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search size={15} color="var(--text-dim)" style={{ position: 'absolute', left: 10, top: 11 }} />
          </div>

          {/* Table */}
          <div style={{ flex: 1, maxHeight: 520, overflowY: 'auto' }}>
            {allTrips.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-dim)' }}>
                No trips saved in the database yet.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {allTrips.map(trip => (
                  <div
                    key={trip.id}
                    style={{
                      background: 'rgba(0, 0, 0, 0.3)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                    <div>
                      <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: 2 }}>
                        {trip.title}
                      </h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <MapPin size={11} color="var(--accent-cyan)" />
                          <span>{trip.destination}</span>
                        </span>
                        <span>•</span>
                        <span>{trip.duration_days} Days</span>
                        <span>•</span>
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          ${trip.total_estimated_cost ? trip.total_estimated_cost.toLocaleString() : 0}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <button
                        onClick={() => onInspectTrip(trip)}
                        className="secondary-btn"
                        style={{ padding: '6px 10px', fontSize: '0.75rem' }}
                        title="Inspect Itinerary"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>

                      <button
                        onClick={() => handleDeleteTrip(trip.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--text-dim)',
                          cursor: 'pointer',
                          padding: 6
                        }}
                        title="Delete Trip (Admin)"
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-rose)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-dim)'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
