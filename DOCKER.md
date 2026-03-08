# ITSO Quiz Bee Docker Setup

This docker-compose configuration runs the complete ITSO Quiz Bee application with all services.

## Services

- **PostgreSQL (postgres)** - Database
- **Redis (redis)** - Cache layer for WebSocket state
- **Backend (backend)** - Go API server  
- **Frontend (frontend)** - React/Vite web application

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=itso_quiz_bee
DB_PORT=5432

# Redis
REDIS_PORT=6379

# Ports
BACKEND_PORT=3002
FRONTEND_PORT=3001
```

## Building and Running

Build and start all services:
```bash
docker-compose up --build
```

Run in background:
```bash
docker-compose up -d --build
```

Stop all services:
```bash
docker-compose down
```

View logs:
```bash
docker-compose logs -f
```

View specific service logs:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

## Service URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3002
- **Database**: localhost:5432
- **Redis**: localhost:6379

## Database Migrations

To run migrations on startup, ensure the backend is properly configured to run `goose` migrations automatically.

## Development

For local development without Docker:

Frontend:
```bash
cd itso-quiz-bee
npm install
npm run dev
```

Backend:
```bash
cd itso-quiz-bee-backend
go mod download
go run main.go
```

Make sure PostgreSQL and Redis are running locally.
