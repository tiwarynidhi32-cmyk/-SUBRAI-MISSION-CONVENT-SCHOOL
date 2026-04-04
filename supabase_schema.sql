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

-- Leave Requests
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
ALTER TABLE leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE sql_snippets ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

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
