import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  User, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  X, 
  FileText,
  Calendar,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Clock,
  File,
  Search,
  Upload,
  Send,
  Paperclip,
  Trash2
} from 'lucide-react';
import { studentsService, assignmentsService, loginSessionsService, submissionsService, type Assignment, type Submission } from '../services/supabaseService';
import { supabaseStorageService } from '../services/supabaseStorageService';
import { CLASS_PASSWORDS } from '../utils/classPasswords';

interface StudentPortalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StudentPortal: React.FC<StudentPortalProps> = ({ isOpen, onClose }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(true);
  const [formData, setFormData] = useState({
    studentName: '',
    studentClass: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Student portal data
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStudent, setCurrentStudent] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // Submission states
  const [submissionFiles, setSubmissionFiles] = useState<{ [assignmentId: string]: File | null }>({});
  const [submittingAssignments, setSubmittingAssignments] = useState<{ [assignmentId: string]: boolean }>({});
  const [submissionErrors, setSubmissionErrors] = useState<{ [assignmentId: string]: string }>({});

  // Reset all states
  const resetAllStates = () => {
    setIsAuthenticated(false);
    setShowPasswordForm(true);
    setFormData({
      studentName: '',
      studentClass: '',
      email: '',
      password: ''
    });
    setShowPassword(false);
    setLoading(false);
    setError(null);
    setSuccess(null);
    setAssignments([]);
    setSubmissions([]);
    setSearchTerm('');
    setCurrentStudent(null);
    setSessionId(null);
    setSubmissionFiles({});
    setSubmittingAssignments({});
    setSubmissionErrors({});
  };

  // Reset states when portal closes
  useEffect(() => {
    if (!isOpen) {
      resetAllStates();
    }
  }, [isOpen]);

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

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated && currentStudent) {
      loadStudentData();
    }
  }, [isAuthenticated, currentStudent]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateClassPassword = (classNumber: string, password: string): boolean => {
    return CLASS_PASSWORDS[classNumber as keyof typeof CLASS_PASSWORDS] === password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate class password
      if (!validateClassPassword(formData.studentClass, formData.password)) {
        setError('Incorrect password for the selected class. Please contact your teacher for the correct password.');
        return;
      }

      // Check if student exists or create new one
      let student = await studentsService.getStudentByEmail(formData.email);
      
      if (!student) {
        // Create new student
        const studentId = await studentsService.addStudent({
          student_id: formData.studentName,
          student_class: formData.studentClass,
          email: formData.email
        });
        
        student = await studentsService.getStudentByEmail(formData.email);
        setSuccess('Welcome! Your student account has been created.');
      } else {
        // Update last login
        await studentsService.updateLastLogin(student.id!);
        setSuccess('Welcome back!');
      }

      // Start login session
      try {
        const newSessionId = await loginSessionsService.startSession({
          student_name: formData.studentName,
          student_class: formData.studentClass,
          student_email: formData.email,
          ip_address: 'Unknown',
          user_agent: navigator.userAgent
        });
        setSessionId(newSessionId);
      } catch (sessionError) {
        console.error('Error starting session:', sessionError);
        // Continue without session tracking
      }

      setCurrentStudent(student);
      setIsAuthenticated(true);
      setShowPasswordForm(false);

    } catch (error: any) {
      console.error('Student login error:', error);
      setError('Login failed. Please try again or contact support.');
    } finally {
      setLoading(false);
    }
  };

  const loadStudentData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load text assignments for student's class
      const classAssignments = await assignmentsService.getAssignmentsByClass(formData.studentClass);
      setAssignments(classAssignments);
      
      // Load student's submissions
      const studentSubmissions = await submissionsService.getSubmissionsByStudent(formData.studentName);
      setSubmissions(studentSubmissions);
      
      // Track feature access
      if (sessionId) {
        await loginSessionsService.trackFeatureAccess(sessionId, 'assignments');
      }
    } catch (error) {
      console.error('Error loading student data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      // End login session
      if (sessionId) {
        await loginSessionsService.endSession(sessionId);
      }
      
      resetAllStates();
    } catch (error) {
      console.error('Error during logout:', error);
      resetAllStates(); // Reset anyway
    }
  };

  const handleAssignmentPDFView = async (assignment: Assignment) => {
    try {
      if (assignment.pdf_url) {
        // Track assignment view
        if (sessionId) {
          await loginSessionsService.trackAssignmentView(sessionId, assignment.id!);
        }
        
        // Open PDF in new tab
        window.open(assignment.pdf_url, '_blank');
      }
    } catch (error) {
      console.error('Error viewing assignment PDF:', error);
    }
  };

  const handleFileSelect = (assignmentId: string, file: File | null) => {
    setSubmissionFiles(prev => ({
      ...prev,
      [assignmentId]: file
    }));
    
    // Clear any previous error for this assignment
    setSubmissionErrors(prev => ({
      ...prev,
      [assignmentId]: ''
    }));
  };

  const validateSubmissionFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file type (allow PDF, DOC, DOCX, TXT, JPG, PNG)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/jpg'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        isValid: false, 
        error: 'Only PDF, Word documents, text files, and images (JPG, PNG) are allowed' 
      };
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { 
        isValid: false, 
        error: 'File size must be less than 10MB' 
      };
    }
    
    return { isValid: true };
  };

  const handleSubmitAssignment = async (assignment: Assignment) => {
    const assignmentId = assignment.id!;
    const file = submissionFiles[assignmentId];
    
    if (!file) {
      setSubmissionErrors(prev => ({
        ...prev,
        [assignmentId]: 'Please select a file to submit'
      }));
      return;
    }

    // Validate file
    const validation = validateSubmissionFile(file);
    if (!validation.isValid) {
      setSubmissionErrors(prev => ({
        ...prev,
        [assignmentId]: validation.error!
      }));
      return;
    }

    setSubmittingAssignments(prev => ({ ...prev, [assignmentId]: true }));
    setSubmissionErrors(prev => ({ ...prev, [assignmentId]: '' }));

    try {
      // Upload file to Supabase Storage
      const uploadResult = await supabaseStorageService.uploadSubmissionPDF(
        file,
        assignmentId,
        formData.studentName
      );

      // Create submission record
      const submissionData = {
        assignment_id: assignmentId,
        student_name: formData.studentName,
        student_class: formData.studentClass,
        file_name: file.name,
        file_url: uploadResult.url,
        file_size: file.size,
        file_type: file.type,
        status: 'submitted' as const
      };

      const submissionId = await submissionsService.addSubmission(submissionData);

      // Track submission in session
      if (sessionId) {
        await loginSessionsService.trackSubmission(sessionId, submissionId);
      }

      // Refresh submissions data
      await loadStudentData();

      // Clear the file selection
      setSubmissionFiles(prev => ({
        ...prev,
        [assignmentId]: null
      }));

      setSuccess(`Assignment "${assignment.title}" submitted successfully!`);

    } catch (error: any) {
      console.error('Error submitting assignment:', error);
      setSubmissionErrors(prev => ({
        ...prev,
        [assignmentId]: `Failed to submit: ${error.message || 'Unknown error'}`
      }));
    } finally {
      setSubmittingAssignments(prev => ({ ...prev, [assignmentId]: false }));
    }
  };

  const getSubmissionForAssignment = (assignmentId: string): Submission | undefined => {
    return submissions.find(sub => sub.assignment_id === assignmentId);
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

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter assignments based on search
  const filteredAssignments = assignments.filter(assignment => {
    return assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
           assignment.description.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleClose = () => {
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

        {/* Login Form */}
        {showPasswordForm && (
          <div className="p-8 text-center">
            <GraduationCap className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Student Portal Access</h2>
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Student Name *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="studentName"
                      value={formData.studentName}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <GraduationCap className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      name="studentClass"
                      value={formData.studentClass}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
                      required
                      disabled={loading}
                    >
                      <option value="">Select your class</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your email"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Class Password *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter class password"
                      required
                      disabled={loading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Contact your teacher if you don't know the class password
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Access Student Portal</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-700 text-sm">{success}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* Main Student Portal */}
        {isAuthenticated && !showPasswordForm && (
          <>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 pr-16">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Student Portal</h2>
                    <p className="text-blue-100">
                      Welcome, {formData.studentName} - Class {formData.studentClass}
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

              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Assignments for Class {formData.studentClass}
                </h3>
                <button
                  onClick={loadStudentData}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search assignments..."
                  />
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
                    <span>Loading assignments...</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Text Assignments with PDF Attachments and Submission */}
                  {filteredAssignments.length > 0 ? (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <span>Assignments from Teacher</span>
                      </h4>
                      <div className="space-y-6">
                        {filteredAssignments.map((assignment) => {
                          const submission = getSubmissionForAssignment(assignment.id!);
                          const isSubmitted = !!submission;
                          const selectedFile = submissionFiles[assignment.id!];
                          const isSubmitting = submittingAssignments[assignment.id!];
                          const submissionError = submissionErrors[assignment.id!];

                          return (
                            <div key={assignment.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow bg-gradient-to-r from-blue-50 to-indigo-50">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <h5 className="font-semibold text-gray-900 text-lg">{assignment.title}</h5>
                                    {assignment.pdf_url && (
                                      <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                        <File className="h-3 w-3" />
                                        <span>PDF Attached</span>
                                      </span>
                                    )}
                                    {isSubmitted && (
                                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                                        <CheckCircle className="h-3 w-3" />
                                        <span>Submitted</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-gray-600 mb-4 leading-relaxed">{assignment.description}</p>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="h-4 w-4" />
                                      <span>Due: {formatDate(assignment.due_date)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-4 w-4" />
                                      <span>Created: {formatDate(assignment.created_at)}</span>
                                    </div>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                      Class {assignment.class}
                                    </span>
                                  </div>
                                  
                                  {/* Action Buttons Row */}
                                  <div className="flex items-center space-x-3 mb-4">
                                    {/* PDF View Button */}
                                    {assignment.pdf_url && (
                                      <button
                                        onClick={() => handleAssignmentPDFView(assignment)}
                                        className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                      >
                                        <File className="h-4 w-4" />
                                        <span>View Assignment PDF</span>
                                        <ExternalLink className="h-3 w-3" />
                                      </button>
                                    )}

                                    {/* Submission Status */}
                                    {isSubmitted && (
                                      <div className="flex items-center space-x-2 text-green-600 text-sm">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>Submitted on {formatDate(submission.submitted_at)}</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Submission Section */}
                                  {!isSubmitted && (
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                      <h6 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                                        <Upload className="h-4 w-4 text-blue-600" />
                                        <span>Submit Your Assignment</span>
                                      </h6>
                                      
                                      {/* File Upload */}
                                      <div className="space-y-3">
                                        <div>
                                          <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Select File to Submit *
                                          </label>
                                          <div className="flex items-center space-x-3">
                                            <input
                                              type="file"
                                              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                                              onChange={(e) => handleFileSelect(assignment.id!, e.target.files?.[0] || null)}
                                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                              disabled={isSubmitting}
                                            />
                                            {selectedFile && (
                                              <button
                                                onClick={() => handleFileSelect(assignment.id!, null)}
                                                className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                                disabled={isSubmitting}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            )}
                                          </div>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Supported formats: PDF, Word documents, text files, images (JPG, PNG). Max size: 10MB
                                          </p>
                                        </div>

                                        {/* Selected File Info */}
                                        {selectedFile && (
                                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                            <div className="flex items-center space-x-2">
                                              <Paperclip className="h-4 w-4 text-blue-600" />
                                              <span className="text-sm font-medium text-blue-900">{selectedFile.name}</span>
                                              <span className="text-xs text-blue-600">({formatFileSize(selectedFile.size)})</span>
                                            </div>
                                          </div>
                                        )}

                                        {/* Submit Button */}
                                        <button
                                          onClick={() => handleSubmitAssignment(assignment)}
                                          disabled={!selectedFile || isSubmitting}
                                          className={`inline-flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                                            !selectedFile || isSubmitting
                                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                              : 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                                          }`}
                                        >
                                          {isSubmitting ? (
                                            <>
                                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                              <span>Submitting...</span>
                                            </>
                                          ) : (
                                            <>
                                              <Send className="h-4 w-4" />
                                              <span>Submit Assignment</span>
                                            </>
                                          )}
                                        </button>

                                        {/* Submission Error */}
                                        {submissionError && (
                                          <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
                                            <AlertCircle className="h-4 w-4 text-red-600" />
                                            <span className="text-red-700 text-sm">{submissionError}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}

                                  {/* Submitted File Info */}
                                  {isSubmitted && submission && (
                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                      <h6 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span>Your Submission</span>
                                      </h6>
                                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center space-x-3">
                                            <File className="h-5 w-5 text-green-600" />
                                            <div>
                                              <p className="font-medium text-green-900">{submission.file_name}</p>
                                              <p className="text-sm text-green-700">
                                                Submitted on {formatDate(submission.submitted_at)} • {formatFileSize(submission.file_size)}
                                              </p>
                                              {submission.status === 'graded' && submission.grade && (
                                                <p className="text-sm text-green-700 font-medium">
                                                  Grade: {submission.grade}/100
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <button
                                            onClick={() => window.open(submission.file_url, '_blank')}
                                            className="inline-flex items-center space-x-1 text-green-600 hover:text-green-800 transition-colors text-sm"
                                          >
                                            <ExternalLink className="h-4 w-4" />
                                            <span>View</span>
                                          </button>
                                        </div>
                                        {submission.feedback && (
                                          <div className="mt-3 pt-3 border-t border-green-200">
                                            <p className="text-sm font-medium text-green-900 mb-1">Teacher Feedback:</p>
                                            <p className="text-sm text-green-700">{submission.feedback}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* No Content Message */
                    <div className="text-center py-12">
                      <div className="flex flex-col items-center space-y-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {searchTerm 
                              ? 'No assignments match your search' 
                              : 'No assignments available yet'
                            }
                          </h3>
                          <p className="text-gray-500 text-sm">
                            {searchTerm 
                              ? 'Try adjusting your search criteria.' 
                              : 'Your teacher will upload assignments here.'
                            }
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm('')}
                              className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                              Clear search
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;