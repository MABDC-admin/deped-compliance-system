const { getActiveSchoolYear } = require('../utils/schoolYear');

// Get all sections (filtered by SY)
router.get('/sections', auth, async (req, res) => {
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const result = await pool.query(`
            SELECT 
                s.*, 
                u.first_name || ' ' || u.last_name as adviser_name
            FROM sections s
            LEFT JOIN users u ON s.adviser_id = u.id
            WHERE ($1::uuid IS NULL OR s.school_year_id = $1)
            ORDER BY s.grade_level, s.name
        `, [syId]);
        res.json({ success: true, sections: result.rows });
    } catch (err) {
        console.error('Failed to fetch sections:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create new section (tied to SY)
router.post('/sections', auth, async (req, res) => {
    const { name, gradeLevel, adviserId, room, capacity, schoolYearId } = req.body;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        if (!syId) {
            return res.status(400).json({ success: false, error: 'No active school year found' });
        }

        const result = await pool.query(`
            INSERT INTO sections (name, grade_level, adviser_id, room_number, capacity, school_year_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `, [name, gradeLevel, adviserId, room, capacity || 45, syId]);
        res.json({ success: true, section: result.rows[0] });
    } catch (err) {
        console.error('Failed to create section:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Get all subjects
router.get('/subjects', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM subjects ORDER BY grade_level, name');
        res.json({ success: true, subjects: result.rows });
    } catch (err) {
        console.error('Failed to fetch subjects:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update section
router.put('/sections/:id', auth, async (req, res) => {
    const { name, grade_level, adviser_name, room_number, capacity } = req.body;
    try {
        const result = await pool.query(`
            UPDATE sections 
            SET name = $1, grade_level = $2, adviser_name = $3, room_number = $4, capacity = $5
            WHERE id = $6
            RETURNING *
        `, [name, grade_level, adviser_name, room_number, capacity, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Section not found' });
        }

        res.json({ success: true, section: result.rows[0] });
    } catch (err) {
        console.error('Failed to update section:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Delete section
router.delete('/sections/:id', auth, async (req, res) => {
    try {
        await pool.query('DELETE FROM sections WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete section:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
