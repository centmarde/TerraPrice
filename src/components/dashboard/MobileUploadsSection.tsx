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
import { formatPhilippineDate } from '../../utils/dateUtils';

interface MobileUploadsProps {
  uploads: MobileUpload[];
  isLoading: boolean;
}

const ITEMS_PER_PAGE = 6; // Balanced for good UX while showing pagination

export const MobileUploadsSection: React.FC<MobileUploadsProps> = ({ 
  uploads, 
  isLoading 
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
    
    let matchesStatus = false;
    
    if (statusFilter === 'all') {
      matchesStatus = true;
    } else if (statusFilter === 'pending') {
      // Pending means not approved and not denied (matches Dashboard logic)
      matchesStatus = upload.status !== 'approved' && upload.status !== 'denied';
    } else {
      // For 'approved' and 'denied', match exact status
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
    return formatPhilippineDate(dateString, { shortFormat: true });
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    const kb = Math.round(bytes / 1024);
    return kb < 1024 ? `${kb} KB` : `${(kb / 1024).toFixed(1)} MB`;
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case 'approved': return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'denied': return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300';
      default: return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300'; // pending (null or any other status)
    }
  };

  const getStatusLabel = (status: string | null) => {
    switch (status) {
      case 'approved': return 'Approved';
      case 'denied': return 'Denied';
      default: return 'Pending'; // null or any other status is considered pending
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
    <Card className="overflow-hidden">
      <CardHeader 
        title="Mobile Uploads"
        subtitle={`${filteredUploads.length} total uploads${statusFilter !== 'all' ? ` (${statusFilter})` : ''}`}
        action={
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 text-sm">
              <div className="flex items-center space-x-1 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-700">
                <Upload className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-semibold text-teal-700 dark:text-teal-300">
                  {filteredUploads.length}
                </span>
              </div>
            </div>
          </div>
        }
      />

      {/* Enhanced Search and Filter Bar */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search uploads, files, or users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent
                       placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200
                       hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md"
            />
          </div>

          {/* Status Filter */}
          <div className="relative sm:w-auto">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto pl-10 pr-8 py-2.5 sm:py-3 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm sm:text-base
                       focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-200
                       hover:border-gray-300 dark:hover:border-gray-500 shadow-sm hover:shadow-md cursor-pointer"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
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
          <div className="space-y-3 sm:space-y-4">
            {paginatedUploads.map((upload, index) => (
              <div 
                key={upload.id}
                className={`group p-4 sm:p-5 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl
                         bg-white dark:bg-gray-800/50 hover:shadow-xl hover:border-teal-300 dark:hover:border-teal-600
                         hover:bg-gray-50/80 dark:hover:bg-gray-800/70 hover:-translate-y-1
                         transition-all duration-300 cursor-pointer transform
                         animate-fadeInUp opacity-0 backdrop-blur-sm`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  {/* File Info */}
                  <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                    {/* File Thumbnail/Icon */}
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-teal-200 dark:border-teal-700 shadow-sm">
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
                                  parent.innerHTML = '<div class="w-7 h-7 text-teal-600 dark:text-teal-400"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg></div>';
                                }
                              }}
                            />
                          );
                        } else {
                          console.log('Not an image or no file path, showing icon for:', upload.file_name);
                          return <FileImage className="w-6 h-6 sm:w-7 sm:h-7 text-teal-600 dark:text-teal-400" />;
                        }
                      })()}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <p className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                          {upload.file_name || 'Unknown File'}
                        </p>
                        <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(upload.status)} shadow-sm w-fit`}>
                          {getStatusLabel(upload.status)}
                        </span>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          {formatDate(upload.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <User className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="truncate max-w-32 sm:max-w-none">
                            {upload.userDetails?.fullName || upload.userDetails?.email || 'Unknown User'}
                          </span>
                        </span>
                        <span className="text-gray-500 dark:text-gray-400 font-medium">
                          {formatFileSize(upload.file_size)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:transform sm:translate-x-4 sm:group-hover:translate-x-0">
                    <button
                      onClick={() => handleViewUpload(upload)}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-teal-50 to-teal-100 hover:from-teal-100 hover:to-teal-200 
                               dark:from-teal-900/20 dark:to-teal-800/20 dark:hover:from-teal-900/40 dark:hover:to-teal-800/40
                               text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300
                               transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-teal-200/50
                               border border-teal-200 dark:border-teal-700"
                      title="View Details"
                    >
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => handleDownloadUpload(upload)}
                      className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200
                               dark:from-blue-900/20 dark:to-blue-800/20 dark:hover:from-blue-900/40 dark:hover:to-blue-800/40
                               text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300
                               transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-lg hover:shadow-blue-200/50
                               border border-blue-200 dark:border-blue-700"
                      title="Download File"
                    >
                      <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No more uploads message when paginated beyond available data */}
          {paginatedUploads.length === 0 && filteredUploads.length > 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-10 h-10 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No more uploads
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                You've reached the end of the uploads list. Use Previous to go back.
              </p>
            </div>
          )}

          {/* Pagination - Always show if there are any submissions */}
          {filteredUploads.length > 0 && (
            <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-left">
                  Page {currentPage} of {Math.max(1, totalPages)} ({filteredUploads.length} total uploads)
                </p>
                
                <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    icon={ChevronLeft}
                    className="min-w-[80px] text-xs sm:text-sm"
                  >
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={false} // Never disable - let them see "no more uploads"
                    icon={ChevronRight}
                    className="min-w-[80px] text-xs sm:text-sm"
                  >
                    Next
                  </Button>
                </div>
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
      />
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
    </Card>
  );
};
