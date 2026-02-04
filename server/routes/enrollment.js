const express = require('express');
const router = express.Router();
const { saveFile } = require('../storage');
const { logAction } = require('../audit');
const pool = require('../db');
const PDFDocument = require('pdfkit');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

// Helper to send email
async function sendApprovalEmail(studentData, parentEmail, pdfBuffer) {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: `"DepEd Compliance System" <${process.env.EMAIL_USER}>`,
        to: `${parentEmail}, ${process.env.SCHOOL_EMAIL}`,
        subject: `Admission Approved: ${studentData.student_first_name} ${studentData.student_last_name}`,
        text: `Dear Parent/Guardian,\n\nWe are pleased to inform you that the admission for ${studentData.student_first_name} ${studentData.student_last_name} to ${studentData.grade_level} has been APPROVED.\n\nPlease find the attached Enrollment Form and Learner Information for your records.\n\nNext Steps:\n1. Visit the school office for final document verification.\n2. Proceed to the cashier for any necessary fees.\n3. Attend the student orientation on the scheduled date.\n\nBest regards,\nSchool Registrar`,
        attachments: [
            {
                filename: `Enrollment_Form_${studentData.application_number}.pdf`,
                content: pdfBuffer,
            },
        ],
    };

    await transporter.sendMail(mailOptions);
}

// Helper to generate PDF
async function generateStudentPDF(studentData) {
    return new Promise((resolve) => {
        const doc = new PDFDocument();
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
            let pdfData = Buffer.concat(buffers);
            resolve(pdfData);
        });

        doc.fontSize(20).text('CERTIFICATE OF ADMISSION', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).text(`Application Number: ${studentData.application_number}`);
        doc.text(`Student Name: ${studentData.student_last_name}, ${studentData.student_first_name} ${studentData.student_middle_name || ''}`);
        doc.text(`Grade Level: ${studentData.grade_level}`);
        doc.text(`Status: ADMITTED`);
        doc.text(`Date of Approval: ${new Date().toLocaleDateString()}`);
        doc.moveDown();
        doc.text('This document serves as official confirmation of admission.');

        doc.end();
    });
}

