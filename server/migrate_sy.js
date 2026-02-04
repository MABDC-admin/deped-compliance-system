const { pool } = require('./db');

async function migrate() {
    console.log('Starting SY Segregation Migration...');
    const client = await pool.connect();
    try {
        // await client.query('BEGIN'); // Removed for debugging

        try {
            console.log('1. Creating/Updating school_years table...');
            await client.query(`
                CREATE TABLE IF NOT EXISTS school_years (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    year_name TEXT UNIQUE NOT NULL,
                    start_date DATE NOT NULL,
                    end_date DATE NOT NULL,
                    enrollment_start DATE,
                    enrollment_end DATE,
                    is_active BOOLEAN DEFAULT false,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            `);
            await client.query(`ALTER TABLE school_years ADD COLUMN IF NOT EXISTS enrollment_start DATE`);
            await client.query(`ALTER TABLE school_years ADD COLUMN IF NOT EXISTS enrollment_end DATE`);
        } catch (e) {
            console.error('   Step 1 failed:', e.message);
        }

        try {
            console.log('2. Updating sections table...');
            await client.query(`ALTER TABLE sections ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id)`);
            await client.query(`ALTER TABLE sections ADD COLUMN IF NOT EXISTS adviser_id UUID REFERENCES users(id)`);
            await client.query(`ALTER TABLE sections ADD COLUMN IF NOT EXISTS room_number TEXT`);
        } catch (e) {
            console.error('   Step 2 failed:', e.message);
        }

        try {
            console.log('3. Creating enrollments table...');
            await client.query(`
                CREATE TABLE IF NOT EXISTS enrollments (
                    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                    student_id UUID REFERENCES students(id) NOT NULL,
                    school_year_id UUID REFERENCES school_years(id) NOT NULL,
                    section_id UUID REFERENCES sections(id),
                    grade_level TEXT NOT NULL,
                    status TEXT DEFAULT 'Enrolled',
                    enrollment_date DATE DEFAULT CURRENT_DATE,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    UNIQUE(student_id, school_year_id)
                )
            `);
        } catch (e) {
            console.error('   Step 3 failed:', e.message);
        }

        try {
            console.log('4. Updating attendance table...');
            await client.query(`ALTER TABLE attendance ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id)`);
            try {
                await client.query(`ALTER TABLE attendance DROP CONSTRAINT IF EXISTS attendance_student_id_date_key`);
            } catch (e) {
                console.log('   Note: attendance_student_id_date_key drop failed');
            }
            await client.query(`ALTER TABLE attendance ADD CONSTRAINT attendance_student_id_date_school_year_id_key UNIQUE(student_id, date, school_year_id)`);
        } catch (e) {
            console.error('   Step 4 failed:', e.message);
        }

        try {
            console.log('5. Updating grades table...');
            await client.query(`ALTER TABLE grades ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id)`);
            try {
                await client.query(`ALTER TABLE grades DROP CONSTRAINT IF EXISTS grades_student_id_subject_id_quarter_key`);
            } catch (e) {
                console.log('   Note: grades_student_id_subject_id_quarter_key drop failed');
            }
            await client.query(`ALTER TABLE grades ADD CONSTRAINT grades_student_id_subject_id_quarter_school_year_id_key UNIQUE(student_id, subject_id, quarter, school_year_id)`);
        } catch (e) {
            console.error('   Step 5 failed:', e.message);
        }

        try {
            console.log('6. Updating enrollment_applications table...');
            await client.query(`ALTER TABLE enrollment_applications ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id)`);
            await client.query(`ALTER TABLE enrollment_applications ADD COLUMN IF NOT EXISTS section_id UUID REFERENCES sections(id)`);
        } catch (e) {
            console.error('   Step 6 failed:', e.message);
        }

        try {
            console.log('7. Updating teacher_assignments table...');
            await client.query(`ALTER TABLE teacher_assignments ADD COLUMN IF NOT EXISTS school_year_id UUID REFERENCES school_years(id)`);
        } catch (e) {
            console.error('   Step 7 failed:', e.message);
        }

        try {
            console.log('8. Ensuring default school year...');
            const syCheck = await client.query('SELECT id FROM school_years LIMIT 1');
            if (syCheck.rows.length === 0) {
                const currentYear = new Date().getFullYear();
                await client.query(`
                    INSERT INTO school_years (year_name, start_date, end_date, is_active)
                    VALUES ($1, $2, $3, true)
                `, [`${currentYear}-${currentYear + 1}`, `${currentYear}-08-01`, `${currentYear + 1}-06-30`]);
                console.log('   Created default school year: ' + currentYear + '-' + (currentYear + 1));
            }
        } catch (e) {
            console.error('   Step 8 failed:', e.message);
        }

        // await client.query('COMMIT');
        console.log('Migration process finished (non-transactional).');
    } catch (err) {
        // await client.query('ROLLBACK');
        console.error('Main migration block error:', err);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
