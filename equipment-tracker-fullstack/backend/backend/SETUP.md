# Equipment Tracker API - Setup Guide

## Prerequisites

Ensure you have the following installed on your machine:
- **Node.js** (v14.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for version control)

### Check Installation
```bash
node --version
npm --version
```

---

## Installation Steps

### Step 1: Extract the Project
Unzip the `backend.zip` file to your desired location:
```bash
unzip backend.zip
cd backend
```

### Step 2: Install Dependencies
```bash
npm install
```

This will install:
- `express` - Web framework
- `cors` - CORS middleware
- `sqlite3` - Database driver
- `nodemon` - Development auto-reload tool

### Step 3: Verify Installation
```bash
npm list
```

You should see all dependencies listed.

---

## Running the Server

### Production Mode
```bash
npm start
```

### Development Mode (with auto-reload on file changes)
```bash
npm run dev
```

### Expected Output
```
Connected to SQLite database
Equipment table ready

Equipment Tracker API running on http://localhost:5000
Database: equipment.db

Available endpoints:
  GET    /api/equipment       - Fetch all equipment
  POST   /api/equipment       - Create new equipment
  PUT    /api/equipment/:id   - Update equipment
  DELETE /api/equipment/:id   - Delete equipment
  GET    /health             - Health check
```

---

## Testing the API

### Option 1: Using cURL (Command Line)

**Health Check:**
```bash
curl http://localhost:5000/health
```

**Create Equipment:**
```bash
curl -X POST http://localhost:5000/api/equipment \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mixer Unit A",
    "type": "Mixer",
    "status": "Active",
    "lastCleanedDate": "2025-12-18"
  }'
```

**Get All Equipment:**
```bash
curl http://localhost:5000/api/equipment
```

**Update Equipment:**
```bash
curl -X PUT http://localhost:5000/api/equipment/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "Under Maintenance"
  }'
```

**Delete Equipment:**
```bash
curl -X DELETE http://localhost:5000/api/equipment/1
```

### Option 2: Using Postman

1. Download and install [Postman](https://www.postman.com/downloads/)
2. Create a new request
3. Set method to GET/POST/PUT/DELETE
4. Enter URL: `http://localhost:5000/api/equipment`
5. For POST/PUT, go to Body tab -> select "raw" -> choose "JSON"
6. Add your JSON payload
7. Click "Send"

### Option 3: Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Click the Thunder Client icon
3. Create new request
4. Use the same URLs and methods as above

---

## Database

### Automatic Creation
The database (`equipment.db`) is created automatically on first run in the project root.

### Manual Database Inspection (Optional)

If you want to view the database directly, install SQLite CLI:

**macOS (with Homebrew):**
```bash
brew install sqlite
```

**Windows (with Chocolatey):**
```bash
choco install sqlite
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install sqlite3
```

### Browse Database
```bash
sqlite3 equipment.db
```

Then use SQL commands:
```sql
-- View all equipment
SELECT * FROM equipment;

-- View table schema
.schema equipment

-- Exit
.exit
```

---

## Project Structure

```
backend/
├── server.js              # Main Express app and server setup
├── db.js                  # SQLite connection and query helpers
├── routes/
│   └── equipmentRoutes.js # All CRUD endpoints
├── package.json           # Node.js dependencies
├── package-lock.json      # Dependency lock file (auto-generated)
├── .gitignore             # Git ignore file
├── .env.example           # Environment variables example
├── SETUP.md               # This setup guide
├── README.md              # API documentation
└── equipment.db           # SQLite database (auto-created)
```

---

## Connecting with Frontend

The API is CORS-enabled and ready to connect with a React frontend.

### React Example (Fetch All Equipment)
```javascript
useEffect(() => {
  fetch('http://localhost:5000/api/equipment')
    .then(res => res.json())
    .then(data => setEquipment(data.data))
    .catch(err => console.error('Error:', err));
}, []);
```

### React Example (Create Equipment)
```javascript
const createEquipment = async (equipmentData) => {
  const response = await fetch('http://localhost:5000/api/equipment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(equipmentData)
  });
  return response.json();
};
```

---

## Configuration

### Change Server Port
Edit `server.js` or set environment variable:
```bash
PORT=8000 npm start
```

### CORS Configuration
Currently allows all origins (good for development). For production, modify `server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000' // Your frontend URL
}));
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### Database Lock Error
```bash
# Remove old database and restart
rm equipment.db
npm start
```

### npm install fails
```bash
# Clear npm cache and retry
npm cache clean --force
npm install
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## API Endpoint Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/equipment` | Fetch all equipment |
| POST | `/api/equipment` | Create new equipment |
| PUT | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |
| GET | `/health` | Server health check |

---

## Next Steps

1. Extract and install the project
2. Start the server (`npm start`)
3. Test endpoints with cURL or Postman
4. Build your React frontend
5. Connect frontend to this API

---

## Support

For issues or questions:
- Check the README.md for API documentation
- Review error messages in the server console
- Ensure Node.js and npm are properly installed
- Verify port 5000 is available
