import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, Compass, MapPin, Calendar, Users, 
  ArrowRight, ShieldCheck, Zap, Globe 
} from 'lucide-react';
import Navbar from './components/Navbar';
import ScenarioPresets from './components/ScenarioPresets';
import TripBuilderModal from './components/TripBuilderModal';
import ItineraryView from './components/ItineraryView';
import RefineDayModal from './components/RefineDayModal';
import SavedTripsDrawer from './components/SavedTripsDrawer';
import ExportModal from './components/ExportModal';
import PackingChecklistModal from './components/PackingChecklistModal';
import { api } from './services/api';

export default function App() {
  const [currentTrip, setCurrentTrip] = useState(null);
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [health, setHealth] = useState(null);

  // Modals & Drawers
  const [builderOpen, setBuilderOpen] = useState(false);
  const [savedDrawerOpen, setSavedDrawerOpen] = useState(false);
  const [refineModalOpen, setRefineModalOpen] = useState(false);
  const [dayToRefine, setDayToRefine] = useState(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [packingModalOpen, setPackingModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Initial load
  useEffect(() => {
    async function init() {
      const h = await api.checkHealth();
      setHealth(h);
      const trips = await api.getSavedTrips();
      setSavedTrips(trips);
    }
    init();
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback if canvas is unavailable
    }
  };

  // Generate Itinerary Handler
  const handleGenerateItinerary = async (preferences) => {
    setLoading(true);
    try {
      const result = await api.generateItinerary(preferences);
      setCurrentTrip(result);
      setBuilderOpen(false);
      triggerConfetti();
      showToast(`Itinerary generated for ${result.destination}!`);
    } catch (err) {
      alert(`Error generating itinerary: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Refine Day Handler
  const handleRefineDay = async (refineRequest) => {
    setLoading(true);
    try {
      const updatedDay = await api.refineDay(refineRequest);
      setCurrentTrip(prev => {
        if (!prev) return prev;
        const newDays = prev.days.map(d => 
          d.day_number === updatedDay.day_number ? updatedDay : d
        );
        const newTotalCost = newDays.reduce((acc, d) => acc + (d.estimated_day_cost || 0), 0);
        return {
          ...prev,
          days: newDays,
          total_estimated_cost: newTotalCost
        };
      });
      setRefineModalOpen(false);
      setDayToRefine(null);
      showToast(`Day ${updatedDay.day_number} updated with AI customization!`);
    } catch (err) {
      alert(`Error refining day: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Save Trip
  const handleSaveTrip = async (trip) => {
    setSaveLoading(true);
    try {
      const res = await api.saveTrip(trip);
      const trips = await api.getSavedTrips();
      setSavedTrips(trips);
      showToast("Trip itinerary successfully saved!");
    } catch (err) {
      alert(`Error saving trip: ${err.message}`);
    } finally {
      setSaveLoading(false);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async (tripId) => {
    try {
      await api.deleteTrip(tripId);
      setSavedTrips(prev => prev.filter(t => t.id !== tripId));
      if (currentTrip?.id === tripId) {
        showToast("Active trip deleted from saved list.");
      }
    } catch (err) {
      alert(`Error deleting trip: ${err.message}`);
    }
  };

  const isCurrentTripSaved = currentTrip && savedTrips.some(t => t.id === currentTrip.id);

  return (
    <div style={{ minHeight: '100vh', padding: '16px 20px 60px 20px' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 2000,
          background: 'rgba(15, 23, 42, 0.95)',
          border: '1px solid var(--border-focus)',
          borderRadius: 'var(--radius-sm)',
          padding: '12px 20px',
          color: '#f8fafc',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.9rem',
          animation: 'fadeIn 0.25s ease-out'
        }}>
          <Sparkles size={18} color="var(--accent-primary)" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        onOpenNewTrip={() => setBuilderOpen(true)}
        onOpenSaved={() => setSavedDrawerOpen(true)}
        savedCount={savedTrips.length}
        health={health}
      />

      <main style={{ maxWidth: 1280, margin: '0 auto' }}>
        {/* If no trip generated yet, show Welcome Hero & Scenarios */}
        {!currentTrip ? (
          <div>
            {/* Dashboard Hero */}
            <div className="glass-panel-elevated" style={{
              padding: '48px 36px',
              marginBottom: 40,
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                <span className="badge badge-indigo">
                  <Sparkles size={13} />
                  <span>Enterprise AI Autonomous Travel Agent</span>
                </span>
              </div>

              <h1 style={{ fontSize: '2.9rem', maxWidth: 860, margin: '0 auto 16px auto', lineHeight: 1.15 }}>
                Personalized Day-by-Day Travel Plans in <span className="gradient-text">Seconds</span>
              </h1>

              <p style={{
                fontSize: '1.08rem',
                color: 'var(--text-muted)',
                maxWidth: 680,
                margin: '0 auto 30px auto',
                lineHeight: 1.6
              }}>
                Harnessing generative AI, route optimization, and prompt engineering to deliver structured itineraries with attractions, dining, accommodations, and transportation.
              </p>

              <div style={{ display: 'flex', justifyContent: 'center', gap: 14, flexWrap: 'wrap' }}>
                <button
                  onClick={() => setBuilderOpen(true)}
                  className="gradient-btn"
                  style={{ fontSize: '1rem', padding: '12px 26px' }}
                >
                  <Sparkles size={18} />
                  <span>Build Custom Trip</span>
                </button>

                <button
                  onClick={() => setSavedDrawerOpen(true)}
                  className="secondary-btn"
                  style={{ fontSize: '1rem', padding: '12px 24px' }}
                >
                  <span>View Saved Trips ({savedTrips.length})</span>
                </button>
              </div>

              {/* Feature Highlights Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
                marginTop: 40,
                paddingTop: 32,
                borderTop: '1px solid var(--border-subtle)',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(99, 102, 241, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Zap size={18} color="var(--accent-primary)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: 2 }}>Zero Decision Fatigue</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Automated research, route allocation, and scheduling.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(6, 182, 212, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Globe size={18} color="var(--accent-cyan)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: 2 }}>Curated Recommendations</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Local dining gems, hidden spots, and verified transit tips.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius-sm)',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <ShieldCheck size={18} color="var(--accent-emerald)" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.92rem', marginBottom: 2 }}>Dynamic Day Refinement</h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      Tweak or regenerate individual days on the fly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Presets: 3 Core Project Scenarios */}
            <ScenarioPresets
              onSelectScenario={handleGenerateItinerary}
              loading={loading}
            />
          </div>
        ) : (
          /* Active Itinerary View */
          <div>
            <ItineraryView
              trip={currentTrip}
              onSaveTrip={handleSaveTrip}
              onOpenExport={() => setExportModalOpen(true)}
              onOpenPacking={() => setPackingModalOpen(true)}
              onEditTrip={() => setBuilderOpen(true)}
              onOpenRefine={(day) => {
                setDayToRefine(day);
                setRefineModalOpen(true);
              }}
              isSaved={isCurrentTripSaved}
              saveLoading={saveLoading}
            />

            <div style={{ textAlign: 'center', marginTop: 40 }} className="no-print">
              <button
                onClick={() => setCurrentTrip(null)}
                className="secondary-btn"
                style={{ fontSize: '0.85rem' }}
              >
                ← Back to Dashboard & Scenarios
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modals & Slide-overs */}
      <TripBuilderModal
        isOpen={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onGenerate={handleGenerateItinerary}
        initialData={currentTrip ? {
          destination: currentTrip.destination,
          start_date: currentTrip.start_date,
          end_date: currentTrip.end_date,
          duration_days: currentTrip.duration_days,
          budget_level: currentTrip.budget_level,
          travel_party: currentTrip.travel_party,
          group_size: currentTrip.group_size || 1,
          travel_style: currentTrip.travel_style,
          interests: ['Sightseeing', 'Food & Dining'],
          special_requirements: '',
          currency: currentTrip.currency || 'USD'
        } : null}
        loading={loading}
      />

      <RefineDayModal
        isOpen={refineModalOpen}
        onClose={() => {
          setRefineModalOpen(false);
          setDayToRefine(null);
        }}
        day={dayToRefine}
        trip={currentTrip}
        onRefineDay={handleRefineDay}
        loading={loading}
      />

      <SavedTripsDrawer
        isOpen={savedDrawerOpen}
        onClose={() => setSavedDrawerOpen(false)}
        savedTrips={savedTrips}
        onSelectTrip={(trip) => setCurrentTrip(trip)}
        onDeleteTrip={handleDeleteTrip}
      />

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        trip={currentTrip}
      />

      <PackingChecklistModal
        isOpen={packingModalOpen}
        onClose={() => setPackingModalOpen(false)}
        trip={currentTrip}
      />
    </div>
  );
}
