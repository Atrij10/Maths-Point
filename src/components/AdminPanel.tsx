import React, { useState } from 'react';
import { Database, Plus, Trash2, RefreshCw, AlertCircle } from 'lucide-react';
import { announcementsService } from '../services/supabaseService';

const AdminPanel: React.FC = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sampleAnnouncements = [
    {
      title: 'New Batch Starting - Grade 11 & 12 Mathematics',
      content: 'We are excited to announce a new batch for Grade 11 & 12 students starting from March 1st, 2024. Limited seats available. Early bird discount of 20% for registrations before February 20th.',
      type: 'important' as const,
      author: 'Administration',
      is_pinned: true,
      tags: ['Admission', 'Grade 11-12']
    },
    {
      title: 'Mid-Term Examination Schedule Released',
      content: 'The mid-term examination schedule for all grades has been published. Exams will be conducted from February 25th to March 5th, 2024. Please check your respective grade sections for detailed timetables.',
      type: 'urgent' as const,
      author: 'Academic Department',
      is_pinned: true,
      tags: ['Exams', 'All Grades']
    },
    {
      title: 'Holiday Notice - Holi Celebration',
      content: 'The center will remain closed on March 13th and 14th, 2024, for Holi celebrations. Regular classes will resume on March 15th. Wishing everyone a colorful and joyful Holi!',
      type: 'info' as const,
      author: 'Administration',
      is_pinned: false,
      tags: ['Holiday', 'General']
    },
    {
      title: 'Success Story - 100% Results in Board Exams',
      content: 'We are proud to announce that our Grade 10 and 12 students achieved 100% pass rate in the recent board examinations with 85% students scoring above 90%. Congratulations to all!',
      type: 'success' as const,
      author: 'Academic Department',
      is_pinned: false,
      tags: ['Results', 'Achievement']
    }
  ];

  const handleSeedData = async () => {
    setIsSeeding(true);
    setMessage(null);
    setError(null);
    
    try {
      for (const announcement of sampleAnnouncements) {
        await announcementsService.addAnnouncement(announcement, 'admin-user-id');
      }
      setMessage('✅ Successfully added sample announcements to the database!');
      setError(null);
    } catch (error: any) {
      console.error('Detailed error:', error);
      
      let errorMessage = '❌ Error adding announcements: ';
      
      if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      setMessage(null);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('Are you sure you want to delete ALL announcements? This action cannot be undone.')) {
      return;
    }

    setIsClearing(true);
    setMessage(null);
    setError(null);
    
    try {
      const announcements = await announcementsService.getAllAnnouncements();
      
      for (const announcement of announcements) {
        if (announcement.id) {
          await announcementsService.deleteAnnouncement(announcement.id);
        }
      }
      
      setMessage('✅ Successfully cleared all announcements from the database!');
      setError(null);
    } catch (error: any) {
      console.error('Detailed error:', error);
      
      let errorMessage = '❌ Error clearing announcements: ';
      
      if (error?.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Unknown error occurred.';
      }
      
      setError(errorMessage);
      setMessage(null);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-sm z-50">
      <div className="flex items-center space-x-2 mb-4">
        <Database className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold text-gray-900">Database Admin</h3>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={handleSeedData}
          disabled={isSeeding}
          className="w-full flex items-center justify-center space-x-2 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isSeeding ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              <span>Add Sample Announcements</span>
            </>
          )}
        </button>

        <button
          onClick={handleClearData}
          disabled={isClearing}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isClearing ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Clearing...</span>
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4" />
              <span>Clear All Announcements</span>
            </>
          )}
        </button>
      </div>

      {/* Success Message */}
      {message && (
        <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-sm text-green-700 font-medium">
            {message}
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-red-700">
              <div className="font-medium mb-1">Error Details:</div>
              <div className="text-xs leading-relaxed">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="text-xs text-blue-700">
          <div className="font-medium mb-1">Instructions:</div>
          <div className="space-y-1">
            <div>1. Use these buttons to populate or clear announcements</div>
            <div>2. If you get permission errors, update your Supabase RLS policies</div>
            <div>3. Press Ctrl+Shift+A to hide this panel</div>
          </div>
        </div>
      </div>

      {/* Supabase Help */}
      {error?.includes('permission') && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="text-xs text-yellow-800">
            <div className="font-medium mb-1">Fix Supabase Policies:</div>
            <div className="text-xs">
              Go to Supabase Dashboard → Authentication → Policies and ensure proper RLS policies are set for the announcements table.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;