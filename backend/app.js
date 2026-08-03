const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorHandler');

// Load config
dotenv.config();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Morgan logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/user'));
app.use('/api/crs', require('./routes/crs'));
app.use('/api/skill-gap', require('./routes/skillGap'));
app.use('/api/roadmap', require('./routes/roadmap'));
app.use('/api/companies', require('./routes/company'));
app.use('/api/news', require('./routes/news'));
app.use('/api/trends', require('./routes/trends'));
app.use('/api/ai-mentor', require('./routes/aiMentor'));

// Error handling middleware
app.use(errorHandler);

module.exports = app;
