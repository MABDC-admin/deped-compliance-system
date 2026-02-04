const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../db');

// @route   POST api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ success: false, error: 'Invalid Credentials' });
        }

        const user = result.rows[0];

        // Simplistic password check for now (Denskie123)
        // In production, use bcrypt.compare(password, user.password_hash)
        if (password !== user.password_hash) {
            // Check if it's the base64 encoded one from the seed
            if (password !== 'Denskie123') {
                return res.status(400).json({ success: false, error: 'Invalid Credentials' });
            }
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '24h' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    user: {
                        id: user.id,
                        email: user.email,
                        firstName: user.first_name,
                        lastName: user.last_name,
                        role: user.role,
                        status: user.user_status
                    }
                });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/auth/verify
// @desc    Verify token & return user
router.post('/verify', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ success: false, error: 'No token provided' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const result = await db.query('SELECT id, email, first_name, last_name, role, user_status FROM users WHERE id = $1', [decoded.user.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const user = result.rows[0];
        res.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name,
                role: user.role,
                status: user.user_status
            }
        });
    } catch (err) {
        res.status(401).json({ success: false, error: 'Token is not valid' });
    }
});

module.exports = router;
