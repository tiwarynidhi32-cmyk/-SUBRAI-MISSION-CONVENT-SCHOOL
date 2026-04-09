-- ==========================================
-- 1. STUDENTS & REGISTRATION
-- ==========================================
CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT UNIQUE NOT NULL,
    title TEXT,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    gender TEXT,
    date_of_birth DATE,
    category TEXT,
    religion TEXT,
    caste TEXT,
    blood_group TEXT,
    email TEXT,
    mobile TEXT,
    aadhaar_number TEXT,
    pan_number TEXT,
    passport_number TEXT,
    
    -- Family Details
    father_name TEXT,
    mother_name TEXT,
    father_mobile TEXT,
    mother_mobile TEXT,
    father_income TEXT,
    father_income_source TEXT,
    mother_income TEXT,
    mother_income_source TEXT,
    
    -- Contact & Address
    residential_address TEXT,
    emergency_contact TEXT,
    local_guardian_contact TEXT,
    
    -- Health & Relations
    allergy TEXT,
    has_disability BOOLEAN DEFAULT FALSE,
    disability_details TEXT,
    relation_in_school JSONB DEFAULT '[]',
    
    -- Documents (Base64 or URLs)
    photo TEXT,
    roll_number TEXT,
    aadhaar_card_doc TEXT,
    caste_certificate_doc TEXT,
    parents_docs TEXT,
    signature_doc TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial Seed Data
