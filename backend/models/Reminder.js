const mongoose = require('mongoose');

const ReminderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  subject: { type: String, default: 'Reminder' },
  message: { type: String, required: true },
  remindAt: { type: Date, required: true },
  sent: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reminder', ReminderSchema);
