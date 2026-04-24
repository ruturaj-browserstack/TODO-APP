# Product

Monorepo for the product: FastAPI backend + React frontend.

## Quick start

```bash
# Backend (terminal 1)
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (terminal 2)
cd frontend
npm install
npm run dev
```

- API: http://localhost:8000 (docs at `/docs`)
- Web: http://localhost:5173

## Features

- **Login** – creds `admin` / `admin123`
- **Todos** – add / toggle / delete
- **Counter** – increment / decrement / reset

Regression tests live in the sibling `automation/` repo.
