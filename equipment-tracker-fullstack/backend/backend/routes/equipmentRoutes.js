const express = require('express');
const db = require('../db');
const router = express.Router();

// Valid enum values
const VALID_TYPES = ['Machine', 'Vessel', 'Tank', 'Mixer'];
const VALID_STATUSES = ['Active', 'Inactive', 'Under Maintenance'];

// ============================================================================
// GET /api/equipment - Fetch all equipment
// ============================================================================
router.get('/equipment', async (req, res) => {
  try {
    const equipment = await db.all('SELECT * FROM equipment ORDER BY id DESC');
    res.json({
      success: true,
      count: equipment.length,
      data: equipment
    });
  } catch (err) {
    console.error('Error fetching equipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch equipment',
      message: err.message
    });
  }
});

// ============================================================================
// POST /api/equipment - Create new equipment
// ============================================================================
router.post('/equipment', async (req, res) => {
  try {
    const { name, type, status, lastCleanedDate } = req.body;

    // Validation
    const errors = [];

    if (!name || typeof name !== 'string' || name.trim() === '') {
      errors.push('name is required and must be a non-empty string');
    }

    if (!type || !VALID_TYPES.includes(type)) {
      errors.push(`type is required and must be one of: ${VALID_TYPES.join(', ')}`);
    }

    if (!status || !VALID_STATUSES.includes(status)) {
      errors.push(`status is required and must be one of: ${VALID_STATUSES.join(', ')}`);
    }

    if (lastCleanedDate && !/^\d{4}-\d{2}-\d{2}$/.test(lastCleanedDate)) {
      errors.push('lastCleanedDate must be in YYYY-MM-DD format');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Insert into database
    const result = await db.run(
      `INSERT INTO equipment (name, type, status, lastCleanedDate)
       VALUES (?, ?, ?, ?)`,
      [name.trim(), type, status, lastCleanedDate || null]
    );

    // Fetch and return the created record
    const newEquipment = await db.get(
      'SELECT * FROM equipment WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'Equipment created successfully',
      data: newEquipment
    });
  } catch (err) {
    console.error('Error creating equipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to create equipment',
      message: err.message
    });
  }
});

// ============================================================================
// PUT /api/equipment/:id - Update equipment
// ============================================================================
router.put('/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, status, lastCleanedDate } = req.body;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid equipment ID'
      });
    }

    // Check if equipment exists
    const existing = await db.get(
      'SELECT * FROM equipment WHERE id = ?',
      [id]
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
        id: parseInt(id)
      });
    }

    // Build update query dynamically
    const updates = [];
    const params = [];

    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['name must be a non-empty string']
        });
      }
      updates.push('name = ?');
      params.push(name.trim());
    }

    if (type !== undefined) {
      if (!VALID_TYPES.includes(type)) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: [`type must be one of: ${VALID_TYPES.join(', ')}`]
        });
      }
      updates.push('type = ?');
      params.push(type);
    }

    if (status !== undefined) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: [`status must be one of: ${VALID_STATUSES.join(', ')}`]
        });
      }
      updates.push('status = ?');
      params.push(status);
    }

    if (lastCleanedDate !== undefined) {
      if (lastCleanedDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(lastCleanedDate)) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: ['lastCleanedDate must be in YYYY-MM-DD format']
        });
      }
      updates.push('lastCleanedDate = ?');
      params.push(lastCleanedDate);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No fields to update'
      });
    }

    // Add updatedAt timestamp
    updates.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    // Execute update
    await db.run(
      `UPDATE equipment SET ${updates.join(', ')} WHERE id = ?`,
      params
    );

    // Fetch and return updated record
    const updated = await db.get(
      'SELECT * FROM equipment WHERE id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Equipment updated successfully',
      data: updated
    });
  } catch (err) {
    console.error('Error updating equipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to update equipment',
      message: err.message
    });
  }
});

// ============================================================================
// DELETE /api/equipment/:id - Delete equipment
// ============================================================================
router.delete('/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid equipment ID'
      });
    }

    // Check if equipment exists
    const existing = await db.get(
      'SELECT * FROM equipment WHERE id = ?',
      [id]
    );

    if (!existing) {
      return res.status(404).json({
        success: false,
        error: 'Equipment not found',
        id: parseInt(id)
      });
    }

    // Delete the equipment
    await db.run('DELETE FROM equipment WHERE id = ?', [id]);

    res.json({
      success: true,
      message: 'Equipment deleted successfully',
      id: parseInt(id)
    });
  } catch (err) {
    console.error('Error deleting equipment:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to delete equipment',
      message: err.message
    });
  }
});

module.exports = router;
