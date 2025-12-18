# Equipment Tracker API

A simple REST API backend for managing equipment items. Built with Node.js, Express.js, and SQLite.

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Navigate to the project directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

### Development Mode (with auto-reload)
```bash
npm run dev
```

## API Endpoints

### GET /api/equipment
Fetch all equipment items.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Mixer A",
      "type": "Mixer",
      "status": "Active",
      "lastCleanedDate": "2025-12-15",
      "createdAt": "2025-12-18T10:30:00",
      "updatedAt": "2025-12-18T10:30:00"
    }
  ]
}
```

---

### POST /api/equipment
Create a new equipment item.

**Request Body:**
```json
{
  "name": "Mixer A",
  "type": "Mixer",
  "status": "Active",
  "lastCleanedDate": "2025-12-15"
}
```

**Parameters:**
- `name` (string, required): Equipment name
- `type` (string, required): One of `Machine`, `Vessel`, `Tank`, `Mixer`
- `status` (string, required): One of `Active`, `Inactive`, `Under Maintenance`
- `lastCleanedDate` (string, optional): Date in YYYY-MM-DD format

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Equipment created successfully",
  "data": {
    "id": 1,
    "name": "Mixer A",
    "type": "Mixer",
    "status": "Active",
    "lastCleanedDate": "2025-12-15",
    "createdAt": "2025-12-18T10:30:00",
    "updatedAt": "2025-12-18T10:30:00"
  }
}
```

---

### PUT /api/equipment/:id
Update an existing equipment item.

**Request Body (all fields optional):**
```json
{
  "name": "Mixer B",
  "status": "Under Maintenance",
  "lastCleanedDate": "2025-12-17"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Equipment updated successfully",
  "data": {
    "id": 1,
    "name": "Mixer B",
    "type": "Mixer",
    "status": "Under Maintenance",
    "lastCleanedDate": "2025-12-17",
    "createdAt": "2025-12-18T10:30:00",
    "updatedAt": "2025-12-18T11:00:00"
  }
}
```

---

### DELETE /api/equipment/:id
Delete an equipment item.

**Response:**
```json
{
  "success": true,
  "message": "Equipment deleted successfully",
  "id": 1
}
```

---

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "OK",
  "message": "Equipment Tracker API is running"
}
```

## Database

- **File:** `equipment.db` (auto-created in project root)
- **Format:** SQLite 3
- **Table:** `equipment`

### Table Schema
```sql
CREATE TABLE equipment (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('Machine', 'Vessel', 'Tank', 'Mixer')),
  status TEXT NOT NULL CHECK(status IN ('Active', 'Inactive', 'Under Maintenance')),
  lastCleanedDate TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## Error Handling

All errors return appropriate HTTP status codes with descriptive JSON messages.

### Common Errors

**400 Bad Request** - Invalid input
```json
{
  "success": false,
  "error": "Validation failed",
  "details": ["name is required and must be a non-empty string"]
}
```

**404 Not Found** - Equipment not found
```json
{
  "success": false,
  "error": "Equipment not found",
  "id": 999
}
```

**500 Internal Server Error** - Database or server error
```json
{
  "success": false,
  "error": "Failed to fetch equipment",
  "message": "database disk image is malformed"
}
```

## Project Structure

```
backend/
├── server.js              # Express app setup and server configuration
├── db.js                  # SQLite database connection and helpers
├── routes/
│   └── equipmentRoutes.js # Equipment API endpoints
├── package.json           # Dependencies and scripts
├── README.md              # This file
└── equipment.db           # SQLite database (auto-created)
```

## Testing with cURL

### Create Equipment
```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tank 1",
    "type": "Tank",
    "status": "Active",
    "lastCleanedDate": "2025-12-15"
  }'
```

### Get All Equipment
```bash
curl http://localhost:5000/api/equipment
```

### Update Equipment
```bash
curl -X PUT http://localhost:5000/api/equipment/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Under Maintenance"
  }'
```

### Delete Equipment
```bash
curl -X DELETE http://localhost:5000/api/equipment/1
```

## Features

- CRUD operations for equipment
- SQLite database with auto-initialization
- Input validation with detailed error messages
- CORS enabled for frontend integration
- Clean code structure
- Proper HTTP status codes
- Timestamp tracking (createdAt, updatedAt)
- Database constraints (ENUM-like validation)

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** SQLite 3
- **Additional:** CORS middleware

## Notes

- Database file is automatically created on first run
- CORS is enabled for all origins (suitable for development)
- No authentication required
- Suitable for development and learning purposes

---

**Version:** 1.0.0  
**Last Updated:** December 2025
