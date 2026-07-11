-- Supabase Schema for KamrupCareers

-- 1. Create Jobs Table
CREATE TABLE public.jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT DEFAULT 'Full-Time',
  salary_range TEXT,
  description TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Applications Table
CREATE TABLE public.applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES public.jobs(id) ON DELETE SET NULL, -- Null if general application
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  qualification TEXT NOT NULL,
  experience TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  message TEXT,
  cv_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'shortlisted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Row Level Security (RLS) Policies

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Jobs: Anyone can read open jobs
CREATE POLICY "Public can view open jobs" 
ON public.jobs FOR SELECT 
USING (status = 'open');

-- Jobs: Only authenticated users (Admins) can insert/update/delete
CREATE POLICY "Admins can manage jobs" 
ON public.jobs 
FOR ALL 
TO authenticated 
USING (true);

-- Applications: Allow public to insert their applications (but not read them)
CREATE POLICY "Allow public insert to applications" 
ON public.applications 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Applications: Admins can view and manage all applications
CREATE POLICY "Admins can manage applications" 
ON public.applications 
FOR ALL 
TO authenticated 
USING (true);

-- 4. Storage Bucket for CVs
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage Policy: Allow public to upload to resumes bucket
CREATE POLICY "Allow public upload" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'resumes');

-- ============================================================
-- 5. Site Settings Table (key-value store for admin control)
-- ============================================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO site_settings (key, value) VALUES
  ('site_name', 'KamrupCareers'),
  ('tagline', 'Connecting Talent with Opportunity'),
  ('footer_description', 'A local recruitment consultancy in Guwahati, Assam. We connect genuine candidates with real private job openings across Kamrup.'),
  ('contact_email', 'kamrupcareers@gmail.com'),
  ('contact_phone', '+91 98XXX XXXXX'),
  ('contact_address', 'Guwahati, Assam, India'),
  ('office_hours', 'Monday – Saturday: 10:00 AM – 6:00 PM'),
  ('whatsapp_number', ''),
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_linkedin', ''),
  ('hero_headline', 'Connecting Talent with Genuine Opportunities'),
  ('hero_subtext', 'We connect freshers and experienced professionals with trusted companies in Assam. Submit your CV once, and let the right jobs find you.'),
  ('hero_btn_primary', 'Submit Your CV'),
  ('hero_btn_secondary', 'Browse Active Jobs'),
  ('hero_badge_text', 'Guwahati''s Premier Recruitment Consultancy'),
  ('cta_headline', 'Still Looking for a Job?'),
  ('cta_subtext', 'Submit your CV today. We''ll contact you when a suitable opportunity matches your profile.'),
  ('stat_placements', '1200'),
  ('stat_companies', '180'),
  ('stat_candidates', '8500'),
  ('stat_active_jobs', '45'),
  ('banner_enabled', 'false'),
  ('banner_text', 'We are now hiring for new roles in Guwahati!'),
  ('banner_color', 'blue'),
  ('jobs_per_page', '12'),
  ('enable_application_form', 'true'),
  ('seo_title', 'KamrupCareers — Private Jobs in Guwahati'),
  ('seo_description', 'Browse verified private job openings in Guwahati, Assam.'),
  ('seo_og_image', '');

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin write settings" ON site_settings FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 6. Testimonials Table
-- ============================================================
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  initials TEXT NOT NULL,
  color TEXT DEFAULT '#155EEF',
  quote TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO testimonials (name, role, initials, color, quote, sort_order) VALUES
  ('Priyanka Das', 'Receptionist · Brahmaputra Retail', 'PD', '#155EEF', 'I only had a 12th pass and no experience. KamrupCareers still called me within a week and helped me get my first job.', 1),
  ('Rahul Bora', 'Customer Support · Kamakhya Tele', 'RB', '#16B364', 'The team explained everything in simple words. My interview happened the next day and I got selected. Very grateful.', 2),
  ('Anjali Sharma', 'HR Executive · Skyline Hospitality', 'AS', '#0EA5E9', 'I submitted my CV even though there was no matching job. Two months later they called me for a perfect role.', 3);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read testimonials" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Admin manage testimonials" ON testimonials FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 7. FAQs Table
-- ============================================================
CREATE TABLE faqs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO faqs (question, answer, sort_order) VALUES
  ('Who can apply?', 'Anyone looking for private jobs around Guwahati — freshers, 10th pass, 12th pass, graduates, and experienced candidates are all welcome.', 1),
  ('How do I submit my CV?', 'Go to the Submit Resume page, fill in the short form, and upload your CV file. It takes less than 2 minutes.', 2),
  ('Can freshers apply?', 'Yes. Many of our current openings are specifically for freshers with no prior experience.', 3),
  ('How will I know if I am selected?', 'If your profile matches an opening, our team will call you directly. Please keep your phone number active.', 4),
  ('Is this only for Guwahati?', 'Right now we focus on Guwahati and nearby areas in Kamrup district. We will expand to other regions of Assam soon.', 5);

ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read faqs" ON faqs FOR SELECT USING (active = true);
CREATE POLICY "Admin manage faqs" ON faqs FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- 8. Contact Messages Table
-- ============================================================
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can insert messages" ON contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read messages" ON contact_messages FOR ALL USING (auth.role() = 'authenticated');

