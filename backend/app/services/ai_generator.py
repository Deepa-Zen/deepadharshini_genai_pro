import json
import uuid
import datetime
from typing import Dict, Any, List
from app.config import settings
from app.models.itinerary import (
    TripPreferences,
    GeneratedItinerary,
    ItineraryDay,
    Activity,
    RefineDayRequest
)

# Destination knowledge base for realistic offline synthesis and enrichment
DESTINATION_CATALOG = {
    "paris": {
        "highlights": ["Eiffel Tower", "Louvre Museum", "Montmartre & Sacré-Cœur", "Seine River Cruise", "Le Marais", "Palace of Versailles", "Musée d'Orsay"],
        "dining": ["Café de Flore", "Le Relais de l'Entrecôte", "Pink Mamma", "Boulangerie Poilâne", "Chez Janou bistro"],
        "transport": "Paris Métro & RER (Navigo Easy Pass)",
        "currency": "EUR",
        "avg_daily_budget": {"Budget": 65, "Moderate": 160, "Luxury": 450}
    },
    "tokyo": {
        "highlights": ["Shibuya Crossing & Sky", "Senso-ji Temple Asakusa", "Shinjuku Gyoen National Garden", "Akihabara Tech District", "Meiji Shrine & Harajuku", "TeamLab Planets"],
        "dining": ["Ichiran Shibuya", "Tsukiji Outer Market Food Tour", "Omoide Yokocho Yakitori", "Ginza Sushi Yoshitake", "Fuunji Ramen"],
        "transport": "Tokyo Metro & JR Yamanote Line (Suica/Pasmo card)",
        "currency": "JPY",
        "avg_daily_budget": {"Budget": 60, "Moderate": 140, "Luxury": 420}
    },
    "new york": {
        "highlights": ["Central Park & The Met", "Times Square & Broadway", "High Line & Hudson Yards", "Statue of Liberty & Ellis Island", "Brooklyn Bridge & DUMBO", "Summit One Vanderbilt"],
        "dining": ["Joe's Pizza Greenwich Village", "Katz's Delicatessen", "Chelsea Market Tacos", "Le Bernardin", "Gramercy Tavern"],
        "transport": "MTA Subway (OMNY contactless tap)",
        "currency": "USD",
        "avg_daily_budget": {"Budget": 90, "Moderate": 220, "Luxury": 550}
    },
    "bali": {
        "highlights": ["Ubud Monkey Forest", "Tegallalang Rice Terraces", "Uluwatu Temple & Kecak Dance", "Seminyak Beach Sunset", "Mount Batur Sunrise Trek", "Tirta Empul Water Temple"],
        "dining": ["Locavore Ubud", "Naughty Nuri's Ribs", "La Brisa Beach Club Canggu", "Warung Babi Guling Ibu Oka", "Single Fin Uluwatu"],
        "transport": "Scooter rental or private driver with Grab/Gojek app",
        "currency": "IDR",
        "avg_daily_budget": {"Budget": 35, "Moderate": 90, "Luxury": 280}
    },
    "rome": {
        "highlights": ["Colosseum & Roman Forum", "Vatican Museums & Sistine Chapel", "Trevi Fountain", "Pantheon", "Piazza Navona", "Trastevere Cobblestone Walk"],
        "dining": ["Da Enzo al 29", "Roscioli Salumeria", "Two Sizes Tiramisu", "Pizzarium Bonci", "Armando al Pantheon"],
        "transport": "ATAC Rome Metro & scenic walking",
        "currency": "EUR",
        "avg_daily_budget": {"Budget": 60, "Moderate": 150, "Luxury": 400}
    }
}

