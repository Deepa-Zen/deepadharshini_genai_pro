// Frontend API Client for Personalized Travel Itinerary Planner
const API_BASE = '/api';

export const api = {
  // Auth
  async login(email, password, role = 'user') {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    if (!res.ok) throw new Error("Login failed");
    return await res.json();
  },

  async register(full_name, email, password, role = 'user') {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ full_name, email, password, role }),
    });
    if (!res.ok) throw new Error("Registration failed");
    return await res.json();
  },

  // Admin Telemetry & Real-time Monitoring
  async getAdminMetrics() {
    try {
      const res = await fetch(`${API_BASE}/admin/metrics`);
      if (!res.ok) throw new Error("Failed to fetch admin metrics");
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  async getLiveActivities() {
    try {
      const res = await fetch(`${API_BASE}/admin/activities`);
      if (!res.ok) throw new Error("Failed to fetch activities");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async getAllTripsAdmin() {
    try {
      const res = await fetch(`${API_BASE}/admin/all-trips`);
      if (!res.ok) throw new Error("Failed to fetch all trips");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  async adminDeleteTrip(tripId) {
    const res = await fetch(`${API_BASE}/admin/trips/${tripId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error("Failed to delete trip");
    return await res.json();
  },

  // Health & connection status
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`);
      return await res.json();
    } catch (err) {
      console.warn("Backend health check failed:", err);
      return { status: "offline" };
    }
  },

  // Get project preset scenarios (Solo, Couple, Small Group)
  async getScenarios() {
    try {
      const res = await fetch(`${API_BASE}/itinerary/scenarios`);
      if (!res.ok) throw new Error("Failed to fetch scenarios");
      return await res.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },

  // Generate complete day-by-day itinerary with AI
  async generateItinerary(preferences) {
    const res = await fetch(`${API_BASE}/itinerary/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preferences),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to generate itinerary");
    }
    return await res.json();
  },

  // Refine single day with user instruction
  async refineDay(data) {
    const res = await fetch(`${API_BASE}/itinerary/refine-day`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.detail || "Failed to refine day");
    }
    return await res.json();
  },

  // Save trip to Supabase / Backend store
  async saveTrip(trip) {
    const res = await fetch(`${API_BASE}/trips`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trip),
    });
    if (!res.ok) throw new Error("Failed to save trip");
    return await res.json();
  },

  // List all saved trips
  async getSavedTrips() {
    try {
      const res = await fetch(`${API_BASE}/trips`);
      if (!res.ok) throw new Error("Failed to list trips");
      return await res.json();
    } catch (err) {
      console.error("Error fetching trips:", err);
      return [];
    }
  },

  // Delete saved trip
  async deleteTrip(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error("Failed to delete trip");
    return await res.json();
  },

  // Export trip summary
  async exportTrip(tripId) {
    const res = await fetch(`${API_BASE}/trips/${tripId}/export`);
    if (!res.ok) throw new Error("Failed to export trip");
    return await res.json();
  }
};
