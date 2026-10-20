# pyrefly: ignore[missing-import]
from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.services.supabase_client import supabase_service

router = APIRouter(prefix="/trips", tags=["Trips"])

@router.post("", response_model=Dict[str, Any])
async def save_trip(trip: Dict[str, Any]):
    """Saves a trip itinerary to Supabase / store."""
    try:
        saved = supabase_service.save_trip(trip)
        return {"status": "success", "message": "Trip saved successfully", "trip": saved}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save trip: {str(e)}")

@router.get("", response_model=List[Dict[str, Any]])
async def list_trips():
    """Lists all saved trips."""
    return supabase_service.list_user_trips()

@router.get("/{trip_id}", response_model=Dict[str, Any])
async def get_trip(trip_id: str):
    """Retrieves a single trip by ID."""
    trip = supabase_service.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/{trip_id}")
async def delete_trip(trip_id: str):
    """Deletes a trip by ID."""
    success = supabase_service.delete_trip(trip_id)
    return {"status": "success", "message": "Trip deleted successfully"}

@router.get("/{trip_id}/export")
async def export_trip(trip_id: str):
    """Exports trip summary in human-readable markdown format."""
    trip = supabase_service.get_trip(trip_id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
        
    lines = [
        f"# {trip.get('title', 'Travel Itinerary')}",
        f"**Destination**: {trip.get('destination')}",
        f"**Dates**: {trip.get('start_date')} to {trip.get('end_date')} ({trip.get('duration_days')} Days)",
        f"**Travel Style**: {trip.get('travel_style')} | **Party**: {trip.get('travel_party')} ({trip.get('group_size', 1)} people)",
        f"**Total Estimated Budget**: ${trip.get('total_estimated_cost', 0):,.2f}",
        "",
        "## Overview",
        trip.get('summary', 'No summary provided.'),
        "",
        "## Daily Schedule"
    ]
    
    for day in trip.get("days", []):
        lines.append(f"\n### Day {day.get('day_number')}: {day.get('theme')}")
        lines.append(f"*{day.get('daily_overview', '')}* (Est. Cost: ${day.get('estimated_day_cost', 0):,.2f})\n")
        for act in day.get("activities", []):
            time_slot = act.get('time_slot')
            start = act.get('start_time')
            title = act.get('title')
            cost = f"${act.get('estimated_cost', 0):,.2f}"
            lines.append(f"- **[{time_slot} - {start}] {title}** ({cost})")
            lines.append(f"  {act.get('description', '')}")
            if act.get('tips'):
                lines.append(f"  *Tip: {act.get('tips')}*")
                
    return {
        "format": "markdown",
        "trip_id": trip_id,
        "content": "\n".join(lines)
    }
