const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');
const { getActiveSchoolYear } = require('../utils/schoolYear');

// Get teacher dashboard stats
router.get('/teacher', auth, async (req, res) => {
    const teacherId = req.user.id;
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        // Total students in teacher's sections for the specific SY
        const studentsResult = await pool.query(`
            SELECT count(*) 
            FROM enrollments e
            JOIN sections s ON e.section_id = s.id
            WHERE s.adviser_id = $1 AND e.school_year_id = $2
        `, [teacherId, syId]);

        // Total classes/sections for this teacher for the specific SY
        const classesResult = await pool.query(`
            SELECT count(*) FROM sections WHERE adviser_id = $1 AND school_year_id = $2
        `, [teacherId, syId]);

        // Average attendance for teacher's sections (last 30 days) within the SY
        const attendanceResult = await pool.query(`
            SELECT 
                (COUNT(CASE WHEN a.status = 'Present' THEN 1 END)::FLOAT / NULLIF(COUNT(*), 0) * 100) as avg_attendance
            FROM attendance a
            JOIN sections s ON a.student_id IN (SELECT student_id FROM enrollments WHERE section_id = s.id AND school_year_id = $2)
            WHERE s.adviser_id = $1 AND a.school_year_id = $2
            AND a.date > CURRENT_DATE - INTERVAL '30 days'
        `, [teacherId, syId]);

        res.json({
            success: true,
            stats: {
                totalStudents: parseInt(studentsResult.rows[0].count),
                totalClasses: parseInt(classesResult.rows[0].count),
                averageAttendance: Math.round(parseFloat(attendanceResult.rows[0].avg_attendance || 0)),
                pendingGrades: 12 // Placeholder for now
            }
        });
    } catch (err) {
        console.error('Failed to fetch teacher dashboard data:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get student dashboard stats
router.get('/student', auth, async (req, res) => {
    const userId = req.user.id;
    const { schoolYearId } = req.query;
    try {
        // Find student_id corresponding to user.id
        const studentLookup = await pool.query('SELECT id FROM students WHERE email = $1', [req.user.email]);
        if (studentLookup.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Student record not found' });
        }
        const studentId = studentLookup.rows[0].id;

        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const attendanceResult = await pool.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(CASE WHEN status = 'Present' THEN 1 END) as present,
                COUNT(CASE WHEN status = 'Absent' THEN 1 END) as absent,
                COUNT(CASE WHEN status = 'Late' THEN 1 END) as late
            FROM attendance
            WHERE student_id = $1 AND school_year_id = $2
        `, [studentId, syId]);

        const gradesResult = await pool.query(`
            SELECT g.*, s.name as subject_name 
            FROM grades g
            JOIN subjects s ON g.subject_id = s.id
            WHERE g.student_id = $1 AND g.school_year_id = $2
            ORDER BY s.name, g.quarter
        `, [studentId, syId]);

        res.json({
            success: true,
            attendance: attendanceResult.rows[0],
            grades: gradesResult.rows
        });
    } catch (err) {
        console.error('Failed to fetch student dashboard data:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get events
router.get('/events', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC LIMIT 10');
        res.json({ success: true, events: result.rows });
    } catch (err) {
        console.error('Failed to fetch events:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get notices
router.get('/notices', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM notices ORDER BY created_at DESC LIMIT 10');
        res.json({ success: true, notices: result.rows });
    } catch (err) {
        console.error('Failed to fetch notices:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
