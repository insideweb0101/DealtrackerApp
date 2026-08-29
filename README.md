# DealtrackerApp - Fully Automated Deal Tracking & Alerting System

A production-ready deal tracking platform with real-time alerts, automated monitoring, and comprehensive dashboard.

## Features

- **Deal Management** - Create, update, and track deals with customizable fields
- **Real-time Alerts** - Instant notifications for deal status changes, milestones, and anomalies
- **Automated Tracking** - Background jobs that monitor deal progress and trigger actions
- **Dashboard** - Comprehensive UI for deal overview, analytics, and quick actions
- **Webhook Integration** - Integration with external CRM and communication platforms
- **Multi-channel Alerts** - Email, Slack, SMS, and in-app notifications
- **Deal Analytics** - Conversion rates, pipeline health, revenue forecasting
- **Role-based Access** - Admin, manager, and sales rep roles with appropriate permissions

## Tech Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Knex.js query builder
- **Frontend**: React 18, Redux Toolkit, TailwindCSS
- **Real-time**: Socket.IO for live updates
- **Task Queue**: Bull (Redis-backed job queue)
- **Authentication**: JWT with refresh tokens
- **Deployment**: Docker & Docker Compose
- **Testing**: Jest, Supertest

## Project Structure

```
DealtrackerApp/
├── backend/               # Node.js API server
│   ├── src/
│   │   ├── config/       # Configuration & environment
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── models/       # Database models
│   │   ├── middleware/   # Auth, validation, error handling
│   │   ├── utils/        # Helpers & utilities
│   │   ├── jobs/         # Background job definitions
│   │   ├── alerts/       # Alert engine & notifications
│   │   └── app.ts        # Express app setup
│   ├── migrations/       # Database migrations
│   ├── seeds/           # Database seeding
│   └── tests/           # Test suite
├── frontend/             # React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── features/    # Feature modules (deals, alerts, etc.)
│   │   ├── store/       # Redux store configuration
│   │   ├── services/    # API client services
│   │   ├── hooks/       # Custom React hooks
│   │   └── App.tsx      # Main app component
│   └── tests/           # Frontend tests
├── docker-compose.yml   # Local development setup
├── Dockerfile           # Production container
└── docs/               # API documentation
```

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Docker & Docker Compose (optional)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/insideweb0101/DealtrackerApp.git
cd DealtrackerApp

# Start services with Docker Compose
docker-compose up -d

# Install backend dependencies
cd backend && npm install
npm run migrate
npm run seed

# Install frontend dependencies
cd ../frontend && npm install

# Start development servers
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

### Environment Variables

Create `.env` files in both `backend/` and `frontend/` directories. See `.env.example` files for required variables.

## API Documentation

See `docs/API.md` for comprehensive endpoint documentation.

## Alerts System

The alerts engine monitors deals and triggers notifications based on:
- Status changes
- Milestone dates approaching
- Revenue anomalies
- Stalled deals (no activity)
- Custom business rules

See `docs/ALERTS.md` for configuration details.

## Database Schema

Run migrations to set up the database:

```bash
cd backend
npm run migrate
```

See `docs/DATABASE.md` for schema documentation.

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test

# E2E tests
npm run test:e2e
```

## Deployment

### Docker

```bash
docker build -t dealtracker-app .
docker run -p 3000:3000 dealtracker-app
```

### Production Checklist

- [ ] Set up PostgreSQL hosted instance
- [ ] Set up Redis for caching/jobs
- [ ] Configure environment variables
- [ ] Set up SSL certificates
- [ ] Configure alert notification services (Slack, SendGrid, etc.)
- [ ] Set up monitoring & logging
- [ ] Configure backups

## Contributing

1. Create a feature branch
2. Make your changes
3. Write tests
4. Submit a pull request

## License

MIT

## Support

For issues and questions, open a GitHub issue.