// @route   GET api/enrollment
// @desc    Get all applications (filtered by SY)
router.get('/', auth, async (req, res) => {
    const { schoolYearId } = req.query;
    try {
        let syId = schoolYearId;
        if (!syId) {
            const activeSY = await getActiveSchoolYear();
            syId = activeSY?.id;
        }

        const query = `
            SELECT a.*, s.name as section_name 
            FROM enrollment_applications a
            LEFT JOIN sections s ON a.section_id = s.id
            WHERE ($1::uuid IS NULL OR a.school_year_id = $1)
            ORDER BY a.created_at DESC
        `;
        const result = await pool.query(query, [syId]);
        res.json({ success: true, applications: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/enrollment/:id/status
// @desc    Update single application status
router.put('/:id/status', auth, async (req, res) => {
    const { status, section_id } = req.body;
    try {
        if (section_id) {
            await pool.query('UPDATE enrollment_applications SET status = $1, section_id = $2 WHERE id = $3', [status, section_id, req.params.id]);
        } else {
            await pool.query('UPDATE enrollment_applications SET status = $1 WHERE id = $2', [status, req.params.id]);
        }
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/enrollment/bulk/status
// @desc    Update multiple application statuses
router.post('/bulk/status', auth, async (req, res) => {
    const { ids, status } = req.body;
    try {
        await pool.query('UPDATE enrollment_applications SET status = $1 WHERE id = ANY($2::uuid[])', [status, ids]);
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/enrollment/submit
// @desc    Submit new enrollment
router.post('/submit', async (req, res) => {
    const data = req.body;
    const application_number = `ENR-${new Date().getFullYear()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;

    try {
        const activeSY = await getActiveSchoolYear();
        if (!activeSY) {
            return res.status(400).json({ success: false, error: 'No active school year found. Enrollment is currently closed.' });
        }

        const result = await pool.query(
            `INSERT INTO enrollment_applications 
            (application_number, student_first_name, student_middle_name, student_last_name, 
            date_of_birth, gender, grade_level, lrn, parent_email, status, school_year_id) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [
                application_number, data.firstName, data.middleName, data.lastName,
                data.dateOfBirth, data.gender, data.gradeLevelApplying, data.lrn, data.email, 'pre-registered', activeSY.id
            ]
        );
        res.json({ success: true, applicationId: result.rows[0].id, applicationNumber: application_number });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/enrollment/approve
// @desc    Approve admission and send email
router.post('/approve', auth, async (req, res) => {
    const { applicationId } = req.body;

    try {
        // 1. Get application details
        const appResult = await pool.query('SELECT * FROM enrollment_applications WHERE id = $1', [applicationId]);
        if (appResult.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Application not found' });
        }
        const studentData = appResult.rows[0];

        // 2. Update status in DB
        await pool.query('UPDATE enrollment_applications SET status = $1 WHERE id = $2', ['enrolled', applicationId]);

        // 3. Create record in enrollments table
        // First check if student exists by LRN, if not we'd ideally create one, 
        // but for now let's assume they exist or use the application data to create/link
        let studentId = studentData.student_id;

        // If the application doesn't have a linked student_id yet (first time enrollment)
        if (!studentId && studentData.lrn) {
            const studentCheck = await pool.query('SELECT id FROM students WHERE lrn = $1', [studentData.lrn]);
            if (studentCheck.rows.length > 0) {
                studentId = studentCheck.rows[0].id;
            } else {
                // Create new student record from application data
                const newStudent = await pool.query(
                    `INSERT INTO students (lrn, first_name, last_name, middle_name, current_grade_level, current_section)
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
                    [studentData.lrn, studentData.student_first_name, studentData.student_last_name,
                    studentData.student_middle_name, studentData.grade_level, studentData.section_id]
                );
                studentId = newStudent.rows[0].id;
            }
        }

        if (studentId) {
            await pool.query(
                `INSERT INTO enrollments (student_id, school_year_id, section_id, grade_level, status)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (student_id, school_year_id) DO UPDATE 
                SET section_id = EXCLUDED.section_id, grade_level = EXCLUDED.grade_level, status = EXCLUDED.status`,
                [studentId, studentData.school_year_id, studentData.section_id, studentData.grade_level, 'Enrolled']
            );
        }

        // 4. Generate PDF
        const pdfBuffer = await generateStudentPDF(studentData);

        // Save PDF to persistent storage
        const filename = `admission_${studentData.lrn || Date.now()}.pdf`;
        const filePath = saveFile(filename, pdfBuffer);

        // 5. Send Email
        try {
            await sendApprovalEmail(studentData, studentData.parent_email, pdfBuffer);
        } catch (emailErr) {
            console.error('Failed to send approval email:', emailErr);
        }

        // 6. Audit Log
        await logAction(
            req.user.id,
            'APPROVE_ENROLLMENT',
            'ENROLLMENT',
            applicationId,
            { status: studentData.status },
            { status: 'enrolled' },
            req.ip
        );

        res.json({ success: true, message: 'Enrollment approved and certificate generated' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   GET api/enrollment/school-years
// @desc    Get all school years
router.get('/school-years', auth, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM school_years ORDER BY start_date DESC');
        res.json({ success: true, schoolYears: result.rows });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/enrollment/school-years
// @desc    Create school year
router.post('/school-years', auth, async (req, res) => {
    const { year_name, start_date, end_date, enrollment_start, enrollment_end } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO school_years (year_name, start_date, end_date, enrollment_start, enrollment_end, is_active) 
            VALUES ($1, $2, $3, $4, $5, false) RETURNING *`,
            [year_name, start_date, end_date, enrollment_start, enrollment_end]
        );
        res.json({ success: true, schoolYear: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   PUT api/enrollment/school-years/:id
// @desc    Update school year
router.put('/school-years/:id', auth, async (req, res) => {
    const { year_name, start_date, end_date, enrollment_start, enrollment_end } = req.body;
    try {
        const result = await pool.query(
            `UPDATE school_years 
            SET year_name = $1, start_date = $2, end_date = $3, enrollment_start = $4, enrollment_end = $5
            WHERE id = $6 RETURNING *`,
            [year_name, start_date, end_date, enrollment_start, enrollment_end, req.params.id]
        );
        res.json({ success: true, schoolYear: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// @route   POST api/enrollment/school-years/:id/active
// @desc    Set school year as active
router.post('/school-years/:id/active', auth, async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        await client.query('UPDATE school_years SET is_active = false');
        await client.query('UPDATE school_years SET is_active = true WHERE id = $1', [req.params.id]);
        await client.query('COMMIT');
        res.json({ success: true });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err.message);
        res.status(500).send('Server error');
    } finally {
        client.release();
    }
});

module.exports = router;
