import express from 'express';
import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Create booking
router.post('/', authenticate, async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate, numberOfGuests } = req.body;

    // Check room exists
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    // Calculate total price
    const days = Math.ceil(
      (new Date(checkOutDate) - new Date(checkInDate)) / (1000 * 60 * 60 * 24)
    );
    const totalPrice = days * room.price;

    // Create booking
    const booking = new Booking({
      userId: req.userId,
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
    });

    await booking.save();

    res.status(201).json({
      message: 'Booking confirmed',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Booking error', error: error.message });
  }
});

// Get user bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId })
      .populate('roomId');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

export default router;
