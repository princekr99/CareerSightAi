// Simple Express server for CareerSight AI
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { setMongoEnabled } = require('./utils/dbState');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resume');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/careersight')
  .then(() => {
    setMongoEnabled(true);
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    setMongoEnabled(false);
    console.error('MongoDB connection error', err.message || err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resume', resumeRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send('CareerSight AI backend running');
  });
}

if (process.env.NODE_ENV === 'production') {
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');

  if (fs.existsSync(clientDistPath)) {
    app.use(express.static(clientDistPath));

    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(path.join(clientDistPath, 'index.html'));
    });
  }
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
