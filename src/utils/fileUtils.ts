// File download utilities
import { supabase } from '../lib/supabase';

// Function to list available storage buckets (for debugging)
export const listSupabaseBuckets = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets();
    
    if (error) {
      console.error('Error listing buckets:', error);
      return [];
    }
    
    console.log('Available Supabase buckets:', data);
    return data;
  } catch (error) {
    console.error('Error accessing Supabase storage:', error);
    return [];
  }
};

// Convert Supabase storage path to public URL (for public buckets)
export const getSupabaseFileUrl = (filePath: string): string => {
  if (!filePath) return '';
  
  // If it's already a full URL, return as-is
  if (filePath.startsWith('http') || filePath.startsWith('blob:') || filePath.startsWith('data:')) {
    return filePath;
  }
  
  // For Supabase storage paths, get public URL from the mobile_uploads bucket
  const bucketName = 'mobile_uploads';
  
  try {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    console.log('Supabase public URL generation:', {
      bucket: bucketName,
      filePath: filePath,
      publicUrl: data.publicUrl
    });
    
    return data.publicUrl;
  } catch (error) {
    console.error('Error getting Supabase public URL:', error);
    
    // Fallback: try to construct URL manually
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    if (supabaseUrl) {
      const manualUrl = `${supabaseUrl}/storage/v1/object/public/${bucketName}/${filePath}`;
      console.log('Manual URL fallback:', manualUrl);
      return manualUrl;
    }
    
    return '';
  }
};

export const downloadFile = async (fileUrl: string, fileName: string) => {
  try {
    // For development/demo purposes, we'll simulate a download
    // In production, this would handle actual file URLs from your storage
    
    if (fileUrl.startsWith('http') || fileUrl.startsWith('blob:')) {
      // Handle actual URL download
      const response = await fetch(fileUrl);
      const blob = await response.blob();
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'download';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Download started successfully' };
    } else {
      // For demo purposes, create a sample file download
      const sampleContent = `Sample file content for: ${fileName}\n\nThis is a demo download.\nIn production, this would be the actual file content.\n\nFile path: ${fileUrl}\nDownloaded at: ${new Date().toISOString()}`;
      
      const blob = new Blob([sampleContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'sample-file.txt';
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Demo file downloaded successfully' };
    }
  } catch (error) {
    console.error('Download failed:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Download failed' 
    };
  }
};

export const previewFile = (fileUrl: string, fileName: string) => {
  // For image files, we can show a preview
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  const fileExtension = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
  
  if (imageExtensions.includes(fileExtension)) {
    // Check if it's a valid URL or local path that could be an image
    const isValidUrl = fileUrl.startsWith('http') || fileUrl.startsWith('blob:') || fileUrl.startsWith('data:');
    const isLocalPath = fileUrl.includes('/') || fileUrl.includes('\\');
    
    return {
      type: 'image',
      url: fileUrl,
      canPreview: isValidUrl || isLocalPath
    };
  }
  
  // For other files, we can determine if they're previewable
  const textExtensions = ['.txt', '.json', '.csv', '.log', '.md'];
  if (textExtensions.includes(fileExtension)) {
    return {
      type: 'text',
      url: fileUrl,
      canPreview: true
    };
  }
  
  return {
    type: 'unknown',
    url: fileUrl,
    canPreview: false
  };
};
