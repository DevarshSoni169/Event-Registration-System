const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  studentEmail: {
    type: String,
    required: true,
    trim: true
  },
  studentId: {
    type: String,
    required: true,
    trim: true
  },
  registrationDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['registered', 'waitlisted', 'cancelled'],
    default: 'registered'
  },
  position: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Prevent duplicate registrations for same event and email
registrationSchema.index({ eventId: 1, studentEmail: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);