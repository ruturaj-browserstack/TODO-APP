from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional
from itertools import count

app = FastAPI(title="Product API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class TodoIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)


class TodoUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=200)
    completed: Optional[bool] = None


class Todo(BaseModel):
    id: int
    title: str
    completed: bool = False


class LoginIn(BaseModel):
    username: str
    password: str


_ids = count(1)
_todos: dict[int, Todo] = {}
_counter = {"value": 0}

VALID_USER = {"username": "admin", "password": "admin123"}


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/login")
def login(payload: LoginIn):
    if payload.username != VALID_USER["username"] or payload.password != VALID_USER["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"token": "demo-token", "username": payload.username}


@app.get("/api/todos", response_model=list[Todo])
def list_todos():
    return list(_todos.values())


@app.post("/api/todos", response_model=Todo, status_code=201)
def create_todo(payload: TodoIn):
    todo = Todo(id=next(_ids), title=payload.title.strip())
    _todos[todo.id] = todo
    return todo


@app.patch("/api/todos/{todo_id}", response_model=Todo)
def update_todo(todo_id: int, payload: TodoUpdate):
    todo = _todos.get(todo_id)
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    if payload.title is not None:
        todo.title = payload.title.strip()
    if payload.completed is not None:
        todo.completed = payload.completed
    _todos[todo_id] = todo
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int):
    if todo_id not in _todos:
        raise HTTPException(status_code=404, detail="Todo not found")
    del _todos[todo_id]
    return None


@app.post("/api/todos/reset", status_code=204)
def reset_todos():
    _todos.clear()
    return None


@app.get("/api/counter")
def get_counter():
    return {"value": _counter["value"]}


@app.post("/api/counter/increment")
def increment_counter():
    _counter["value"] += 1
    return {"value": _counter["value"]}


@app.post("/api/counter/decrement")
def decrement_counter():
    _counter["value"] -= 1
    return {"value": _counter["value"]}


@app.post("/api/counter/reset")
def reset_counter():
    _counter["value"] = 0
    return {"value": _counter["value"]}
