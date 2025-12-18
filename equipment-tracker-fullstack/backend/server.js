const express = require('express');
const cors = require('cors');
const db = require('./db');
const equipmentRoutes = require('./routes/equipmentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.initialize();

// Routes
app.use('/api', equipmentRoutes);

// Basic health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Equipment Tracker API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

app.listen(PORT, () => {
  console.log(`\nEquipment Tracker API running on http://localhost:${PORT}`);
  console.log(`Database: equipment.db`);
  console.log(`\nAvailable endpoints:`);
  console.log(`  GET    /api/equipment       - Fetch all equipment`);
  console.log(`  POST   /api/equipment       - Create new equipment`);
  console.log(`  PUT    /api/equipment/:id   - Update equipment`);
  console.log(`  DELETE /api/equipment/:id   - Delete equipment`);
  console.log(`  GET    /health             - Health check\n`);
});

module.exports = app;
