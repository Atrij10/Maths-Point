import { supabase } from '../config/supabase';

// Types for our data structures (matching the database schema)
export interface ContactMessage {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  class?: string;
  message: string;
  created_at?: string;
  status: 'new' | 'read' | 'replied';
}

export interface StudentData {
  id?: string;
  student_id: string;
  student_class: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  enrollment_date?: string;
  status: 'active' | 'inactive';
  last_login?: string;
  user_id?: string;
}

export interface AdminData {
  id?: string;
  email: string;
  role: 'admin' | 'teacher';
  first_name?: string;
  last_name?: string;
  last_login?: string;
  permissions: string[];
  user_id?: string;
}

export interface Announcement {
  id?: string;
  title: string;
  content: string;
  type: 'important' | 'urgent' | 'info' | 'success';
  author: string;
  author_id: string;
  is_pinned: boolean;
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Assignment {
  id?: string;
  title: string;
  description: string;
  class: string;
  due_date: string;
  created_by: string;
  pdf_url?: string;
  created_at?: string;
  updated_at?: string;
  submissions?: Submission[];
}

export interface Submission {
  id?: string;
  assignment_id: string;
  student_name: string;
  student_class: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  submitted_at?: string;
  status: 'submitted' | 'graded' | 'returned';
  grade?: number;
  feedback?: string;
  graded_by?: string;
  graded_at?: string;
}

export interface StudentLoginSession {
  id?: string;
  student_name: string;
  student_class: string;
  student_email: string;
  login_time?: string;
  logout_time?: string;
  session_duration?: number;
  ip_address?: string;
  user_agent?: string;
  browser_info?: string;
  device_type?: string;
  is_active: boolean;
  accessed_features: string[];
  assignments_viewed: string[];
  submissions_made: string[];
  total_time_spent?: number;
  last_activity?: string;
}

// Contact Messages Service
export const contactService = {
  async addMessage(messageData: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          ...messageData,
          status: 'new'
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Contact message added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding contact message: ', error);
      throw error;
    }
  },

  async getAllMessages() {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting contact messages: ', error);
      throw error;
    }
  },

  async updateMessageStatus(messageId: string, status: ContactMessage['status']) {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ status })
        .eq('id', messageId);

      if (error) throw error;
      console.log('Message status updated');
    } catch (error) {
      console.error('Error updating message status: ', error);
      throw error;
    }
  }
};

// Students Service
export const studentsService = {
  async addStudent(studentData: Omit<StudentData, 'id' | 'enrollment_date' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...studentData,
          status: 'active'
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Student added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding student: ', error);
      throw error;
    }
  },

  async getStudentByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting student: ', error);
      throw error;
    }
  },

  async updateLastLogin(studentId: string) {
    try {
      const { error } = await supabase
        .from('students')
        .update({ last_login: new Date().toISOString() })
        .eq('id', studentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating last login: ', error);
      throw error;
    }
  },

  async getAllStudents() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('enrollment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting students: ', error);
      throw error;
    }
  }
};

// Admin Service (without email features)
export const adminService = {
  async addAdmin(adminData: Omit<AdminData, 'id' | 'last_login'>) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .insert([adminData])
        .select()
        .single();

      if (error) throw error;
      console.log('Admin added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding admin: ', error);
      throw error;
    }
  },

  async getAdminByEmail(email: string) {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('email', email)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting admin: ', error);
      throw error;
    }
  },

  async updateLastLogin(adminId: string) {
    try {
      const { error } = await supabase
        .from('admins')
        .update({ last_login: new Date().toISOString() })
        .eq('id', adminId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating admin last login: ', error);
      throw error;
    }
  }
};

