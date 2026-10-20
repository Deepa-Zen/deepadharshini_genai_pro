# Personalized Travel Itinerary Planner 🌍✈️

An AI-powered full-stack web application that simplifies travel planning through intelligent automation, prompt engineering, and personalized recommendations.

Built with a **React** frontend, **FastAPI** backend, and **Supabase** database integration.

---

## 🚀 Key Features

1. **AI Itinerary Generator**:
   - Generates day-by-day plans covering Attractions, Dining, Accommodations, and Transportation.
   - Pacing optimization (Morning, Afternoon, Evening, Night slots) that minimizes travel delays.
   - Supports Google Gemini API, OpenAI/OpenRouter, and includes a smart local synthesis engine for offline/instant evaluation.

2. **Core Scenarios (1-Click Presets)**:
   - **Scenario 1: Solo Traveler Weekend Getaway** (Tokyo 3-Day fast-paced, solo dining, transit optimization).
   - **Scenario 2: Couple Romantic Vacation** (Paris 5-Day relaxed, panoramic vistas, candlelit bistros, luxury pacing).
   - **Scenario 3: Small Group Multi-Day Trip** (Bali 7-Day shared budget, group adventure, culture, villa logistics).

3. **Smart Trip Builder**:
   - Flexible preferences: Destination, Dates, Budget Level, Travel Party, Group Size, Pace & Style, Interest Tags, and custom requirements.

4. **Dynamic Day Refinement (Epic 4)**:
   - Customize or regenerate individual days with natural language instructions (e.g. *"Add more romantic sunset spots"*, *"Replace fine dining with authentic street food"*).

5. **Budget Tracker & Analytics**:
   - Visual percentage allocation across Attractions, Dining, Transportation, and Stays.
   - Per-day and per-traveler cost estimations.

6. **Supabase Cloud Storage & Fallback**:
   - Save, load, and delete trips securely.
   - Database schema with Row Level Security (RLS) included in `supabase/schema.sql`.

7. **Export & Sharing**:
   - Export full itineraries as formatted Markdown or raw JSON data.

---

## 🛠️ Tech Stack & Prerequisites

- **Frontend**: React 18, Vite, Lucide Icons, Canvas Confetti, Vanilla CSS (Modern SaaS Glassmorphism)
- **Backend**: FastAPI, Uvicorn, Pydantic v2, Python Dotenv
- **AI Engine**: Google Generative AI (`google-generativeai`), Gemini 1.5 Flash + deterministic local engine
- **Database**: Supabase (`supabase-py`) + local in-memory fallback
- **Runtimes**: Node.js (v22+) & Python 3.13+

---

## 📁 Project Structure

```
skillwalletgenai/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   │   └── itinerary.py       # Pydantic schemas for trips, days, activities
│   │   ├── routers/
│   │   │   ├── itinerary.py      # /api/itinerary/generate, /refine-day, /scenarios
│   │   │   └── trips.py          # /api/trips CRUD & export
│   │   ├── services/
│   │   │   ├── ai_generator.py   # AI prompt engineering & destination knowledge
│   │   │   └── supabase_client.py# Supabase integration + fallback store
│   │   ├── config.py             # Settings & environment configuration
│   │   └── main.py               # FastAPI application entrypoint with CORS
│   ├── requirements.txt
│   ├── .env.example
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ScenarioPresets.jsx
│   │   │   ├── TripBuilderModal.jsx
│   │   │   ├── ItineraryView.jsx
│   │   │   ├── DayCard.jsx
│   │   │   ├── RefineDayModal.jsx
│   │   │   ├── BudgetTracker.jsx
│   │   │   ├── SavedTripsDrawer.jsx
│   │   │   └── ExportModal.jsx
│   │   ├── services/
│   │   │   └── api.js            # Frontend API client
│   │   ├── App.jsx
│   │   ├── index.css             # Glassmorphism design system
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── supabase/
│   └── schema.sql                # Complete Supabase SQL migration script
├── start_dev.bat                 # One-click Windows starter
├── start_dev.ps1                 # One-click PowerShell starter
└── README.md
```

---

## ⚡ Quick Start

### 1. Launch Both Servers (One Click)
Double-click `start_dev.bat` or run in PowerShell:
```powershell
.\start_dev.ps1
```

### 2. Or Start Manually

**Start Backend**:
```bash
cd backend
py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

**Start Frontend**:
```bash
cd frontend
npm run dev
```
Open application at: [http://localhost:5173](http://localhost:5173)

---

## 🗄️ Supabase Setup (Optional)
To connect your own Supabase project:
1. Create a project at [https://supabase.com](https://supabase.com)
2. Go to SQL Editor and run `supabase/schema.sql`
3. Add your `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `backend/.env`
