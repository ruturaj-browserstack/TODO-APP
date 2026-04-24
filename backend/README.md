# Product Backend (FastAPI)

## Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Run

```bash
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API docs: http://localhost:8000/docs

## Endpoints

- `POST /api/login` – credentials: `admin` / `admin123`
- `GET /api/todos` – list todos
- `POST /api/todos` – create todo (`{"title": "..."}`)
- `PATCH /api/todos/{id}` – update (title / completed)
- `DELETE /api/todos/{id}` – delete todo
- `POST /api/todos/reset` – clear all todos (used by tests)
- `GET /api/counter` – read counter
- `POST /api/counter/increment` | `decrement` | `reset`