// Login Sessions Service
export const loginSessionsService = {
  async startSession(sessionData: Omit<StudentLoginSession, 'id' | 'login_time' | 'is_active' | 'accessed_features' | 'assignments_viewed' | 'submissions_made' | 'last_activity'>) {
    try {
      console.log('Starting session with data:', sessionData);
      
      const deviceType = this.getDeviceType();
      const browserInfo = this.getBrowserInfo();
      
      const { data, error } = await supabase
        .from('login_sessions')
        .insert([{
          ...sessionData,
          device_type: deviceType,
          browser_info: browserInfo,
          is_active: true,
          accessed_features: [],
          assignments_viewed: [],
          submissions_made: []
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Student login session started with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error starting login session: ', error);
      throw error;
    }
  },

  async startSessionWithCustomId(sessionData: Omit<StudentLoginSession, 'id' | 'login_time' | 'is_active' | 'accessed_features' | 'assignments_viewed' | 'submissions_made' | 'last_activity'>) {
    try {
      console.log('Starting session with custom ID...');
      
      const deviceType = this.getDeviceType();
      const browserInfo = this.getBrowserInfo();
      
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const { data, error } = await supabase
        .from('login_sessions')
        .insert([{
          id: sessionId,
          ...sessionData,
          device_type: deviceType,
          browser_info: browserInfo,
          is_active: true,
          accessed_features: [],
          assignments_viewed: [],
          submissions_made: []
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Student login session started with custom ID: ', sessionId);
      return sessionId;
    } catch (error) {
      console.error('Error starting login session with custom ID: ', error);
      throw error;
    }
  },

  async endSession(sessionId: string) {
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      if (sessionData) {
        const loginTime = new Date(sessionData.login_time);
        const logoutTime = new Date();
        const sessionDuration = Math.round((logoutTime.getTime() - loginTime.getTime()) / 60000); // in minutes

        const { error } = await supabase
          .from('login_sessions')
          .update({
            logout_time: logoutTime.toISOString(),
            session_duration: sessionDuration,
            total_time_spent: sessionDuration,
            is_active: false,
            last_activity: logoutTime.toISOString()
          })
          .eq('id', sessionId);

        if (error) throw error;
        console.log('Student login session ended');
      }
    } catch (error) {
      console.error('Error ending login session: ', error);
      throw error;
    }
  },

  async updateActivity(sessionId: string) {
    try {
      const { error } = await supabase
        .from('login_sessions')
        .update({ last_activity: new Date().toISOString() })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating activity: ', error);
      throw error;
    }
  },

  async trackFeatureAccess(sessionId: string, feature: string) {
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('login_sessions')
        .select('accessed_features')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      if (sessionData) {
        const accessedFeatures = sessionData.accessed_features || [];
        
        if (!accessedFeatures.includes(feature)) {
          accessedFeatures.push(feature);
          const { error } = await supabase
            .from('login_sessions')
            .update({ 
              accessed_features: accessedFeatures,
              last_activity: new Date().toISOString()
            })
            .eq('id', sessionId);

          if (error) throw error;
        } else {
          await this.updateActivity(sessionId);
        }
      }
    } catch (error) {
      console.error('Error tracking feature access: ', error);
      throw error;
    }
  },

  async trackAssignmentView(sessionId: string, assignmentId: string) {
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('login_sessions')
        .select('assignments_viewed')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      if (sessionData) {
        const assignmentsViewed = sessionData.assignments_viewed || [];
        
        if (!assignmentsViewed.includes(assignmentId)) {
          assignmentsViewed.push(assignmentId);
          const { error } = await supabase
            .from('login_sessions')
            .update({ 
              assignments_viewed: assignmentsViewed,
              last_activity: new Date().toISOString()
            })
            .eq('id', sessionId);

          if (error) throw error;
        } else {
          await this.updateActivity(sessionId);
        }
      }
    } catch (error) {
      console.error('Error tracking assignment view: ', error);
      throw error;
    }
  },

  async trackSubmission(sessionId: string, submissionId: string) {
    try {
      const { data: sessionData, error: fetchError } = await supabase
        .from('login_sessions')
        .select('submissions_made')
        .eq('id', sessionId)
        .single();

      if (fetchError) throw fetchError;

      if (sessionData) {
        const submissionsMade = sessionData.submissions_made || [];
        
        if (!submissionsMade.includes(submissionId)) {
          submissionsMade.push(submissionId);
          const { error } = await supabase
            .from('login_sessions')
            .update({ 
              submissions_made: submissionsMade,
              last_activity: new Date().toISOString()
            })
            .eq('id', submissionId);

          if (error) throw error;
        }
      }
    } catch (error) {
      console.error('Error tracking submission: ', error);
      throw error;
    }
  },

  getDeviceType(): string {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    }
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  },

  getBrowserInfo(): string {
    const userAgent = navigator.userAgent;
    let browser = 'Unknown';
    
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    return browser;
  },

  async getAllSessions() {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .order('login_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting login sessions: ', error);
      throw error;
    }
  },

  async getSessionsByStudent(studentName: string) {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('student_name', studentName)
        .order('login_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sessions by student: ', error);
      throw error;
    }
  },

  async getSessionsByEmail(studentEmail: string) {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('student_email', studentEmail)
        .order('login_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sessions by email: ', error);
      throw error;
    }
  },

  async getSessionsByClass(studentClass: string) {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('student_class', studentClass)
        .order('login_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting sessions by class: ', error);
      throw error;
    }
  },

  async getActiveSessions() {
    try {
      const { data, error } = await supabase
        .from('login_sessions')
        .select('*')
        .eq('is_active', true)
        .order('login_time', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting active sessions: ', error);
      throw error;
    }
  }
};