class AIEngine:
    def __init__(self):
        self.gemini_available = False
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
                self.gemini_available = True
            except Exception as e:
                print(f"[AIEngine] Gemini init error: {e}")
                self.gemini_available = False

    def generate_itinerary(self, prefs: TripPreferences) -> GeneratedItinerary:
        """Main method to generate a full customized day-by-day travel plan."""
        if self.gemini_available:
            try:
                return self._generate_with_gemini(prefs)
            except Exception as e:
                print(f"[AIEngine] Gemini generation failed, falling back to smart local synthesis: {e}")
        
        return self._generate_smart_local(prefs)

    def refine_day(self, req: RefineDayRequest) -> ItineraryDay:
        """Regenerate or adjust an individual day's activities based on custom instructions."""
        if self.gemini_available:
            try:
                return self._refine_with_gemini(req)
            except Exception as e:
                print(f"[AIEngine] Gemini day refinement failed, falling back: {e}")
                
        return self._refine_smart_local(req)

    def _generate_with_gemini(self, prefs: TripPreferences) -> GeneratedItinerary:
        prompt = f"""
You are an expert AI Travel Concierge. Generate a highly detailed, personalized day-by-day itinerary JSON.
Requirements:
- Destination: {prefs.destination}
- Duration: {prefs.duration_days} days (from {prefs.start_date} to {prefs.end_date})
- Travel Party: {prefs.travel_party} (Group size: {prefs.group_size})
- Budget Level: {prefs.budget_level}
- Travel Style: {prefs.travel_style}
- Key Interests: {', '.join(prefs.interests)}
- Special Notes: {prefs.special_requirements or 'None'}
- Currency: {prefs.currency}

Format your response strictly as valid raw JSON with this exact schema:
{{
  "title": "Creative Trip Title",
  "summary": "Engaging 2-3 sentence overview of this curated journey",
  "total_estimated_cost": 450.00,
  "budget_breakdown": {{
     "attractions": 150.00,
     "dining": 180.00,
     "transportation": 70.00,
     "accommodation_estimate": 250.00
  }},
  "logistics_tips": ["Tip 1 on transit/passes", "Tip 2 on bookings", "Tip 3 on safety/timing"],
  "days": [
    {{
      "day_number": 1,
      "date": "{prefs.start_date}",
      "theme": "Captivating Day Theme",
      "daily_overview": "Summary of what today entails",
      "estimated_day_cost": 120.00,
      "activities": [
        {{
          "time_slot": "Morning",
          "start_time": "09:00 AM",
          "title": "Activity name",
          "description": "Engaging description and context",
          "category": "Attraction", 
          "location_name": "Specific place name",
          "location_address": "General district/area",
          "estimated_cost": 25.00,
          "cost_level": "$$",
          "duration_minutes": 120,
          "tips": "Pro-tip for visitors",
          "booking_required": true
        }}
      ]
    }}
  ]
}}
Ensure exactly {prefs.duration_days} days are provided with 3-4 activities (Morning, Afternoon, Evening, Night) per day. Return ONLY the JSON object.
"""
        response = self.gemini_model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        
        days_objs = []
        for d in data.get("days", []):
            acts = [Activity(**a) for a in d.get("activities", [])]
            days_objs.append(ItineraryDay(
                day_number=d.get("day_number", 1),
                date=d.get("date", prefs.start_date),
                theme=d.get("theme", f"Day {d.get('day_number')} Exploration"),
                daily_overview=d.get("daily_overview", ""),
                estimated_day_cost=float(d.get("estimated_day_cost", 0.0)),
                activities=acts
            ))
            
        return GeneratedItinerary(
            id=str(uuid.uuid4()),
            title=data.get("title", f"{prefs.duration_days}-Day {prefs.destination} Adventure"),
            destination=prefs.destination,
            duration_days=prefs.duration_days,
            start_date=prefs.start_date,
            end_date=prefs.end_date,
            travel_party=prefs.travel_party,
            group_size=prefs.group_size,
            travel_style=prefs.travel_style,
            budget_level=prefs.budget_level,
            currency=prefs.currency,
            total_estimated_cost=float(data.get("total_estimated_cost", 0.0)),
            budget_breakdown=data.get("budget_breakdown", {}),
            summary=data.get("summary", ""),
            logistics_tips=data.get("logistics_tips", []),
            days=days_objs,
            created_at=datetime.datetime.now().isoformat()
        )

    def _generate_smart_local(self, prefs: TripPreferences) -> GeneratedItinerary:
        """Production-grade deterministic itinerary generator based on travel engineering principles."""
        dest_key = prefs.destination.lower().strip()
        catalog_entry = None
        for k, v in DESTINATION_CATALOG.items():
            if k in dest_key or dest_key in k:
                catalog_entry = v
                break
                
        # Base multipliers
        party_factor = max(1.0, prefs.group_size * 0.85)
        budget_multipliers = {"Budget": 0.6, "Moderate": 1.0, "Luxury": 2.4}
        b_mul = budget_multipliers.get(prefs.budget_level, 1.0)
        daily_base = 120.0 * b_mul * (1.2 if prefs.travel_party == "Couple" else 1.0)
        
        days: List[ItineraryDay] = []
        total_cost = 0.0
        
        themes = [
            f"Arrival, Iconic Landmarks & Welcome Sunset",
            f"Deep Cultural Immersion & Historic Gems",
            f"Culinary Flavors, Markets & Scenic Strolls",
            f"Off-the-Beaten-Path & Hidden Neighbourhoods",
            f"Day Trip, Nature Landscapes & Memorable Farewell"
        ]
        
        start_dt = None
        try:
            start_dt = datetime.datetime.strptime(prefs.start_date, "%Y-%m-%d")
        except:
            start_dt = datetime.datetime.now()

        for day_idx in range(1, prefs.duration_days + 1):
            curr_date = (start_dt + datetime.timedelta(days=day_idx - 1)).strftime("%Y-%m-%d")
            theme = themes[(day_idx - 1) % len(themes)]
            
            day_activities: List[Activity] = []
            
            # 1. Morning
            morning_act = self._create_slot_activity(
                day_idx=day_idx,
                slot="Morning",
                start_time="09:00 AM",
                destination=prefs.destination,
                catalog_entry=catalog_entry,
                prefs=prefs,
                b_mul=b_mul
            )
            day_activities.append(morning_act)
            
            # 2. Afternoon
            afternoon_act = self._create_slot_activity(
                day_idx=day_idx,
                slot="Afternoon",
                start_time="01:00 PM",
                destination=prefs.destination,
                catalog_entry=catalog_entry,
                prefs=prefs,
                b_mul=b_mul
            )
            day_activities.append(afternoon_act)
            
            # 3. Evening
            evening_act = self._create_slot_activity(
                day_idx=day_idx,
                slot="Evening",
                start_time="05:30 PM",
                destination=prefs.destination,
                catalog_entry=catalog_entry,
                prefs=prefs,
                b_mul=b_mul
            )
            day_activities.append(evening_act)
            
            # 4. Night
            night_act = self._create_slot_activity(
                day_idx=day_idx,
                slot="Night",
                start_time="08:30 PM",
                destination=prefs.destination,
                catalog_entry=catalog_entry,
                prefs=prefs,
                b_mul=b_mul
            )
            day_activities.append(night_act)
            
            day_sum = sum(a.estimated_cost for a in day_activities)
            total_cost += day_sum
            
            days.append(ItineraryDay(
                day_number=day_idx,
                date=curr_date,
                theme=theme,
                daily_overview=f"Day {day_idx} balances curated sight-explorations with {prefs.travel_style.lower()} activities and optimized route pacing.",
                estimated_day_cost=round(day_sum, 2),
                activities=day_activities
            ))

        total_cost = round(total_cost * party_factor, 2)
        budget_breakdown = {
            "attractions": round(total_cost * 0.38, 2),
            "dining": round(total_cost * 0.34, 2),
            "transportation": round(total_cost * 0.16, 2),
            "leisure_and_misc": round(total_cost * 0.12, 2)
        }

        transit_info = catalog_entry["transport"] if catalog_entry else f"Local transit network, ride-hailing apps, and walkable pedestrian corridors"

        logistics = [
            f"Public Transit: Utilize {transit_info} for fast and cost-effective travel between clusters.",
            f"Pacing: Activities are arranged geographically to minimize transit delays and avoid decision fatigue.",
            f"Peak Times: Book tickets online 2-3 days ahead for popular morning landmarks.",
            f"Group Dynamics: Shared meals and flexible afternoon rendezvous maximize convenience for {prefs.travel_party.lower()} travelers."
        ]

        title = f"{prefs.duration_days}-Day {prefs.travel_style} {prefs.destination} Itinerary"

        return GeneratedItinerary(
            id=str(uuid.uuid4()),
            title=title,
            destination=prefs.destination,
            duration_days=prefs.duration_days,
            start_date=prefs.start_date,
            end_date=prefs.end_date,
            travel_party=prefs.travel_party,
            group_size=prefs.group_size,
            travel_style=prefs.travel_style,
            budget_level=prefs.budget_level,
            currency=prefs.currency,
            total_estimated_cost=total_cost,
            budget_breakdown=budget_breakdown,
            summary=f"A meticulously crafted {prefs.duration_days}-day itinerary for {prefs.destination}, tailored for {prefs.travel_party.lower()} travelers seeking a {prefs.travel_style.lower()} experience within a {prefs.budget_level.lower()} budget.",
            logistics_tips=logistics,
            days=days,
            created_at=datetime.datetime.now().isoformat()
        )

    def _create_slot_activity(self, day_idx: int, slot: str, start_time: str, destination: str, catalog_entry: Any, prefs: TripPreferences, b_mul: float) -> Activity:
        """Helper to create realistic contextual activities for slots."""
        dest = destination.title()
        is_couple = prefs.travel_party == "Couple"
        is_group = prefs.travel_party in ["Friends", "Group"]
        
        if slot == "Morning":
            name = (catalog_entry["highlights"][(day_idx - 1) % len(catalog_entry["highlights"])] 
                    if catalog_entry else f"Historic Landmark & Viewpoint in {dest}")
            cost = round(20.0 * b_mul, 2)
            return Activity(
                id=str(uuid.uuid4()),
                time_slot="Morning",
                start_time=start_time,
                title=f"Explore {name}",
                description=f"Begin the morning beating peak crowds at {name}. Experience panoramic views and learn the historical heritage of {dest}.",
                category="Attraction",
                location_name=name,
                location_address=f"Central District, {dest}",
                estimated_cost=cost,
                cost_level="$" if b_mul < 1.0 else ("$$" if b_mul < 2.0 else "$$$"),
                duration_minutes=120,
                tips="Arrive early at opening time to capture optimal photography lighting.",
                booking_required=True if b_mul >= 1.0 else False
            )
        elif slot == "Afternoon":
            dining_name = (catalog_entry["dining"][(day_idx - 1) % len(catalog_entry["dining"])] 
                           if catalog_entry else f"Artisan Café & Local Bistro")
            cost = round(25.0 * b_mul, 2)
            desc = (f"Enjoy a romantic culinary experience featuring local wine and seasonal specialties." 
                    if is_couple else 
                    f"Sample authentic local delicacies and regional street eats with relaxed atmosphere.")
            return Activity(
                id=str(uuid.uuid4()),
                time_slot="Afternoon",
                start_time=start_time,
                title=f"Gastronomy Tasting at {dining_name}",
                description=desc,
                category="Dining",
                location_name=dining_name,
                location_address=f"Culinary Quarter, {dest}",
                estimated_cost=cost,
                cost_level="$$" if b_mul <= 1.0 else "$$$",
                duration_minutes=75,
                tips="Ask the host for the house specialty of the day."
            )
        elif slot == "Evening":
            title = "Scenic Promenade & Golden Hour Stroll"
            if is_couple:
                title = "Sunset Canal/Rooftop Vista Experience"
            elif is_group:
                title = "Interactive Cultural Quarter & Market Discovery"
            cost = round(15.0 * b_mul, 2)
            return Activity(
                id=str(uuid.uuid4()),
                time_slot="Evening",
                start_time=start_time,
                title=title,
                description=f"Soak in golden hour across the historic promenades of {dest}. Perfect spot for relaxing and social photos.",
                category="Leisure",
                location_name=f"{dest} Waterfront Promenade",
                location_address=f"Scenic Promenade, {dest}",
                estimated_cost=cost,
                cost_level="Free" if b_mul < 1.0 else "$",
                duration_minutes=90,
                tips="Bring a light jacket for breezy evenings."
            )
        else: # Night
            dining_spot = f"Atmospheric Dining & Night Ambiance"
            cost = round(35.0 * b_mul, 2)
            desc = (f"Candlelit dinner with ambient music and curated dessert pairings." 
                    if is_couple else 
                    f"Vibrant group dinner followed by craft refreshments and local live acoustics.")
            return Activity(
                id=str(uuid.uuid4()),
                time_slot="Night",
                start_time=start_time,
                title=dining_spot,
                description=desc,
                category="Dining",
                location_name=f"La Terrace {dest}",
                location_address=f"Nightlife Promenade, {dest}",
                estimated_cost=cost,
                cost_level="$$" if b_mul <= 1.0 else "$$$",
                duration_minutes=110,
                tips="Reservations recommended on weekend nights."
            )

    def _refine_smart_local(self, req: RefineDayRequest) -> ItineraryDay:
        """Refines a specific day with custom adjustments."""
        b_mul = 1.0
        if req.budget_level == "Budget":
            b_mul = 0.6
        elif req.budget_level == "Luxury":
            b_mul = 2.2
            
        instruction = req.user_instruction.lower()
        new_activities = []
        
        for act in req.current_day.activities:
            copy_act = act.model_copy()
            if "budget" in instruction or "cheap" in instruction or "free" in instruction:
                copy_act.estimated_cost = round(copy_act.estimated_cost * 0.5, 2)
                copy_act.cost_level = "$" if copy_act.estimated_cost > 0 else "Free"
                copy_act.tips = f"Refined: Cost-friendly option optimized for savings."
            elif "romantic" in instruction:
                if copy_act.category == "Dining":
                    copy_act.title = f"Candlelight Scenic Dining ({req.destination})"
                    copy_act.description = "Cozy ambiance with secluded seating and tailored chef's pairings."
                elif copy_act.category == "Attraction":
                    copy_act.title = f"Scenic Viewpoint & Sunset Lookout"
            elif "adventure" in instruction or "nature" in instruction:
                if copy_act.time_slot in ["Morning", "Afternoon"]:
                    copy_act.category = "Attraction"
                    copy_act.title = f"Outdoor Adventure & Nature Trail"
                    copy_act.description = "Active exploration, scenic hiking route, and landscape vantage points."
            new_activities.append(copy_act)
            
        new_day_cost = round(sum(a.estimated_cost for a in new_activities), 2)
        
        return ItineraryDay(
            day_number=req.day_number,
            date=req.current_day.date,
            theme=f"Refined Day {req.day_number}: Custom Tailored ({req.user_instruction[:35]}...)",
            daily_overview=f"Adjusted according to your request: '{req.user_instruction}'. Optimized timing, categories, and expenditures.",
            estimated_day_cost=new_day_cost,
            activities=new_activities
        )

    def _refine_with_gemini(self, req: RefineDayRequest) -> ItineraryDay:
        prompt = f"""
You are an AI Travel Assistant. The user wants to adjust/regenerate Day {req.day_number} of their trip to {req.destination}.
User Instruction: "{req.user_instruction}"
Current Activities:
{req.current_day.model_dump_json()}

Generate an updated Day object adhering to the user's instructions while keeping it realistic and structured.
Return strictly valid raw JSON representing an ItineraryDay object:
{{
  "day_number": {req.day_number},
  "date": "{req.current_day.date}",
  "theme": "Updated Theme",
  "daily_overview": "Updated overview explaining adjustments",
  "estimated_day_cost": 110.0,
  "activities": [
    {{
      "time_slot": "Morning",
      "start_time": "09:00 AM",
      "title": "Title",
      "description": "Description",
      "category": "Attraction",
      "location_name": "Location",
      "location_address": "Address",
      "estimated_cost": 20.0,
      "cost_level": "$",
      "duration_minutes": 90,
      "tips": "Tip",
      "booking_required": false
    }}
  ]
}}
"""
        response = self.gemini_model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        data = json.loads(response.text)
        acts = [Activity(**a) for a in data.get("activities", [])]
        return ItineraryDay(
            day_number=data.get("day_number", req.day_number),
            date=data.get("date", req.current_day.date),
            theme=data.get("theme", req.current_day.theme),
            daily_overview=data.get("daily_overview", ""),
            estimated_day_cost=float(data.get("estimated_day_cost", 0.0)),
            activities=acts
        )

ai_engine = AIEngine()
