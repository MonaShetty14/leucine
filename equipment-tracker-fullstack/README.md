# Equipment Tracker

A full-stack web application to manage equipment inventory with CRUD operations.

## Features

- View equipment in a table format
- Add, edit, and delete equipment
- Filter by type and status
- Search across all fields
- Sort by name, type, status, or last cleaned date
- Mobile-responsive design

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express
- **Database:** SQLite

## How to Run Locally

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd equipment-tracker
```

2. Install all dependencies:
```bash
npm run install:all
```

Or install separately:
```bash
# Backend
cd backend/backend && npm install

# Frontend
cd frontend/equipment-hub-main && npm install
```

3. Start the application:
```bash
npm run dev
```

This starts both servers:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/equipment | Get all equipment |
| POST | /api/equipment | Create new equipment |
| PUT | /api/equipment/:id | Update equipment |
| DELETE | /api/equipment/:id | Delete equipment |

## Equipment Fields

- **Name** (required): Text field
- **Type** (required): Machine, Vessel, Tank, or Mixer
- **Status** (required): Active, Inactive, or Under Maintenance
- **Last Cleaned Date** (optional): Date picker

## Assumptions

- Single user application (no authentication required)
- SQLite is sufficient for data persistence
- Equipment names don't need to be unique
- Last cleaned date cannot be in the future

## What I Would Improve With More Time

- Add pagination for large datasets
- Implement bulk delete functionality
- Add data export (CSV/Excel)
- Add equipment history/audit log
- Implement dark mode toggle
- Add unit and integration tests
