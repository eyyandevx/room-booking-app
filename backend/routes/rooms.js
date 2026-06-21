import express from 'express';
import Room from '../models/Room.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get rooms by city
router.get('/', authenticate, async (req, res) => {
  try {
    const { city } = req.query;
    const rooms = await Room.find(city ? { city } : {});
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

// Get single room
router.get('/:id', authenticate, async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching room', error: error.message });
  }
});

export default router;
