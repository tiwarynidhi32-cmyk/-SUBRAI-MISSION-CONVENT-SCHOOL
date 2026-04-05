/* SQL Schema for School Management System */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable RLS
-- Note: You need to enable RLS on each table manually or via SQL

-- Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  title TEXT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  gender TEXT,
  residential_address TEXT,
  category TEXT,
  religion TEXT,
  caste TEXT,
  blood_group TEXT,
  email TEXT,
  aadhaar_number TEXT,
  pan_number TEXT,
  passport_number TEXT,
  father_name TEXT,
  mother_name TEXT,
  father_mobile TEXT,
  mother_mobile TEXT,
  father_income TEXT,
  father_income_source TEXT,
  mother_income TEXT,
  mother_income_source TEXT,
  emergency_contact TEXT,
  local_guardian_contact TEXT,
  allergy TEXT,
  has_disability BOOLEAN DEFAULT FALSE,
  disability_details TEXT,
  relation_in_school TEXT,
  photo TEXT,
  aadhaar_card_doc TEXT,
  caste_certificate_doc TEXT,
  parents_docs TEXT,
  signature_doc TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report Card Templates
CREATE TABLE IF NOT EXISTS report_card_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  terms JSONB NOT NULL, -- Array of terms with subcolumns
  subjects TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report Cards
CREATE TABLE IF NOT EXISTS report_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT REFERENCES students(student_id),
  template_id UUID REFERENCES report_card_templates(id),
  term_data JSONB NOT NULL,
  result TEXT,
  aggregate TEXT,
  percentage TEXT,
  rank TEXT,
  teacher_comments TEXT,
  promotion_status TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exams
