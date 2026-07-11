import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Supabase Client Initialization
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('⚠️ SUPABASE_URL or SUPABASE_SERVICE_KEY is missing. Database operations will fail.');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Multer setup for memory storage (for file uploads to Supabase)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Basic Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET /api/jobs - Fetch open jobs
app.get('/api/jobs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('status', 'open')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json({ data });
  } catch (error: any) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// POST /api/apply - Submit a resume
app.post('/api/apply', upload.single('cv'), async (req, res) => {
  try {
    const { name, phone, email, qualification, experience, location, category, message, job_id } = req.body;
    const file = req.file;

    if (!name || !phone || !email || !qualification || !file) {
      return res.status(400).json({ error: 'Missing required fields or CV file.' });
    }

    // 1. Upload CV to Supabase Storage
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `resumes/${fileName}`;

    const { error: uploadError, data: uploadData } = await supabase.storage
      .from('resumes')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    // 2. Save Application Record
    const { error: insertError } = await supabase
      .from('applications')
      .insert([
        {
          job_id: job_id || null,
          name,
          phone,
          email,
          qualification,
          experience,
          location,
          category,
          message: message || '',
          cv_url: uploadData?.path || filePath,
        }
      ]);

    if (insertError) {
      // Rollback file upload if database insert fails
      await supabase.storage.from('resumes').remove([filePath]);
      throw insertError;
    }

    res.status(201).json({ message: 'Application submitted successfully.' });
  } catch (error: any) {
    console.error('Error processing application:', error);
    res.status(500).json({ error: 'Failed to submit application.' });
  }
});

app.listen(port, () => {
  console.log(`🚀 Backend server running on http://localhost:${port}`);
});
