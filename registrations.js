const express = require('express');
const router = express.Router();
const Registration = require('../Models/Registration');
const Event = require('../Models/Event');
const { sendEmail } = require('../utils/emailService');

// Get registrations for an event (Admin) - ADD THIS ROUTE
router.get('/event/:eventId', async (req, res) => {
  try {
    console.log('🔍 Fetching registrations for event:', req.params.eventId);
    
    // Check if event exists
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const registrations = await Registration.find({ 
      eventId: req.params.eventId 
    }).sort({ status: 1, position: 1, registrationDate: 1 });

    console.log('✅ Found registrations:', registrations.length);
    res.json(registrations);
  } catch (error) {
    console.error('❌ Error fetching registrations:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get user's registrations - ADD THIS ROUTE TOO
router.get('/user/:email', async (req, res) => {
  try {
    const registrations = await Registration.find({ 
      studentEmail: req.params.email 
    }).populate('eventId').sort({ registrationDate: -1 });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register for event
router.post('/', async (req, res) => {
  try {
    const { eventId, studentName, studentEmail, studentId } = req.body;

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event || !event.isActive) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      eventId,
      studentEmail
    });

    if (existingRegistration) {
      return res.status(400).json({ 
        message: 'You are already registered for this event' 
      });
    }

    // Get current registration count
    const registeredCount = await Registration.countDocuments({
      eventId,
      status: 'registered'
    });

    let status = 'registered';
    let position = 0;

    // Check if event is full
    if (registeredCount >= event.capacity) {
      status = 'waitlisted';
      const waitlistedCount = await Registration.countDocuments({
        eventId,
        status: 'waitlisted'
      });
      position = waitlistedCount + 1;
    }

    const registration = new Registration({
      eventId,
      studentName,
      studentEmail,
      studentId,
      status,
      position
    });

    await registration.save();

    // Update event registration count if registered
    if (status === 'registered') {
      await Event.findByIdAndUpdate(eventId, {
        $inc: { currentRegistrations: 1 }
      });
    }

    // Send confirmation email
    if (status === 'registered') {
      await sendEmail(
        studentEmail,
        `🎉 Registration Confirmed: ${event.title}`,
        'registration',
        {
          studentName,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location
        }
      );
    } else {
      await sendEmail(
        studentEmail,
        `⏳ Waitlist Confirmation: ${event.title}`,
        'waitlist',
        {
          studentName,
          eventTitle: event.title,
          position
        }
      );
    }

    res.status(201).json({
      message: status === 'registered' 
        ? 'Registration successful! Confirmation email sent.' 
        : `Added to waiting list (Position #${position}). Confirmation email sent.`,
      registration,
      status,
      position
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Cancel registration
router.put('/:id/cancel', async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('eventId');
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const wasRegistered = registration.status === 'registered';
    registration.status = 'cancelled';
    await registration.save();

    // Send cancellation email
    await sendEmail(
      registration.studentEmail,
      `📝 Registration Cancelled: ${registration.eventId.title}`,
      'cancellation',
      {
        studentName: registration.studentName,
        eventTitle: registration.eventId.title
      }
    );

    // If it was a registered spot, promote first waitlisted person
    if (wasRegistered) {
      await promoteFromWaitlist(registration.eventId._id);
    }

    res.json({ message: 'Registration cancelled successfully. Confirmation email sent.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Helper function to promote from waitlist
async function promoteFromWaitlist(eventId) {
  const nextWaitlisted = await Registration.findOne({
    eventId,
    status: 'waitlisted'
  }).sort({ position: 1 });

  if (nextWaitlisted) {
    nextWaitlisted.status = 'registered';
    nextWaitlisted.position = 0;
    await nextWaitlisted.save();

    // Update positions for remaining waitlisted
    await Registration.updateMany(
      {
        eventId,
        status: 'waitlisted',
        position: { $gt: nextWaitlisted.position }
      },
      { $inc: { position: -1 } }
    );

    const event = await Event.findById(eventId);
    
    // Send promotion email
    await sendEmail(
      nextWaitlisted.studentEmail,
      `🎊 You're In! Promotion Confirmation: ${event.title}`,
      'promotion',
      {
        studentName: nextWaitlisted.studentName,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time,
        eventLocation: event.location
      }
    );

    // Update event registration count
    await Event.findByIdAndUpdate(eventId, {
      $inc: { currentRegistrations: 1 }
    });
  }
}

module.exports = router;