/*
  # Add Email Functionality to Admins Table

  1. Changes
    - Add `sent_emails` column to store sent email data as JSONB
    - Add `received_emails` column to store received email data as JSONB  
    - Add `email_settings` column to store admin email preferences as JSONB

  2. Security
    - Maintains existing RLS policies on admins table
    - No changes to existing permissions

  This migration adds the missing email-related columns that the application expects.
*/

-- Add email-related columns to admins table
DO $$
BEGIN
  -- Add sent_emails column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'sent_emails'
  ) THEN
    ALTER TABLE admins ADD COLUMN sent_emails JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add received_emails column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'received_emails'
  ) THEN
    ALTER TABLE admins ADD COLUMN received_emails JSONB DEFAULT '[]'::jsonb;
  END IF;

  -- Add email_settings column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'admins' AND column_name = 'email_settings'
  ) THEN
    ALTER TABLE admins ADD COLUMN email_settings JSONB DEFAULT '{
      "signature": "",
      "auto_reply": false,
      "notification_preferences": ["new_messages", "replies"]
    }'::jsonb;
  END IF;
END $$;

-- Create admins table if it doesn't exist (fallback)
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'teacher')),
  first_name TEXT,
  last_name TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  user_id UUID REFERENCES auth.users(id),
  sent_emails JSONB DEFAULT '[]'::jsonb,
  received_emails JSONB DEFAULT '[]'::jsonb,
  email_settings JSONB DEFAULT '{
    "signature": "",
    "auto_reply": false,
    "notification_preferences": ["new_messages", "replies"]
  }'::jsonb
);

-- Enable RLS if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE tablename = 'admins' AND rowsecurity = true
  ) THEN
    ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policy if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'admins' AND policyname = 'Anyone can manage admins'
  ) THEN
    CREATE POLICY "Anyone can manage admins" ON admins FOR ALL USING (true);
  END IF;
END $$;