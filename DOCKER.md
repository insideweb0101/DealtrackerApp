# Dealtracker App - Docker Build Guide

## Prerequisites
- Docker Desktop installed
- Docker Compose installed

## Setup

1. Create `.env` file in project root:

```bash
cp backend/.env.example .env
```

2. Update `.env` with your configuration

## Running

```bash
# Build and start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npm run migrate

# Seed database
docker-compose exec backend npm run seed

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

## Services

- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:3000
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## Health Checks

```bash
# Check backend health
curl http://localhost:3001/health
```
