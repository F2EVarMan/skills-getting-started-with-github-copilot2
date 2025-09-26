"""
High School Management System API

A super simple FastAPI application that allows students to view and sign up
for extracurricular activities at Mergington High School.
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
import os
from pathlib import Path

app = FastAPI(title="Mergington High School API",
              description="API for viewing and signing up for extracurricular activities")

# 多语言支持
def get_localized_message(key: str, lang: str = "en", **kwargs):
    messages = {
        "en": {
            "signup_success": "Signed up {email} for {activity_name}",
            "student_already_signed_up": "Student already signed up",
            "activity_not_found": "Activity not found"
        },
        "zh": {
            "signup_success": "已为 {email} 成功报名 {activity_name}",
            "student_already_signed_up": "学生已经报名",
            "activity_not_found": "未找到活动"
        }
    }
    
    message = messages.get(lang, messages["en"]).get(key, key)
    return message.format(**kwargs)

# Mount the static files directory
current_dir = Path(__file__).parent
app.mount("/static", StaticFiles(directory=os.path.join(Path(__file__).parent,
          "static")), name="static")

# In-memory activity database with bilingual support
activities = {
    "Chess Club": {
        "description": "Learn strategies and compete in chess tournaments",
        "description_zh": "学习象棋策略并参加象棋比赛",
        "schedule": "Fridays, 3:30 PM - 5:00 PM",
        "schedule_zh": "周五，下午3:30 - 5:00",
        "max_participants": 12,
        "participants": ["michael@mergington.edu", "daniel@mergington.edu"]
    },
    "Programming Class": {
        "description": "Learn programming fundamentals and build software projects",
        "description_zh": "学习编程基础知识并开发软件项目",
        "schedule": "Tuesdays and Thursdays, 3:30 PM - 4:30 PM",
        "schedule_zh": "周二和周四，下午3:30 - 4:30",
        "max_participants": 20,
        "participants": ["emma@mergington.edu", "sophia@mergington.edu"]
    },
    "Gym Class": {
        "description": "Physical education and sports activities",
        "description_zh": "体育教育和运动活动",
        "schedule": "Mondays, Wednesdays, Fridays, 2:00 PM - 3:00 PM",
        "schedule_zh": "周一、周三、周五，下午2:00 - 3:00",
        "max_participants": 30,
        "participants": ["john@mergington.edu", "olivia@mergington.edu"]
    }
}


@app.get("/")
def root():
    return RedirectResponse(url="/static/index.html")


@app.get("/activities")
def get_activities(lang: str = "en"):
    """Get activities with localized descriptions"""
    localized_activities = {}
    
    for name, details in activities.items():
        localized_details = details.copy()
        
        # Use localized description and schedule if available
        if lang == "zh":
            if "description_zh" in details:
                localized_details["description"] = details["description_zh"]
            if "schedule_zh" in details:
                localized_details["schedule"] = details["schedule_zh"]
        
        # Remove language-specific keys to keep the response clean
        localized_details.pop("description_zh", None)
        localized_details.pop("schedule_zh", None)
        
        localized_activities[name] = localized_details
    
    return localized_activities


@app.post("/activities/{activity_name}/signup")
def signup_for_activity(activity_name: str, email: str, lang: str = "en"):
    """Sign up a student for an activity"""
    # Validate activity exists
    if activity_name not in activities:
        raise HTTPException(
            status_code=404, 
            detail=get_localized_message("activity_not_found", lang)
        )

    # Get the specific activity
    activity = activities[activity_name]

    # 验证学生尚未注册
    if email in activity["participants"]:
        raise HTTPException(
            status_code=400, 
            detail=get_localized_message("student_already_signed_up", lang)
        )

    # Add student
    activity["participants"].append(email)
    return {
        "message": get_localized_message(
            "signup_success", 
            lang, 
            email=email, 
            activity_name=activity_name
        )
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
