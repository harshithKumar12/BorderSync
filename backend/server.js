const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const ocrRoutes = require('./routes/ocr');
const adminRoutes = require('./routes/admin'); 
dotenv.config();

const authRoutes = require('./routes/auth');
const travelerRoutes = require('./routes/travelers');
const caseRoutes = require('./routes/cases');
const dashboardRoutes = require('./routes/dashboard');

const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/travelers', travelerRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use("/api/ocr", ocrRoutes);
app.use('/api/admin', adminRoutes); 
// Health check
app.get('/', (req, res) => {
  res.json({ message: 'BorderSync API is running' });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bordersync';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });


