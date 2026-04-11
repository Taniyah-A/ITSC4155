# app/main.py
import datetime
from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
from app.db.database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware

# Models
from app.models.user import User, Parents,Topic, Questions,UserProgress

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

@app.post("/parent/create-child", response_model=UserResponse)
def create_child(
    user: UserCreate,
    db: Session = Depends(get_db),
    current = Depends(get_current_user)
):
    if current["role"] != "parent":
        raise HTTPException(status_code = 403, detail="Only parent can create child account")
    existing = db.query(User).filter(
        (User.username == user.username)).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    parent = db.query(Parents).filter(Parents.username == current["sub"]).first()

    if not parent:
        raise HTTPException(status_code=404, detail="Parent not found")

    new_user = User(
        username = user.username,
        password_hash = hash_password(user.password),
        parent_id = parent.id
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@app.get("/dashboard")
def dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['role']} {user['sub']}!",
        "role": user["role"]
    }

# ----------------------
# View Point
# ----------------------
@app.get("/parent/children")
def get_children(db:Session = Depends(get_db), current=Depends(get_current_user)):
    if current ["role"] != "parent":
        raise HTTPException(status_code=403, detail="Only parents allowed")
    
    parent = db.query(Parents).filter(Parents.username == current["sub"]).first()
    
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

    progress.times_attempted += 1

    if is_correct:
        progress.times_correct += 1

    progress.last_attempted = datetime.datetime.utc()
    db.commit()

    return {
        "correct": is_correct,
        "score": score,
    }


#-----------------
#Progress Tracking
#-----------------
@app.get("/student/progress/topics")
def get_topic_progress(
    db: Session = Depends(get_db),
    current=Depends(get_current_user)
):
    if current["role"] != "student":
        HTTPException(status_code=403, detail="Not a child")

    student = db.query(User).filter(
        User.username==current["sub"]
    ).first()
    progress = db.query(UserProgress).filter(
        UserProgress.user_id == student.id
    ).all()

    return [
        {
            "topic": p.topic.name,
            "attempted": p.times_attempted,
            "correct": p.times_correct,
            "accuracy":(
                p.time.correct / p.time_attempted * 100
                if p.time_attempted > 0  else 0
            )
        }
        for p in progress
    ]