import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  FileText, 
  Upload, 
  Download,
  Eye,
  EyeOff,
  X,
  Save,
  AlertCircle,
  CheckCircle,
  Calendar,
  Pin,
  PinOff,
  File
} from 'lucide-react';
import { 
  announcementsService, 
  assignmentsService, 
  studentsService, 
  contactService,
  adminService,
  type Announcement,
  type Assignment,
  type StudentData,
  type ContactMessage,
  type AdminData
} from '../services/supabaseService';
import { pdfService, type PDFMetadata } from '../services/pdfService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'announcements' | 'assignments' | 'students' | 'messages'>('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Current admin data
  const [currentAdmin, setCurrentAdmin] = useState<AdminData | null>(null);

  // Form states
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form data
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    type: 'info' as const,
    is_pinned: false,
    tags: ''
  });

  const [assignmentForm, setAssignmentForm] = useState({
    title: '',
    description: '',
    class: '',
    due_date: '',
    pdfFile: null as File | null
  });

  // PDF upload states
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Admin authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const ADMIN_PASSWORD = 'Punyatoa@15';

  // FIXED: Reset all states to initial values
  const resetAllStates = () => {
    console.log('Resetting all admin portal states...');
    
    // Authentication states
    setIsAuthenticated(false);
    setShowPasswordForm(true);
    setPassword('');
    setAdminEmail('');
    setShowPassword(false);
    setRememberMe(false);
    setCurrentAdmin(null);
    
    // Data states
    setAnnouncements([]);
    setAssignments([]);
    setStudents([]);
    setMessages([]);
    
    // Form states
    setShowAnnouncementForm(false);
    setShowAssignmentForm(false);
    setEditingAnnouncement(null);
    setEditingAssignment(null);
    
    // Form data
    setAnnouncementForm({
      title: '',
      content: '',
      type: 'info',
      is_pinned: false,
      tags: ''
    });
    
    setAssignmentForm({
      title: '',
      description: '',
      class: '',
      due_date: '',
      pdfFile: null
    });
    
    // PDF upload states
    setUploadingPdf(false);
    setUploadProgress(0);
    
    // UI states
    setError(null);
    setSuccess(null);
    setLoading(false);
    setActiveTab('announcements');
    
    console.log('All admin portal states reset successfully');
  };

  // Load saved preferences when component mounts
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const savedData = localStorage.getItem('adminPortalPreferences');
        if (savedData) {
          const preferences = JSON.parse(savedData);
          if (preferences.password === ADMIN_PASSWORD && preferences.adminEmail) {
            setPassword(preferences.password);
            setAdminEmail(preferences.adminEmail);
            setRememberMe(true);
            setIsAuthenticated(true);
            setShowPasswordForm(false);
            
            // Load admin data
            await loadAdminData(preferences.adminEmail);
          }
        }
      } catch (error) {
        console.error('Error loading admin preferences:', error);
      }
    };

    if (isOpen) {
      loadPreferences();
    }
  }, [isOpen]);

  // FIXED: Reset states when portal closes
  useEffect(() => {
    if (!isOpen) {
      resetAllStates();
    }
  }, [isOpen]);

  // Load data when tab changes
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      loadData();
    }
  }, [activeTab, isAuthenticated, isOpen]);

  // Lock background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const loadAdminData = async (email: string) => {
    try {
      let admin = await adminService.getAdminByEmail(email);
      
      // If admin doesn't exist, create one
      if (!admin) {
        console.log('Admin not found, creating new admin record...');
        const adminId = await adminService.addAdmin({
          email: email,
          role: 'admin',
          first_name: 'Admin',
          last_name: 'User',
          permissions: ['read', 'write', 'delete', 'manage_users']
        });
        
        admin = await adminService.getAdminByEmail(email);
        console.log('New admin created:', admin);
      }
      
      setCurrentAdmin(admin);
      
    } catch (error) {
      console.error('Error loading admin data:', error);
      setError('Failed to load admin data');
    }
  };

  const savePreferences = async () => {
    if (rememberMe && password === ADMIN_PASSWORD && adminEmail) {
      try {
        const preferences = {
          password,
          adminEmail,
          lastLogin: new Date().toISOString()
        };
        
        localStorage.setItem('adminPortalPreferences', JSON.stringify(preferences));
        console.log('Admin preferences saved to localStorage');
      } catch (error) {
        console.error('Error saving admin preferences:', error);
      }
    } else if (!rememberMe) {
      localStorage.removeItem('adminPortalPreferences');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminEmail.trim()) {
      setError('Please enter your admin email address');
      return;
    }
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordForm(false);
      setError(null);
      
      // Load admin data
      await loadAdminData(adminEmail.trim());
      
      await savePreferences();
    } else {
      setError('Incorrect admin password');
    }
  };

  const clearSavedData = () => {
    if (confirm('Are you sure you want to clear all saved admin data?')) {
      localStorage.removeItem('adminPortalPreferences');
      setPassword('');
      setAdminEmail('');
      setRememberMe(false);
    }
  };

  // FIXED: Improved logout function
  const handleLogout = async () => {
    try {
      console.log('Admin logging out...');
      
      // Clear saved preferences if not remembering
      if (!rememberMe) {
        localStorage.removeItem('adminPortalPreferences');
      }
      
      // Reset all states
      resetAllStates();
      
      console.log('Admin logout completed successfully');
      
    } catch (error) {
      console.error('Error during admin logout:', error);
      setError('Error during logout. Please try again.');
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      switch (activeTab) {
        case 'announcements':
          const announcementsData = await announcementsService.getAllAnnouncements();
          setAnnouncements(announcementsData);
          break;
        case 'assignments':
          const assignmentsData = await assignmentsService.getAllAssignments();
          setAssignments(assignmentsData);
          break;
        case 'students':
          const studentsData = await studentsService.getAllStudents();
          setStudents(studentsData);
          break;
        case 'messages':
          const messagesData = await contactService.getAllMessages();
          setMessages(messagesData);
          break;
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      console.log('Submitting announcement form...');
      
      const announcementData = {
        title: announcementForm.title.trim(),
        content: announcementForm.content.trim(),
        type: announcementForm.type,
        author: currentAdmin?.first_name && currentAdmin?.last_name 
          ? `${currentAdmin.first_name} ${currentAdmin.last_name}`
          : 'Admin',
        is_pinned: announcementForm.is_pinned,
        tags: announcementForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      console.log('Announcement data to save:', announcementData);

      if (editingAnnouncement) {
        console.log('Updating existing announcement:', editingAnnouncement.id);
        await announcementsService.updateAnnouncement(editingAnnouncement.id!, announcementData);
        setSuccess('Announcement updated successfully!');
      } else {
        console.log('Creating new announcement...');
        const announcementId = await announcementsService.addAnnouncement(announcementData, currentAdmin?.id || 'admin-user-id');
        console.log('New announcement created with ID:', announcementId);
        setSuccess('Announcement created successfully!');
      }

      setAnnouncementForm({
        title: '',
        content: '',
        type: 'info',
        is_pinned: false,
        tags: ''
      });
      setShowAnnouncementForm(false);
      setEditingAnnouncement(null);
      
      await loadData();
      
    } catch (err: any) {
      console.error('Error saving announcement:', err);
      
      let errorMessage = 'Failed to save announcement. ';
      
      if (err?.message) {
        errorMessage += err.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      setSuccess(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      let pdfUrl = '';
      
      // Handle PDF upload if file is selected
      if (assignmentForm.pdfFile) {
        setUploadingPdf(true);
        setUploadProgress(0);
        
        try {
          console.log('Uploading PDF file...');
          const pdfId = await pdfService.uploadPDF(
            assignmentForm.pdfFile,
            `Class ${assignmentForm.class}`,
            assignmentForm.description,
            currentAdmin?.email || 'admin@mathspoint.com',
            assignmentForm.title
          );
          
          // Get the uploaded PDF details
          const allPdfs = await pdfService.getAllPDFs();
          const uploadedPdf = allPdfs.find(pdf => pdf.id === pdfId);
          if (uploadedPdf) {
            pdfUrl = uploadedPdf.file_url;
          }
          
          setUploadProgress(100);
          console.log('PDF uploaded successfully with ID:', pdfId);
        } catch (pdfError) {
          console.error('PDF upload failed:', pdfError);
          setError('Failed to upload PDF file. Please try again.');
          return;
        } finally {
          setUploadingPdf(false);
        }
      }

      const assignmentData = {
        title: assignmentForm.title,
        description: assignmentForm.description,
        class: assignmentForm.class,
        due_date: assignmentForm.due_date,
        created_by: currentAdmin?.id || 'admin-user-id',
        pdf_url: pdfUrl
      };

      if (editingAssignment) {
        await assignmentsService.updateAssignment(editingAssignment.id!, assignmentData);
        setSuccess('Assignment updated successfully!');
      } else {
        await assignmentsService.addAssignment(assignmentData);
        setSuccess('Assignment created successfully!');
      }

      setAssignmentForm({
        title: '',
        description: '',
        class: '',
        due_date: '',
        pdfFile: null
      });
      setShowAssignmentForm(false);
      setEditingAssignment(null);
      loadData();
    } catch (err) {
      console.error('Error saving assignment:', err);
      setError('Failed to save assignment. Please try again.');
    } finally {
      setLoading(false);
      setUploadingPdf(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;

    try {
      await announcementsService.deleteAnnouncement(id);
      setSuccess('Announcement deleted successfully!');
      loadData();
    } catch (err) {
      console.error('Error deleting announcement:', err);
      setError('Failed to delete announcement.');
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return;

    try {
      await assignmentsService.deleteAssignment(id);
      setSuccess('Assignment deleted successfully!');
      loadData();
    } catch (err) {
      console.error('Error deleting assignment:', err);
      setError('Failed to delete assignment.');
    }
  };

  const handleEditAnnouncement = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      is_pinned: announcement.is_pinned,
      tags: announcement.tags.join(', ')
    });
    setShowAnnouncementForm(true);
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setAssignmentForm({
      title: assignment.title,
      description: assignment.description,
      class: assignment.class,
      due_date: assignment.due_date,
      pdfFile: null
    });
    setShowAssignmentForm(true);
  };

  const handleTogglePin = async (announcement: Announcement) => {
    try {
      setLoading(true);
      const newPinStatus = !announcement.is_pinned;
      
      await announcementsService.updateAnnouncement(announcement.id!, {
        is_pinned: newPinStatus
      });
      
      setSuccess(`Announcement ${newPinStatus ? 'pinned' : 'unpinned'} successfully!`);
      loadData();
    } catch (err) {
      console.error('Error toggling pin status:', err);
      setError('Failed to update pin status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please select a PDF file only.');
        e.target.value = '';
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB.');
        e.target.value = '';
        return;
      }
      
      setAssignmentForm({
        ...assignmentForm,
        pdfFile: file
      });
      setError(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch {
      return 'Unknown date';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // FIXED: Proper close handler
  const handleClose = () => {
    console.log('Admin portal closing...');
    resetAllStates();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 z-30 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        {/* Password Form */}
        {showPasswordForm && (
          <div className="p-8 text-center">
            <Shield className="h-16 w-16 text-indigo-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Admin Access Required</h2>
            <form onSubmit={handlePasswordSubmit} className="max-w-sm mx-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="Enter your admin email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 mt-7"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 select-none">Remember me</span>
                </label>
                
                {rememberMe && (password || adminEmail) && (
                  <button
                    type="button"
                    onClick={clearSavedData}
                    className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                  >
                    Clear saved data
                  </button>
                )}
              </div>

              {rememberMe && password === ADMIN_PASSWORD && adminEmail && (
                <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">
                      Admin credentials will be saved locally
                    </span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">Email: {adminEmail}</p>
                </div>
              )}
              
              <div className="flex space-x-3">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Access Admin Panel
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
              {error && (
                <div className="mt-3 text-sm text-red-600">{error}</div>
              )}
            </form>
          </div>
        )}

        {/* Main Admin Panel */}
        {isAuthenticated && !showPasswordForm && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 pr-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Shield className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Admin Portal</h2>
                    <p className="text-indigo-100">
                      Welcome, {currentAdmin?.first_name || 'Admin'} ({currentAdmin?.email})
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Logout
                </button>
              </div>

              {/* Tabs */}
              <div className="flex space-x-1 mt-6 bg-white/10 rounded-lg p-1">
                {[
                  { id: 'announcements', label: 'Announcements', icon: FileText },
                  { id: 'assignments', label: 'Assignments', icon: Upload },
                  { id: 'students', label: 'Students', icon: Users },
                  { id: 'messages', label: 'Messages', icon: FileText }
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-lg font-medium transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-white text-indigo-600'
                          : 'text-white hover:bg-white/20'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[60vh] overflow-y-auto">
              {/* Success/Error Messages */}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700">{success}</span>
                  <button onClick={() => setSuccess(null)} className="ml-auto text-green-600 hover:text-green-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700">{error}</span>
                  <button onClick={() => setError(null)} className="ml-auto text-red-600 hover:text-red-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Announcements Tab */}
              {activeTab === 'announcements' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Manage Announcements</h3>
                    <button
                      onClick={() => setShowAnnouncementForm(true)}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Announcement</span>
                    </button>
                  </div>

                  {/* Announcement Form */}
                  {showAnnouncementForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                      </h4>
                      <form onSubmit={handleAnnouncementSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={announcementForm.title}
                            onChange={(e) => setAnnouncementForm({...announcementForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            maxLength={200}
                            placeholder="Enter announcement title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                          <textarea
                            value={announcementForm.content}
                            onChange={(e) => setAnnouncementForm({...announcementForm, content: e.target.value})}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            maxLength={1000}
                            placeholder="Enter announcement content"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                              value={announcementForm.type}
                              onChange={(e) => setAnnouncementForm({...announcementForm, type: e.target.value as any})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            >
                              <option value="info">Info</option>
                              <option value="important">Important</option>
                              <option value="urgent">Urgent</option>
                              <option value="success">Success</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                            <input
                              type="text"
                              value={announcementForm.tags}
                              onChange={(e) => setAnnouncementForm({...announcementForm, tags: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="e.g., Grade 9, Exam, Holiday"
                            />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="isPinned"
                            checked={announcementForm.is_pinned}
                            onChange={(e) => setAnnouncementForm({...announcementForm, is_pinned: e.target.checked})}
                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <label htmlFor="isPinned" className="text-sm text-gray-700 flex items-center space-x-1">
                            <Pin className="h-4 w-4 text-indigo-600" />
                            <span>Pin this announcement</span>
                          </label>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                          >
                            <Save className="h-4 w-4" />
                            <span>{loading ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAnnouncementForm(false);
                              setEditingAnnouncement(null);
                              setAnnouncementForm({title: '', content: '', type: 'info', is_pinned: false, tags: ''});
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Announcements List */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span>Loading announcements...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((announcement) => (
                        <div key={announcement.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h4 className="font-semibold text-gray-900">{announcement.title}</h4>
                                {announcement.is_pinned && (
                                  <div className="flex items-center space-x-1 bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-xs font-medium">
                                    <Pin className="h-3 w-3" />
                                    <span>Pinned</span>
                                  </div>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  announcement.type === 'urgent' ? 'bg-red-100 text-red-800' :
                                  announcement.type === 'important' ? 'bg-blue-100 text-blue-800' :
                                  announcement.type === 'success' ? 'bg-green-100 text-green-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {announcement.type.toUpperCase()}
                                </span>
                              </div>
                              <p className="text-gray-700 mb-2">{announcement.content}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>By {announcement.author}</span>
                                <span>{formatDate(announcement.created_at)}</span>
                                <div className="flex flex-wrap gap-1">
                                  {announcement.tags.map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleTogglePin(announcement)}
                                disabled={loading}
                                className={`p-2 rounded-lg transition-colors ${
                                  announcement.is_pinned
                                    ? 'text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50'
                                    : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                                }`}
                                title={announcement.is_pinned ? 'Unpin announcement' : 'Pin announcement'}
                              >
                                {announcement.is_pinned ? (
                                  <PinOff className="h-4 w-4" />
                                ) : (
                                  <Pin className="h-4 w-4" />
                                )}
                              </button>
                              <button
                                onClick={() => handleEditAnnouncement(announcement)}
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAnnouncement(announcement.id!)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Assignments Tab */}
              {activeTab === 'assignments' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Manage Assignments</h3>
                    <button
                      onClick={() => setShowAssignmentForm(true)}
                      className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Assignment</span>
                    </button>
                  </div>

                  {/* Assignment Form */}
                  {showAssignmentForm && (
                    <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="font-semibold text-gray-900 mb-4">
                        {editingAssignment ? 'Edit Assignment' : 'Create New Assignment'}
                      </h4>
                      <form onSubmit={handleAssignmentSubmit} className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={assignmentForm.title}
                            onChange={(e) => setAssignmentForm({...assignmentForm, title: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            placeholder="Enter assignment title"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea
                            value={assignmentForm.description}
                            onChange={(e) => setAssignmentForm({...assignmentForm, description: e.target.value})}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                            placeholder="Enter assignment description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                            <select
                              value={assignmentForm.class}
                              onChange={(e) => setAssignmentForm({...assignmentForm, class: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            >
                              <option value="">Select class</option>
                              <option value="9">Class 9</option>
                              <option value="10">Class 10</option>
                              <option value="11">Class 11</option>
                              <option value="12">Class 12</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                            <input
                              type="date"
                              value={assignmentForm.due_date}
                              onChange={(e) => setAssignmentForm({...assignmentForm, due_date: e.target.value})}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* PDF Upload Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assignment PDF (Optional)
                          </label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                            <div className="space-y-1 text-center">
                              <File className="mx-auto h-12 w-12 text-gray-400" />
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="pdf-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>Upload a PDF file</span>
                                  <input
                                    id="pdf-upload"
                                    name="pdf-upload"
                                    type="file"
                                    accept=".pdf"
                                    className="sr-only"
                                    onChange={handleFileChange}
                                    disabled={uploadingPdf || loading}
                                  />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs text-gray-500">PDF up to 10MB</p>
                              
                              {assignmentForm.pdfFile && (
                                <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <File className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm text-blue-800 font-medium">
                                      {assignmentForm.pdfFile.name}
                                    </span>
                                    <span className="text-xs text-blue-600">
                                      ({formatFileSize(assignmentForm.pdfFile.size)})
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => setAssignmentForm({...assignmentForm, pdfFile: null})}
                                      className="text-red-600 hover:text-red-800"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {uploadingPdf && (
                                <div className="mt-2">
                                  <div className="bg-blue-200 rounded-full h-2">
                                    <div 
                                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${uploadProgress}%` }}
                                    ></div>
                                  </div>
                                  <p className="text-xs text-blue-600 mt-1">
                                    Uploading... {uploadProgress}%
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-3">
                          <button
                            type="submit"
                            disabled={loading || uploadingPdf}
                            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                          >
                            <Save className="h-4 w-4" />
                            <span>
                              {uploadingPdf ? 'Uploading...' : 
                               loading ? 'Saving...' : 
                               (editingAssignment ? 'Update' : 'Create')}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setShowAssignmentForm(false);
                              setEditingAssignment(null);
                              setAssignmentForm({title: '', description: '', class: '', due_date: '', pdfFile: null});
                            }}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Assignments List */}
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
                        <span>Loading assignments...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">{assignment.title}</h4>
                              <p className="text-gray-700 mb-2">{assignment.description}</p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-2">
                                <span>Class {assignment.class}</span>
                                <span>Due: {formatDate(assignment.due_date)}</span>
                                <span>Created: {formatDate(assignment.created_at)}</span>
                              </div>
                              {assignment.pdf_url && (
                                <div className="flex items-center space-x-2 text-sm">
                                  <File className="h-4 w-4 text-red-600" />
                                  <span className="text-gray-600">PDF attachment available</span>
                                  <a
                                    href={assignment.pdf_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-medium"
                                  >
                                    View PDF
                                  </a>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 ml-4">
                              <button
                                onClick={() => handleEditAssignment(assignment)}
                                className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteAssignment(assignment.id!)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Other tabs would go here... */}
              {activeTab === 'students' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Student management coming soon...</p>
                </div>
              )}

              {activeTab === 'messages' && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Message management coming soon...</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPortal;