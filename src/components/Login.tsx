import React, { useState, useEffect } from 'react';
import { User, Shield, Eye, EyeOff, Mail, Lock, ArrowRight, X, GraduationCap } from 'lucide-react';
import { studentsService, adminService, userPreferencesService } from '../services/supabaseService';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SavedLoginData {
  email: string;
  password: string;
  studentId: string;
  studentClass: string;
  loginType: 'student' | 'admin';
}

const Login: React.FC<LoginProps> = ({ isOpen, onClose }) => {
  const [loginType, setLoginType] = useState<'student' | 'admin'>('student');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentId: '',
    studentClass: ''
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingPreferences, setLoadingPreferences] = useState(false);

  const getUserId = () => {
    return `${loginType}_${formData.email}`;
  };

  useEffect(() => {
    const loadPreferences = async () => {
      setLoadingPreferences(true);
      try {
        const localData = localStorage.getItem(`loginPreferences_${loginType}`);
        if (localData) {
          const preferences = JSON.parse(localData);
          setFormData({
            email: preferences.email || '',
            password: preferences.password || '',
            studentId: preferences.studentId || '',
            studentClass: preferences.studentClass || ''
          });
          setRememberMe(true);
          
          if (preferences.email && preferences.password && 
              (loginType === 'admin' || (preferences.studentId && preferences.studentClass))) {
            await handleAutoLogin(preferences);
          }
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setLoadingPreferences(false);
      }
    };

    if (isOpen) {
      loadPreferences();
    }
  }, [loginType, isOpen]);

  const handleAutoLogin = async (preferences: any) => {
    try {
      setIsLoading(true);
      
      if (loginType === 'student') {
        const student = await studentsService.getStudentByEmail(preferences.email);
        
        if (student && student.student_id === preferences.studentId && 
            student.student_class === preferences.studentClass) {
          await studentsService.updateLastLogin(student.id!);
          
          const loginDetails = `Auto-Login Successful!\nStudent: ${preferences.studentId}\nClass: ${preferences.studentClass}\nEmail: ${preferences.email}`;
          alert(`${loginDetails}\n\nWelcome back! Your credentials were remembered.`);
          onClose();
          return;
        }
      } else {
        const admin = await adminService.getAdminByEmail(preferences.email);
        
        if (admin) {
          await adminService.updateLastLogin(admin.id!);
          
          const loginDetails = `Auto-Login Successful!\nAdmin: ${preferences.email}\nRole: ${admin.role}`;
          alert(`${loginDetails}\n\nWelcome back! Your credentials were remembered.`);
          onClose();
          return;
        }
      }
      
      clearSavedData();
    } catch (error) {
      console.error('Auto-login error:', error);
      clearSavedData();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '0px';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setRememberMe(checked);
    
    if (!checked) {
      clearSavedData();
    }
  };

  const saveLoginData = async () => {
    if (rememberMe && formData.email && formData.password) {
      const dataToSave: SavedLoginData = {
        email: formData.email,
        password: formData.password,
        studentId: formData.studentId,
        studentClass: formData.studentClass,
        loginType: loginType
      };
      
      try {
        localStorage.setItem(`loginPreferences_${loginType}`, JSON.stringify(dataToSave));
        
        const userId = getUserId();
        await userPreferencesService.saveLoginPreferences(userId, dataToSave);
        
        console.log('Login preferences saved');
      } catch (error) {
        console.error('Error saving login preferences:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (loginType === 'student') {
        const student = await studentsService.getStudentByEmail(formData.email);
        
        if (student) {
          await studentsService.updateLastLogin(student.id!);
          
          if (student.student_id === formData.studentId && student.student_class === formData.studentClass) {
            console.log('Student login successful:', student);
            
            await saveLoginData();
            
            const loginDetails = `Student: ${formData.studentId}\nClass: ${formData.studentClass}\nEmail: ${formData.email}`;
            alert(`Login successful!\n\n${loginDetails}\n\n${rememberMe ? 'Login details have been saved for next time.' : 'Login details will not be remembered.'}`);
            onClose();
          } else {
            alert('Student details do not match our records. Please check your information.');
          }
        } else {
          const studentId = await studentsService.addStudent({
            student_id: formData.studentId,
            student_class: formData.studentClass,
            email: formData.email
          });
          
          console.log('New student created with ID:', studentId);
          
          await saveLoginData();
          
          const loginDetails = `New Student Registered!\nStudent: ${formData.studentId}\nClass: ${formData.studentClass}\nEmail: ${formData.email}`;
          alert(`Registration & Login successful!\n\n${loginDetails}\n\n${rememberMe ? 'Login details have been saved for next time.' : 'Login details will not be remembered.'}`);
          onClose();
        }
      } else {
        const admin = await adminService.getAdminByEmail(formData.email);
        
        if (admin) {
          await adminService.updateLastLogin(admin.id!);
          
          console.log('Admin login successful:', admin);
          
          await saveLoginData();
          
          const loginDetails = `Admin: ${formData.email}\nRole: ${admin.role}`;
          alert(`Admin Login successful!\n\n${loginDetails}\n\n${rememberMe ? 'Login details have been saved for next time.' : 'Login details will not be remembered.'}`);
          onClose();
        } else {
          alert('Admin account not found. Please contact the administrator.');
        }
      }
      
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      studentId: '',
      studentClass: ''
    });
    setShowPassword(false);
    setRememberMe(false);
  };

  const handleLoginTypeChange = (type: 'student' | 'admin') => {
    setLoginType(type);
    setShowPassword(false);
    resetForm();
  };

  const handleClose = () => {
    onClose();
  };

  const handleForgotPassword = () => {
    alert('Please contact the administration for password reset assistance.\n\nContact Details:\nPhone: +91 98308 44440 | +91 94330 44440\nEmail: arnab09@gmail.com');
  };

  const clearSavedData = async () => {
    try {
      localStorage.removeItem(`loginPreferences_${loginType}`);
      
      if (formData.email) {
        const userId = getUserId();
        await userPreferencesService.clearLoginPreferences(userId);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error clearing saved data:', error);
    }
  };

  const handleClearSavedData = async () => {
    if (confirm('Are you sure you want to clear all saved login data?')) {
      await clearSavedData();
      alert('All saved login data has been cleared.');
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full transition-all duration-200 z-20 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 group"
        >
          <X className="h-5 w-5 group-hover:rotate-90 transition-transform duration-200" />
        </button>

        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 text-white rounded-t-2xl overflow-hidden">
          <div className="relative z-10 pr-12">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-blue-100 text-sm sm:text-base">
              {loadingPreferences ? 'Loading your saved preferences...' :
               rememberMe && (formData.email || formData.studentId) ? 
                'Your details have been remembered' : 
                'Sign in to access your account'
              }
            </p>
          </div>
        </div>

        <div className="max-h-[calc(95vh-200px)] overflow-y-auto">
          <div className="p-4 sm:p-6 pb-0">
            <div className="flex bg-blue-50 rounded-xl p-1 mb-4 sm:mb-6">
              <button
                onClick={() => handleLoginTypeChange('student')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  loginType === 'student'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <User className="h-4 w-4" />
                <span>Student</span>
              </button>
              <button
                onClick={() => handleLoginTypeChange('admin')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 text-sm sm:text-base ${
                  loginType === 'admin'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Shield className="h-4 w-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6">
            <div className="space-y-4">
              {loginType === 'student' && (
                <>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Student Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                        placeholder="Enter your full name"
                        required
                        disabled={isLoading || loadingPreferences}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Class *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <GraduationCap className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        name="studentClass"
                        value={formData.studentClass}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base appearance-none bg-white"
                        required
                        disabled={isLoading || loadingPreferences}
                      >
                        <option value="">Select your class</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                        placeholder="Enter your email"
                        required
                        disabled={isLoading || loadingPreferences}
                      />
                    </div>
                  </div>
                </>
              )}

              {loginType === 'admin' && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                      placeholder="Enter your email"
                      required
                      disabled={isLoading || loadingPreferences}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 text-sm sm:text-base"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading || loadingPreferences}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    disabled={isLoading || loadingPreferences}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                    disabled={isLoading || loadingPreferences}
                  />
                  <span className="text-sm text-gray-600 select-none">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                  disabled={isLoading || loadingPreferences}
                >
                  Forgot password?
                </button>
              </div>

              {rememberMe && (formData.email || formData.studentId) && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-700 font-medium">
                        Login details will be saved
                        {loginType === 'student' && formData.studentClass && (
                          <span className="text-green-600"> (Class {formData.studentClass})</span>
                        )}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearSavedData}
                      className="text-xs text-red-600 hover:text-red-800 font-medium transition-colors duration-200"
                      disabled={isLoading || loadingPreferences}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading || loadingPreferences}
                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  loginType === 'student'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700'
                } ${(isLoading || loadingPreferences) ? 'opacity-75 cursor-not-allowed' : 'hover:shadow-lg transform hover:-translate-y-0.5'}`}
              >
                {(isLoading || loadingPreferences) ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>{loadingPreferences ? 'Loading...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <span>Sign In as {loginType === 'student' ? 'Student' : 'Admin'}</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>

            {loginType === 'admin' && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Need help accessing admin panel?
                  </p>
                  <button
                    type="button"
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors duration-200"
                    disabled={isLoading || loadingPreferences}
                  >
                    Contact Administrator
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;