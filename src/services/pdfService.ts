import { supabase } from '../config/supabase';
import { supabaseStorageService } from './supabaseStorageService';

export interface PDFMetadata {
  id?: string;
  name: string;
  original_name: string;
  file_path: string;
  file_url: string;
  file_size: number;
  category: string;
  description?: string;
  uploaded_by: string;
  uploaded_at?: string;
  is_active: boolean;
  download_count: number;
  tags: string[];
}

export const pdfService = {
  // Upload PDF and save metadata
  async uploadPDF(
    file: File,
    category: string,
    description: string,
    uploadedBy: string,
    customName?: string
  ): Promise<string> {
    try {
      console.log('Starting PDF upload process...');
      
      // Upload file to Supabase Storage
      const uploadResult = await supabaseStorageService.uploadAssignmentPDF(
        file,
        'admin-uploads'
      );

      // Save metadata to database
      const pdfMetadata: Omit<PDFMetadata, 'id' | 'uploaded_at'> = {
        name: customName || file.name,
        original_name: file.name,
        file_path: `admin-uploads/${file.name}`,
        file_url: uploadResult.url,
        file_size: file.size,
        category: category,
        description: description || undefined,
        uploaded_by: uploadedBy,
        is_active: true,
        download_count: 0,
        tags: [category.toLowerCase().replace(/\s+/g, '-')]
      };

      const { data, error } = await supabase
        .from('pdf_files')
        .insert([pdfMetadata])
        .select()
        .single();

      if (error) throw error;

      console.log('PDF metadata saved with ID:', data.id);
      return data.id;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  },

  // Get all PDFs
  async getAllPDFs(): Promise<PDFMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('pdf_files')
        .select('*')
        .eq('is_active', true)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting PDFs:', error);
      throw error;
    }
  },

  // Get PDFs by category
  async getPDFsByCategory(category: string): Promise<PDFMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('pdf_files')
        .select('*')
        .eq('category', category)
        .eq('is_active', true)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting PDFs by category:', error);
      throw error;
    }
  },

  // Update PDF metadata
  async updatePDF(id: string, updates: Partial<PDFMetadata>): Promise<void> {
    try {
      const { error } = await supabase
        .from('pdf_files')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      console.log('PDF metadata updated');
    } catch (error) {
      console.error('Error updating PDF:', error);
      throw error;
    }
  },

  // Delete PDF (soft delete)
  async deletePDF(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pdf_files')
        .update({ is_active: false })
        .eq('id', id);

      if (error) throw error;
      console.log('PDF deleted (soft delete)');
    } catch (error) {
      console.error('Error deleting PDF:', error);
      throw error;
    }
  },

  // Increment download count
  async incrementDownloadCount(id: string): Promise<void> {
    try {
      const { data: currentData, error: fetchError } = await supabase
        .from('pdf_files')
        .select('download_count')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      const newCount = (currentData?.download_count || 0) + 1;

      const { error } = await supabase
        .from('pdf_files')
        .update({ download_count: newCount })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error incrementing download count:', error);
      // Don't throw error for download count - it's not critical
    }
  },

  // Search PDFs
  async searchPDFs(query: string): Promise<PDFMetadata[]> {
    try {
      const { data, error } = await supabase
        .from('pdf_files')
        .select('*')
        .eq('is_active', true)
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching PDFs:', error);
      throw error;
    }
  }
};