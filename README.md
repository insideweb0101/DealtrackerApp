# DealTracker - Full-Stack Deal Management & Alert System

## 🎯 Overview

DealTracker is a comprehensive full-stack application for managing sales deals and generating intelligent alerts. Built with modern technologies, it provides real-time monitoring, automated notifications, and detailed sales pipeline analytics.

## ✨ Features

### Deal Management
- ✅ Create, read, update, and delete deals
- ✅ Track deal status (prospecting, qualified, negotiating, won, lost)
- ✅ Monitor deal value and probability
- ✅ Set expected close dates
- ✅ Sales pipeline analytics with visualizations

### Alert System
- ✅ Automatic alerts for approaching deadlines
- ✅ Detection of stalled deals (no updates in 7+ days)
- ✅ Low probability anomaly detection
- ✅ Status change notifications
- ✅ Custom alert rules

### Notifications
- ✅ Email notifications
- ✅ Slack integration
- ✅ SMS alerts
- ✅ In-app notifications
- ✅ Background job processing with Bull Queue

### User Management
- ✅ User registration and authentication
- ✅ Role-based access control (Admin, Manager, Sales Rep)
- ✅ JWT token-based authentication
- ✅ Profile management

### Analytics & Dashboard
- ✅ Real-time deal pipeline visualization
- ✅ Win rate tracking
- ✅ Revenue forecasting
- ✅ Performance metrics

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **Cache/Queue:** Redis
- **Job Queue:** Bull
- **Authentication:** JWT (jsonwebtoken)
- **Logging:** Winston

### Frontend
- **UI Framework:** React 18
- **Language:** TypeScript
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Charts:** Recharts
- **Icons:** React Icons

### DevOps
- **Containerization:** Docker & Docker Compose
- **Testing:** Jest

## 📁 Project Structure

```
DealTrackerApp/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration files (DB, Redis, Logger)
│   │   ├── models/        # Database models
│   │   ├── services/      # Business logic
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── jobs/          # Background jobs
│   │   ├── types/         # TypeScript types
│   │   └── app.ts         # Express app setup
│   ├── migrations/        # Database migrations
│   ├── seeds/            # Database seeds
│   ├── tests/            # Unit tests
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── store/        # Redux store
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   └── package.json
├── docker-compose.yml
├── Dockerfile
├── API.md                # API documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- Node.js 18+ (for local development)
- PostgreSQL 15 (for local development)
- Redis 7 (for local development)

### Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/insideweb0101/DealtrackerApp.git
   cd DealtrackerApp
   ```

2. **Create environment file**
   ```bash
   cp backend/.env.example .env
   ```

3. **Update .env with your configuration**
   ```env
   NODE_ENV=development
   PORT=3001
   
   # Database
   DB_HOST=postgres
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=dealtracker
   
   # Redis
   REDIS_HOST=redis
   REDIS_PORT=6379
   
   # JWT
   JWT_SECRET=your-secret-key
   JWT_EXPIRE=7d
   
   # Email (Optional)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_FROM=noreply@dealtracker.app
   
   # Slack (Optional)
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/...
   ```

4. **Start services**
   ```bash
   docker-compose up -d
   ```

5. **Run migrations**
   ```bash
   docker-compose exec backend npm run migrate
   ```

6. **Seed database (optional)**
   ```bash
   docker-compose exec backend npm run seed
   ```

7. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Docs: http://localhost:3001/docs (coming soon)

### Local Development Setup

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run build
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📖 API Documentation

See [API.md](./API.md) for detailed endpoint documentation.

### Key Endpoints

**Authentication**
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - Login user
- `GET /api/v1/users/profile` - Get user profile

**Deals**
- `GET /api/v1/deals` - List all deals
- `POST /api/v1/deals` - Create new deal
- `GET /api/v1/deals/:id` - Get deal details
- `PATCH /api/v1/deals/:id` - Update deal
- `DELETE /api/v1/deals/:id` - Delete deal
- `GET /api/v1/deals/pipeline` - Get pipeline statistics

**Alerts**
- `GET /api/v1/alerts/unread` - Get unread alerts
- `PATCH /api/v1/alerts/:id/read` - Mark alert as read

## 🧪 Testing

### Run Tests
```bash
# All tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Test Structure
- Backend tests in `backend/tests/`
- Frontend tests in `frontend/src/` (with `.test.tsx` suffix)

## 🔄 Background Jobs

### Alert Check Job
- Runs every 5 minutes
- Checks all deals for alert conditions
- Creates alerts for:
  - Approaching deadlines (≤7 days)
  - Stalled deals (>7 days without updates)
  - Low probability deals

### Notification Job
- Processes email, Slack, SMS notifications
- Retry logic with exponential backoff
- Error tracking and logging

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Request validation with Joi
- Helmet.js for HTTP headers
- CORS protection
- SQL injection prevention via parameterized queries

## 📊 Database Schema

### Tables
- **users** - User accounts with roles
- **deals** - Sales deals with status and metadata
- **alerts** - System-generated alerts
- **notifications** - Notification delivery tracking
- **alert_rules** - Custom alert rule configurations

## 🚢 Deployment

### Using Docker
```bash
# Build production image
docker build -t dealtracker:latest .

# Run container
docker run -p 3001:3001 dealtracker:latest
```

### Environment Variables for Production
```env
NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:5432/dbname
REDIS_URL=redis://host:6379
JWT_SECRET=strong-random-secret
SLACK_WEBHOOK_URL=your-slack-webhook
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Support

For issues and questions, please open a GitHub issue or contact the development team.

## 🎉 Acknowledgments

- Built with TypeScript for type safety
- Redux for predictable state management
- Tailwind CSS for rapid UI development
- PostgreSQL for reliable data persistence
- Redis for high-performance caching and job queuing

---

**Last Updated:** August 29, 2024
**Version:** 1.0.0
