from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.models.itinerary import (
    TripPreferences,
    GeneratedItinerary,
    ItineraryDay,
    RefineDayRequest
)
from app.services.ai_generator import ai_engine
from app.services.activity_logger import activity_logger

router = APIRouter(prefix="/itinerary", tags=["Itinerary"])

@router.post("/generate", response_model=GeneratedItinerary)
async def generate_itinerary(preferences: TripPreferences):
    """Generates a complete day-by-day travel itinerary using AI."""
    try:
        itinerary = ai_engine.generate_itinerary(preferences)
        # Log to live admin activity feed
        activity_logger.log_activity(
            user_name=f"Traveler ({preferences.travel_party})",
            user_email="traveler@wanderai.com",
            action="Generated Itinerary",
            details=f"{preferences.duration_days}-Day {preferences.travel_style} trip to {preferences.destination} (${itinerary.total_estimated_cost:,.2f})"
        )
        return itinerary
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")

@router.post("/refine-day", response_model=ItineraryDay)
async def refine_itinerary_day(request: RefineDayRequest):
    """Refines and customizes an individual day based on user instructions."""
    try:
        updated_day = ai_engine.refine_day(request)
        # Log to live admin activity feed
        activity_logger.log_activity(
            user_name="Active Traveler",
            user_email="traveler@wanderai.com",
            action="AI Day Refinement",
            details=f"Day {request.day_number} ({request.destination}): '{request.user_instruction[:40]}...'"
        )
        return updated_day
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to refine day: {str(e)}")

@router.get("/scenarios", response_model=List[Dict[str, Any]])
async def get_preset_scenarios():
    """Returns curated presets for the 3 core project scenarios."""
    return [
        {
            "id": "scenario-1",
            "name": "Solo Traveler Weekend Getaway",
            "tagline": "Fast, balanced weekend with optimized routes and local eats",
            "badge": "Solo",
            "defaults": {
                "destination": "Tokyo",
                "start_date": "2026-11-06",
                "end_date": "2026-11-08",
                "duration_days": 3,
                "budget_level": "Moderate",
                "travel_party": "Solo",
                "group_size": 1,
                "travel_style": "Balanced",
                "interests": ["Sightseeing", "Food", "Technology", "Photography"],
                "special_requirements": "Fast-paced, minimize transit times, great solo dining spots"
            }
        },
        {
            "id": "scenario-2",
            "name": "Couple Romantic Vacation",
            "tagline": "Relaxed pacing, scenic sunset vistas, and curated dining",
            "badge": "Couple",
            "defaults": {
                "destination": "Paris",
                "start_date": "2026-12-10",
                "end_date": "2026-12-14",
                "duration_days": 5,
                "budget_level": "Luxury",
                "travel_party": "Couple",
                "group_size": 2,
                "travel_style": "Romantic",
                "interests": ["Scenic Views", "Fine Dining", "Art & Architecture", "Relaxation"],
                "special_requirements": "Unhurried mornings, candlelit dinners, riverside viewpoints"
            }
        },
        {
            "id": "scenario-3",
            "name": "Small Group Multi-Day Adventure",
            "tagline": "Shared costs, adventure trails, culture, and vibrant group vibes",
            "badge": "Group",
            "defaults": {
                "destination": "Bali",
                "start_date": "2027-01-15",
                "end_date": "2027-01-21",
                "duration_days": 7,
                "budget_level": "Budget",
                "travel_party": "Friends",
                "group_size": 5,
                "travel_style": "Adventure",
                "interests": ["Outdoor Adventure", "Beaches", "Culture", "Nightlife", "Local Markets"],
                "special_requirements": "Group-friendly activities, budget allocation, shared transport tips"
            }
        }
    ]
