const { getActiveSchoolYear } = require('../utils/schoolYear');

// Get attendance for a section and date (filtered by SY)
router.get('/:sectionId/:date', auth, async (req, res) => {
    const { sectionId, date } = req.params;
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const result = await pool.query(`
            SELECT 
                s.id as student_id,
                s.first_name || ' ' || s.last_name as student_name,
                s.lrn,
                COALESCE(a.status, 'Present') as status,
                a.remarks
            FROM students s
            JOIN enrollments e ON s.id = e.student_id
            LEFT JOIN attendance a ON s.id = a.student_id AND a.date = $2 AND a.school_year_id = $3
            WHERE e.section_id = $1 AND e.school_year_id = $3
            ORDER BY s.last_name, s.first_name
        `, [sectionId, date, syId]);

        res.json({ success: true, attendance: result.rows });
    } catch (err) {
        console.error('Failed to fetch attendance:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update attendance (bulk - tied to SY)
router.post('/bulk', auth, async (req, res) => {
    const { date, records, schoolYearId } = req.body;

    if (!date || !records || !Array.isArray(records)) {
        return res.status(400).json({ success: false, error: 'Invalid data' });
    }

    const client = await pool.connect();
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        if (!syId) {
            return res.status(400).json({ success: false, error: 'No active school year found' });
        }

        await client.query('BEGIN');

        for (const record of records) {
            await client.query(`
                INSERT INTO attendance (student_id, status, date, remarks, school_year_id)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (student_id, date, school_year_id) 
                DO UPDATE SET status = EXCLUDED.status, remarks = EXCLUDED.remarks, created_at = CURRENT_TIMESTAMP
            `, [record.student_id, record.status, date, record.remarks, syId]);
        }

        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Failed to update attendance:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    } finally {
        client.release();
    }
});

module.exports = router;
