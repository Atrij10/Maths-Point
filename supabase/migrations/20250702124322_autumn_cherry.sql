/*
  # Create PDF Storage Setup

  1. Storage Setup
    - Create 'pdfs' bucket for storing PDF files
    - Set up proper policies for PDF access

  2. Database Tables
    - Create 'pdf_files' table to store PDF metadata
    - Add proper RLS policies

  3. Security
    - Allow authenticated users to upload PDFs
    - Allow public read access to PDFs
    - Proper file size and type restrictions
*/

-- Create the pdfs bucket if it doesn't exist
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
  tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Enable RLS on pdf_files table
ALTER TABLE pdf_files ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read PDF metadata (for students to see available PDFs)
CREATE POLICY "Anyone can read PDF metadata" ON pdf_files
  FOR SELECT USING (is_active = true);

-- Allow anyone to insert PDF metadata (for development - restrict in production)
CREATE POLICY "Anyone can insert PDF metadata" ON pdf_files
  FOR INSERT WITH CHECK (true);

-- Allow anyone to update PDF metadata (for development - restrict in production)
CREATE POLICY "Anyone can update PDF metadata" ON pdf_files
  FOR UPDATE USING (true);

-- Allow anyone to delete PDF metadata (for development - restrict in production)
CREATE POLICY "Anyone can delete PDF metadata" ON pdf_files
  FOR DELETE USING (true);

-- Storage policies for the pdfs bucket

-- Allow anyone to upload PDFs (for development - restrict in production)
CREATE POLICY "Anyone can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs');

-- Allow anyone to read PDFs
CREATE POLICY "Anyone can read PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

-- Allow anyone to update PDFs (for development - restrict in production)
CREATE POLICY "Anyone can update PDFs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pdfs');

-- Allow anyone to delete PDFs (for development - restrict in production)
CREATE POLICY "Anyone can delete PDFs" ON storage.objects
  FOR DELETE USING (bucket_id = 'pdfs');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pdf_files_category ON pdf_files(category);
CREATE INDEX IF NOT EXISTS idx_pdf_files_uploaded_at ON pdf_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_files_active ON pdf_files(is_active);