INSERT INTO settings (id, school_name, school_email, school_contact, categories, castes, religions, titles, classes, sections, subjects, genders)
VALUES (1, 'Digital School Systems', 'info@digitalschool.com', '+91 9876543210', 
    '["General", "OBC", "SC", "ST"]', 
    '["General", "Yadav", "Sharma", "Verma"]', 
    '["Hindu", "Muslim", "Sikh", "Christian"]', 
    '["Mr.", "Mrs.", "Ms.", "Dr."]', 
    '["Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"]', 
    '["A", "B", "C", "D"]', 
    '["Math", "Science", "English", "Hindi", "Social Studies", "Computer", "Sanskrit", "Physical Education"]', 
    '["Male", "Female", "Other"]'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (username, password, role, permissions)
VALUES 
('admin', '12345', 'admin', '["all"]'),
('teacher', 'teacher', 'teacher', '["all"]'),
('stu', 'stu', 'student', '["all"]'),
('warden', 'warden', 'warden', '["all"]'),
('super-admin', 'DC0018', 'super-admin', '["all"]'),
('TCH-12345', '123', 'teacher', '["QR Attendance", "QR Late Attendance", "QR Leaving During School", "Leave Application", "Syllabus", "Home Work Assign", "Progress Report"]'),
('PAR-12345', '123', 'parent', '["QR Attendance", "Leave Application", "Fee Structure", "Syllabus", "Progress Report", "Home Work Assign"]')
ON CONFLICT (username) DO NOTHING;

-- ==========================================
-- 2. ACADEMIC MODULE
-- ==========================================

-- Timetable
CREATE TABLE IF NOT EXISTS timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    session TEXT DEFAULT '2024-25',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subject Teacher Assignment
CREATE TABLE IF NOT EXISTS subject_teacher_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    session TEXT DEFAULT '2024-25',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Syllabus
CREATE TABLE IF NOT EXISTS syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homework
CREATE TABLE IF NOT EXISTS homework (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    file_url TEXT,
    date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. ATTENDANCE MODULE
-- ==========================================

-- Student Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT,
    class TEXT NOT NULL,
    section TEXT NOT NULL,
    date DATE NOT NULL,
    status TEXT NOT NULL, -- Present, Absent, Late, Half Day
    period TEXT, -- Morning, Last Period, etc.
    marked_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Staff Attendance
CREATE TABLE IF NOT EXISTS staff_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT NOT NULL,
    staff_name TEXT,
    role TEXT,
    date DATE NOT NULL,
    status TEXT NOT NULL,
    in_time TIMESTAMPTZ,
    out_time TIMESTAMPTZ,
    method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 4. ROLE ASSIGNMENT & PERMISSIONS
-- ==========================================

CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY, -- User ID (e.g., admin, TCH-123, DS-123)
    name TEXT,
    password TEXT DEFAULT '12345678',
    role TEXT NOT NULL, -- admin, teacher, student, warden, super-admin, parent
    permissions TEXT[] DEFAULT '{}',
    student_id TEXT, -- For parents/students
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. HOSTEL MODULE
-- ==========================================

CREATE TABLE IF NOT EXISTS hostel_rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hostel_name TEXT NOT NULL,
    room_no TEXT NOT NULL,
    room_type TEXT,
    capacity INTEGER,
    occupied INTEGER DEFAULT 0,
    cost_per_bed NUMERIC(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS hostel_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    hostel_name TEXT NOT NULL,
    room_no TEXT NOT NULL,
    registration_date DATE DEFAULT CURRENT_DATE,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 6. FRONT OFFICE
-- ==========================================

CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_name TEXT NOT NULL,
    father_name TEXT,
    mobile TEXT NOT NULL,
    class TEXT,
    source TEXT,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS visitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    purpose TEXT,
    date DATE DEFAULT CURRENT_DATE,
    in_time TEXT,
    out_time TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complainant_name TEXT NOT NULL,
    complaint_type TEXT,
    source TEXT,
    date DATE DEFAULT CURRENT_DATE,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 7. FEE MANAGEMENT
-- ==========================================

CREATE TABLE IF NOT EXISTS fee_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class TEXT NOT NULL,
    fee_type TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    session TEXT DEFAULT '2024-25',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL,
    student_name TEXT,
    class TEXT,
    section TEXT,
    fee_type TEXT,
    month TEXT,
    amount_payable NUMERIC(10,2),
    discount NUMERIC(10,2) DEFAULT 0,
    scholarship NUMERIC(10,2) DEFAULT 0,
    total_paid NUMERIC(10,2) NOT NULL,
    payment_mode TEXT,
    transaction_id TEXT,
    invoice_number TEXT UNIQUE,
    date DATE DEFAULT CURRENT_DATE,
    collected_by TEXT,
    due_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 8. HUMAN RESOURCE
-- ==========================================

CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    surname TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT,
    designation TEXT,
    mobile TEXT,
    email TEXT,
    joining_date DATE,
    photo TEXT,
    status TEXT DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS staff_leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    staff_id TEXT NOT NULL,
    staff_name TEXT,
    leave_type TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status TEXT DEFAULT 'Pending',
    applied_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 9. SETTINGS & MASTER DATA
-- ==========================================

CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY DEFAULT 1,
    school_name TEXT,
    school_contact TEXT,
    school_email TEXT,
    school_gst TEXT,
    school_reg_no TEXT,
    school_address TEXT,
    school_logo TEXT,
    principal_signature TEXT,
    class_teacher_signature TEXT,
    school_stamp TEXT,
    warden_id TEXT,
    warden_password TEXT,
    camera1_name TEXT,
    camera1_url TEXT,
    camera2_name TEXT,
    camera2_url TEXT,
    camera3_name TEXT,
    camera3_url TEXT,
    camera4_name TEXT,
    camera4_url TEXT,
    tax_percentage NUMERIC(5,2) DEFAULT 0,
    categories TEXT[] DEFAULT '{"General", "OBC", "SC", "ST"}',
    castes TEXT[] DEFAULT '{"Hindu", "Muslim", "Sikh", "Christian"}',
    religions TEXT[] DEFAULT '{"Hinduism", "Islam", "Sikhism", "Christianity"}',
    titles TEXT[] DEFAULT '{"Mr.", "Ms.", "Mrs."}',
    classes TEXT[] DEFAULT '{"Nursery", "LKG", "UKG", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"}',
    sections TEXT[] DEFAULT '{"A", "B", "C", "D"}',
    subjects TEXT[] DEFAULT '{"English", "Hindi", "Mathematics", "Science", "Social Science", "Computer", "Sanskrit", "EVS"}',
    genders TEXT[] DEFAULT '{"Male", "Female", "Other"}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO settings (id, school_name) 
VALUES (1, 'My School Name')
ON CONFLICT (id) DO NOTHING;
