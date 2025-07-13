import { supabase } from '../config/supabase';

export interface UploadResult {
  url: string;
  fileName: string;
  size: number;
  uploadedAt: Date;
}

export interface UploadProgress {
  progress: number;
  bytesTransferred: number;
  totalBytes: number;
}

class SupabaseStorageService {
  // Upload assignment PDF
  async uploadAssignmentPDF(
    file: File, 
    assignmentId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      console.log('Starting assignment PDF upload to Supabase...');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      console.log('Assignment ID:', assignmentId);
      
      // Validate file first
      const validation = this.validatePDFFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      // Create file path
      const fileName = `${Date.now()}_${this.sanitizeFileName(file.name)}`;
      const filePath = `assignments/${assignmentId}/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);

      console.log('Public URL obtained:', urlData.publicUrl);

      return {
        url: urlData.publicUrl,
        fileName: file.name,
        size: file.size,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error in uploadAssignmentPDF:', error);
      throw new Error(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Upload submission PDF
  async uploadSubmissionPDF(
    file: File, 
    assignmentId: string, 
    studentName: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    try {
      console.log('Starting submission PDF upload to Supabase...');
      console.log('File details:', { name: file.name, size: file.size, type: file.type });
      console.log('Assignment ID:', assignmentId);
      console.log('Student name:', studentName);
      
      // Validate file first
      const validation = this.validatePDFFile(file);
      if (!validation.isValid) {
        throw new Error(validation.error);
      }
      
      // Create file path
      const sanitizedStudentName = this.sanitizeFileName(studentName);
      const fileName = `${Date.now()}_${sanitizedStudentName}_${this.sanitizeFileName(file.name)}`;
      const filePath = `submissions/${assignmentId}/${fileName}`;
      
      console.log('Uploading to path:', filePath);
      
      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Supabase submission upload error:', error);
        throw new Error(`Upload failed: ${error.message}`);
      }

      console.log('Submission upload successful:', data);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('pdfs')
        .getPublicUrl(filePath);

      console.log('Submission public URL obtained:', urlData.publicUrl);

      return {
        url: urlData.publicUrl,
        fileName: file.name,
        size: file.size,
        uploadedAt: new Date()
      };
    } catch (error) {
      console.error('Error in uploadSubmissionPDF:', error);
      throw new Error(`Failed to upload submission: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Delete file from storage
  async deleteFile(filePath: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from('pdfs')
        .remove([filePath]);

      if (error) throw error;
      console.log('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // List files in a directory
  async listFiles(path: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from('pdfs')
        .list(path);

      if (error) throw error;

      const urls = data?.map(file => {
        const { data: urlData } = supabase.storage
          .from('pdfs')
          .getPublicUrl(`${path}/${file.name}`);
        return urlData.publicUrl;
      }) || [];

      return urls;
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error(`Failed to list files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Validate file type and size
  validatePDFFile(file: File): { isValid: boolean; error?: string } {
    // Check if file exists
    if (!file) {
      return { isValid: false, error: 'No file selected' };
    }
    
    // Check file type
    if (file.type !== 'application/pdf') {
      return { isValid: false, error: 'Only PDF files are allowed' };
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    // Check minimum file size (1KB)
    if (file.size < 1024) {
      return { isValid: false, error: 'File is too small (minimum 1KB)' };
    }
    
    // Check file name length
    if (file.name.length > 100) {
      return { isValid: false, error: 'File name is too long (maximum 100 characters)' };
    }
    
    // Check for empty file name
    if (!file.name.trim()) {
      return { isValid: false, error: 'File name cannot be empty' };
    }
    
    return { isValid: true };
  }

  // Sanitize file name for storage
  private sanitizeFileName(fileName: string): string {
    // Remove special characters and spaces, replace with underscores
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(/_{2,}/g, '_')
      .replace(/^_+|_+$/g, '');
  }

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Test storage connection
  async testStorageConnection(): Promise<boolean> {
    try {
      // Try to list buckets to test connectivity
      const { data, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Storage connection test failed:', error);
        return false;
      }
      
      console.log('Storage connection test successful');
      return true;
    } catch (error) {
      console.error('Storage connection test failed:', error);
      return false;
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();