# API Documentation

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
All endpoints (except `/users/login` and `/users/register`) require a Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

## Endpoints

### Users

#### Register
```
POST /users/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "password123",
  "role": "sales_rep" // optional: admin, manager, sales_rep
}

Response:
{
  "token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "sales_rep"
  }
}
```

#### Login
```
POST /users/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: Same as register
```

#### Get Profile
```
GET /users/profile
Authorization: Bearer <token>

Response:
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "sales_rep",
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Update Profile
```
PATCH /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe"
}

Response: Updated user object
```

### Deals

#### Create Deal
```
POST /deals
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Enterprise Software License",
  "description": "Annual license for 100 users",
  "value": 50000,
  "status": "prospecting",
  "client_name": "Acme Corp",
  "expected_close_date": "2024-12-31",
  "probability": 75
}

Response:
{
  "id": "uuid",
  "title": "Enterprise Software License",
  "value": 50000,
  "status": "prospecting",
  "owner_id": "uuid",
  "client_name": "Acme Corp",
  "expected_close_date": "2024-12-31T00:00:00Z",
  "probability": 75,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### Get All Deals
```
GET /deals?status=prospecting
Authorization: Bearer <token>

Query Parameters:
- status: Filter by status (optional)

Response: Array of deal objects
```

#### Get Deal by ID
```
GET /deals/:id
Authorization: Bearer <token>

Response: Single deal object
```

#### Update Deal
```
PATCH /deals/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "qualified",
  "probability": 85
}

Response: Updated deal object
```

#### Delete Deal
```
DELETE /deals/:id
Authorization: Bearer <token>

Response: 204 No Content
```

#### Get Pipeline
```
GET /deals/pipeline
Authorization: Bearer <token>

Response:
{
  "prospecting": {
    "count": 5,
    "value": 250000,
    "avgProbability": 45
  },
  "qualified": {
    "count": 3,
    "value": 150000,
    "avgProbability": 65
  },
  "negotiating": {
    "count": 2,
    "value": 100000,
    "avgProbability": 80
  },
  "won": {
    "count": 1,
    "value": 50000,
    "avgProbability": 100
  },
  "lost": {
    "count": 0,
    "value": 0,
    "avgProbability": 0
  }
}
```

### Alerts

#### Get Unread Alerts
```
GET /alerts/unread
Authorization: Bearer <token>

Response: Array of alert objects
[
  {
    "id": "uuid",
    "deal_id": "uuid",
    "type": "approaching_deadline",
    "message": "Deal closing in 3 days",
    "severity": "high",
    "is_read": false,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Mark Alert as Read
```
PATCH /alerts/:id/read
Authorization: Bearer <token>

Response: Updated alert object
```

## Error Responses

### 400 Bad Request
```json
{
  "errors": [
    {
      "field": "email",
      "message": "must be a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Deal not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

## Deal Statuses
- `prospecting` - Initial lead
- `qualified` - Qualified prospect
- `negotiating` - In negotiation
- `won` - Deal won
- `lost` - Deal lost

## Alert Types
- `status_change` - Deal status changed
- `approaching_deadline` - Deal closing soon
- `anomaly` - Unusual activity detected
- `stalled` - No updates in 7+ days
- `custom` - Custom alert rules

## Alert Severity
- `low` - Informational
- `medium` - Important
- `high` - Urgent
- `critical` - Immediate action needed
