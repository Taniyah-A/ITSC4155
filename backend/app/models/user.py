from sqlalchemy import Column, Integer, String, DateTime,ForeignKey,Enum
from sqlalchemy.orm import relationship
from app.db.database import Base
import datetime
import enum

class DifficultyLevel(str, enum.Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionType(str, enum.Enum):
    simple = "simple"
    word_problem = "word_problem"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer,ForeignKey("parents.id"),nullable=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, index=True)
    password_hash = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Parents(Base):
    __tablename__ = "parents"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False,index=True)
    email = Column(String(100), unique=True,nullable=False,index=True)
    password_hash = Column(String(100),nullable=False)
    created_at = Column(DateTime,default=datetime.datetime.utcnow)
    children = relationship("User", backref = "parent")

class Topic(Base):
    __tablename__ = "topic"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(50),unique=True,nullable=False,index=True)
    grade_level = Column(Integer,nullable=False)

class Questions(Base):
    __tablename__ = "questions"
    id = Column(Integer,primary_key=True,index=True)
    topic_id = Column(Integer,ForeignKey("topic.id"), nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    question_type = Column(Enum(QuestionType),nullable=False)
    question_text = Column(String(250),nullable=False)
    correct_ans = Column(String(250), nullable=False)


    



    