CREATE TABLE IF NOT EXISTS exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT CHECK (status IN ('Upcoming', 'Ongoing', 'Completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exam Schedules
CREATE TABLE IF NOT EXISTS exam_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id UUID REFERENCES exams(id),
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  subject TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  room TEXT,
  question_paper TEXT,
  answer_sheet TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Exam Results
CREATE TABLE IF NOT EXISTS exam_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_schedule_id UUID REFERENCES exam_schedules(id),
  student_id TEXT REFERENCES students(student_id),
  student_name TEXT,
  marks NUMERIC NOT NULL,
  max_marks NUMERIC DEFAULT 100,
  grade TEXT,
  status TEXT CHECK (status IN ('Pass', 'Fail')),
  feedback TEXT,
  teacher_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Income & Expense
CREATE TABLE IF NOT EXISTS income_heads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expense_heads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS incomes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  income_head TEXT NOT NULL,
  invoice_number TEXT,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  expense_head TEXT NOT NULL,
  invoice_number TEXT,
  date DATE NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff
CREATE TABLE IF NOT EXISTS staff (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  designation TEXT,
  email TEXT,
  mobile TEXT,
  status TEXT DEFAULT 'Active',
  joining_date DATE,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Designations
CREATE TABLE IF NOT EXISTS designations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Staff Leave Requests
CREATE TABLE IF NOT EXISTS staff_leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  staff_id TEXT REFERENCES staff(staff_id),
  staff_name TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  applied_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leave Requests (for Students)
CREATE TABLE IF NOT EXISTS leave_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT REFERENCES students(student_id),
  student_name TEXT,
  class TEXT,
  section TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration NUMERIC,
  reason TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
  applied_date DATE DEFAULT CURRENT_DATE,
  approved_by TEXT,
  type TEXT DEFAULT 'Leave',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  admin_username TEXT DEFAULT 'admin',
  admin_id TEXT DEFAULT 'admin',
  admin_email TEXT,
  admin_phone TEXT,
  school_name TEXT DEFAULT 'Digital School Systems',
  school_contact TEXT DEFAULT '+91 9876543210',
  school_email TEXT DEFAULT 'info@digitalschool.com',
  school_gst TEXT DEFAULT '22AAAAA0000A1Z5',
  school_reg_no TEXT DEFAULT 'SCH/2024/001',
  warden_id TEXT DEFAULT 'warden',
  warden_password TEXT DEFAULT 'warden',
  school_address TEXT DEFAULT '123 Education Hub, New Delhi, India',
  school_logo TEXT,
  principal_signature TEXT,
  class_teacher_signature TEXT,
  school_stamp TEXT,
  tax_percentage NUMERIC DEFAULT 0,
  camera1_name TEXT DEFAULT 'Main Gate',
  camera1_url TEXT DEFAULT 'https://picsum.photos/seed/gate/640/480',
  camera2_name TEXT DEFAULT 'Hostel Block A',
  camera2_url TEXT DEFAULT 'https://picsum.photos/seed/hostel/640/480',
  camera3_name TEXT DEFAULT 'Playground',
  camera3_url TEXT DEFAULT 'https://picsum.photos/seed/play/640/480',
  camera4_name TEXT DEFAULT 'Library',
  camera4_url TEXT DEFAULT 'https://picsum.photos/seed/library/640/480',
  categories TEXT[] DEFAULT ARRAY['General', 'OBC', 'SC', 'ST'],
  castes TEXT[] DEFAULT ARRAY['Hindu', 'Muslim', 'Sikh', 'Christian'],
  religions TEXT[] DEFAULT ARRAY['Hinduism', 'Islam', 'Sikhism', 'Christianity', 'Buddhism', 'Jainism'],
  titles TEXT[] DEFAULT ARRAY['Mr.', 'Miss', 'Mrs.'],
  classes TEXT[] DEFAULT ARRAY['LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12'],
  sections TEXT[] DEFAULT ARRAY['A', 'B', 'C', 'D'],
  subjects TEXT[] DEFAULT ARRAY['Mathematics', 'Science', 'English', 'Social Studies', 'Hindi', 'Computer Science'],
  genders TEXT[] DEFAULT ARRAY['Male', 'Female', 'Others'],
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- SQL Snippets Table
CREATE TABLE IF NOT EXISTS sql_snippets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  father_name TEXT,
  mobile TEXT NOT NULL,
  class TEXT NOT NULL,
  source TEXT,
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Converted', 'Cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Visitors Table
CREATE TABLE IF NOT EXISTS visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  purpose TEXT,
  date DATE DEFAULT CURRENT_DATE,
  in_time TIME,
  out_time TIME,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Complaints Table
CREATE TABLE IF NOT EXISTS complaints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  complainant_name TEXT NOT NULL,
  complaint_type TEXT,
  source TEXT,
  date DATE DEFAULT CURRENT_DATE,
  description TEXT,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Types
CREATE TABLE IF NOT EXISTS fee_types (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Master
CREATE TABLE IF NOT EXISTS fee_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_type_id UUID REFERENCES fee_types(id) ON DELETE CASCADE,
  class TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Fee Collections
CREATE TABLE IF NOT EXISTS fee_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT REFERENCES students(student_id),
  fee_master_id UUID REFERENCES fee_master(id),
  month TEXT NOT NULL,
  amount_paid NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  scholarship NUMERIC DEFAULT 0,
  payment_mode TEXT NOT NULL,
  due_date DATE,
  reference_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contra Entries
CREATE TABLE IF NOT EXISTS contra_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Bank to Cash', 'Cash to Bank')),
  amount NUMERIC NOT NULL,
  reference_note TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings if not exists
INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- RLS Policies
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_card_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_heads ENABLE ROW LEVEL SECURITY;
ALTER TABLE incomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contra_entries ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is authenticated
-- (Note: In Supabase, auth.role() = 'authenticated' is standard)

-- Students Policies
DROP POLICY IF EXISTS "Allow public read" ON students;
DROP POLICY IF EXISTS "Allow authenticated insert" ON students;
DROP POLICY IF EXISTS "Allow authenticated update" ON students;
DROP POLICY IF EXISTS "Allow authenticated delete" ON students;
CREATE POLICY "Allow public read" ON students FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON students FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON students FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON students FOR DELETE USING (true);

-- Report Card Templates Policies
DROP POLICY IF EXISTS "Allow public read" ON report_card_templates;
DROP POLICY IF EXISTS "Allow authenticated insert" ON report_card_templates;
DROP POLICY IF EXISTS "Allow authenticated update" ON report_card_templates;
DROP POLICY IF EXISTS "Allow authenticated delete" ON report_card_templates;
CREATE POLICY "Allow public read" ON report_card_templates FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON report_card_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON report_card_templates FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON report_card_templates FOR DELETE USING (true);

-- Report Cards Policies
DROP POLICY IF EXISTS "Allow public read" ON report_cards;
DROP POLICY IF EXISTS "Allow authenticated insert" ON report_cards;
DROP POLICY IF EXISTS "Allow authenticated update" ON report_cards;
DROP POLICY IF EXISTS "Allow authenticated delete" ON report_cards;
CREATE POLICY "Allow public read" ON report_cards FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON report_cards FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON report_cards FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON report_cards FOR DELETE USING (true);

-- Exams Policies
DROP POLICY IF EXISTS "Allow public read" ON exams;
DROP POLICY IF EXISTS "Allow authenticated insert" ON exams;
DROP POLICY IF EXISTS "Allow authenticated update" ON exams;
DROP POLICY IF EXISTS "Allow authenticated delete" ON exams;
CREATE POLICY "Allow public read" ON exams FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON exams FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON exams FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON exams FOR DELETE USING (true);

-- Exam Schedules Policies
DROP POLICY IF EXISTS "Allow public read" ON exam_schedules;
DROP POLICY IF EXISTS "Allow authenticated insert" ON exam_schedules;
DROP POLICY IF EXISTS "Allow authenticated update" ON exam_schedules;
DROP POLICY IF EXISTS "Allow authenticated delete" ON exam_schedules;
CREATE POLICY "Allow public read" ON exam_schedules FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON exam_schedules FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON exam_schedules FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON exam_schedules FOR DELETE USING (true);

-- Exam Results Policies
DROP POLICY IF EXISTS "Allow public read" ON exam_results;
DROP POLICY IF EXISTS "Allow authenticated insert" ON exam_results;
DROP POLICY IF EXISTS "Allow authenticated update" ON exam_results;
DROP POLICY IF EXISTS "Allow authenticated delete" ON exam_results;
CREATE POLICY "Allow public read" ON exam_results FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON exam_results FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON exam_results FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON exam_results FOR DELETE USING (true);

-- Income Heads Policies
DROP POLICY IF EXISTS "Allow public read" ON income_heads;
DROP POLICY IF EXISTS "Allow authenticated insert" ON income_heads;
DROP POLICY IF EXISTS "Allow authenticated update" ON income_heads;
DROP POLICY IF EXISTS "Allow authenticated delete" ON income_heads;
CREATE POLICY "Allow public read" ON income_heads FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON income_heads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON income_heads FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON income_heads FOR DELETE USING (true);

-- Expense Heads Policies
DROP POLICY IF EXISTS "Allow public read" ON expense_heads;
DROP POLICY IF EXISTS "Allow authenticated insert" ON expense_heads;
DROP POLICY IF EXISTS "Allow authenticated update" ON expense_heads;
DROP POLICY IF EXISTS "Allow authenticated delete" ON expense_heads;
CREATE POLICY "Allow public read" ON expense_heads FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON expense_heads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON expense_heads FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON expense_heads FOR DELETE USING (true);

-- Incomes Policies
DROP POLICY IF EXISTS "Allow public read" ON incomes;
DROP POLICY IF EXISTS "Allow authenticated insert" ON incomes;
DROP POLICY IF EXISTS "Allow authenticated update" ON incomes;
DROP POLICY IF EXISTS "Allow authenticated delete" ON incomes;
CREATE POLICY "Allow public read" ON incomes FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON incomes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON incomes FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON incomes FOR DELETE USING (true);

-- Expenses Policies
DROP POLICY IF EXISTS "Allow public read" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated insert" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated update" ON expenses;
DROP POLICY IF EXISTS "Allow authenticated delete" ON expenses;
CREATE POLICY "Allow public read" ON expenses FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON expenses FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON expenses FOR DELETE USING (true);

-- Staff Policies
DROP POLICY IF EXISTS "Allow public read" ON staff;
DROP POLICY IF EXISTS "Allow authenticated insert" ON staff;
DROP POLICY IF EXISTS "Allow authenticated update" ON staff;
DROP POLICY IF EXISTS "Allow authenticated delete" ON staff;
CREATE POLICY "Allow public read" ON staff FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON staff FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON staff FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON staff FOR DELETE USING (true);

-- Departments Policies
DROP POLICY IF EXISTS "Allow public read" ON departments;
DROP POLICY IF EXISTS "Allow authenticated insert" ON departments;
DROP POLICY IF EXISTS "Allow authenticated update" ON departments;
DROP POLICY IF EXISTS "Allow authenticated delete" ON departments;
CREATE POLICY "Allow public read" ON departments FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON departments FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON departments FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON departments FOR DELETE USING (true);

-- Designations Policies
DROP POLICY IF EXISTS "Allow public read" ON designations;
DROP POLICY IF EXISTS "Allow authenticated insert" ON designations;
DROP POLICY IF EXISTS "Allow authenticated update" ON designations;
DROP POLICY IF EXISTS "Allow authenticated delete" ON designations;
CREATE POLICY "Allow public read" ON designations FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON designations FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON designations FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON designations FOR DELETE USING (true);

-- Staff Leave Requests Policies
DROP POLICY IF EXISTS "Allow public read" ON staff_leave_requests;
DROP POLICY IF EXISTS "Allow authenticated insert" ON staff_leave_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON staff_leave_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON staff_leave_requests;
CREATE POLICY "Allow public read" ON staff_leave_requests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON staff_leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON staff_leave_requests FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON staff_leave_requests FOR DELETE USING (true);

-- Leave Requests (Student) Policies
DROP POLICY IF EXISTS "Allow public read" ON leave_requests;
DROP POLICY IF EXISTS "Allow authenticated insert" ON leave_requests;
DROP POLICY IF EXISTS "Allow authenticated update" ON leave_requests;
DROP POLICY IF EXISTS "Allow authenticated delete" ON leave_requests;
CREATE POLICY "Allow public read" ON leave_requests FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON leave_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON leave_requests FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON leave_requests FOR DELETE USING (true);

-- Settings Policies
DROP POLICY IF EXISTS "Allow public read" ON settings;
DROP POLICY IF EXISTS "Allow authenticated update" ON settings;
CREATE POLICY "Allow public read" ON settings FOR SELECT USING (true);
CREATE POLICY "Allow authenticated update" ON settings FOR UPDATE USING (true);

-- SQL Snippets Policies
DROP POLICY IF EXISTS "Allow public read" ON sql_snippets;
DROP POLICY IF EXISTS "Allow authenticated insert" ON sql_snippets;
DROP POLICY IF EXISTS "Allow authenticated update" ON sql_snippets;
DROP POLICY IF EXISTS "Allow authenticated delete" ON sql_snippets;
CREATE POLICY "Allow public read" ON sql_snippets FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON sql_snippets FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON sql_snippets FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON sql_snippets FOR DELETE USING (true);

-- Enquiries Policies
DROP POLICY IF EXISTS "Allow public read" ON enquiries;
DROP POLICY IF EXISTS "Allow authenticated insert" ON enquiries;
DROP POLICY IF EXISTS "Allow authenticated update" ON enquiries;
DROP POLICY IF EXISTS "Allow authenticated delete" ON enquiries;
CREATE POLICY "Allow public read" ON enquiries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON enquiries FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON enquiries FOR DELETE USING (true);

-- Visitors Policies
DROP POLICY IF EXISTS "Allow public read" ON visitors;
DROP POLICY IF EXISTS "Allow authenticated insert" ON visitors;
DROP POLICY IF EXISTS "Allow authenticated update" ON visitors;
DROP POLICY IF EXISTS "Allow authenticated delete" ON visitors;
CREATE POLICY "Allow public read" ON visitors FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON visitors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON visitors FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON visitors FOR DELETE USING (true);

-- Complaints Policies
DROP POLICY IF EXISTS "Allow public read" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated insert" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated update" ON complaints;
DROP POLICY IF EXISTS "Allow authenticated delete" ON complaints;
CREATE POLICY "Allow public read" ON complaints FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON complaints FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON complaints FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON complaints FOR DELETE USING (true);

-- Fee Types Policies
DROP POLICY IF EXISTS "Allow public read" ON fee_types;
DROP POLICY IF EXISTS "Allow authenticated insert" ON fee_types;
DROP POLICY IF EXISTS "Allow authenticated update" ON fee_types;
DROP POLICY IF EXISTS "Allow authenticated delete" ON fee_types;
CREATE POLICY "Allow public read" ON fee_types FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON fee_types FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON fee_types FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON fee_types FOR DELETE USING (true);

-- Fee Master Policies
DROP POLICY IF EXISTS "Allow public read" ON fee_master;
DROP POLICY IF EXISTS "Allow authenticated insert" ON fee_master;
DROP POLICY IF EXISTS "Allow authenticated update" ON fee_master;
DROP POLICY IF EXISTS "Allow authenticated delete" ON fee_master;
CREATE POLICY "Allow public read" ON fee_master FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON fee_master FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON fee_master FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON fee_master FOR DELETE USING (true);

-- Fee Collections Policies
DROP POLICY IF EXISTS "Allow public read" ON fee_collections;
DROP POLICY IF EXISTS "Allow authenticated insert" ON fee_collections;
DROP POLICY IF EXISTS "Allow authenticated update" ON fee_collections;
DROP POLICY IF EXISTS "Allow authenticated delete" ON fee_collections;
CREATE POLICY "Allow public read" ON fee_collections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON fee_collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON fee_collections FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON fee_collections FOR DELETE USING (true);

-- Contra Entries Policies
DROP POLICY IF EXISTS "Allow public read" ON contra_entries;
DROP POLICY IF EXISTS "Allow authenticated insert" ON contra_entries;
DROP POLICY IF EXISTS "Allow authenticated update" ON contra_entries;
DROP POLICY IF EXISTS "Allow authenticated delete" ON contra_entries;
CREATE POLICY "Allow public read" ON contra_entries FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON contra_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON contra_entries FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON contra_entries FOR DELETE USING (true);
-- 1. Ensure the students table exists (Full Schema)
CREATE TABLE IF NOT EXISTS students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT UNIQUE NOT NULL,
  title TEXT,
  name TEXT NOT NULL,
  surname TEXT NOT NULL,
  class TEXT NOT NULL,
  section TEXT NOT NULL,
  gender TEXT,
  residential_address TEXT,
  category TEXT,
  religion TEXT,
  caste TEXT,
  blood_group TEXT,
  email TEXT,
  aadhaar_number TEXT,
  pan_number TEXT,
  passport_number TEXT,
  father_name TEXT,
  mother_name TEXT,
  father_mobile TEXT,
  mother_mobile TEXT,
  father_income TEXT,
  father_income_source TEXT,
  mother_income TEXT,
  mother_income_source TEXT,
  emergency_contact TEXT,
  local_guardian_contact TEXT,
  allergy TEXT,
  has_disability BOOLEAN DEFAULT FALSE,
  disability_details TEXT,
  relation_in_school TEXT,
  photo TEXT,
  aadhaar_card_doc TEXT,
  caste_certificate_doc TEXT,
  parents_docs TEXT,
  signature_doc TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- 3. Create a "Permissive" policy so the app can work
DROP POLICY IF EXISTS "Allow all for students" ON students;
CREATE POLICY "Allow all for students" ON students FOR ALL USING (true) WITH CHECK (true);

-- 4. CRITICAL: Force Supabase to refresh the schema cache
NOTIFY pgrst, 'reload schema';

-- Update Fee Master Table
DROP TABLE IF EXISTS fee_master CASCADE;
CREATE TABLE fee_master (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  fee_type TEXT REFERENCES fee_types(name) ON DELETE CASCADE,
  class TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'Monthly',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update Fee Collections Table
DROP TABLE IF EXISTS fee_collections CASCADE;
CREATE TABLE fee_collections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id TEXT REFERENCES students(student_id),
  student_name TEXT,
  roll_no TEXT,
  class TEXT,
  section TEXT,
  fee_type TEXT,
  amount NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  discount_reason TEXT,
  scholarship NUMERIC DEFAULT 0,
  total_paid NUMERIC NOT NULL,
  payment_mode TEXT NOT NULL,
  transaction_id TEXT,
  invoice_number TEXT,
  collected_by TEXT,
  period TEXT,
  date TEXT,
  due_date TEXT,
  status TEXT,
  breakdown JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Re-enable RLS and Policies
ALTER TABLE fee_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON fee_master FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON fee_master FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON fee_master FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON fee_master FOR DELETE USING (true);

CREATE POLICY "Allow public read" ON fee_collections FOR SELECT USING (true);
CREATE POLICY "Allow authenticated insert" ON fee_collections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow authenticated update" ON fee_collections FOR UPDATE USING (true);
CREATE POLICY "Allow authenticated delete" ON fee_collections FOR DELETE USING (true);
-- Academic Module Tables

-- 1. Time Table
CREATE TABLE IF NOT EXISTS time_tables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name TEXT NOT NULL,
    section TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject TEXT NOT NULL,
    teacher_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Teacher Assignments
CREATE TABLE IF NOT EXISTS teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session TEXT NOT NULL,
    class_name TEXT NOT NULL,
    section TEXT NOT NULL,
    class_teacher_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Subject Teacher Assignments (Linked to Teacher Assignments)
CREATE TABLE IF NOT EXISTS subject_teacher_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES teacher_assignments(id) ON DELETE CASCADE,
    subject TEXT NOT NULL,
    teacher_name TEXT NOT NULL
);

-- 4. Syllabus
CREATE TABLE IF NOT EXISTS syllabuses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    file_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Homework
CREATE TABLE IF NOT EXISTS homeworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_name TEXT NOT NULL,
    section TEXT NOT NULL,
    subject TEXT NOT NULL,
    title TEXT NOT NULL,
    instructions TEXT,
    due_date DATE NOT NULL,
    file_url TEXT,
    teacher_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Academic Planner
CREATE TABLE IF NOT EXISTS academic_planner (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    type TEXT DEFAULT 'event', -- 'holiday', 'exam', 'event'
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
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
    aadhaar_card_doc TEXT,
    caste_certificate_doc TEXT,
    parents_docs TEXT,
    signature_doc TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
    id TEXT PRIMARY KEY, -- User ID (e.g., admin, TCH-123, DS-123)
    username TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
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
    roll_no TEXT,
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

-- Initial Seed Data
INSERT INTO settings (id, school_name, school_email, school_contact, categories, castes, religions, titles, classes, sections, subjects, genders)
VALUES (1, 'Digital School Systems', 'info@digitalschool.com', '+91 9876543210', 
    '{"General", "OBC", "SC", "ST"}', 
    '{"General", "Yadav", "Sharma", "Verma"}', 
    '{"Hindu", "Muslim", "Sikh", "Christian"}', 
    '{"Mr.", "Mrs.", "Ms.", "Dr."}', 
    '{"Nursery", "LKG", "UKG", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th", "11th", "12th"}', 
    '{"A", "B", "C", "D"}', 
    '{"Math", "Science", "English", "Hindi", "Social Studies", "Computer", "Sanskrit", "Physical Education"}', 
    '{"Male", "Female", "Other"}'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, username, name, password, role, permissions)
VALUES 
('admin', 'admin', 'Admin User', '12345', 'admin', '{"all"}'),
('teacher', 'teacher', 'Teacher User', 'teacher', 'teacher', '{"all"}'),
('stu', 'stu', 'Student User', 'stu', 'student', '{"all"}'),
('warden', 'warden', 'Warden User', 'warden', 'warden', '{"all"}'),
('super-admin', 'super-admin', 'Super Admin', 'DC0018', 'super-admin', '{"all"}'),
('TCH-12345', 'TCH-12345', 'John Doe', '123', 'teacher', '{"QR Attendance", "QR Late Attendance", "QR Leaving During School", "Leave Application", "Syllabus", "Home Work Assign", "Progress Report"}'),
('PAR-12345', 'PAR-12345', 'Jane Smith', '123', 'parent', '{"QR Attendance", "Leave Application", "Fee Structure", "Syllabus", "Progress Report", "Home Work Assign"}')
ON CONFLICT (username) DO NOTHING;
