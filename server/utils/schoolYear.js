const pool = require('./db');

/**
 * Gets the current active school year
 * @returns {Promise<Object|null>}
 */
async function getActiveSchoolYear() {
    const result = await pool.query('SELECT * FROM school_years WHERE is_active = true LIMIT 1');
    return result.rows[0] || null;
}

module.exports = { getActiveSchoolYear };
