from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class Activity(BaseModel):
    id: Optional[str] = None
    time_slot: str = Field(..., description="Morning, Afternoon, Evening, Night")
    start_time: str = Field(default="09:00 AM")
    title: str
    description: str
    category: str = Field(..., description="Attraction, Dining, Accommodation, Transport, Leisure")
    location_name: str
    location_address: Optional[str] = None
    estimated_cost: float = 0.0
    cost_level: str = "Free" # Free, $, $$, $$$
    duration_minutes: int = 60
    tips: Optional[str] = None
    booking_required: bool = False

class ItineraryDay(BaseModel):
    day_number: int
    date: Optional[str] = None
    theme: str
    daily_overview: str
    estimated_day_cost: float = 0.0
    activities: List[Activity] = []

class TripPreferences(BaseModel):
    destination: str
    start_date: str
    end_date: str
    duration_days: int = 3
    budget_level: str = Field(default="Moderate", description="Budget, Moderate, Luxury")
    travel_party: str = Field(default="Solo", description="Solo, Couple, Family, Friends, Group")
    group_size: int = 1
    travel_style: str = Field(default="Balanced", description="Relaxed, Adventure, Cultural, Romantic, Budget Backpacker, Luxury")
    interests: List[str] = Field(default_factory=lambda: ["Sightseeing", "Food"])
    special_requirements: Optional[str] = None
    currency: str = "USD"

class GeneratedItinerary(BaseModel):
    id: Optional[str] = None
    title: str
    destination: str
    duration_days: int
    start_date: str
    end_date: str
    travel_party: str
    group_size: int
    travel_style: str
    budget_level: str
    currency: str = "USD"
    total_estimated_cost: float
    budget_breakdown: Dict[str, float] = Field(default_factory=dict)
    summary: str
    logistics_tips: List[str] = Field(default_factory=list)
    days: List[ItineraryDay] = []
    created_at: Optional[str] = None

class RefineDayRequest(BaseModel):
    trip_id: Optional[str] = None
    destination: str
    day_number: int
    current_day: ItineraryDay
    user_instruction: str # e.g. "Add more romantic scenic spots" or "Replace expensive lunch with local street food"
    budget_level: str = "Moderate"
    travel_style: str = "Balanced"
    interests: List[str] = []
