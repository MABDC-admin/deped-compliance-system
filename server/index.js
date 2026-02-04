const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes
// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'DepEd Compliance System Backend is running' });
});

// Import Routes
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

app.use('/api/auth', authRoutes);
app.use('/api/enrollment', enrollmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/classes', classesRoutes);
app.use('/api/grades', gradesRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/students', studentsRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