// Announcements Service
export const announcementsService = {
  async addAnnouncement(announcementData: Omit<Announcement, 'id' | 'created_at' | 'updated_at' | 'author_id'>, authorId: string) {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          ...announcementData,
          author_id: authorId
        }])
        .select()
        .single();

      if (error) throw error;
      console.log('Announcement added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding announcement: ', error);
      throw error;
    }
  },

  async getAllAnnouncements() {
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting announcements: ', error);
      throw error;
    }
  },

  async updateAnnouncement(announcementId: string, updateData: Partial<Announcement>) {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcementId);

      if (error) throw error;
      console.log('Announcement updated');
    } catch (error) {
      console.error('Error updating announcement: ', error);
      throw error;
    }
  },

  async deleteAnnouncement(announcementId: string) {
    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);

      if (error) throw error;
      console.log('Announcement deleted');
    } catch (error) {
      console.error('Error deleting announcement: ', error);
      throw error;
    }
  }
};

// Assignments Service
export const assignmentsService = {
  async addAssignment(assignmentData: Omit<Assignment, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert([assignmentData])
        .select()
        .single();

      if (error) throw error;
      console.log('Assignment added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding assignment: ', error);
      throw error;
    }
  },

  async getAllAssignments() {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting assignments: ', error);
      throw error;
    }
  },

  async getAssignmentsByClass(className: string) {
    try {
      const { data, error } = await supabase
        .from('assignments')
        .select('*')
        .eq('class', className)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting assignments by class: ', error);
      throw error;
    }
  },

  async updateAssignment(assignmentId: string, updateData: Partial<Assignment>) {
    try {
      const { error } = await supabase
        .from('assignments')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', assignmentId);

      if (error) throw error;
      console.log('Assignment updated');
    } catch (error) {
      console.error('Error updating assignment: ', error);
      throw error;
    }
  },

  async deleteAssignment(assignmentId: string) {
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
      console.log('Assignment deleted');
    } catch (error) {
      console.error('Error deleting assignment: ', error);
      throw error;
    }
  }
};

// Submissions Service
export const submissionsService = {
  async addSubmission(submissionData: Omit<Submission, 'id' | 'submitted_at'>) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;
      console.log('Submission added with ID: ', data.id);
      return data.id;
    } catch (error) {
      console.error('Error adding submission: ', error);
      throw error;
    }
  },

  async getSubmissionsByAssignment(assignmentId: string) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting submissions by assignment: ', error);
      throw error;
    }
  },

  async getSubmissionsByStudent(studentName: string) {
    try {
      const { data, error } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_name', studentName)
        .order('submitted_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting submissions by student: ', error);
      throw error;
    }
  },

  async updateSubmission(submissionId: string, updateData: Partial<Submission>) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update(updateData)
        .eq('id', submissionId);

      if (error) throw error;
      console.log('Submission updated');
    } catch (error) {
      console.error('Error updating submission: ', error);
      throw error;
    }
  },

  async gradeSubmission(submissionId: string, grade: number, feedback: string, gradedBy: string) {
    try {
      const { error } = await supabase
        .from('submissions')
        .update({
          grade,
          feedback,
          graded_by: gradedBy,
          graded_at: new Date().toISOString(),
          status: 'graded'
        })
        .eq('id', submissionId);

      if (error) throw error;
      console.log('Submission graded');
    } catch (error) {
      console.error('Error grading submission: ', error);
      throw error;
    }
  }
};

// User Preferences Service
export const userPreferencesService = {
  async saveLoginPreferences(userId: string, preferences: any) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert([{
          user_id: userId,
          login_preferences: preferences
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error saving login preferences: ', error);
      throw error;
    }
  },

  async getLoginPreferences(userId: string) {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('login_preferences')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data?.login_preferences || null;
    } catch (error) {
      console.error('Error getting login preferences: ', error);
      throw error;
    }
  },

  async clearLoginPreferences(userId: string) {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .update({ login_preferences: null })
        .eq('user_id', userId);

      if (error) throw error;
    } catch (error) {
      console.error('Error clearing login preferences: ', error);
      throw error;
    }
  }
};