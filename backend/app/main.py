from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.security import HTTPBearer

from app.db.database import SessionLocal, engine, Base

# Import ALL models first before create_all
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserResponse, UserLogin
from app.routes.auth import create_access_token, hash_password, verify_password

# Now create tables — models are registered to Base
Base.metadata.create_all(bind=engine)

app = FastAPI()
security = HTTPBearer()

def get_db():
    db = SessionLocal()
    try: 
        yield db
    finally:
        db.close()

@app.get('/')
def read_root():
    return {"message": "Brainy Pop API is running!"}

@app.post('/register')
def signup(user:UserCreate, db: Session = Depends(get_db)):
    existing = db.query(User).filter((User.username == user.username) | (User.email == user.email)).first()
    if existing: 
        raise HTTPException(status_code=400, detail="Username or email already exists")
    hashed_password = hash_password(user.password)
    new_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post('/login')
def login(user:UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=400, detail="Incorrect Password or Username")
    access_token = create_access_token(data={"sub": db_user.username})
    return {"access_token": access_token, "token_type": "bearer","user": db_user.username}