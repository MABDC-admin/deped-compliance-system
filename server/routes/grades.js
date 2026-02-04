const { getActiveSchoolYear } = require('../utils/schoolYear');

// Get grades for a student and subject (filtered by SY)
router.get('/:studentId/:subjectId', auth, async (req, res) => {
    const { studentId, subjectId } = req.params;
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const result = await pool.query(`
            SELECT * FROM grades 
            WHERE student_id = $1 AND subject_id = $2 AND school_year_id = $3
            ORDER BY quarter
        `, [studentId, subjectId, syId]);
        res.json({ success: true, grades: result.rows });
    } catch (err) {
        console.error('Failed to fetch grades:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update or record scores for a specific component
router.post('/record-score', auth, async (req, res) => {
    const { studentId, subjectId, quarter, component, rawScore, maxScore } = req.body;
    // Component: 'written_work', 'performance_task', 'quarterly_assessment'
    try {
        // Logic to update component scores and recompute quarterly grade
        // For MVP, we'll just log it. Full logic would require a more complex scores table
        res.json({ success: true, message: 'Score recorded (computation logic coming soon)' });
    } catch (err) {
        console.error('Failed to record score:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
