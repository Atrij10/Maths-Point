import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, Calculator, Info, CheckCircle, Calendar, Pin, AlertTriangle, RefreshCw } from 'lucide-react';
import { announcementsService, type Announcement } from '../services/supabaseService';
import { testSupabaseConnection } from '../config/supabase';

const Announcements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [retryCount, setRetryCount] = useState(0);

  // Fallback announcements data
  const fallbackAnnouncements: Announcement[] = [
    {
      id: '1',
      title: 'New Batch Starting - Grade 11 & 12 Mathematics',
      content: 'We are excited to announce a new batch for Grade 11 & 12 students starting from March 1st, 2024. Limited seats available. Early bird discount of 20% for registrations before February 20th.',
      type: 'important',
      author: 'Administration',
      author_id: 'admin-1',
      is_pinned: true,
      tags: ['Admission', 'Grade 11-12'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: 'Mid-Term Examination Schedule Released',
      content: 'The mid-term examination schedule for all grades has been published. Exams will be conducted from February 25th to March 5th, 2024. Please check your respective grade sections for detailed timetables.',
      type: 'urgent',
      author: 'Academic Department',
      author_id: 'admin-2',
      is_pinned: true,
      tags: ['Exams', 'All Grades'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: 'Holiday Notice - Republic Day',
      content: 'The institute will remain closed on January 26th, 2024 in observance of Republic Day. Regular classes will resume on January 27th, 2024.',
      type: 'info',
      author: 'Administration',
      author_id: 'admin-1',
      is_pinned: false,
      tags: ['Holiday', 'Notice'],
      created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
      updated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  // Load announcements from Supabase with enhanced error handling
  const loadAnnouncements = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setLoading(true);
        setConnectionStatus('checking');
      }
      
      // Test connection first
      const isConnected = await testSupabaseConnection();
      
      if (!isConnected) {
        setConnectionStatus('disconnected');
        setError('Database connection not available. Please check your Supabase configuration.');
        setAnnouncements([]);
        return;
      }
      
      setConnectionStatus('connected');
      const fetchedAnnouncements = await announcementsService.getAllAnnouncements();
      setAnnouncements(fetchedAnnouncements);
      setError(null);
      setRetryCount(0);
      
    } catch (err: any) {
      console.error('Error loading announcements:', err);
      setConnectionStatus('disconnected');
      
      // Enhanced error handling with specific error messages
      let errorMessage = 'Failed to load announcements.';
      
      if (err.message?.includes('503') || err.message?.includes('upstream connect error')) {
        errorMessage = 'The database service is temporarily unavailable. Please try again in a few minutes.';
      } else if (err.message?.includes('network') || err.message?.includes('fetch')) {
        errorMessage = 'Network connection issue. Please check your internet connection and try again.';
      } else if (err.message?.includes('timeout')) {
        errorMessage = 'Request timed out. The service may be experiencing high traffic.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      
      // Use fallback data when Supabase fails
      setAnnouncements(fallbackAnnouncements);
      
    } finally {
      setLoading(false);
    }
  };

  // Retry function
  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    await loadAnnouncements(true);
  };

  // Load announcements on component mount
  useEffect(() => {
    loadAnnouncements();
  }, []);

  const getAnnouncementIcon = (type: string) => {
    const icons = {
      'important': AlertCircle,
      'urgent': Bell,
      'info': Info,
      'success': CheckCircle
    };
    return icons[type as keyof typeof icons] || Info;
  };

  const getAnnouncementColors = (type: string) => {
    const colors = {
      'important': 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 text-blue-800',
      'urgent': 'bg-gradient-to-br from-red-50 to-pink-50 border-red-200 text-red-800',
      'info': 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 text-indigo-800',
      'success': 'bg-gradient-to-br from-green-50 to-teal-50 border-green-200 text-green-800'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const getTypeColors = (type: string) => {
    const colors = {
      'important': 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800',
      'urgent': 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800',
      'info': 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800',
      'success': 'bg-gradient-to-r from-green-100 to-teal-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown date';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const pinnedAnnouncements = announcements.filter(ann => ann.is_pinned);
  const regularAnnouncements = announcements.filter(ann => !ann.is_pinned);

  if (loading) {
    return (
      <section id="announcements" className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-blue-400">
              <div className="w-6 h-6 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              <span className="text-lg">Loading announcements...</span>
            </div>
            {connectionStatus === 'checking' && (
              <p className="text-sm text-gray-400 mt-2">Checking database connection...</p>
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="announcements" className="py-20 bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 right-40 w-72 h-72 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-40 w-72 h-72 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Announcements & Notices
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Stay informed about important updates, events, and news from Maths Point Educational Centre. 
            Check regularly for the latest announcements.
          </p>
          
          {/* Connection Status */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            {connectionStatus === 'connected' && (
              <div className="flex items-center space-x-1 text-green-400 text-sm">
                <CheckCircle className="h-4 w-4" />
                <span>Connected to database</span>
              </div>
            )}
            {connectionStatus === 'disconnected' && (
              <div className="flex items-center space-x-1 text-yellow-400 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>Using offline data</span>
              </div>
            )}
          </div>
          
          {/* Error Message with Retry */}
          {error && (
            <div className="mt-4 p-4 bg-yellow-900/50 border border-yellow-700 rounded-lg text-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Service Notice</p>
                  <p className="text-sm mt-1">{error}</p>
                  {connectionStatus === 'disconnected' && (
                    <div className="mt-3 flex items-center space-x-3">
                      <button
                        onClick={handleRetry}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs rounded-md transition-colors duration-200"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Retry Connection</span>
                      </button>
                      {retryCount > 0 && (
                        <span className="text-xs text-yellow-300">
                          Retry attempts: {retryCount}
                        </span>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-yellow-300 mt-2">
                    Don't worry - you can still view announcements using our offline backup data.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
              <Pin className="h-5 w-5 text-blue-400" />
              <span>Pinned Announcements</span>
            </h3>
            <div className="space-y-4">
              {pinnedAnnouncements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className="bg-white/95 backdrop-blur-sm rounded-xl border-2 border-dashed border-blue-300 p-6 transform hover:scale-105 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{announcement.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColors(announcement.type)}`}>
                              {announcement.type.toUpperCase()}
                            </span>
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(announcement.created_at || '')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Pin className="h-4 w-4 text-blue-500" />
                    </div>
                    
                    <p className="mb-4 leading-relaxed text-gray-700">{announcement.content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {announcement.tags.map((tag, tagIndex) => (
                          <span key={tagIndex} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">By {announcement.author}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Announcements */}
        <div>
          <h3 className="text-xl font-bold text-white mb-6">Recent Announcements</h3>
          {regularAnnouncements.length > 0 ? (
            <div className="space-y-6">
              {regularAnnouncements.map((announcement) => {
                const IconComponent = getAnnouncementIcon(announcement.type);
                return (
                  <div
                    key={announcement.id}
                    className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getAnnouncementColors(announcement.type)}`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h4>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColors(announcement.type)}`}>
                                {announcement.type.toUpperCase()}
                              </span>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDate(announcement.created_at || '')}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {announcement.tags.map((tag, tagIndex) => (
                              <span key={tagIndex} className="px-2 py-1 bg-gradient-to-r from-indigo-100 to-purple-100 text-gray-700 rounded-md text-xs font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">By {announcement.author}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-400">No regular announcements at this time.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Announcements;