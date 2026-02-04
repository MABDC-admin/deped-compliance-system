const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dbUrl = process.env.DATABASE_URL || '';
const sslConfig = (dbUrl.includes('localhost') ||
    dbUrl.includes('127.0.0.1') ||
    dbUrl.includes('turntable.proxy.rlwy.net'))
    ? false
    : { rejectUnauthorized: false };

const pool = new Pool({
    connectionString: dbUrl,
    ssl: dbUrl ? sslConfig : false
});

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
