/**
 * Simple scheduler that runs every minute, finds due reminders and sends emails.
 * Uses nodemailer. Configure SMTP via environment variables.
 */
const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const nodemailer = require('nodemailer');

let transporter;

function initTransporter() {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

async function sendReminder(reminder) {
  if (!transporter) initTransporter();
  const mail = {
    from: process.env.EMAIL_USER,
    to: reminder.email,
    subject: reminder.subject || 'Reminder',
    text: reminder.message
  };
  try {
    const info = await transporter.sendMail(mail);
    console.log('Email sent to', reminder.email, info.messageId || info);
    reminder.sent = true;
    await reminder.save();
  } catch (err) {
    console.error('Failed to send email for reminder', reminder._id, err.message);
  }
}

module.exports = {
  start: () => {
    // run every minute
    cron.schedule('* * * * *', async () => {
      try {
        const now = new Date();
        const due = await Reminder.find({ sent: false, remindAt: { $lte: now } });
        if (due.length > 0) {
          console.log('Found', due.length, 'due reminders');
          for (const r of due) {
            await sendReminder(r);
          }
        }
      } catch (err) {
        console.error('Scheduler error:', err);
      }
    }, {
      scheduled: true,
      timezone: 'UTC'
    });
    console.log('Scheduler started (checks every minute, UTC).');
  }
};
