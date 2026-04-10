# app/main.py
from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from fastapi.security import HTTPBearer
from app.db.database import SessionLocal, engine, Base
from fastapi.middleware.cors import CORSMiddleware
from typing import List

# Models
from app.models.user import User, Parents,Topic, Questions

# Schemas
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin
from app.schemas.parent_schema import ParentCreate, ParentLogin, ParentResponse
from app.schemas.questions_schema import QuestionsSchema, TopicSchema

# Auth helpers
from app.routes.auth import create_access_token, hash_password, verify_password, decode_access_token

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app
app = FastAPI()
security = HTTPBearer()

#-----------------------
# Enable CORS
#-----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


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
        raise HTTPException(status_code=400, detail="Username or email already exists")

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
# Protected Route Example
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
@app.get("/parent/children",response_model=List[UserResponse])
def get_children(parent:Parents=Depends(get_current_parent)):
    return parent.children


# ----------------------
# Question Routes
# ----------------------
#returns list of topics
@app.get("/topics", response_model=List[TopicSchema])
def get_topics(db: Session = Depends(get_db)):
    return db.query(Topic).all()

#requires auth and returns questions along with their answer choices
@app.get("/topics/{topic_id}/questions", response_model=List[QuestionsSchema])
def get_questions_by_topic(
    topic_id: int,
    difficulty: Optional[str] = None,
    db: Session = Depends(get_db),
    current = Depends(get_current_user)
):
    topic = db.query(Topic).filter(Topic.id == topic_id).first()
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    query = (
        db.query(Questions)
        .options(joinedload(Questions.choices))
        .filter(Questions.topic_id == topic_id)
    )

    if difficulty:
        query = query.filter(Questions.difficulty == difficulty)

    return query.all()
#same as topic but grabs questions based on the grade level.
@app.get("/questions/grade/{grade_level}", response_model=List[QuestionsSchema])
def get_questions_by_grade(
    grade_level: int,
    db: Session = Depends(get_db),
    current = Depends(get_current_user)
):
    topics = db.query(Topic).filter(Topic.grade_level == grade_level).all()
    topic_ids = [t.id for t in topics]

    return (
        db.query(Questions)
        .options(joinedload(Questions.choices))
        .filter(Questions.topic_id.in_(topic_ids))
        .all()
    )


#-----------------------
# Points Route
#-----------------------
