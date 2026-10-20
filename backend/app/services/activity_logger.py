import datetime
from typing import List, Dict, Any

class ActivityLogger:
    def __init__(self):
        # Seed with initial realistic activity events for immediate admin viewing
        self.logs: List[Dict[str, Any]] = [
            {
                "id": "act-1",
                "user_name": "Deepa (Solo)",
                "user_email": "deepa@wanderai.com",
                "action": "Generated Itinerary",
                "details": "3-Day Fast-paced Tokyo Tech & Food Explorer ($360)",
                "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=14)).strftime("%H:%M:%S • %b %d"),
                "status": "success",
                "ip": "192.168.1.102"
            },
            {
                "id": "act-2",
                "user_name": "Arun & Priya",
                "user_email": "arun.p@gmail.com",
                "action": "Saved Trip to Cloud",
                "details": "5-Day Luxury Paris Romantic Vacation ($2,250)",
                "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=8)).strftime("%H:%M:%S • %b %d"),
                "status": "success",
                "ip": "192.168.1.105"
            },
            {
                "id": "act-3",
                "user_name": "Adventure Squad (5 Friends)",
                "user_email": "group.bali@travel.org",
                "action": "AI Day Refinement",
                "details": "Refined Day 2: Added outdoor waterfall hike in Ubud",
                "timestamp": (datetime.datetime.now() - datetime.timedelta(minutes=3)).strftime("%H:%M:%S • %b %d"),
                "status": "success",
                "ip": "192.168.1.112"
            }
        ]

    def log_activity(self, user_name: str, user_email: str, action: str, details: str, status: str = "success"):
        entry = {
            "id": f"act-{len(self.logs) + 1}",
            "user_name": user_name,
            "user_email": user_email,
            "action": action,
            "details": details,
            "timestamp": datetime.datetime.now().strftime("%H:%M:%S • %b %d"),
            "status": status,
            "ip": "127.0.0.1"
        }
        self.logs.insert(0, entry)
        if len(self.logs) > 100:
            self.logs = self.logs[:100]

    def get_activities(self) -> List[Dict[str, Any]]:
        return self.logs

activity_logger = ActivityLogger()
