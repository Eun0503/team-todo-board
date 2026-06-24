# FastAPI 백엔드 어플리케이션 메인 로직 (SQLite DB 연동 및 REST API CRUD 엔드포인트)
import os
from typing import List, Optional
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel

# 환경변수 파싱
env_path = ".env.local"
db_url = "sqlite:///./todos.db"

if os.path.exists(env_path):
    with open(env_path, "r") as f:
        for line in f:
            if line.startswith("DATABASE_URL="):
                db_url = line.strip().split("=", 1)[1]

# DB 설정
DATABASE_URL = db_url
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# DB 모델
class Todo(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    completed = Column(Boolean, default=False)
    date = Column(String, index=True, nullable=True)

# Pydantic 스키마
class TodoCreate(BaseModel):
    title: str
    date: Optional[str] = None

class TodoUpdate(BaseModel):
    title: Optional[str] = None
    completed: Optional[bool] = None
    date: Optional[str] = None

class TodoResponse(BaseModel):
    id: int
    title: str
    completed: bool
    date: Optional[str] = None

    class Config:
        from_attributes = True

# 테이블 생성
Base.metadata.create_all(bind=engine)

# FastAPI 앱
app = FastAPI(title="Todo API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "Hello World"}

@app.get("/todos", response_model=List[TodoResponse])
def get_todos(
    filter: Optional[str] = Query(None, description="active or completed"),
    search: Optional[str] = Query(None, description="search keyword"),
    db: Session = Depends(get_db)
):
    query = db.query(Todo)
    
    if filter == "active":
        query = query.filter(Todo.completed == False)
    elif filter == "completed":
        query = query.filter(Todo.completed == True)
        
    if search:
        query = query.filter(Todo.title.contains(search))
        
    return query.all()

@app.post("/todos", response_model=TodoResponse)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = Todo(title=todo.title, date=todo.date)
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.put("/todos/{todo_id}", response_model=TodoResponse)
def update_todo(todo_id: int, todo: TodoUpdate, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
        
    if todo.title is not None:
        db_todo.title = todo.title
    if todo.completed is not None:
        db_todo.completed = todo.completed
    if todo.date is not None:
        db_todo.date = todo.date
        
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    db_todo = db.query(Todo).filter(Todo.id == todo_id).first()
    if not db_todo:
        raise HTTPException(status_code=404, detail="Todo not found")
        
    db.delete(db_todo)
    db.commit()
    return {"message": "Deleted successfully"}
