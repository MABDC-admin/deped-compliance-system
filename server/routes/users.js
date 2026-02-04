const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all users (Admin only)
router.get('/', auth, async (req, res) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({ success: false, error: 'Access denied' });
    }

    try {
        const result = await pool.query('SELECT id, email, first_name, last_name, role, user_status, last_login, created_at FROM users ORDER BY created_at DESC');
        res.json({ success: true, users: result.rows });
    } catch (err) {
        console.error('Failed to fetch users:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Create user
router.post('/', auth, async (req, res) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { email, password, first_name, last_name, role } = req.body;
    try {
        // Simple hash (matching your current login logic for consistency)
        const passwordHash = Buffer.from(password).toString('base64');

        const result = await pool.query(
            'INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [email, passwordHash, first_name, last_name, role]
        );
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Failed to create user:', err);
        if (err.code === '23505') {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Update user
router.put('/:id', auth, async (req, res) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;
    const { first_name, last_name, role, user_status } = req.body;
    try {
        await pool.query(
            'UPDATE users SET first_name = $1, last_name = $2, role = $3, user_status = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
            [first_name, last_name, role, user_status, id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to update user:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

// Delete user
router.delete('/:id', auth, async (req, res) => {
    if (req.user.role !== 'administrator') {
        return res.status(403).json({ success: false, error: 'Access denied' });
    }

    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Failed to delete user:', err);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

module.exports = router;
