from sqlalchemy import Column, Integer, String, DateTime,ForeignKey,Enum, Boolean
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
    password_hash = Column(String(100), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    parent = relationship("Parents", back_populates= "children")

class Parents(Base):
    __tablename__ = "parents"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False,index=True)
    email = Column(String(100), unique=True,nullable=False,index=True)
    password_hash = Column(String(100),nullable=False)
    created_at = Column(DateTime,default=datetime.datetime.utcnow)
    children = relationship("User", back_populates = "parent")

class Topic(Base):
    __tablename__ = "topic"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(50),unique=True,nullable=False,index=True)
    grade_level = Column(Integer,nullable=False)
    questions = relationship("Questions", back_populates="topic")

class Questions(Base):
    __tablename__ = "questions"
    id = Column(Integer,primary_key=True,index=True)
    topic_id = Column(Integer,ForeignKey("topic.id"), nullable=False)
    difficulty = Column(Enum(DifficultyLevel), nullable=False)
    question_type = Column(Enum(QuestionType),nullable=False)
    question_text = Column(String(250),nullable=False)
    correct_ans = Column(String(250), nullable=False)
    topic= relationship("Topic", back_populates="questions")
    choices = relationship("AnswerChoices", back_populates="question")

class AnswerChoices(Base):
    __tablename__ = "answer_choices"
    id = Column(Integer, primary_key=True, index=True)
    questions_id = Column(Integer, ForeignKey('questions.id'), nullable=False)
    choice_text = Column(String(250), nullable=False)
    is_correct = Column(Boolean, default=False)
    question = relationship("Questions", back_populates="choices")

class UserAnswer(Base):
    __tablename__ = "user_answers"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    questions_id = Column(Integer, ForeignKey('questions.id'), nullable=True)
    free_response_text = Column(String(500), nullable=True)
    is_correct = Column(Boolean, nullable=True)
    answered_at = Column(DateTime, default=datetime.datetime.utcnow)

class UserProgress(Base):
    __tablename__ = "user_progress"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    topic_id = Column(Integer, ForeignKey('topic.id'), nullable=False)
    times_attempted = Column(Integer, default=0)
    times_correct = Column(Integer, default=0)
    last_attempted = Column(DateTime, default=datetime.datetime.utcnow)
    



    
