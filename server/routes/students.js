const { getActiveSchoolYear } = require('../utils/schoolYear');

// Get all students with filtering (filtered by SY)
router.get('/', auth, async (req, res) => {
    const { search, gradeLevel, status, schoolYearId, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        let syId = schoolYearId;
        if (!syId && schoolYearId !== 'all') {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        let query = `
            SELECT s.*, e.grade_level, sec.name as section_name, e.status as enrollment_status
            FROM students s 
            JOIN enrollments e ON s.id = e.student_id
            LEFT JOIN sections sec ON e.section_id = sec.id 
            WHERE 1=1
        `;
        const params = [];

        if (syId && syId !== 'all') {
            params.push(syId);
            query += ` AND e.school_year_id = $${params.length}`;
        }

        if (search) {
            params.push(`%${search}%`);
            query += ` AND (s.first_name ILIKE $${params.length} OR s.last_name ILIKE $${params.length} OR s.lrn ILIKE $${params.length})`;
        }

        if (gradeLevel && gradeLevel !== 'all') {
            params.push(gradeLevel);
            query += ` AND e.grade_level = $${params.length}`;
        }

        if (status && status !== 'all') {
            params.push(status);
            query += ` AND e.status = $${params.length}`;
        }

        // Count total for pagination
        const countQuery = query.replace('s.*, e.grade_level, sec.name as section_name, e.status as enrollment_status', 'COUNT(*)');
        const countResult = await pool.query(countQuery, params);

        params.push(limit, offset);
        query += ` ORDER BY s.last_name ASC LIMIT $${params.length - 1} OFFSET $${params.length}`;

        const result = await pool.query(query, params);
        res.json({
            success: true,
            students: result.rows,
            total: parseInt(countResult.rows[0].count)
        });
    } catch (err) {
        console.error('Failed to fetch students:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get single student details (including academic and attendance records for specific SY)
router.get('/:id', auth, async (req, res) => {
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const studentResult = await pool.query(`
            SELECT s.*, e.grade_level, sec.name as section_name, e.school_year_id
            FROM students s 
            LEFT JOIN enrollments e ON s.id = e.student_id AND e.school_year_id = $2
            LEFT JOIN sections sec ON e.section_id = sec.id 
            WHERE s.id = $1
        `, [req.params.id, syId]);

        if (studentResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        const academicRecords = await pool.query('SELECT * FROM grades WHERE student_id = $1 AND school_year_id = $2 ORDER BY created_at DESC', [req.params.id, syId]);
        const attendanceRecords = await pool.query('SELECT * FROM attendance WHERE student_id = $1 AND school_year_id = $2 ORDER BY date DESC LIMIT 30', [req.params.id, syId]);

        res.json({
            success: true,
            student: studentResult.rows[0],
            academicRecords: academicRecords.rows,
            attendanceRecords: attendanceRecords.rows,
            history: (await pool.query('SELECT e.*, sy.year_name FROM enrollments e JOIN school_years sy ON e.school_year_id = sy.id WHERE e.student_id = $1 ORDER BY sy.start_date DESC', [req.params.id])).rows
        });
    } catch (err) {
        console.error('Failed to fetch student:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update student
router.put('/:id', auth, async (req, res) => {
    const { studentData } = req.body;
    try {
        const fields = Object.keys(studentData).map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = Object.values(studentData);
        values.push(req.params.id);

        await pool.query(`UPDATE students SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length}`, values);
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to update student:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create student
router.post('/', auth, async (req, res) => {
    const { studentData } = req.body;
    try {
        const keys = Object.keys(studentData).join(', ');
        const placeholders = Object.keys(studentData).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(studentData);

        const result = await pool.query(`INSERT INTO students (${keys}) VALUES (${placeholders}) RETURNING *`, values);
        res.json({ success: true, student: result.rows[0] });
    } catch (err) {
        console.error('Failed to create student:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM students WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete student:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
