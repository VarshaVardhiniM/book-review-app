const express    = require('express');
const mongoose   = require('mongoose');
const cors       = require('cors');
const dotenv     = require('dotenv');

const bookRoutes   = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const authRoutes   = require('./routes/authRoutes');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/books',   bookRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check
app.get('/', (req, res) => res.json({ message: 'Book Review API running' }));

// Error handler (must be last)
app.use(errorHandler);

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => { console.error('DB Error:', err); process.exit(1); });
