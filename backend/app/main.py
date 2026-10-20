from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import itinerary, trips

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Intelligent AI-powered personalized travel itinerary planning API with Supabase integration."
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(itinerary.router, prefix=settings.API_PREFIX)
app.include_router(trips.router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

@app.get("/api/health")
async def health_check():
    from app.services.supabase_client import supabase_service
    from app.services.ai_generator import ai_engine
    return {
        "status": "healthy",
        "gemini_ai_configured": ai_engine.gemini_available,
        "supabase_connected": supabase_service.is_connected,
        "mode": "hybrid_cloud_or_offline_ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
