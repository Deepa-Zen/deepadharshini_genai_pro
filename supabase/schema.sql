-- ===============================================================
-- Personalized Travel Itinerary Planner - Supabase Schema
-- ===============================================================

-- 1. Profiles Table (User Accounts)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    preferred_currency TEXT DEFAULT 'USD',
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE,
    title TEXT NOT NULL,
    destination TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_days INTEGER NOT NULL,
    travel_style TEXT NOT NULL, -- 'Relaxed', 'Adventure', 'Cultural', 'Romantic', 'Budget Backpacker', 'Luxury'
    travel_party TEXT NOT NULL, -- 'Solo', 'Couple', 'Family', 'Friends', 'Group'
    group_size INTEGER DEFAULT 1,
    budget_level TEXT NOT NULL, -- 'Budget', 'Moderate', 'Luxury'
    total_estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    currency TEXT DEFAULT 'USD',
    interests TEXT[] DEFAULT ARRAY[]::TEXT[],
    status TEXT DEFAULT 'draft', -- 'draft', 'planned', 'completed'
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Itinerary Days Table
CREATE TABLE IF NOT EXISTS public.itinerary_days (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID REFERENCES public.trips ON DELETE CASCADE NOT NULL,
    day_number INTEGER NOT NULL,
    date DATE,
    theme TEXT NOT NULL,
    daily_overview TEXT,
    estimated_day_cost NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities & Attractions Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_id UUID REFERENCES public.itinerary_days ON DELETE CASCADE NOT NULL,
    time_slot TEXT NOT NULL, -- 'Morning', 'Afternoon', 'Evening', 'Night'
    start_time TEXT,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL, -- 'Attraction', 'Dining', 'Accommodation', 'Transport', 'Leisure'
    location_name TEXT,
    location_address TEXT,
    estimated_cost NUMERIC(10, 2) DEFAULT 0.00,
    cost_level TEXT DEFAULT 'Free', -- 'Free', '$', '$$', '$$$'
    duration_minutes INTEGER DEFAULT 60,
    tips TEXT,
    booking_required BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. User Travel Preferences Table
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users ON DELETE CASCADE UNIQUE NOT NULL,
    dietary_restrictions TEXT[] DEFAULT ARRAY[]::TEXT[],
    favorite_activities TEXT[] DEFAULT ARRAY[]::TEXT[],
    preferred_transport TEXT[] DEFAULT ARRAY[]::TEXT[],
    pace_preference TEXT DEFAULT 'Balanced', -- 'Fast-paced', 'Balanced', 'Relaxed'
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Sample Policies (Allows authenticated users to manage their own data)
CREATE POLICY "Users can view their own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can manage their own trips" 
ON public.trips FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Users can access days of their trips" 
ON public.itinerary_days FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.trips 
    WHERE public.trips.id = public.itinerary_days.trip_id 
    AND public.trips.user_id = auth.uid()
));

CREATE POLICY "Users can access activities of their trips" 
ON public.activities FOR ALL 
USING (EXISTS (
    SELECT 1 FROM public.itinerary_days 
    JOIN public.trips ON public.trips.id = public.itinerary_days.trip_id
    WHERE public.itinerary_days.id = public.activities.day_id 
    AND public.trips.user_id = auth.uid()
));
