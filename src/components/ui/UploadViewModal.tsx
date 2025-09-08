import React from 'react';
import { X, FileImage, Calendar, User, HardDrive, MapPin, Clock } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { MobileUpload } from '../../types';
import { previewFile, getSupabaseFileUrl, listSupabaseBuckets } from '../../utils/fileUtils';
import { supabase } from '../../lib/supabase';

interface UploadViewModalProps {
  upload: MobileUpload | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UploadViewModal: React.FC<UploadViewModalProps> = ({ 
  upload, 
  isOpen, 
  onClose 
}) => {
  if (!isOpen || !upload) return null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = Math.round(bytes / 1024);
    return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'uploading': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'uploaded': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'processing': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'completed': return 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300';
      case 'error': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center">
              <FileImage className="w-6 h-6 text-teal-600 dark:text-teal-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Upload Details
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {upload.file_name || 'Unnamed file'}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="p-2 h-9 w-9"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(upload.status)}`}>
              {upload.status || 'unknown'}
            </span>
          </div>

          {/* File Preview */}
          {upload.file_path && upload.file_name && (() => {
            const previewInfo = previewFile(upload.file_path, upload.file_name);
            
            console.log('Modal Preview Debug:', {
              fileName: upload.file_name,
              filePath: upload.file_path,
              previewInfo: previewInfo
            });
            
            // List available buckets first
            const checkBuckets = async () => {
              console.log('🔍 Checking available Supabase buckets...');
              const buckets = await listSupabaseBuckets();
              
              if (buckets.length > 0) {
                console.log('📁 Found buckets:', buckets.map(b => b.name));
                
                // Test the actual buckets that exist
                for (const bucket of buckets) {
                  try {
                    const testUrl = `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/${bucket.name}/${upload.file_path}`;
                    const response = await fetch(testUrl, { method: 'HEAD' });
                    if (response.ok) {
                      console.log(`✅ Bucket "${bucket.name}" works! URL: ${testUrl}`);
                    } else {
                      console.log(`❌ Bucket "${bucket.name}" failed with status:`, response.status);
                    }
                  } catch (error) {
                    console.log(`❌ Bucket "${bucket.name}" failed:`, error);
                  }
                }
              } else {
                console.log('❌ No buckets found or access denied');
              }
            };
            
            // Also test with a signed URL approach (for private files)
            const testSignedUrl = async () => {
              console.log('🔐 Testing signed URL approach...');
              try {
                // Try different bucket names with signed URLs
                const testBuckets = ['uploads', 'images', 'files', 'mobile-uploads', 'user-uploads'];
                
                for (const bucketName of testBuckets) {
                  try {
                    const { data, error } = await supabase.storage
                      .from(bucketName)
                      .createSignedUrl(upload.file_path, 60); // 60 second expiry
                    
                    if (data?.signedUrl && !error) {
                      console.log(`✅ Signed URL for bucket "${bucketName}":`, data.signedUrl);
                      
                      // Test if this signed URL works
                      const response = await fetch(data.signedUrl, { method: 'HEAD' });
                      if (response.ok) {
                        console.log(`🎉 Signed URL works for bucket "${bucketName}"!`);
                      }
                    } else {
                      console.log(`❌ Signed URL failed for bucket "${bucketName}":`, error);
                    }
                  } catch (err) {
                    console.log(`❌ Signed URL error for bucket "${bucketName}":`, err);
                  }
                }
              } catch (error) {
                console.log('❌ Signed URL test failed:', error);
              }
            };
            
            // Run tests (only in development)
            if (import.meta.env.DEV) {
              checkBuckets();
              testSignedUrl();
            }
            
            if (previewInfo.canPreview && previewInfo.type === 'image') {
              const imageUrl = getSupabaseFileUrl(upload.file_path);
              console.log('Modal image URL conversion:', {
                originalPath: upload.file_path,
                convertedUrl: imageUrl
              });
              
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Preview</h3>
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="flex flex-col items-center">
                      {/* Display the actual image */}
                      <div className="w-full max-w-md mb-4">
                        <img
                          src={imageUrl}
                          alt={upload.file_name}
                          className="w-full h-auto max-h-64 object-contain rounded-lg border border-gray-200 dark:border-gray-700"
                          onLoad={() => {
                            console.log('🎉 Modal image loaded successfully:', upload.file_name);
                          }}
                          onError={() => {
                            console.error('❌ Modal image failed to load:', {
                              fileName: upload.file_name,
                              originalPath: upload.file_path,
                              publicUrl: imageUrl,
                              bucket: 'mobile_uploads'
                            });
                          }}
                        />
                      </div>
                      
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                          {upload.file_name}
                        </p>
                        <div className="flex items-center justify-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                            IMAGE
                          </span>
                          {upload.file_size && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatFileSize(upload.file_size)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            } else if (previewInfo.canPreview && previewInfo.type === 'text') {
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Preview</h3>
                  <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <FileImage className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Text File</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {upload.file_name}
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                          TEXT FILE
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            } else {
              return (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Preview</h3>
                  <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center mb-3 mx-auto">
                        <FileImage className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Preview Not Available</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {upload.file_name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Path: {upload.file_path.length > 40 ? upload.file_path.substring(0, 40) + '...' : upload.file_path}
                      </p>
                      <div className="mt-3">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                          UNKNOWN TYPE
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            }
          })()}

          {/* File Information */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">File Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <FileImage className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">File Name</p>
                  <p className="text-gray-900 dark:text-white">{upload.file_name || 'N/A'}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <HardDrive className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">File Size</p>
                  <p className="text-gray-900 dark:text-white">{formatFileSize(upload.file_size)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upload Date</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(upload.created_at)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Updated</p>
                  <p className="text-gray-900 dark:text-white">{formatDate(upload.updated_at)}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* User Information */}
          {upload.userDetails && (
            <Card className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">User Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Full Name</p>
                    <p className="text-gray-900 dark:text-white">{upload.userDetails.fullName || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</p>
                    <p className="text-gray-900 dark:text-white">{upload.userDetails.email || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Technical Details */}
          <Card className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Technical Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Upload ID:</span>
                <span className="text-gray-900 dark:text-white font-mono">{upload.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">File Path:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs break-all">
                  {upload.file_path || 'N/A'}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              // TODO: Implement download functionality
              alert(`Download functionality for: ${upload.file_name}`);
            }}
          >
            Download File
          </Button>
        </div>
      </div>
    </div>
  );
};
