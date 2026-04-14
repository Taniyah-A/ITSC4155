from pydantic import BaseModel
from datetime import datetime

class AchievementSchema(BaseModel):
    id: int
    name: str
    description: str
    badge_icon: str

    class Config: 
        from_attributes = True

class UserAchievementSchema(BaseModel):
    id: int
    achievement: AchievementSchema
    earned_at: datetime

    class Config:
        from_attributes = True

        
    