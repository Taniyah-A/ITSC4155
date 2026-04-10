from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Enum
from app.db.database import Base
import datetime
import enum

class BadgeCat(str, enum.Enum):
    counting = "counting"
    addition = "addition"
    subtraction = "subtraction"
    shapes = "shapes"
    comparing = "comparing"
    number_recognition = "number_recognition"
    general = "general" # for the streaks and the milestones 


class PointTransaction(Base):
    __tablename__ = "point_transactions"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    points = Column(Integer, nullable=False)
    point_type = Column(String(50), nullable=False)
    description = Column(String(200), nullable=True)
    earned_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserPoints(Base):
    __tablename__ = "user_points"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    total_points = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)
    longest_streak = Column(Integer,default=0)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)

class Badge(Base):
    __tablename__ = "badges"
    id = Column(Integer, primary_key=True,index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(String(250), nullable=False)
    icon = Column(String(250), nullable=True) #for the image file for the badge
    category = Column(Enum(BadgeCat), nullable=False)
    points_required = Column(Integer,default=0)
    correct_answers_required = Column(Integer, default=0)
    streak_required = Column(Integer, default=0)

class UserBadge(Base):
    __tablename__ = "user_badges"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.id"), nullable=False)
    earned_at = Column(DateTime, default=datetime.datetime.utcnow)
    notified = Column(Boolean, default=False)#will change to true once popup is shown through frontend.
