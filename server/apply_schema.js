const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

console.log('Using DATABASE_URL:', process.env.DATABASE_URL ? 'FOUND' : 'NOT FOUND');

const applySchema = async () => {
    try {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        await pool.query(schema);
        console.log('Schema applied successfully');
        process.exit(0);
    } catch (err) {
        console.error('Failed to apply schema:', err);
        process.exit(1);
    }
};

applySchema();
