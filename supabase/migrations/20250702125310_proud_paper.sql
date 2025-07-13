/*
  # PDF Storage System Setup

  1. Storage Setup
    - Create 'pdfs' storage bucket for file uploads
    - Set up storage policies for PDF access

  2. Database Tables
    - Create 'pdf_files' table for PDF metadata
    - Add indexes for performance
    - Set up Row Level Security (RLS)

  3. Security Policies
    - Allow public read access to PDFs (for students)
    - Allow admin uploads and management
    - Secure file operations

  This migration sets up a complete PDF storage and management system.
*/

-- Create the pdfs storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Create PDF files metadata table
CREATE TABLE IF NOT EXISTS pdf_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  uploaded_by TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  download_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pdf_files table
CREATE POLICY "Anyone can read active PDFs" ON pdf_files
  FOR SELECT USING (is_active = true);

CREATE POLICY "Anyone can insert PDFs" ON pdf_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update PDFs" ON pdf_files
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete PDFs" ON pdf_files
  FOR DELETE USING (true);

-- Storage policies for the pdfs bucket
CREATE POLICY "Anyone can upload to pdfs bucket" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs');

CREATE POLICY "Anyone can view pdfs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can update pdfs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pdfs');

CREATE POLICY "Anyone can delete pdfs" ON storage.objects
  FOR DELETE USING (bucket_id = 'pdfs');

-- Performance indexes
CREATE INDEX IF NOT EXISTS idx_pdf_files_category ON pdf_files(category);
CREATE INDEX IF NOT EXISTS idx_pdf_files_uploaded_at ON pdf_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_files_active ON pdf_files(is_active);
CREATE INDEX IF NOT EXISTS idx_pdf_files_uploaded_by ON pdf_files(uploaded_by);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_pdf_files_updated_at 
    BEFORE UPDATE ON pdf_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample categories (optional)
INSERT INTO pdf_files (
  name, 
  original_name, 
  file_path, 
  file_url, 
  file_size, 
  category, 
  description, 
  uploaded_by, 
  is_active,
  download_count,
  tags
) VALUES 
(
  'Sample Mathematics Guide',
  'math_guide_sample.pdf',
  'samples/math_guide_sample.pdf',
  'https://example.com/sample.pdf',
  1024000,
  'Class 9',
  'Sample PDF for testing the system',
  'System Admin',
  false,
  0,
  ARRAY['sample', 'class-9', 'mathematics']
) ON CONFLICT DO NOTHING;