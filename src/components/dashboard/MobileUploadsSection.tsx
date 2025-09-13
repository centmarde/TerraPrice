import React, { useState } from 'react';
import { 
  Upload, 
  FileImage, 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Search,
  Calendar,
  User,
  Eye,
  Download
} from 'lucide-react';
import { Card, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { UploadListSkeleton } from '../ui/Skeleton';
import { UploadViewModal } from '../ui/UploadViewModal';
import { ToastContainer, useToast } from '../ui/Toast';
import { MobileUpload } from '../../types';
import { downloadFile, getSupabaseFileUrl } from '../../utils/fileUtils';

interface MobileUploadsProps {
  uploads: MobileUpload[];
  isLoading: boolean;
  onApprove?: (uploadId: number | string) => Promise<void>;
  onDeny?: (uploadId: number | string) => Promise<void>;
}

const ITEMS_PER_PAGE = 5;

export const MobileUploadsSection: React.FC<MobileUploadsProps> = ({ 
  uploads, 
  isLoading,
  onApprove,
  onDeny
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUpload, setSelectedUpload] = useState<MobileUpload | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Toast notifications
  const { toasts, showToast, closeToast } = useToast();

  // Filter uploads based on search and status
  const filteredUploads = uploads.filter(upload => {
    const matchesSearch = !searchTerm || 
      (upload.file_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (upload.userDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (upload.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Treat any upload that is not explicitly approved/denied as 'pending' in the filter
    let matchesStatus = false;
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'pending') {
      matchesStatus = upload.status !== 'approved' && upload.status !== 'denied';
    } else {
      matchesStatus = upload.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredUploads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedUploads = filteredUploads.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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
      case 'pending': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300';
      case 'approved': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'denied': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300';
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Denied' }
  ];

  // Handler functions
  const handleViewUpload = (upload: MobileUpload) => {
    setSelectedUpload(upload);
    setIsModalOpen(true);
  };

  const handleDownloadUpload = async (upload: MobileUpload) => {
    console.log('Downloading upload:', upload);
    
    if (upload.file_path) {
      try {
        showToast({
          type: 'info',
          title: 'Download Starting',
          message: `Preparing to download ${upload.file_name}...`,
          duration: 3000
        });
        
        // Convert Supabase storage path to public URL
        const downloadUrl = getSupabaseFileUrl(upload.file_path);
        console.log('Download URL conversion:', {
          originalPath: upload.file_path,
          downloadUrl: downloadUrl,
          bucket: 'mobile_uploads'
        });
        
        const result = await downloadFile(downloadUrl, upload.file_name || 'download');
        
        if (result.success) {
          showToast({
            type: 'success',
            title: 'Download Started',
            message: `${upload.file_name} download has begun successfully.`,
            duration: 5000
          });
        } else {
          showToast({
            type: 'error',
            title: 'Download Failed',
            message: result.message || 'Unable to start download.',
            duration: 7000
          });
        }
      } catch (error) {
        console.error('Download error:', error);
        showToast({
          type: 'error',
          title: 'Download Error',
          message: 'An unexpected error occurred. Please try again.',
          duration: 7000
        });
      }
    } else {
      showToast({
        type: 'warning',
        title: 'No File Path',
        message: 'This file cannot be downloaded as no file path is available.',
        duration: 5000
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUpload(null);
  };

  return (
    <Card>
      <CardHeader 
        title="Mobile Uploads"
        subtitle={`${filteredUploads.length} total uploads${statusFilter !== 'all' ? ` (${statusFilter})` : ''}`}
        action={
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredUploads.length} uploads
            </span>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
        }
      />

      {/* Search and Filter Bar */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search uploads, files, or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-transparent
                     placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors duration-200"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Content */}
      {isLoading ? (
        <div className="p-4">
          <UploadListSkeleton />
        </div>
      ) : filteredUploads.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No matching uploads' : 'No uploads yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search terms or filters'
              : 'Mobile uploads from users will appear here when available'
            }
          </p>
        </div>
      ) : (
        <>
          {/* Upload Cards */}
          <div className="space-y-3">
            {paginatedUploads.map((upload, index) => (
              <div 
                key={upload.id}
                className={`group p-4 border border-gray-200 dark:border-gray-600 rounded-lg
                         bg-white dark:bg-gray-700/50 hover:shadow-lg hover:border-teal-300 dark:hover:border-teal-600
                         hover:bg-gray-50 dark:hover:bg-gray-700/70 hover:-translate-y-1
                         transition-all duration-300 cursor-pointer transform
                         animate-fadeInUp opacity-0`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  {/* File Info */}
                  <div className="flex items-center space-x-4 flex-1 min-w-0">
                    {/* File Thumbnail/Icon */}
                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {(() => {
                        const isImage = upload.file_name && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(upload.file_name);
                        
                        console.log('Upload debug:', {
                          fileName: upload.file_name,
                          filePath: upload.file_path,
                          isImage: isImage
                        });
                        
                        if (isImage && upload.file_path) {
                          const imageUrl = getSupabaseFileUrl(upload.file_path);
                          console.log('Converted image URL:', imageUrl);
                          
                          return (
                            <img
                              src={imageUrl}
                              alt={upload.file_name}
                              className="w-full h-full object-cover rounded-lg"
                              onLoad={() => console.log('Image loaded successfully:', upload.file_name)}
                              onError={(e) => {
                                console.error('Image failed to load:', upload.file_name, 'Original path:', upload.file_path, 'Converted URL:', imageUrl);
                                // Fallback to icon if image fails to load
                                const target = e.target as HTMLImageElement;
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = '<div class="w-6 h-6 text-teal-600 dark:text-teal-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                                }
                              }}
                            />
                          );
                        } else {
                          console.log('Not an image or no file path, showing icon for:', upload.file_name);
                          return <FileImage className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
                        }
                      })()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 dark:text-white truncate">
                          {upload.file_name || 'Unknown File'}
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(upload.status)}`}>
                          {upload.status || 'unknown'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(upload.created_at)}
                        </span>
                        <span>{formatFileSize(upload.file_size)}</span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {upload.userDetails?.fullName || upload.userDetails?.email || 'Unknown User'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => handleViewUpload(upload)}
                      className="p-2 rounded-lg bg-teal-50 hover:bg-teal-100 dark:bg-teal-900/20 dark:hover:bg-teal-900/40 
                               text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300
                               transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-teal-200/50"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadUpload(upload)}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/40 
                               text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                               transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-md hover:shadow-blue-200/50"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filteredUploads.length)} of {filteredUploads.length} uploads
              </p>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-110 active:scale-95 ${
                        pageNum === currentPage
                          ? 'bg-teal-700 text-white dark:bg-teal-600 shadow-lg shadow-teal-500/25'
                          : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  icon={ChevronRight}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Upload View Modal */}
      <UploadViewModal
        upload={selectedUpload}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={onApprove}
        onDeny={onDeny}
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </Card>
  );
};
