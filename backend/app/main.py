# app/main.py
from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer
from app.db.database import SessionLocal, engine, Base

# Models
from app.models.user import User, Parents

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
@app.post("/register", response_model=UserResponse)
def student_register(user: UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username or email already exists")

    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


@app.post("/login")
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
# Protected Route Example
# ----------------------
def get_current_user(token=Security(security)):
    payload = decode_access_token(token.credentials)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload


@app.get("/dashboard")
def dashboard(user=Depends(get_current_user)):
    return {
        "message": f"Welcome {user['role']} {user['sub']}!",
        "role": user["role"]
    }