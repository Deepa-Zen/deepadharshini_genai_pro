import os
from typing import Dict, Any, List, Optional
from app.config import settings

class SupabaseService:
    def __init__(self):
        self.client = None
        self.is_connected = False
        self._local_storage: Dict[str, Dict[str, Any]] = {}
        
        if settings.SUPABASE_URL and settings.SUPABASE_ANON_KEY:
            try:
                from supabase import create_client, Client
                self.client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
                self.is_connected = True
                print("[SupabaseService] Connected to Supabase Cloud Database.")
            except Exception as e:
                print(f"[SupabaseService] Cloud connection failed ({e}). Using local in-memory fallback store.")
                self.is_connected = False
        else:
            print("[SupabaseService] No Supabase credentials set. Operating in local in-memory store mode.")

    def save_trip(self, trip_data: Dict[str, Any], user_id: str = "demo-user") -> Dict[str, Any]:
        """Saves an itinerary to Supabase or the local fallback store."""
        trip_id = trip_data.get("id")
        trip_data["user_id"] = user_id
        
        if self.is_connected and self.client:
            try:
                # 1. Insert into trips table
                db_trip = {
                    "id": trip_id,
                    "user_id": user_id,
                    "title": trip_data.get("title"),
                    "destination": trip_data.get("destination"),
                    "start_date": trip_data.get("start_date"),
                    "end_date": trip_data.get("end_date"),
                    "duration_days": trip_data.get("duration_days"),
                    "travel_style": trip_data.get("travel_style"),
                    "travel_party": trip_data.get("travel_party"),
                    "group_size": trip_data.get("group_size", 1),
                    "budget_level": trip_data.get("budget_level"),
                    "total_estimated_cost": trip_data.get("total_estimated_cost", 0.0),
                    "currency": trip_data.get("currency", "USD"),
                    "ai_summary": trip_data.get("summary", "")
                }
                res = self.client.table("trips").upsert(db_trip).execute()
                self._local_storage[trip_id] = trip_data
                return trip_data
            except Exception as e:
                print(f"[SupabaseService] Error saving to Supabase: {e}. Storing locally.")
                
        self._local_storage[trip_id] = trip_data
        return trip_data

    def get_trip(self, trip_id: str) -> Optional[Dict[str, Any]]:
        """Retrieves a single trip by ID."""
        if self.is_connected and self.client:
            try:
                res = self.client.table("trips").select("*").eq("id", trip_id).execute()
                if res.data:
                    return self._local_storage.get(trip_id, res.data[0])
            except Exception as e:
                print(f"[SupabaseService] Error fetching trip: {e}")
                
        return self._local_storage.get(trip_id)

    def list_user_trips(self, user_id: str = "demo-user") -> List[Dict[str, Any]]:
        """Lists all trips for the active user."""
        if self.is_connected and self.client:
            try:
                res = self.client.table("trips").select("*").order("created_at", desc=True).execute()
                if res.data:
                    # Enrich with local full itinerary details if present
                    return [self._local_storage.get(item["id"], item) for item in res.data]
            except Exception as e:
                print(f"[SupabaseService] Error listing trips: {e}")
                
        return list(self._local_storage.values())

    def delete_trip(self, trip_id: str) -> bool:
        """Deletes a trip from storage."""
        if trip_id in self._local_storage:
            del self._local_storage[trip_id]
            
        if self.is_connected and self.client:
            try:
                self.client.table("trips").delete().eq("id", trip_id).execute()
            except Exception as e:
                print(f"[SupabaseService] Error deleting trip: {e}")
                
        return True

supabase_service = SupabaseService()
