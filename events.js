const express = require('express');
const router = express.Router();
const Event = require('../Models/Event');
const Registration = require('../Models/Registration');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find({ isActive: true }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single event with registration count
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registeredCount = await Registration.countDocuments({
      eventId: req.params.id,
      status: 'registered'
    });

    const waitlistedCount = await Registration.countDocuments({
      eventId: req.params.id,
      status: 'waitlisted'
    });

    res.json({
      ...event.toObject(),
      registeredCount,
      waitlistedCount,
      availableSeats: event.capacity - registeredCount
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new event (Admin)
router.post('/', async (req, res) => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event (Admin)
router.put('/:id', async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;