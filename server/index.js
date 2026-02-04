const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configure CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'x-auth-token'],
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());

// Import storage utilities and Routes
const path = require('path');
const { UPLOADS_DIR } = require('./storage');
const authRoutes = require('./routes/auth');
const enrollmentRoutes = require('./routes/enrollment');
const attendanceRoutes = require('./routes/attendance');
const classesRoutes = require('./routes/classes');
const gradesRoutes = require('./routes/grades');
const dashboardRoutes = require('./routes/dashboard');
const usersRoutes = require('./routes/users');
const studentsRoutes = require('./routes/students');

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DepEd Compliance System Backend is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/students', studentsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('Unhandled Error:', err);
    const status = err.status || 500;
    const message = process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        error: message
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
