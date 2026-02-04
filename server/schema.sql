-- Database Schema for DepEd Compliance System

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    phone TEXT,
    user_status TEXT DEFAULT 'active',
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lrn TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    middle_name TEXT,
    suffix TEXT,
    gender TEXT,
    birth_date DATE,
    birth_place TEXT,
    nationality TEXT,
    religion TEXT,
    mother_tongue TEXT,
    email TEXT,
    phone TEXT,
    address_street TEXT,
    address_barangay TEXT,
    address_city TEXT,
    address_province TEXT,
    address_zip TEXT,
    guardian_name TEXT,
    guardian_relationship TEXT,
    guardian_phone TEXT,
    guardian_email TEXT,
    current_grade_level TEXT,
    current_section TEXT,
    status TEXT DEFAULT 'Enrolled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enrollment Applications
CREATE TABLE IF NOT EXISTS enrollment_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    student_first_name TEXT NOT NULL,
    student_middle_name TEXT,
    student_last_name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    status TEXT DEFAULT 'pre-registered',
    parent_email TEXT,
    parent_phone TEXT,
    documents JSONB, -- List of uploaded document URLs/info
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- School Years Table
CREATE TABLE IF NOT EXISTS school_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    year_name TEXT UNIQUE NOT NULL, -- e.g., '2023-2024'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    enrollment_start DATE,
    enrollment_end DATE,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sections (Updated with school_year_id)
CREATE TABLE IF NOT EXISTS sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    capacity INTEGER DEFAULT 45,
    current_enrollment INTEGER DEFAULT 0,
    school_year_id UUID REFERENCES school_years(id),
    adviser_id UUID REFERENCES users(id),
    room_number TEXT
);

-- Enrollments Table (Linking students to years/sections)
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
);

-- Attendance Table (Updated with school_year_id)
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    school_year_id UUID REFERENCES school_years(id),
    status VARCHAR(20) NOT NULL, -- 'Present', 'Absent', 'Late', 'Excused'
    date DATE NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, date, school_year_id)
);

-- Grades Table (Updated with school_year_id)
CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES students(id),
    subject_id UUID REFERENCES subjects(id),
    school_year_id UUID REFERENCES school_years(id),
    quarter INTEGER NOT NULL, -- 1, 2, 3, 4
    written_work_score DECIMAL(5,2),
    performance_task_score DECIMAL(5,2),
    quarterly_assessment_score DECIMAL(5,2),
    initial_grade DECIMAL(5,2),
    transmuted_grade DECIMAL(5,2),
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, subject_id, quarter, school_year_id)
);

-- Enrollment Applications (Updated with school_year_id)
CREATE TABLE IF NOT EXISTS enrollment_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number TEXT UNIQUE NOT NULL,
    student_first_name TEXT NOT NULL,
    student_middle_name TEXT,
    student_last_name TEXT NOT NULL,
    grade_level TEXT NOT NULL,
    status TEXT DEFAULT 'pre-registered',
    parent_email TEXT,
    parent_phone TEXT,
    documents JSONB, -- List of uploaded document URLs/info
    school_year_id UUID REFERENCES school_years(id),
    section_id UUID REFERENCES sections(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Teacher Assignments (Updated with school_year_id reference)
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES users(id),
    subject_id UUID REFERENCES subjects(id),
    section_id UUID REFERENCES sections(id),
    school_year_id UUID REFERENCES school_years(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs for Compliance
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    module VARCHAR(50) NOT NULL,
    entity_id UUID,
    before_values JSONB,
    after_values JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
