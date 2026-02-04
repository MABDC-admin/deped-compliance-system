const pool = require('./db');

/**
 * Log a system action for compliance and auditing.
 * @param {string} userId - ID of the user performing the action
 * @param {string} action - Description of the action (e.g., 'UPDATE_GRADE')
 * @param {string} module - Component name (e.g., 'GRADING')
 * @param {string} entityId - ID of the record being changed
 * @param {object} beforeValues - State before change
 * @param {object} afterValues - State after change
 * @param {string} ipAddress - Request IP address
 */
const logAction = async (userId, action, module, entityId, beforeValues, afterValues, ipAddress) => {
    try {
        await pool.query(`
            INSERT INTO audit_logs (user_id, action, module, entity_id, before_values, after_values, ip_address)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [userId, action, module, entityId, beforeValues, afterValues, ipAddress]);
    } catch (err) {
        console.error('Failed to save audit log:', err);
    }
};

module.exports = {
    logAction
};
