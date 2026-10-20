@echo off
echo ===============================================================
echo Starting Personalized Travel Itinerary Planner Development Servers
echo ===============================================================

echo [1/2] Starting FastAPI Backend on http://localhost:8000 ...
start "FastAPI Backend" cmd /k "cd /d %~dp0backend && py -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"

timeout /t 3 /nobreak >nul

echo [2/2] Starting React Vite Frontend on http://localhost:5173 ...
start "React Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers started!
echo Frontend: http://localhost:5173
echo Backend API Docs: http://localhost:8000/docs
echo ===============================================================
