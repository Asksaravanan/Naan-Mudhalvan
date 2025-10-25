require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reminderRoutes = require('./routes/reminderRoutes');
const scheduler = require('./utils/scheduler');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/reminders', reminderRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log('Server running on port', PORT));
    // start scheduler after DB is ready
    scheduler.start();
})
.catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
});
