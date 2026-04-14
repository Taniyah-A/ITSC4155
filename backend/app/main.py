# app/main.py
from datetime import datetime
from typing import List
from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
from app.db.database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Models
from app.models.user import User, Parents,Topic, Questions,UserProgress, DifficultyLevel

# Schemas
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin
from app.schemas.parent_schema import ParentCreate, ParentLogin, ParentResponse

# Auth helpers
from app.routes.auth import create_access_token, hash_password, verify_password, decode_access_token

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()
security = HTTPBearer()

# #-----------------------
# # Enable CORS
# #-----------------------
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=['http://localhost:3000'],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# DB dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ----------------------
# Root Route
# ----------------------
@app.get("/")
def read_root():
    return {"message": "Brainy Pop API is running!"}


# ----------------------
# Student Routes
# ----------------------

@app.post("/student/login")
def student_login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect Username or Password")

    access_token = create_access_token(data={"sub": db_user.username, "role": "student"})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "student",
        "username": db_user.username
    }


# ----------------------
# Parent Routes
# ----------------------
@app.post("/parent/register", response_model=ParentResponse)
def parent_register(parent: ParentCreate, db: Session = Depends(get_db)):
    existing = db.query(Parents).filter(
        (Parents.username == parent.username) | (Parents.email == parent.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Parent already exists")

    new_parent = Parents(
        username=parent.username,
        email=parent.email,
        password_hash=hash_password(parent.password)
    )

    db.add(new_parent)
    db.commit()
    db.refresh(new_parent)
    return new_parent


@app.post("/parent/login")
def parent_login(parent: ParentLogin, db: Session = Depends(get_db)):
    db_parent = db.query(Parents).filter(Parents.username == parent.username).first()
    if not db_parent or not verify_password(parent.password, db_parent.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect Username or Password")

    access_token = create_access_token(data={"sub": db_parent.username, "role": "parent"})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "role": "parent",
        "username": db_parent.username
    }


# ----------------------
# Protected Route
# ----------------------
def get_current_user(token=Security(security)):
    payload = decode_access_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload

def get_current_parent(
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    if current["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents allowed")

    parent = db.query(Parents).filter(
        Parents.username == current["sub"]
    ).first()

    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    return parent

@app.get("/dashboard")
def dashboard(user:dict=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['role']} {user['sub']}!",
        "role": user["role"]
    }

@app.get("/parent/me")
def get_parent(parent:Parents = Depends(get_current_parent)):
    return parent

@app.post("/parent/create-child", response_model=UserResponse)
def create_child(
    user: UserCreate,
    db: Session = Depends(get_db),
    parent:Parents = Depends(get_current_parent)
):
    existing = db.query(User).filter(
        User.username == user.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = User(
        username = user.username,
        password_hash = hash_password(user.password),
        parent_id = parent.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# ----------------------
# View Point
# ----------------------
@app.get("/parent/children", response_model=List[UserResponse])
def get_children(parent:Parents=Depends(get_current_parent)):
    return parent.children

#-----------------------
# Question Answer
#-----------------------
@app.post("/questions/answer")
def answer_question(
    question_id: int,
    answer: str,
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    if current["role"] != "student":
        raise HTTPException(status_code=403, detail="Only student allowed")
    
    question = db.query(Questions).filter(Questions.id == question_id).first()

    if not question:
        raise HTTPException(status_code=404, detail="Question not found")
    
    is_correct = question.correct_ans.lower() == answer.lower()
    score = 10 if is_correct else 0

    student = db.query(User).filter(User.username==current["sub"]).first()

    progress = db.query(UserProgress).filter(
        UserProgress.user_id == student.id,
        UserProgress.topic_id == question.topic_id
    ).first()

    if not progress:
        progress = UserProgress(
            user_id = student.id,
            topic_id = question.topic_id
        )
        db.add(progress)
    if not progress.difficulty_level:
        progress.difficulty_level = DifficultyLevel.easy

    progress.times_attempted += 1

    if is_correct:
        progress.times_correct += 1
        progress.current_streak += 1
        progress.wrong_streak = 0
    else:
        progress.wrong_streak += 1
        progress.current_streak = 0

    # Increase difficulty
    if progress.current_streak >= 5:
        if progress.difficulty_level == DifficultyLevel.easy:
            progress.difficulty_level = DifficultyLevel.medium
        elif progress.difficulty_level == DifficultyLevel.medium:
            progress.difficulty_level = DifficultyLevel.hard
        progress.current_streak = 0

# Decrease difficulty
    if progress.wrong_streak >= 2:
        if progress.difficulty_level == DifficultyLevel.hard:
            progress.difficulty_level = DifficultyLevel.medium
        elif progress.difficulty_level == DifficultyLevel.medium:
            progress.difficulty_level = DifficultyLevel.easy
        progress.wrong_streak = 0


    progress.last_attempted = datetime.datetime.utcnow()
    db.commit()

    return {
        "Correct": is_correct,
        "Score": score,
        "Streak": progress.current_streak,
        "Difficulty": progress.difficulty_level
    }

#-----------------
#Progress Tracking
#-----------------
@app.get("/parent/children/{child_id}/progress")
def get_child_progress(
    child_id: int,
    db:Session = Depends(get_db),
    parent:Parents = Depends(get_current_parent)
):
    child = db.query(User).filter(
        User.id == child_id,
        User.parent_id == parent.id
    ).first()

    if not child:
        raise HTTPException(status_code=404, detail="Child not Found")
    
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == child_id
    ).all()

    return [
        {
        "Topic": p.topic.name,
        "Attempted": p.times_attempted,
        "Correct": p.times_correct,
        "Accuracy": round(
        (p.times_correct / p.times_attempted * 100)
        if p.times_attempted > 0 else 0,
        2
        ),
        "Difficulty": p.difficulty_level,
        "Streak": p.current_streak
        }
        for p in progress
    ]