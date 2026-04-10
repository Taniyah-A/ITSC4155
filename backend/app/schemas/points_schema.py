from pydantic import BaseModel
from typing import List, Optional
import datetime


class PointTransactionOut(BaseModel):
    id: int
    points: int 
    point_type: str
    description: Optional[str]
    earned_at: datetime.datetime

    class Config:
        from_attributes = True

class UserPointsOut(BaseModel):
    user_id: int
    total_points: int
    current_streak: int
    longest_streak: int
    last_updated: datetime.datetime
    class Config:
        from_attributes = True

class BadgeOut(BaseModel):
    id: int
    name:str
    description: str
    icon:Optional[str]
    category:str
    points_required: int
    correct_answers_required: int
    streak_required: int
    class Config:
        from_attributes = True

class UserBadgeOut(BaseModel):
    badge: BadgeOut
    earned_at: datetime.datetime
    notified: bool
    class Config:
        from_attributes = True

class UserAchievementsOut(BaseModel):
    user_id: int
    total_points: int 
    current_streak: int 
    longest_streak: int 
    badges_earned: int 
    badges: List[UserBadgeOut]
    