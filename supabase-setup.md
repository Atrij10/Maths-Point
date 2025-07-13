# Supabase Setup Instructions

This guide will help you set up Supabase for your Maths Point Educational Centre application.

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - Name: `maths-point-educational-centre`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your location
5. Click "Create new project"

## 2. Get Your Project Credentials

1. Go to Settings → API
2. Copy the following values:
   - Project URL
   - `anon` public key

## 3. Update Configuration

Update `src/config/supabase.ts` with your credentials:

```typescript
const supabaseUrl = 'YOUR_PROJECT_URL';
const supabaseAnonKey = 'YOUR_ANON_KEY';
```

## 4. Create Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

### Contact Messages Table
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  class TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'))
);

-- Enable RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for contact form)
CREATE POLICY "Anyone can insert contact messages" ON contact_messages
  FOR INSERT WITH CHECK (true);

-- Allow reading for authenticated users (admins)
CREATE POLICY "Authenticated users can read contact messages" ON contact_messages
  FOR SELECT USING (true);
```

### Students Table
```sql
CREATE TABLE students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_class TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  enrollment_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login TIMESTAMP WITH TIME ZONE,
  user_id UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert/read/update (for development)
CREATE POLICY "Anyone can manage students" ON students
  FOR ALL USING (true);
```

### Admins Table (Updated with Email Fields)
```sql
CREATE TABLE admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'teacher')),
  first_name TEXT,
  last_name TEXT,
  last_login TIMESTAMP WITH TIME ZONE,
  permissions TEXT[] DEFAULT ARRAY['read', 'write'],
  user_id UUID REFERENCES auth.users(id),
  -- Email-related fields
  sent_emails JSONB DEFAULT '[]'::jsonb,
  received_emails JSONB DEFAULT '[]'::jsonb,
  email_settings JSONB DEFAULT '{
    "signature": "",
    "auto_reply": false,
    "notification_preferences": ["new_messages", "replies"]
  }'::jsonb
);

-- Enable RLS
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage admins (for development)
CREATE POLICY "Anyone can manage admins" ON admins
  FOR ALL USING (true);
```

### Announcements Table
```sql
CREATE TABLE announcements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'info' CHECK (type IN ('important', 'urgent', 'info', 'success')),
  author TEXT NOT NULL,
  author_id TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read announcements
CREATE POLICY "Anyone can read announcements" ON announcements
  FOR SELECT USING (true);

-- Allow anyone to manage announcements (for development)
CREATE POLICY "Anyone can manage announcements" ON announcements
  FOR ALL USING (true);
```

### Assignments Table
```sql
CREATE TABLE assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  class TEXT NOT NULL,
  due_date DATE NOT NULL,
  created_by TEXT NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage assignments (for development)
CREATE POLICY "Anyone can manage assignments" ON assignments
  FOR ALL USING (true);
```

### Submissions Table
```sql
CREATE TABLE submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned')),
  grade INTEGER,
  feedback TEXT,
  graded_by TEXT,
  graded_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage submissions (for development)
CREATE POLICY "Anyone can manage submissions" ON submissions
  FOR ALL USING (true);
```

### Login Sessions Table
```sql
CREATE TABLE login_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  student_email TEXT NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  logout_time TIMESTAMP WITH TIME ZONE,
  session_duration INTEGER,
  ip_address TEXT,
  user_agent TEXT,
  browser_info TEXT,
  device_type TEXT,
  is_active BOOLEAN DEFAULT true,
  accessed_features TEXT[] DEFAULT ARRAY[]::TEXT[],
  assignments_viewed TEXT[] DEFAULT ARRAY[]::TEXT[],
  submissions_made TEXT[] DEFAULT ARRAY[]::TEXT[],
  total_time_spent INTEGER,
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE login_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage login sessions (for development)
CREATE POLICY "Anyone can manage login sessions" ON login_sessions
  FOR ALL USING (true);
```

### User Preferences Table
```sql
CREATE TABLE user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  login_preferences JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Allow anyone to manage user preferences (for development)
CREATE POLICY "Anyone can manage user preferences" ON user_preferences
  FOR ALL USING (true);
```

## 5. Set Up Storage

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `pdfs`
3. Set the bucket to public
4. Go to Storage → Policies
5. Create policies for the `pdfs` bucket:

```sql
-- Allow anyone to upload files (for development)
CREATE POLICY "Anyone can upload PDFs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs');

-- Allow anyone to read files
CREATE POLICY "Anyone can read PDFs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');

-- Allow anyone to update files (for development)
CREATE POLICY "Anyone can update PDFs" ON storage.objects
  FOR UPDATE USING (bucket_id = 'pdfs');

-- Allow anyone to delete files (for development)
CREATE POLICY "Anyone can delete PDFs" ON storage.objects
  FOR DELETE USING (bucket_id = 'pdfs');
```

## 6. Email Data Structure in Admin Table

The admin table now includes email functionality with the following JSONB fields:

### sent_emails
Stores all emails sent by the admin:
```json
[
  {
    "id": "email_1234567890_abc123",
    "to": "recipient@example.com",
    "from": "admin@mathspoint.com",
    "subject": "Assignment Reminder",
    "message": "Please submit your assignment...",
    "priority": "normal",
    "status": "sent",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00Z",
    "sent_at": "2024-01-15T10:30:00Z"
  }
]
```

### received_emails
Stores all emails received by the admin:
```json
[
  {
    "id": "email_1234567890_def456",
    "to": "admin@mathspoint.com",
    "from": "student@example.com",
    "subject": "Question about Assignment",
    "message": "I have a question about...",
    "priority": "normal",
    "status": "sent",
    "is_read": false,
    "reply_to": "email_1234567890_abc123",
    "created_at": "2024-01-15T11:00:00Z",
    "sent_at": "2024-01-15T11:00:00Z"
  }
]
```

### email_settings
Stores admin email preferences:
```json
{
  "signature": "Best regards,\nAdmin Name\nMaths Point Educational Centre",
  "auto_reply": false,
  "notification_preferences": ["new_messages", "replies"]
}
```

## 7. Test the Connection

1. Start your development server: `npm run dev`
2. Access the admin portal with any email and password `Punyatoa@15`
3. Try sending emails and managing email settings
4. Check your Supabase dashboard to see if data is being saved in the admin table

## 8. Email Features Available

- **Compose and Send Emails**: Create new emails with priority levels
- **Reply to Emails**: Reply to received emails with conversation threading
- **Email Management**: View sent and received emails in one interface
- **Mark as Read/Unread**: Track email read status
- **Delete Emails**: Remove emails from sent or received lists
- **Email Settings**: Configure signature and notification preferences
- **Unread Count**: Display unread email count in the admin portal
- **Priority Levels**: Set email priority (low, normal, high, urgent)

## 9. Production Security (Important!)

The current setup uses permissive policies for development. Before going to production:

1. Implement proper authentication
2. Update RLS policies to restrict access based on user roles
3. Add proper validation and constraints
4. Set up proper backup and monitoring
5. Implement email encryption for sensitive data

## Troubleshooting

- **Connection issues**: Check your URL and API key
- **Permission errors**: Verify RLS policies are set correctly
- **Storage issues**: Ensure the `pdfs` bucket exists and has proper policies
- **Email issues**: Check that the admin table has the correct JSONB structure

## Next Steps

1. Update the configuration file with your credentials
2. Test all functionality (contact form, announcements, assignments, emails)
3. Customize the email templates and settings as needed
4. Set up proper authentication for production use

Your Supabase backend with integrated email functionality is now ready to use with the Maths Point Educational Centre application!