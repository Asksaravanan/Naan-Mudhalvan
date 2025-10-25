const express = require('express');
const router = express.Router();
const Reminder = require('../models/Reminder');

// Create a reminder
router.post('/', async (req, res) => {
  try {
    const { email, subject, message, remindAt } = req.body;
    if (!email || !message || !remindAt) {
      return res.status(400).json({ error: 'email, message and remindAt are required' });
    }
    const reminder = new Reminder({ email, subject, message, remindAt });
    await reminder.save();
    res.status(201).json(reminder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// List reminders
router.get('/', async (req, res) => {
  try {
    const reminders = await Reminder.find().sort({ remindAt: 1 });
    res.json(reminders);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single reminder
router.get('/:id', async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) return res.status(404).json({ error: 'Not found' });
    res.json(reminder);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete reminder
router.delete('/:id', async (req, res) => {
  try {
    const removed = await Reminder.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
